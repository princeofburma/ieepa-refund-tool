import { NextRequest, NextResponse } from 'next/server';
import { stripe, TIERS, TierKey } from '@/lib/stripe';
import { getAudit } from '@/lib/db';
import { AuditResult } from '@/lib/ieepa-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { auditId?: string; tier?: string };
    const { auditId, tier } = body;

    if (!auditId || !tier) {
      return NextResponse.json({ error: 'auditId and tier are required' }, { status: 400 });
    }

    if (!['starter', 'standard', 'premium'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier. Must be starter, standard, or premium.' }, { status: 400 });
    }

    const tierKey = tier as TierKey;
    const tierConfig = TIERS[tierKey];

    const record = await getAudit(auditId);
    if (!record) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    const storedData = JSON.parse(record.data) as { audit: AuditResult };
    const totalEntries = storedData.audit.total_entries;

    if (totalEntries > tierConfig.max_entries) {
      return NextResponse.json(
        {
          error: `Your audit has ${totalEntries} entries, which exceeds the ${tierConfig.name} plan limit of ${tierConfig.max_entries}. Please select a higher tier.`,
          total_entries: totalEntries,
          tier_limit: tierConfig.max_entries,
        },
        { status: 422 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: tierConfig.priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/report/${auditId}?success=1`,
      cancel_url: `${baseUrl}/results/${auditId}`,
      metadata: {
        auditId,
        tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
