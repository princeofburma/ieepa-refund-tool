import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { EntryRow } from './ieepa-engine';

export interface ParseResult {
  rows: EntryRow[];
  column_mapping: Record<string, string>;
  parse_errors: string[];
  row_count: number;
  format_detected: 'ace_es003' | 'generic' | 'unknown';
}

type RawRow = Record<string, string>;

// Fuzzy header matching: given a header string, return the canonical field name or null
function matchHeader(header: string): string | null {
  const h = header.toLowerCase().trim();

  // Entry number
  if (
    h.includes('entry number') ||
    h.includes('entry_number') ||
    h.includes('entry no') ||
    h.includes('entry summary number') ||
    h === 'entry' ||
    h.includes('filer code')
  ) {
    return 'entry_number';
  }

  // Entry date
  if (
    h.includes('entry date') ||
    h.includes('import date') ||
    h.includes('consumption date') ||
    h.includes('entry_date') ||
    (h === 'date' && !h.includes('liquidation'))
  ) {
    return 'entry_date';
  }

  // HTS code — check before duty to avoid "hts duty" matching duty
  if (
    h.includes('hts code') ||
    h.includes('hts_code') ||
    h.includes('hts number') ||
    h.includes('tariff code') ||
    h.includes('commodity code') ||
    h.includes('classification') ||
    h === 'hts' ||
    h === 'tariff'
  ) {
    return 'hts_code';
  }

  // Duty amount
  if (
    h.includes('duty amount') ||
    h.includes('duty_amount') ||
    h.includes('total duty') ||
    h.includes('ieepa duty') ||
    h.includes('ad valorem') ||
    h.includes('duties paid') ||
    (h === 'duty' && !h.includes('rate'))
  ) {
    return 'duty_amount';
  }

  // Entered value
  if (
    h.includes('entered value') ||
    h.includes('customs value') ||
    h.includes('commercial value') ||
    h.includes('entered_value') ||
    (h === 'value' && !h.includes('declared'))
  ) {
    return 'entered_value';
  }

  // Country of origin
  if (
    h.includes('country of origin') ||
    h.includes('country_of_origin') ||
    h === 'coo' ||
    h === 'origin' ||
    h === 'country'
  ) {
    return 'country_of_origin';
  }

  // Port code
  if (h === 'port' || h.includes('port code') || h.includes('port of entry') || h.includes('port_code')) {
    return 'port_code';
  }

  // Description
  if (
    h === 'description' ||
    h.includes('goods description') ||
    h.includes('commodity description') ||
    h === 'commodity'
  ) {
    return 'description';
  }

  // Line number
  if (h.includes('line') && (h.includes('number') || h.includes('no') || h.includes('item'))) {
    return 'line_number';
  }

  return null;
}

function detectFormat(headers: string[]): 'ace_es003' | 'generic' | 'unknown' {
  const normalized = headers.map((h) => h.toLowerCase().trim());
  const aceMarkers = [
    'entry summary number',
    'importer of record number',
    'line item number',
    'entry type code',
  ];
  const matchCount = aceMarkers.filter((m) => normalized.some((n) => n.includes(m.replace(/ /g, '').toLowerCase()) || n === m)).length;
  if (matchCount >= 2) return 'ace_es003';

  const hasEntry = normalized.some((h) => matchHeader(h) === 'entry_number');
  const hasHts = normalized.some((h) => matchHeader(h) === 'hts_code');
  const hasDuty = normalized.some((h) => matchHeader(h) === 'duty_amount');
  if (hasEntry && hasHts && hasDuty) return 'generic';

  return 'unknown';
}

function buildColumnMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  for (const header of headers) {
    const canonical = matchHeader(header);
    if (canonical) {
      // Only take the first match for each canonical field
      if (!Object.values(mapping).includes(canonical)) {
        mapping[header] = canonical;
      }
    }
  }
  return mapping;
}

