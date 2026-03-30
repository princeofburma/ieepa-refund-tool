import Stripe from 'stripe';

// Lazy singleton — avoids crashing at build time when env vars are not set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

// Keep named export for convenience in route files
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

export const TIERS = {
  starter: {
    name: 'Starter',
    price: 9700,
    max_entries: 25,
    max_ai_checks: 0,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      'Up to 25 entries',
      'Full audit report',
      'CAPE-ready CSV export',
      'Error analysis',
    ],
  },
  standard: {
    name: 'Standard',
    price: 19700,
    max_entries: 250,
    max_ai_checks: 0,
    priceId: process.env.STRIPE_STANDARD_PRICE_ID!,
    features: [
      'Up to 250 entries',
      'Full audit report',
      'CAPE-ready CSV export',
      'Error analysis',
      'Priority support',
    ],
  },
  premium: {
    name: 'Premium',
    price: 39700,
    max_entries: 2500,
    max_ai_checks: 500, // cap AI calls regardless of entry count
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    features: [
      'Up to 2,500 entries',
      'Full audit report',
      'CAPE-ready CSV export',
      'Error analysis',
      'AI classification check (up to 500 lines)',
      'Priority support',
    ],
  },
} as const;

export type TierKey = keyof typeof TIERS;
