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
} as const;

function NavBar() {
  return (
    <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: S.white, letterSpacing: '-0.01em' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/guides/ior-check" style={{ color: S.muted, textDecoration: 'none', fontSize: '0.9rem' }}>Are you eligible?</Link>
          <Link href="#pricing" style={{ color: S.muted, textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</Link>
          <Link href="/upload" style={{ backgroundColor: S.teal, color: S.white, padding: '0.5rem 1.25rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse at center, rgba(46,134,171,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(201,168,76,0.15)', border: `1px solid rgba(201,168,76,0.4)`, color: S.gold, padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Supreme Court Ruling — Feb 20, 2026
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: S.white, marginBottom: '1.25rem' }}>
          Recover Your<br />
          <span style={{ color: S.tealBright }}>IEEPA Tariff Refund</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: S.muted, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 2.5rem', fontWeight: 400 }}>
          The Supreme Court struck down IEEPA tariffs on February 20, 2026. An estimated $166 billion in refunds are owed to US importers. Get your CAPE-ready filing package in minutes — no customs broker required.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/upload" style={{ display: 'inline-block', backgroundColor: S.teal, color: S.white, padding: '1rem 2.25rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em', transition: 'background-color 0.15s' }}>
            Calculate My Refund →
          </Link>
          <Link href="#how-it-works" style={{ display: 'inline-block', border: `1px solid ${S.border}`, color: S.white, padding: '1rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>
            How it works
          </Link>
        </div>
        <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: S.muted }}>
          Free refund estimate. No account required.
        </p>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { label: 'Importers owed refunds', value: '330,000+' },
    { label: 'Average refund amount', value: '$12,400' },
    { label: 'CAPE portal expected', value: 'April 20, 2026' },
    { label: 'Protest window', value: '180 days' },
  ];
  return (
    <section style={{ borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}`, backgroundColor: S.navyMid, padding: '1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center', padding: '0.75rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: S.tealBright, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: S.muted, marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload your ACE data',
      desc: 'Export your Entry Summary Details Report (ES-003) from the ACE portal, or use any CSV with entry number, HTS code, and duty amount columns. We accept .csv and .xlsx.',
    },
    {
      num: '02',
      title: 'Get your instant refund estimate',
      desc: 'Our engine scans every line item for IEEPA Chapter 99 codes (9903.01.xx and 9903.02.xx), calculates refundable duties, and adds interest — all in seconds. Free.',
    },
    {
      num: '03',
      title: 'Download your CAPE-ready filing package',
      desc: 'Unlock your full audit report with a CAPE-formatted CSV, entry-by-entry breakdown, error flags, and step-by-step filing instructions. Starting at $97.',
    },
  ];
  return (
    <section id="how-it-works" style={{ padding: '5rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
        From upload to filing package in minutes
      </h2>
      <p style={{ textAlign: 'center', color: S.muted, marginBottom: '3rem', fontSize: '1rem' }}>
        No customs broker. No waiting. No account required.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {steps.map((step) => (
          <div key={step.num} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 12, padding: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: S.teal, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>STEP {step.num}</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{step.title}</h3>
            <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '0.95rem' }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingCard({ name, price, maxEntries, features, highlighted }: {
  name: string;
  price: number;
  maxEntries: number | string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div style={{
      backgroundColor: highlighted ? 'rgba(46,134,171,0.12)' : S.navyMid,
      border: highlighted ? `2px solid ${S.teal}` : `1px solid ${S.border}`,
      borderRadius: 12,
      padding: '2rem',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {highlighted && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', backgroundColor: S.teal, color: S.white, padding: '0.25rem 0.875rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          MOST POPULAR
        </div>
      )}
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{name}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: S.white, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
        ${price / 100}
      </div>
      <div style={{ fontSize: '0.8rem', color: S.muted, marginBottom: '1.5rem' }}>one-time payment</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        {features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: S.white }}>
            <span style={{ color: S.tealBright, flexShrink: 0 }}>&#10003;</span>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/upload" style={{
        display: 'block',
        textAlign: 'center',
        backgroundColor: highlighted ? S.teal : 'transparent',
        border: `1px solid ${highlighted ? S.teal : S.border}`,
        color: S.white,
        padding: '0.875rem',
        borderRadius: 8,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.95rem',
      }}>
        Get Started
      </Link>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" style={{ padding: '5rem 1.5rem', backgroundColor: S.navyMid }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Simple, transparent pricing
        </h2>
        <p style={{ textAlign: 'center', color: S.muted, marginBottom: '3rem' }}>
          Refund estimate is always free. Pay only when you need the full filing package.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <PricingCard
            name="Starter"
            price={9700}
            maxEntries={25}
            features={['Up to 25 IEEPA entries', 'Full audit report PDF', 'CAPE-ready CSV export', 'Error analysis', 'Filing instructions']}
          />
          <PricingCard
            name="Standard"
            price={19700}
            maxEntries={100}
            features={['Up to 100 IEEPA entries', 'Full audit report PDF', 'CAPE-ready CSV export', 'Error analysis', 'Filing instructions', 'Priority support']}
            highlighted
          />
          <PricingCard
            name="Premium"
            price={39700}
            maxEntries="Unlimited"
            features={['Unlimited IEEPA entries', 'Full audit report PDF', 'CAPE-ready CSV export', 'Error analysis', 'Filing instructions', 'AI classification check', 'Priority support']}
          />
        </div>
        <p style={{ textAlign: 'center', color: S.muted, marginTop: '1.5rem', fontSize: '0.85rem' }}>
          Not sure which plan? Upload your file first — we will tell you how many IEEPA entries you have before asking for payment.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: 'What is IEEPA and why are refunds owed?',
      a: 'The International Emergency Economic Powers Act (IEEPA) was used by the executive branch starting in early 2025 to impose tariffs on imports from multiple countries without congressional authorization. On February 20, 2026, the US Supreme Court ruled these tariffs unconstitutional. That ruling entitles importers who paid IEEPA duties to a refund of those amounts, plus statutory interest.',
    },
    {
      q: 'What is the CAPE portal?',
      a: 'CAPE (Customs Automated Protest Entry) is the CBP electronic portal for submitting refund claims. CBP has announced the portal is expected to open around April 20, 2026. Until then, importers can file traditional protests through the ACE portal. Our tool generates a CAPE-ready CSV so you are prepared the moment the portal opens.',
    },
    {
      q: 'Do I need a customs broker to claim my refund?',
      a: 'Not necessarily. Importers of record can file protests directly through the ACE portal without a licensed customs broker. However, for complex entries, large refund amounts, or entries involving classification disputes, consulting a licensed customs attorney or broker is advisable. This tool prepares your data — the decision to file yourself or engage a professional is yours.',
    },
    {
      q: 'What data do I need to upload?',
      a: 'You need your ACE Entry Summary Details Report (ES-003), which you can export from the ACE portal under the "Reports" section. At minimum, each row in your file needs an entry number, an HTS code, and the duty amount paid. Country of origin and entered value are helpful but optional. We accept .csv and .xlsx files up to 10MB.',
    },
  ];

  return (
    <section id="faq" style={{ padding: '5rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, color: S.white, marginBottom: '3rem', letterSpacing: '-0.02em' }}>
        Common questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {items.map((item) => (
          <div key={item.q} style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.5rem', marginBottom: '0.75rem' }}>
            <h3 style={{ fontWeight: 700, color: S.white, fontSize: '1rem', marginBottom: '0.75rem' }}>{item.q}</h3>
            <p style={{ color: S.muted, lineHeight: 1.75, fontSize: '0.95rem' }}>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Disclaimer() {
  return (
    <section style={{ padding: '2.5rem 1.5rem', backgroundColor: S.navyMid, borderTop: `1px solid ${S.border}` }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: '0.75rem', color: S.muted, lineHeight: 1.75 }}>
          <strong style={{ color: S.white }}>Legal Disclaimer.</strong> This tool is provided for informational purposes only and does not constitute legal or customs-brokerage advice. Refund estimates are based on publicly available information about IEEPA Chapter 99 duty codes and the Supreme Court ruling of February 20, 2026. Actual refund eligibility, amounts, and procedures are subject to CBP determination and any subsequent regulatory guidance. The CAPE portal filing requirements have not yet been published by CBP; the CAPE-ready CSV generated by this tool is based on anticipated requirements and may require updating when official specifications are released. Users are responsible for verifying the accuracy of their entry data and for complying with all applicable deadlines, including the 180-day protest window measured from the date of liquidation of each entry. This tool is not affiliated with or endorsed by US Customs and Border Protection (CBP), the Department of Homeland Security, or any government agency. Consult a licensed customs attorney or customs broker for advice specific to your situation.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${S.border}`, padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontWeight: 700, color: S.white }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[
            ['Guides', '/guides/ior-check'],
            ['ACH Setup', '/guides/ach-setup'],
            ['Protest Guide', '/guides/protest'],
            ['CAPE Filing', '/guides/cape-filing'],
            ['Terms', '/terms'],
            ['Privacy', '/privacy'],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{ color: S.muted, textDecoration: 'none', fontSize: '0.85rem' }}>{label}</Link>
          ))}
        </div>
        <div style={{ color: S.muted, fontSize: '0.8rem' }}>
          &copy; 2026 IEEPA Refund Tool
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main style={{ flex: 1 }}>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <Disclaimer />
      </main>
      <Footer />
    </>
  );
}
