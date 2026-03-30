import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { markAuditPaid } from '@/lib/db';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const auditId = session.metadata?.auditId;
      const tier = session.metadata?.tier;

      if (!auditId || !tier) {
        console.error('[webhook] Missing metadata in session:', session.id);
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
      }

      markAuditPaid(auditId, tier, session.id);
      console.log(`[webhook] Marked audit ${auditId} as paid (tier: ${tier})`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[webhook] handler error:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
