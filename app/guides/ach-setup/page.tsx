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

export default function AchSetupPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.navy }}>
      <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}`, padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ fontWeight: 700, color: S.white, textDecoration: 'none', fontSize: '1.1rem' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </Link>
        <span style={{ color: S.muted, fontSize: '0.85rem' }}>/ ACH Enrollment Guide</span>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Critical warning */}
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.5)', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <span style={{ color: S.red, fontSize: '1.25rem', flexShrink: 0, marginTop: '0.1rem' }}>&#9888;</span>
          <div>
            <div style={{ fontWeight: 700, color: '#fca5a5', fontSize: '1rem', marginBottom: '0.25rem' }}>
              No ACH Registration = No Refund
            </div>
            <div style={{ color: '#fca5a5', fontSize: '0.875rem', lineHeight: 1.6 }}>
              CBP issues IEEPA tariff refunds via Automated Clearing House (ACH) electronic funds transfer only. Importers who are not enrolled in ACH may not receive their refund automatically. Complete this enrollment before the CAPE portal opens.
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          How to Enroll in ACH Electronic Refunds
        </h1>
        <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '1rem', marginBottom: '3rem' }}>
          ACH enrollment authorizes CBP to deposit refunds directly into your bank account. The process is done entirely through the ACE portal and typically takes 3–5 business days to process.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            {
              num: 1,
              title: 'Log in to ACE at ace.cbp.dhs.gov',
              detail: 'Use your existing ACE credentials. If you do not have an ACE account, you will need to register through the ACE Secure Data Portal. Account registration can take several days, so do not delay.',
              link: 'https://ace.cbp.dhs.gov',
              linkLabel: 'Go to ACE portal',
            },
            {
              num: 2,
              title: 'Navigate to Account Settings',
              detail: 'After logging in, select your account from the top navigation. Look for "Account Management" or "Profile" — the exact location may vary by ACE version. You are looking for the financial/banking information section.',
            },
            {
              num: 3,
              title: 'Find the ACH Credit Enrollment section',
              detail: 'In the Account Settings, look for "ACH Credit" or "Electronic Funds Transfer" settings. CBP may also call this "Refund Bank Information" or similar. This is where you authorize direct deposit of refunds.',
            },
            {
              num: 4,
              title: 'Enter your bank account details',
              detail: 'You will need: your bank\'s ABA/routing number (9 digits), your account number, account type (checking or savings), and the account holder name as it appears on your bank account. Double-check these — incorrect information will delay your refund.',
            },
            {
              num: 5,
              title: 'Submit and wait for CBP confirmation',
              detail: 'CBP will send a prenote (zero-dollar test transaction) to your account to verify the routing before activating ACH. This typically takes 3–5 business days. Watch for CBP confirmation in the ACE portal.',
            },
            {
              num: 6,
              title: 'Verify ACH status before filing',
              detail: 'Before submitting your CAPE refund claim, log back in to ACE and confirm that your ACH enrollment status shows as "Active" or "Confirmed." File your CAPE claim only after ACH is active.',
            },
          ].map((step) => (
            <div key={step.num} style={{ display: 'flex', gap: '1.25rem', backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 10, padding: '1.5rem' }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(46,134,171,0.2)', border: `2px solid ${S.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: S.tealBright, fontSize: '0.9rem' }}>
                {step.num}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, color: S.white, fontSize: '1rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>{step.detail}</p>
                {step.link && (
                  <a href={step.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.75rem', color: S.tealBright, fontSize: '0.85rem', textDecoration: 'none' }}>
                    {step.linkLabel} &#8599;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: S.white, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
          Common Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {[
            {
              q: 'What if I already have ACH set up for paying duties?',
              a: 'ACH debit (for paying duties) and ACH credit (for receiving refunds) are separate enrollments in ACE. Confirm that you have an ACH credit enrollment specifically, not just an ACH debit setup.',
            },
            {
              q: 'What if my company does not have an ACE account?',
              a: 'You will need to register for ACE. Go to ace.cbp.dhs.gov and click "Register." You will need your Importer of Record number (EIN or IRS number). Registration can take 5–10 business days, so register immediately.',
            },
            {
              q: 'Can my customs broker enroll on my behalf?',
              a: 'A licensed customs broker with appropriate power of attorney may be able to manage ACH enrollment on your behalf. Contact your broker and confirm whether they can handle this, or whether you need to do it directly.',
            },
            {
              q: 'What happens if I miss the ACH enrollment deadline?',
              a: 'CBP may issue refunds via paper check if ACH is not active, but this is not guaranteed and may cause significant delays. Some refunds may not be issued at all without ACH enrollment, depending on final CBP guidance. Do not wait.',
            },
          ].map((item) => (
            <div key={item.q} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem' }}>
              <h4 style={{ fontWeight: 700, color: S.white, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.q}</h4>
              <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '0.875rem', margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div style={{ backgroundColor: 'rgba(46,134,171,0.08)', border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontWeight: 700, color: S.white, fontSize: '0.95rem', marginBottom: '0.75rem' }}>Official CBP Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              ['ACE Secure Data Portal', 'https://ace.cbp.dhs.gov'],
              ['CBP ACH Information Page', 'https://www.cbp.gov/trade/programs-administration/entry-summary/revenue/ach'],
              ['CBP IEEPA Refund Guidance (check for updates)', 'https://www.cbp.gov/trade/policy-and-legislative-analysis/trade-legislation/ieepa'],
            ].map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ color: S.tealBright, fontSize: '0.875rem', textDecoration: 'none' }}>
                {label} &#8599;
              </a>
            ))}
          </div>
        </div>

        {/* Next step CTA */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/upload" style={{ backgroundColor: S.teal, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
            Calculate My Refund
          </Link>
          <Link href="/guides/cape-filing" style={{ border: `1px solid ${S.border}`, color: S.white, padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
            CAPE Filing Guide
          </Link>
        </div>
      </main>
    </div>
  );
}
