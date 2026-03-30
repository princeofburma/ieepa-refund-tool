import ieepaCodesRaw from '../data/ieepa-codes.json';

export const SUPREME_COURT_DATE = '2026-02-20';

export interface EntryRow {
  entry_number: string;
  entry_date: string;
  hts_code: string;
  duty_amount: number;
  entered_value?: number;
  country_of_origin?: string;
  description?: string;
  port_code?: string;
  line_number?: string | number;
  raw_row?: Record<string, string>;
}

export interface IeepaCode {
  hts_code: string;
  description: string;
  rate_percent: number | null;
  rate_note?: string;
  effective_date: string;
  end_date: string;
  legal_authority: string;
  country_scope: string;
  is_exception: boolean;
  group: string;
}

export interface AuditEntry {
  entry_number: string;
  entry_date: string;
  ieepa_code: string;
  ieepa_description: string;
  duty_amount: number;
  country_of_origin?: string;
  description?: string;
  is_refundable: boolean;
  flags: string[];
}

export interface AuditError {
  row_index: number;
  entry_number?: string;
  field?: string;
  issue: string;
  severity: 'error' | 'warning';
}

export interface AuditResult {
  total_entries: number;
  ieepa_entries: AuditEntry[];
  errors: AuditError[];
  total_refund_estimate: number;
  interest_estimate: number;
  interest_rate: number;
  audit_date: string;
}

const ieepaCodes: IeepaCode[] = ieepaCodesRaw as IeepaCode[];

const codeMap = new Map<string, IeepaCode>();
for (const code of ieepaCodes) {
  codeMap.set(code.hts_code, code);
}

export function isIeepaCode(hts: string): boolean {
  return /^9903\.(01|02)\.\d+$/.test(hts.trim());
}

export function lookupCode(hts: string): IeepaCode | null {
  return codeMap.get(hts.trim()) ?? null;
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function normalizeEntryNumber(en: string): string {
  return en.replace(/[-\s]/g, '');
}

function isValidEntryNumber(en: string): boolean {
  const normalized = normalizeEntryNumber(en);
  return /^\d{11}$/.test(normalized);
}

function toDateString(raw: string): string | null {
  if (!raw || !raw.trim()) return null;
  const d = new Date(raw.trim());
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
}

function isDateInRange(entryDate: string, effectiveDate: string, endDate: string): boolean {
  return entryDate >= effectiveDate && entryDate <= endDate;
}

export function runAudit(rows: EntryRow[]): AuditResult {
  const ieepa_entries: AuditEntry[] = [];
  const errors: AuditError[] = [];

  // Track duplicates: entry_number + hts_code
  const seen = new Map<string, number>();

  let total_refund_estimate = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Only process IEEPA codes
    if (!isIeepaCode(row.hts_code)) continue;

    const flags: string[] = [];
    let is_refundable = true;

    // Look up code in database
    const codeInfo = lookupCode(row.hts_code);
    const ieepa_description = codeInfo ? codeInfo.description : `IEEPA code ${row.hts_code} (not in database — verify against USITC HTS)`;

    // Exception codes: not refundable
    if (codeInfo?.is_exception) {
      is_refundable = false;
      flags.push('Exception code — not a duty-imposing provision');
    }

    // Duty amount checks
    if (row.duty_amount < 0) {
      errors.push({
        row_index: i,
        entry_number: row.entry_number,
        field: 'duty_amount',
        issue: `Negative duty amount: ${row.duty_amount}`,
        severity: 'error',
      });
      is_refundable = false;
      flags.push('Negative duty amount');
    } else if (row.duty_amount === 0) {
      is_refundable = false;
      flags.push('Zero duty amount — nothing to refund');
    }

    // Validate entry number
    if (!isValidEntryNumber(row.entry_number)) {
      errors.push({
        row_index: i,
        entry_number: row.entry_number,
        field: 'entry_number',
        issue: `Entry number does not appear to be 11 digits: "${row.entry_number}"`,
        severity: 'warning',
      });
      flags.push('Entry number format may be invalid');
    }

    // Date validation
    const normalizedDate = toDateString(row.entry_date);
    if (!normalizedDate) {
      errors.push({
        row_index: i,
        entry_number: row.entry_number,
        field: 'entry_date',
        issue: `Cannot parse entry date: "${row.entry_date}"`,
        severity: 'error',
      });
      is_refundable = false;
      flags.push('Invalid entry date');
    } else {
      const effectiveDate = codeInfo?.effective_date ?? '2025-02-04';
      const endDate = codeInfo?.end_date ?? SUPREME_COURT_DATE;

      if (!isDateInRange(normalizedDate, effectiveDate, endDate)) {
        errors.push({
          row_index: i,
          entry_number: row.entry_number,
          field: 'entry_date',
          issue: `Entry date ${normalizedDate} is outside the effective window for ${row.hts_code} (${effectiveDate} – ${endDate})`,
          severity: 'error',
        });
        is_refundable = false;
        flags.push('Entry date outside code effective window');
      }

      // Also check against Supreme Court ruling date
      if (normalizedDate > SUPREME_COURT_DATE) {
        is_refundable = false;
        flags.push(`Entry date after Supreme Court ruling date (${SUPREME_COURT_DATE})`);
      }
    }

    // Duplicate detection
    const dupKey = `${normalizeEntryNumber(row.entry_number)}|${row.hts_code}`;
    if (seen.has(dupKey)) {
      errors.push({
        row_index: i,
        entry_number: row.entry_number,
        field: 'entry_number',
        issue: `Duplicate entry: entry number + HTS code combination already seen at row ${seen.get(dupKey)! + 1}`,
        severity: 'warning',
      });
      flags.push('Duplicate entry — verify this is not a double-count');
    } else {
      seen.set(dupKey, i);
    }

    const entry: AuditEntry = {
      entry_number: row.entry_number,
      entry_date: normalizedDate ?? row.entry_date,
      ieepa_code: row.hts_code,
      ieepa_description,
      duty_amount: row.duty_amount,
      country_of_origin: row.country_of_origin,
      description: row.description,
      is_refundable,
      flags,
    };

    ieepa_entries.push(entry);

    if (is_refundable) {
      total_refund_estimate += row.duty_amount;
    }
  }

  // Interest: 6% annual × 180 days conservative estimate
  const interest_rate = 0.06;
  const days = 180;
  const interest_estimate = total_refund_estimate * interest_rate * (days / 365);

  return {
    total_entries: rows.length,
    ieepa_entries,
    errors,
    total_refund_estimate,
    interest_estimate,
    interest_rate,
    audit_date: new Date().toISOString().split('T')[0],
  };
}