function cleanNumber(val: string): number | null {
  if (!val || !val.trim()) return null;
  const cleaned = val.replace(/[\$,\s]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function mapRow(rawRow: RawRow, mapping: Record<string, string>): Partial<EntryRow> {
  const mapped: Partial<EntryRow> & { raw_row: RawRow } = { raw_row: rawRow };

  for (const [rawCol, canonical] of Object.entries(mapping)) {
    const rawVal = rawRow[rawCol];
    if (rawVal === undefined || rawVal === null) continue;
    const val = String(rawVal).trim();

    switch (canonical) {
      case 'entry_number':
        mapped.entry_number = val;
        break;
      case 'entry_date':
        mapped.entry_date = val;
        break;
      case 'hts_code':
        mapped.hts_code = val;
        break;
      case 'duty_amount': {
        const n = cleanNumber(val);
        if (n !== null) mapped.duty_amount = n;
        break;
      }
      case 'entered_value': {
        const n = cleanNumber(val);
        if (n !== null) mapped.entered_value = n;
        break;
      }
      case 'country_of_origin':
        mapped.country_of_origin = val;
        break;
      case 'port_code':
        mapped.port_code = val;
        break;
      case 'description':
        mapped.description = val;
        break;
      case 'line_number':
        mapped.line_number = val;
        break;
    }
  }

  return mapped;
}

function csvToRawRows(csvText: string): { headers: string[]; rows: RawRow[]; errors: string[] } {
  const errors: string[] = [];
  const result = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });

  for (const err of result.errors) {
    errors.push(`Row ${err.row ?? '?'}: ${err.message}`);
  }

  const headers = result.meta.fields ?? [];
  return { headers, rows: result.data, errors };
}

export async function parseUpload(buffer: Buffer, filename: string): Promise<ParseResult> {
  const parse_errors: string[] = [];
  let csvText: string;

  const ext = filename.toLowerCase().split('.').pop();

  if (ext === 'xlsx' || ext === 'xls') {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        return {
          rows: [],
          column_mapping: {},
          parse_errors: ['No sheets found in workbook'],
          row_count: 0,
          format_detected: 'unknown',
        };
      }
      const sheet = workbook.Sheets[sheetName];
      csvText = XLSX.utils.sheet_to_csv(sheet);
    } catch (err) {
      return {
        rows: [],
        column_mapping: {},
        parse_errors: [`Failed to parse Excel file: ${err instanceof Error ? err.message : String(err)}`],
        row_count: 0,
        format_detected: 'unknown',
      };
    }
  } else {
    csvText = buffer.toString('utf-8');
  }

  const { headers, rows: rawRows, errors: csvErrors } = csvToRawRows(csvText);
  parse_errors.push(...csvErrors);

  if (headers.length === 0) {
    return {
      rows: [],
      column_mapping: {},
      parse_errors: ['No columns detected in file'],
      row_count: 0,
      format_detected: 'unknown',
    };
  }

  const format_detected = detectFormat(headers);
  const column_mapping = buildColumnMapping(headers);

  const missingFields: string[] = [];
  const canonicals = Object.values(column_mapping);
  if (!canonicals.includes('entry_number')) missingFields.push('entry_number');
  if (!canonicals.includes('hts_code')) missingFields.push('hts_code');
  if (!canonicals.includes('duty_amount')) missingFields.push('duty_amount');

  if (missingFields.length > 0) {
    parse_errors.push(
      `Could not detect required columns: ${missingFields.join(', ')}. ` +
        `Detected columns: ${headers.join(', ')}`
    );
  }

  const rows: EntryRow[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const rawRow = rawRows[i];
    const mapped = mapRow(rawRow, column_mapping);

    // Skip rows where duty_amount is not parseable
    if (mapped.duty_amount === undefined || mapped.duty_amount === null) {
      continue;
    }

    if (!mapped.entry_number) {
      parse_errors.push(`Row ${i + 2}: missing entry number, skipping`);
      continue;
    }

    if (!mapped.hts_code) {
      continue; // Rows without HTS code are fine — engine filters them
    }

    rows.push({
      entry_number: mapped.entry_number ?? '',
      entry_date: mapped.entry_date ?? '',
      hts_code: mapped.hts_code ?? '',
      duty_amount: mapped.duty_amount,
      entered_value: mapped.entered_value,
      country_of_origin: mapped.country_of_origin,
      description: mapped.description,
      port_code: mapped.port_code,
      line_number: mapped.line_number,
      raw_row: mapped.raw_row,
    });
  }

  return {
    rows,
    column_mapping,
    parse_errors,
    row_count: rows.length,
    format_detected,
  };
}
