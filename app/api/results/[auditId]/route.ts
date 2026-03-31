import { NextRequest, NextResponse } from 'next/server';
import { getAudit } from '@/lib/db';
import { AuditResult } from '@/lib/ieepa-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
): Promise<NextResponse> {
  try {
    const { auditId } = await params;

    const record = await getAudit(auditId);
    if (!record) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    const storedData = JSON.parse(record.data) as { audit: AuditResult; parse: object };
    const audit = storedData.audit;

    if (record.status === 'paid') {
      return NextResponse.json({
        locked: false,
        status: record.status,
        tier: record.tier,
        audit,
        parse_meta: storedData.parse,
      });
    }

    // Free: return summary only
    return NextResponse.json({
      locked: true,
      status: record.status,
      summary: {
        total_entries: audit.total_entries,
        ieepa_count: audit.ieepa_entries.length,
        refundable_count: audit.ieepa_entries.filter((e) => e.is_refundable).length,
        total_refund_estimate: audit.total_refund_estimate,
        interest_estimate: audit.interest_estimate,
        interest_rate: audit.interest_rate,
        error_count: audit.errors.length,
        errors: audit.errors, // Give errors for free as a hook
        audit_date: audit.audit_date,
      },
    });
  } catch (err) {
    console.error('[results] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
