import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuditResult, AuditEntry, AuditError } from '@/lib/ieepa-engine';

const S = {
  navy: '#0a1628',
  navyMid: '#0f1e38',
  teal: '#2e86ab',
  tealBright: '#38a3cc',
  gold: '#c9a84c',
  white: '#f0f4f8',
  muted: '#8899aa',
  border: 'rgba(46,134,171,0.25)',
  green: '#22c55e',
  yellow: '#f59e0b',
  red: '#ef4444',
} as const;

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function fmtExact(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

interface StoredData {
  audit: AuditResult;
  parse: {
    format_detected: string;
    row_count: number;
    parse_errors: string[];
  };
}

async function getReport(auditId: string): Promise<{ status: string; tier: string | null; data: StoredData } | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/results/${auditId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ auditId: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { auditId } = await params;
  const { success } = await searchParams;

  const data = await getReport(auditId);

  if (!data || data.status !== 'paid') {
    redirect(`/results/${auditId}`);
  }

  const audit = data.data.audit;
  const refundableEntries = audit.ieepa_entries.filter((e: AuditEntry) => e.is_refundable);
  const nonRefundableEntries = audit.ieepa_entries.filter((e: AuditEntry) => !e.is_refundable);
  const totalWithInterest = audit.total_refund_estimate + audit.interest_estimate;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.navy }}>
      {/* Nav */}
      <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}`, padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 700, color: S.white, textDecoration: 'none', fontSize: '1.1rem' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a
            href={`/api/report/${auditId}/cape-csv`}
            download
            style={{ backgroundColor: S.teal, color: S.white, padding: '0.5rem 1.25rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Download CAPE CSV
          </a>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Success banner */}
        {success && (
          <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 8, padding: '1rem 1.5rem', marginBottom: '2rem', color: S.green, fontWeight: 600 }}>
            Payment confirmed. Your full audit report is ready.
          </div>
        )}

        {/* Executive summary */}
        <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 16, padding: '2.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Full Audit Report</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: S.white, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
            IEEPA Tariff Refund Analysis
          </h1>
          <div style={{ color: S.muted, fontSize: '0.85rem', marginBottom: '2rem' }}>
            Audit date: {audit.audit_date} · Plan: {data.tier ?? 'paid'} · Audit ID: {auditId.slice(0, 8)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Total Refund Estimate', value: fmt(audit.total_refund_estimate), color: S.green, big: true },
              { label: 'Estimated Interest', value: fmt(audit.interest_estimate), color: S.tealBright },
              { label: 'Combined Total', value: fmt(totalWithInterest), color: S.gold },
              { label: 'Refundable Entries', value: refundableEntries.length.toLocaleString(), color: S.white },
              { label: 'Total Entries Scanned', value: audit.total_entries.toLocaleString(), color: S.white },
              { label: 'Issues Flagged', value: audit.errors.length.toLocaleString(), color: audit.errors.length > 0 ? S.yellow : S.green },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: s.big ? '2.5rem' : '1.75rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: S.muted, marginTop: '0.35rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div style={{ backgroundColor: S.navyMid, border: `2px solid rgba(201,168,76,0.4)`, borderRadius: 12, padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: S.gold, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
            Important Next Steps
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                num: '1',
                title: 'Register for ACH electronic refunds',
                desc: 'CBP will issue refunds via ACH only. You must be enrolled before you can receive payment.',
                link: '/guides/ach-setup',
                linkLabel: 'ACH Setup Guide',
                urgent: true,
              },
              {
                num: '2',
                title: 'Note your protest deadline',
                desc: 'You have 180 days from the date of liquidation of each entry to file a protest. Check your liquidation dates — do not miss this window.',
                link: '/guides/protest',
                linkLabel: 'Protest Guide',
                urgent: true,
              },
              {
                num: '3',
                title: 'Wait for the CAPE portal',
                desc: 'CBP\'s CAPE portal is expected to open around April 20, 2026. Your CAPE-ready CSV is ready to upload the moment the portal launches.',
                link: '/guides/cape-filing',
                linkLabel: 'CAPE Filing Guide',
              },
              {
                num: '4',
                title: 'Download your CAPE CSV now',
                desc: 'Your CAPE-formatted CSV is available for download above. Keep it safe — you will need it when filing.',
              },
            ].map((step) => (
              <div key={step.num} style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: step.urgent ? 'rgba(245,158,11,0.06)' : 'rgba(15,30,56,0.5)',
                borderRadius: 8,
                border: step.urgent ? '1px solid rgba(245,158,11,0.2)' : `1px solid ${S.border}`,
              }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', backgroundColor: step.urgent ? 'rgba(245,158,11,0.2)' : 'rgba(46,134,171,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: step.urgent ? S.yellow : S.tealBright }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: S.white, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{step.title}</div>
                  <div style={{ color: S.muted, fontSize: '0.875rem', lineHeight: 1.6 }}>{step.desc}</div>
                  {step.link && (
                    <Link href={step.link} style={{ color: S.tealBright, fontSize: '0.8rem', textDecoration: 'none', marginTop: '0.35rem', display: 'inline-block' }}>
                      {step.linkLabel} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entry breakdown table */}
        <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: `1px solid ${S.border}` }}>
            <h2 style={{ fontWeight: 700, color: S.white, fontSize: '1.1rem', margin: 0 }}>
              Refundable Entries ({refundableEntries.length})
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Entry Number', 'Entry Date', 'IEEPA Code', 'Description', 'COO', 'Duty Amount', 'Status'].map((h) => (
                    <th key={h} style={{ backgroundColor: 'rgba(15,30,56,0.9)', color: S.muted, padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refundableEntries.map((entry: AuditEntry, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${S.border}` }}>
                    <td style={{ padding: '0.7rem 1rem', color: S.white, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{entry.entry_number}</td>
                    <td style={{ padding: '0.7rem 1rem', color: S.muted, whiteSpace: 'nowrap' }}>{entry.entry_date}</td>
                    <td style={{ padding: '0.7rem 1rem', color: S.tealBright, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{entry.ieepa_code}</td>
                    <td style={{ padding: '0.7rem 1rem', color: S.muted, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.ieepa_description.slice(0, 60)}{entry.ieepa_description.length > 60 ? '...' : ''}</td>
                    <td style={{ padding: '0.7rem 1rem', color: S.muted }}>{entry.country_of_origin ?? '—'}</td>
                    <td style={{ padding: '0.7rem 1rem', color: S.green, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{fmtExact(entry.duty_amount)}</td>
                    <td style={{ padding: '0.7rem 1rem' }}>
                      <span style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: S.green, padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600 }}>
                        REFUNDABLE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${S.border}`, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: S.muted, marginBottom: '0.2rem' }}>Total refundable duties</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: S.green }}>{fmtExact(audit.total_refund_estimate)}</div>
            </div>
          </div>
        </div>

        {/* Non-refundable entries */}
        {nonRefundableEntries.length > 0 && (
          <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: `1px solid ${S.border}` }}>
              <h2 style={{ fontWeight: 700, color: S.white, fontSize: '1.1rem', margin: 0 }}>
                Non-Refundable IEEPA Entries ({nonRefundableEntries.length})
                <span style={{ fontWeight: 400, color: S.muted, fontSize: '0.85rem', marginLeft: '0.75rem' }}>exception codes or date issues</span>
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Entry Number', 'Entry Date', 'IEEPA Code', 'Duty Amount', 'Reason'].map((h) => (
                      <th key={h} style={{ backgroundColor: 'rgba(15,30,56,0.9)', color: S.muted, padding: '0.75rem 1rem', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nonRefundableEntries.map((entry: AuditEntry, i: number) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${S.border}` }}>
                      <td style={{ padding: '0.7rem 1rem', color: S.white, fontFamily: 'monospace' }}>{entry.entry_number}</td>
                      <td style={{ padding: '0.7rem 1rem', color: S.muted }}>{entry.entry_date}</td>
                      <td style={{ padding: '0.7rem 1rem', color: S.muted, fontFamily: 'monospace' }}>{entry.ieepa_code}</td>
                      <td style={{ padding: '0.7rem 1rem', color: S.muted, fontFamily: 'monospace' }}>{fmtExact(entry.duty_amount)}</td>
                      <td style={{ padding: '0.7rem 1rem', color: S.yellow, fontSize: '0.8rem' }}>{entry.flags[0] ?? 'Not eligible'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error flags */}
        {audit.errors.length > 0 && (
          <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: `1px solid ${S.border}` }}>
              <h2 style={{ fontWeight: 700, color: S.white, fontSize: '1.1rem', margin: 0 }}>
                Issues &amp; Flags ({audit.errors.length})
              </h2>
            </div>
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {audit.errors.map((err: AuditError, i: number) => (
                <div key={i} style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: err.severity === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${err.severity === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  borderRadius: 6,
                  fontSize: '0.85rem',
                  color: S.white,
                  display: 'flex',
                  gap: '0.75rem',
                }}>
                  <span style={{ color: err.severity === 'error' ? S.red : S.yellow, flexShrink: 0, fontSize: '0.75rem', marginTop: '0.1rem' }}>
                    {err.severity === 'error' ? '● ERROR' : '▲ WARN'}
                  </span>
                  <span>
                    {err.entry_number && <span style={{ color: S.teal, marginRight: '0.5rem' }}>Entry {err.entry_number}:</span>}
                    {err.issue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAPE CSV download */}
        <div style={{ backgroundColor: 'rgba(46,134,171,0.08)', border: `1px solid ${S.teal}`, borderRadius: 12, padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontWeight: 700, color: S.white, fontSize: '1.1rem', marginBottom: '0.25rem' }}>CAPE-Ready CSV Export</h2>
            <p style={{ color: S.muted, fontSize: '0.875rem', margin: 0 }}>
              {refundableEntries.length} refundable entries formatted for the CAPE portal.{' '}
              <span style={{ color: S.yellow }}>Note: CBP has not yet published the official CAPE spec. Update format when released.</span>
            </p>
          </div>
          <a
            href={`/api/report/${auditId}/cape-csv`}
            download
            style={{ backgroundColor: S.teal, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap' }}
          >
            Download CAPE CSV
          </a>
        </div>

        {/* Guide links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { title: 'ACH Enrollment Guide', desc: 'Register for electronic refunds before the portal opens', href: '/guides/ach-setup' },
            { title: 'Protest Deadlines', desc: '180-day window — know your dates', href: '/guides/protest' },
            { title: 'CAPE Filing Guide', desc: 'How to submit your claim when the portal launches', href: '/guides/cape-filing' },
            { title: 'Are You the IOR?', desc: 'Confirm your eligibility as importer of record', href: '/guides/ior-check' },
          ].map((guide) => (
            <Link key={guide.title} href={guide.href} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontWeight: 700, color: S.tealBright, fontSize: '0.9rem', marginBottom: '0.35rem' }}>{guide.title}</div>
              <div style={{ color: S.muted, fontSize: '0.8rem', lineHeight: 1.5 }}>{guide.desc}</div>
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem', fontSize: '0.75rem', color: S.muted, lineHeight: 1.75 }}>
          <strong style={{ color: S.white }}>Legal Disclaimer.</strong> This audit report is provided for informational purposes only and does not constitute legal or customs-brokerage advice. The refund estimates are based on IEEPA Chapter 99 duty codes identified in your entry data and the Supreme Court ruling of February 20, 2026. Actual refund eligibility, amounts, and procedures are subject to CBP determination and any subsequent regulatory guidance. The CAPE portal filing requirements have not yet been published by CBP; the CAPE-ready CSV generated by this tool is based on anticipated requirements and may require updating when official specifications are released. Users are responsible for verifying the accuracy of their entry data and for complying with all applicable deadlines, including the 180-day protest window. This tool is not affiliated with CBP or any government agency. Consult a licensed customs attorney or broker for advice specific to your situation. Interest estimates use the IRS underpayment rate (6% annually) and assume 180 days — actual interest may differ.
        </div>
      </main>
    </div>
  );
}
