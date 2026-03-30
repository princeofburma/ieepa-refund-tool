import Link from 'next/link';
import { AuditError } from '@/lib/ieepa-engine';
import CheckoutButton from './CheckoutButton';

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
  red: '#ef4444',
  yellow: '#f59e0b',
} as const;

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

interface FreeSummary {
  total_entries: number;
  ieepa_count: number;
  refundable_count: number;
  total_refund_estimate: number;
  interest_estimate: number;
  interest_rate: number;
  error_count: number;
  errors: AuditError[];
  audit_date: string;
}

interface ResultsData {
  locked: boolean;
  status: string;
  tier?: string;
  summary?: FreeSummary;
}

async function getResults(auditId: string): Promise<ResultsData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/results/${auditId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ResultsPage({ params }: { params: Promise<{ auditId: string }> }) {
  const { auditId } = await params;
  const data = await getResults(auditId);

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: S.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: S.white, fontSize: '1.5rem', marginBottom: '1rem' }}>Audit not found</h1>
          <p style={{ color: S.muted, marginBottom: '2rem' }}>This audit ID does not exist or has expired.</p>
          <Link href="/upload" style={{ backgroundColor: S.teal, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Start a new analysis
          </Link>
        </div>
      </div>
    );
  }

  // If paid, redirect to report page
  if (data.status === 'paid') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: S.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: S.muted }}>Redirecting to your full report...</p>
          <meta httpEquiv="refresh" content={`0;url=/report/${auditId}`} />
        </div>
      </div>
    );
  }

  const summary = data.summary!;
  const totalWithInterest = summary.total_refund_estimate + summary.interest_estimate;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.navy }}>
      {/* Nav */}
      <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}`, padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 700, color: S.white, textDecoration: 'none', fontSize: '1.1rem' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </Link>
        <span style={{ color: S.muted, fontSize: '0.85rem' }}>Audit ID: {auditId.slice(0, 8)}...</span>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Refund estimate hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Estimated IEEPA Refund
          </div>
          <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, color: S.green, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>
            {formatCurrency(summary.total_refund_estimate)}
          </div>
          <div style={{ color: S.muted, fontSize: '1rem' }}>
            + {formatCurrency(summary.interest_estimate)} estimated interest ({(summary.interest_rate * 100).toFixed(0)}% annual, 180-day conservative estimate)
          </div>
          <div style={{ color: S.tealBright, fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem' }}>
            Total with interest: {formatCurrency(totalWithInterest)}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total entries analyzed', value: summary.total_entries.toLocaleString() },
            { label: 'IEEPA entries found', value: summary.ieepa_count.toLocaleString(), highlight: true },
            { label: 'Refundable entries', value: summary.refundable_count.toLocaleString(), highlight: true },
            { label: 'Issues flagged', value: summary.error_count.toLocaleString(), warn: summary.error_count > 0 },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 10, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.warn ? S.yellow : stat.highlight ? S.tealBright : S.white, letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: S.muted, marginTop: '0.35rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Errors section (free) */}
        {summary.errors.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: S.white, marginBottom: '1rem' }}>
              {summary.errors.length} potential issue{summary.errors.length !== 1 ? 's' : ''} found
              <span style={{ color: S.muted, fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.75rem' }}>— review before filing</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 320, overflowY: 'auto' }}>
              {summary.errors.map((err, i) => (
                <div key={i} style={{
                  backgroundColor: err.severity === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${err.severity === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  borderRadius: 6,
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  color: S.white,
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
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

        {/* Locked preview */}
        <div style={{ position: 'relative', marginBottom: '3rem' }}>
          <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: S.white, marginBottom: '1rem' }}>Entry-by-Entry Breakdown</h2>
            {/* Blurred fake table */}
            <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
              <table style={{ width: '100%', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    {['Entry Number', 'Date', 'IEEPA Code', 'Description', 'Duty Amount', 'Status'].map((h) => (
                      <th key={h} style={{ backgroundColor: 'rgba(15,30,56,0.8)', color: S.muted, padding: '0.6rem 0.75rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {['###########', '2025-05-##', '9903.01.##', '████████████', '$#,###.##', 'Refundable'].map((v, j) => (
                        <td key={j} style={{ padding: '0.6rem 0.75rem', borderBottom: `1px solid ${S.border}`, color: S.white }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Locked items */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', filter: 'blur(1px)', userSelect: 'none', pointerEvents: 'none' }}>
            {['CAPE-Ready CSV Export', 'Full Audit Report'].map((item) => (
              <div key={item} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: S.muted, fontSize: '1.2rem' }}>&#128274;</span>
                <span style={{ color: S.muted, fontWeight: 600, fontSize: '0.9rem' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'rgba(10,22,40,0.85)', border: `1px solid ${S.border}`, borderRadius: 12, padding: '1.5rem 2rem', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>&#128274;</div>
              <div style={{ fontWeight: 700, color: S.white, marginBottom: '0.25rem' }}>Unlock your full report below</div>
              <div style={{ color: S.muted, fontSize: '0.85rem' }}>Entry breakdown, CAPE CSV, and filing instructions</div>
            </div>
          </div>
        </div>

        {/* Unlock section */}
        <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 16, padding: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: S.white, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Unlock Your Full Audit Report
          </h2>
          <p style={{ color: S.muted, marginBottom: '2rem', fontSize: '0.95rem' }}>
            Get your complete entry-by-entry breakdown, CAPE-formatted CSV, error analysis, and filing instructions.
            {summary.refundable_count > 100 && (
              <><br /><span style={{ color: S.yellow }}>You have {summary.refundable_count} refundable entries — you will need the Standard or Premium plan.</span></>
            )}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {[
              {
                tier: 'starter' as const,
                name: 'Starter',
                price: '$97',
                limit: 25,
                features: ['Up to 25 refundable entries', 'Full audit report', 'CAPE-ready CSV', 'Error analysis'],
              },
              {
                tier: 'standard' as const,
                name: 'Standard',
                price: '$197',
                limit: 100,
                features: ['Up to 100 refundable entries', 'Full audit report', 'CAPE-ready CSV', 'Error analysis', 'Priority support'],
                highlight: true,
              },
              {
                tier: 'premium' as const,
                name: 'Premium',
                price: '$397',
                limit: 10000,
                features: ['Unlimited entries', 'Full audit report', 'CAPE-ready CSV', 'AI classification check', 'Priority support'],
              },
            ].map((plan) => (
              <div key={plan.tier} style={{
                backgroundColor: plan.highlight ? 'rgba(46,134,171,0.12)' : 'rgba(15,30,56,0.8)',
                border: plan.highlight ? `2px solid ${S.teal}` : `1px solid ${S.border}`,
                borderRadius: 10,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ fontWeight: 700, color: S.white, fontSize: '1rem', marginBottom: '0.25rem' }}>{plan.name}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: S.white, letterSpacing: '-0.03em', marginBottom: '1rem' }}>{plan.price}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ fontSize: '0.8rem', color: S.muted, display: 'flex', gap: '0.4rem' }}>
                      <span style={{ color: S.tealBright }}>&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <CheckoutButton auditId={auditId} tier={plan.tier} label={`Get ${plan.name}`} disabled={summary.refundable_count > plan.limit} />
              </div>
            ))}
          </div>

          <p style={{ color: S.muted, fontSize: '0.8rem' }}>
            Secure payment via Stripe. One-time fee. 30-day refund if we find no IEEPA entries in your file.
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem', fontSize: '0.75rem', color: S.muted, lineHeight: 1.75 }}>
          <strong style={{ color: S.white }}>Disclaimer.</strong> This refund estimate is based on IEEPA Chapter 99 duty codes identified in your entry data and the Supreme Court ruling of February 20, 2026. It is an estimate only. Actual refund eligibility and amounts are subject to CBP determination. The CAPE portal has not yet launched; filing procedures may differ from this tool&#39;s output. Consult a licensed customs attorney or broker for advice specific to your situation. This tool is not affiliated with CBP or any government agency.
        </div>
      </main>
    </div>
  );
}
