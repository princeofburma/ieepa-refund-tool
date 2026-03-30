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
  yellow: '#f59e0b',
} as const;

export default function CapeFilingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.navy }}>
      <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}`, padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ fontWeight: 700, color: S.white, textDecoration: 'none', fontSize: '1.1rem' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </Link>
        <span style={{ color: S.muted, fontSize: '0.85rem' }}>/ CAPE Filing Guide</span>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Placeholder banner */}
        <div style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.4)', borderRadius: 10, padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ fontWeight: 700, color: S.gold, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            CAPE Portal Guide — Coming Soon
          </div>
          <div style={{ color: S.yellow, fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.9 }}>
            CBP has announced the CAPE (Customs Automated Protest Entry) portal is expected to launch around <strong>April 20, 2026</strong>. Once the portal opens and CBP publishes the official filing specification, this guide will be updated with step-by-step instructions. Check back after April 20, 2026.
          </div>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          CAPE Portal: What We Know
        </h1>
        <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '1rem', marginBottom: '2.5rem' }}>
          CBP is building a dedicated portal for IEEPA refund claims. Here is what has been announced so far.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {[
            {
              title: 'What is CAPE?',
              text: 'CAPE stands for Customs Automated Protest Entry. It is a CBP-developed online portal that will allow importers to submit IEEPA tariff refund claims without going through traditional paper-based protest procedures. CBP designed CAPE specifically to handle the volume of IEEPA refund requests following the Supreme Court ruling.',
            },
            {
              title: 'Expected launch: approximately April 20, 2026',
              text: 'CBP has indicated the portal will open around April 20, 2026. This date may shift. Monitor the CBP website at cbp.gov for official announcements. Do not wait for CAPE if your 180-day protest window is approaching — file a traditional protest first.',
            },
            {
              title: 'What information CAPE will likely require',
              text: 'Based on CBP announcements and standard protest requirements, CAPE will likely require: your Importer of Record number (EIN), entry summary numbers for each affected entry, IEEPA HTS codes for each entry (9903.01.xx or 9903.02.xx), duty amounts paid under those codes, and entry dates. Our CAPE CSV download is formatted to include exactly these fields.',
            },
            {
              title: 'CAPE vs. traditional protest: which should I file?',
              text: 'If your entries are approaching the 180-day protest deadline, file a traditional protest through ACE immediately — do not wait for CAPE. For entries with time remaining or entries not yet liquidated, CAPE is expected to be the primary channel when it launches. You should not need to file both for the same entry.',
            },
            {
              title: 'ACH enrollment is required regardless of which method you use',
              text: 'Whether you file through CAPE or through traditional protest, CBP will issue your refund via ACH. Enroll now if you have not already — the process takes 3–5 business days.',
            },
          ].map((item) => (
            <div key={item.title} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, color: S.white, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '0.875rem', margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* While you wait */}
        <div style={{ backgroundColor: 'rgba(46,134,171,0.08)', border: `1px solid ${S.teal}`, borderRadius: 10, padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 700, color: S.tealBright, fontSize: '1rem', marginBottom: '1rem' }}>
            What to do while you wait for CAPE to launch
          </h2>
          <ul style={{ paddingLeft: '1.25rem', color: S.muted, lineHeight: 1.8, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Enroll in ACH electronic refunds now (<Link href="/guides/ach-setup" style={{ color: S.tealBright }}>ACH Setup Guide</Link>)</li>
            <li>Download your CAPE-ready CSV from your audit report — keep it safe</li>
            <li>Check your liquidation dates in ACE and identify any approaching 180-day deadlines</li>
            <li>File traditional protests for any entries within 30 days of the 180-day deadline</li>
            <li>Confirm you are listed as the Importer of Record on all affected entries (<Link href="/guides/ior-check" style={{ color: S.tealBright }}>IOR Check</Link>)</li>
            <li>Monitor <a href="https://www.cbp.gov" target="_blank" rel="noopener noreferrer" style={{ color: S.tealBright }}>cbp.gov</a> and this page for CAPE launch announcements</li>
          </ul>
        </div>

        {/* CBP links */}
        <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontWeight: 700, color: S.white, fontSize: '0.9rem', marginBottom: '0.75rem' }}>Official CBP Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              ['CBP IEEPA Refund Information', 'https://www.cbp.gov/trade/policy-and-legislative-analysis/trade-legislation/ieepa'],
              ['CBP Trade News', 'https://www.cbp.gov/trade'],
              ['ACE Portal (protest filing)', 'https://ace.cbp.dhs.gov'],
            ].map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ color: S.tealBright, fontSize: '0.875rem', textDecoration: 'none' }}>
                {label} &#8599;
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/upload" style={{ backgroundColor: S.teal, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Get My CAPE-Ready CSV
          </Link>
          <Link href="/guides/protest" style={{ border: `1px solid ${S.border}`, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
            Protest Deadline Guide
          </Link>
        </div>
      </main>
    </div>
  );
}
