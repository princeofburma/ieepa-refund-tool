import Link from 'next/link';

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

export default function ProtestGuidePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.navy }}>
      <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}`, padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ fontWeight: 700, color: S.white, textDecoration: 'none', fontSize: '1.1rem' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </Link>
        <span style={{ color: S.muted, fontSize: '0.85rem' }}>/ Protest &amp; Deadlines</span>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          The 180-Day Protest Window
        </h1>
        <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '1rem', marginBottom: '3rem' }}>
          Understanding your protest rights and deadlines is critical. Filing too late means forfeiting your refund claim permanently.
        </p>

        {/* Warning */}
        <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.4)', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ fontWeight: 700, color: S.yellow, fontSize: '1rem', marginBottom: '0.5rem' }}>
            Critical: 180 Days from Liquidation
          </div>
          <div style={{ color: S.yellow, fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.9 }}>
            Under 19 U.S.C. §1514, protests must be filed within 180 days of the date of liquidation of an entry, not the date of entry or the Supreme Court ruling. If your entries liquidated before the ruling, the clock is already running. Check your liquidation dates immediately.
          </div>
        </div>

        {/* Key concepts */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: S.white, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
          Understanding the Timeline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            {
              label: 'What is liquidation?',
              text: 'Liquidation is the final determination by CBP of the correct duties, taxes, and fees for an import entry. The date of liquidation is posted in ACE. It is often several months after the date of entry. Check ACE for your liquidation dates — they are distinct from your entry dates.',
            },
            {
              label: 'What is a protest?',
              text: 'A protest is a formal challenge to CBP\'s liquidation decision, filed under 19 U.S.C. §1514. For IEEPA refunds, you are protesting the assessment of IEEPA duties that the Supreme Court declared unconstitutional. CBP is required to respond to protests filed within the 180-day window.',
            },
            {
              label: 'Should I file a protest now or wait for CAPE?',
              text: 'For entries liquidated before the Supreme Court ruling, you must file a protest within 180 days of liquidation — CAPE is not a substitute for protesting those entries. The CAPE portal is intended for post-ruling administrative claims. For entries that have not yet liquidated, wait for CBP guidance. If your entries are approaching the 180-day deadline, file a protective protest immediately.',
            },
            {
              label: 'What happens if entries have not yet liquidated?',
              text: 'Entries that have not yet been liquidated as of the Supreme Court ruling date may be subject to automatic reliquidation by CBP without IEEPA duties. However, do not count on this — monitor your ACE account and file protests proactively if CBP does not act before the 180-day window.',
            },
          ].map((item) => (
            <div key={item.label} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: S.white, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.label}</h3>
              <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '0.875rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* How to file */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: S.white, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
          How to File a Protest
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            {
              num: 1,
              title: 'File via CBP Form 19 through ACE',
              detail: 'Protests are filed electronically using CBP Form 19 through the ACE portal. Navigate to the protest filing section and complete the required fields: port code, entry number, liquidation date, and the specific duties being protested.',
            },
            {
              num: 2,
              title: 'Identify the liquidation date and protest basis',
              detail: 'The protest must state the specific grounds — in this case, that the IEEPA duties were imposed under unconstitutional authority per the Supreme Court ruling of February 20, 2026. Cite the ruling specifically in your protest narrative.',
            },
            {
              num: 3,
              title: 'Attach your evidence',
              detail: 'Attach documentation showing the IEEPA HTS codes on the entry (a copy of the entry summary or your ACE ES-003 report), the duty amounts paid, and a reference to the Supreme Court ruling. Our CAPE-ready CSV can serve as your evidence file.',
            },
            {
              num: 4,
              title: 'Request accelerated disposition if time is critical',
              detail: 'Under 19 U.S.C. §1515(b), you can request accelerated disposition of your protest if CBP has not acted within 30 days of filing. This forces CBP to either approve or deny the protest within 30 days.',
            },
          ].map((step) => (
            <div key={step.num} style={{ display: 'flex', gap: '1.25rem', backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 10, padding: '1.5rem' }}>
              <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(46,134,171,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: S.tealBright, fontSize: '0.85rem' }}>
                {step.num}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, color: S.white, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{step.title}</h3>
                <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '0.875rem', margin: 0 }}>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Protest letter outline */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: S.white, marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          Protest Narrative Template
        </h2>
        <div style={{ backgroundColor: 'rgba(46,134,171,0.05)', border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.5rem', marginBottom: '2.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: S.muted, lineHeight: 1.8 }}>
          <p style={{ marginBottom: '0.5rem' }}>To: US Customs and Border Protection</p>
          <p style={{ marginBottom: '1rem' }}>Re: Protest of Assessment of Additional Duties Under IEEPA Executive Orders</p>
          <p style={{ marginBottom: '0.5rem' }}>The undersigned Importer of Record respectfully protests the assessment of additional ad valorem duties under the following IEEPA Executive Orders on the above-referenced entry summary:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>[List applicable EO numbers: EO 14193, 14194, 14195, 14257 as applicable]</li>
            <li>[List IEEPA Chapter 99 HTS codes: 9903.01.xx or 9903.02.xx]</li>
            <li>[State duty amounts paid]</li>
          </ul>
          <p style={{ marginBottom: '0.5rem' }}>On February 20, 2026, the Supreme Court of the United States held in [case name TBD] that the use of the International Emergency Economic Powers Act to impose tariffs exceeded the President&#39;s statutory authority and was unconstitutional. The additional duties assessed under the above-referenced Executive Orders were imposed pursuant to IEEPA and are therefore subject to refund pursuant to the Supreme Court&#39;s ruling.</p>
          <p>The Importer of Record requests a full refund of all IEEPA duties paid on this entry, plus applicable statutory interest at the IRS underpayment rate under 26 U.S.C. §6621.</p>
        </div>

        <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '1.25rem', marginBottom: '2.5rem', fontSize: '0.85rem', color: '#fca5a5', lineHeight: 1.7 }}>
          <strong>Important:</strong> This template is for informational purposes only. The Supreme Court case name and precise legal citations should be updated once the ruling is formally reported. Consult a licensed customs attorney before filing a protest, particularly for large refund amounts.
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/upload" style={{ backgroundColor: S.teal, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Calculate My Refund
          </Link>
          <Link href="/guides/ach-setup" style={{ border: `1px solid ${S.border}`, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
            ACH Enrollment Guide
          </Link>
        </div>
      </main>
    </div>
  );
}
