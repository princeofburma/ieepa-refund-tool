import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { parseUpload } from '@/lib/csv-parser';
import { runAudit } from '@/lib/ieepa-engine';
import { createAudit } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded. Send a field named "file".' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 });
    }

    const ext = file.name.toLowerCase().split('.').pop();
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) {
      return NextResponse.json({ error: 'Unsupported file type. Upload a .csv or .xlsx file.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parseResult = await parseUpload(buffer, file.name);

    if (parseResult.rows.length === 0) {
      const errMsg =
        parseResult.parse_errors.length > 0
          ? parseResult.parse_errors[0]
          : 'No valid rows found in the file. Check that your file has entry_number, hts_code, and duty_amount columns.';
      return NextResponse.json({ error: errMsg, parse_errors: parseResult.parse_errors }, { status: 422 });
    }

    const auditResult = runAudit(parseResult.rows);

    const auditId = uuidv4();

    const storedData = {
      audit: auditResult,
      parse: {
        column_mapping: parseResult.column_mapping,
        parse_errors: parseResult.parse_errors,
        format_detected: parseResult.format_detected,
        row_count: parseResult.row_count,
      },
    };

    await createAudit(auditId, storedData);

    return NextResponse.json({
      auditId,
      summary: {
        total_entries: auditResult.total_entries,
        ieepa_count: auditResult.ieepa_entries.length,
        refundable_count: auditResult.ieepa_entries.filter((e) => e.is_refundable).length,
        total_refund: auditResult.total_refund_estimate,
        interest_estimate: auditResult.interest_estimate,
        error_count: auditResult.errors.length,
        format_detected: parseResult.format_detected,
      },
    });
  } catch (err) {
    console.error('[upload] error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
