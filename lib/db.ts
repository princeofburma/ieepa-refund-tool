import { kv } from '@vercel/kv';

export interface AuditRecord {
  id: string;
  created_at: number;
  status: 'free' | 'paid';
  stripe_session_id: string | null;
  tier: string | null;
  data: string;
}

// Audits expire after 90 days (seconds)
const TTL = 60 * 60 * 24 * 90;

export async function createAudit(id: string, data: object): Promise<void> {
  const record: AuditRecord = {
    id,
    created_at: Date.now(),
    status: 'free',
    stripe_session_id: null,
    tier: null,
    data: JSON.stringify(data),
  };
  await kv.set(`audit:${id}`, record, { ex: TTL });
}

export async function getAudit(id: string): Promise<AuditRecord | null> {
  const record = await kv.get<AuditRecord>(`audit:${id}`);
  return record ?? null;
}

export async function markAuditPaid(id: string, tier: string, stripeSessionId: string): Promise<void> {
  const record = await getAudit(id);
  if (!record) return;
  const updated: AuditRecord = {
    ...record,
    status: 'paid',
    tier,
    stripe_session_id: stripeSessionId,
  };
  await kv.set(`audit:${id}`, updated, { ex: TTL });
}
