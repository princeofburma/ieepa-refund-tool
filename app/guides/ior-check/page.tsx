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

interface DecisionNode {
  q: string;
  yes?: { label: string; next: string };
  no?: { label: string; next: string };
  result?: 'eligible' | 'not-eligible' | 'maybe';
  resultText?: string;
}

export default function IorCheckPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.navy }}>
      <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}`, padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ fontWeight: 700, color: S.white, textDecoration: 'none', fontSize: '1.1rem' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </Link>
        <span style={{ color: S.muted, fontSize: '0.85rem' }}>/ Eligibility Check</span>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Are You Eligible for a Refund?
        </h1>
        <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '1rem', marginBottom: '3rem' }}>
          To claim an IEEPA tariff refund, you must be the Importer of Record (IOR) for the affected entries. Use this guide to determine your eligibility.
        </p>

        {/* Decision tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>

          <div style={{ backgroundColor: S.navyMid, border: `2px solid ${S.teal}`, borderRadius: 12, padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: S.teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Question 1</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: S.white, marginBottom: '1rem' }}>
              Were you listed as the Importer of Record (IOR) on the CBP entry summaries where IEEPA duties were paid?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.green, marginBottom: '0.35rem' }}>Yes</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>You are the IOR. Continue to Question 2.</div>
              </div>
              <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.red, marginBottom: '0.35rem' }}>No</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>You are likely not eligible unless you have a power of attorney or assignment of refund rights from the IOR. See the note below.</div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: S.teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Question 2</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: S.white, marginBottom: '1rem' }}>
              Were any of your entries liquidated (finalized by CBP) after February 20, 2026?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.green, marginBottom: '0.35rem' }}>Yes</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>CBP may automatically refund unliquidated or recently-liquidated entries. You may also be able to protest within 180 days. Continue to Question 3.</div>
              </div>
              <div style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.yellow, marginBottom: '0.35rem' }}>No — entries liquidated before Feb 20</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>You can still file a protest for entries liquidated within the last 180 days. For older entries, consult a customs attorney about whether a further review or court action is available.</div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: S.teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Question 3</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: S.white, marginBottom: '1rem' }}>
              Did your entry summaries include any Chapter 99 IEEPA classification codes (HTS codes starting with 9903.01 or 9903.02)?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.green, marginBottom: '0.35rem' }}>Yes — I can see 9903.01.xx or 9903.02.xx codes</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>
                  You likely have refundable IEEPA duties. Upload your ACE entry summary to calculate your exact refund estimate.
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.yellow, marginBottom: '0.35rem' }}>Not sure or No</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>
                  Upload your data anyway — our engine will scan every HTS code automatically. If no IEEPA codes are found, we will tell you immediately at no cost.
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: S.teal, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Question 4</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: S.white, marginBottom: '1rem' }}>
              Are you enrolled in ACH electronic refunds through ACE?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.green, marginBottom: '0.35rem' }}>Yes</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>You are ready to receive your refund electronically. No check delays.</div>
              </div>
              <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '1rem' }}>
                <div style={{ fontWeight: 700, color: S.red, marginBottom: '0.35rem' }}>No — critical</div>
                <div style={{ color: S.muted, fontSize: '0.875rem' }}>
                  CBP issues IEEPA refunds via ACH only. Without ACH enrollment, you may not receive your refund. <Link href="/guides/ach-setup" style={{ color: S.tealBright }}>Enroll now</Link>.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Who is the IOR note */}
        <div style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10, padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: 700, color: S.gold, marginBottom: '0.75rem' }}>Who is the Importer of Record?</h3>
          <div style={{ color: S.muted, lineHeight: 1.8, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p>The Importer of Record is the entity listed on the CBP Form 7501 (Entry Summary) as responsible for the entry. This is typically:</p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>The US buyer or consignee who purchased the goods</li>
              <li>A customs broker acting under a continuous bond</li>
              <li>The foreign seller if they have a US-based IOR arrangement</li>
            </ul>
            <p>If your customs broker filed entries on your behalf but you paid the duties (via a binding obligation in your customs bond), you are typically still the party entitled to the refund. Confirm with your broker.</p>
            <p>If you are a seller (not buyer) who was unexpectedly listed as IOR, or if you filed as a Non-Resident Importer (NRI), the eligibility analysis is more complex — consult a licensed customs attorney.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/upload" style={{ display: 'inline-block', backgroundColor: S.teal, color: S.white, padding: '1rem 2.25rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem' }}>
            Upload My ACE Data — Free Estimate
          </Link>
          <div style={{ color: S.muted, fontSize: '0.8rem', marginTop: '0.75rem' }}>No account required. Refund estimate is free.</div>
        </div>
      </main>
    </div>
  );
}
