'use client';

import { useState } from 'react';

const S = {
  teal: '#2e86ab',
  white: '#f0f4f8',
  border: 'rgba(46,134,171,0.25)',
  muted: '#8899aa',
} as const;

interface CheckoutButtonProps {
  auditId: string;
  tier: 'starter' | 'standard' | 'premium';
  label: string;
  disabled?: boolean;
}

export default function CheckoutButton({ auditId, tier, label, disabled = false }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (disabled) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId, tier }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to start checkout');
      }
      if (json.url) {
        window.location.href = json.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: disabled ? 'transparent' : S.teal,
          border: `1px solid ${disabled ? S.border : S.teal}`,
          color: disabled ? S.muted : S.white,
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: disabled ? 'not-allowed' : loading ? 'wait' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.15s',
        }}
      >
        {loading ? 'Redirecting...' : disabled ? 'Too many entries' : label}
      </button>
      {error && <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}
