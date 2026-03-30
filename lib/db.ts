import BetterSqlite3 from 'better-sqlite3';
import path from 'path';

export interface AuditRecord {
  id: string;
  created_at: number;
  status: 'free' | 'paid';
  stripe_session_id: string | null;
  tier: string | null;
  data: string;
}

let _db: BetterSqlite3.Database | null = null;

export function getDb(): BetterSqlite3.Database {
  if (_db) return _db;

  const dbPath = process.env.DATABASE_URL
    ? path.resolve(process.env.DATABASE_URL)
    : path.resolve('./ieepa-audits.db');

  _db = new BetterSqlite3(dbPath);

  _db.exec(`
    CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'free',
      stripe_session_id TEXT,
      tier TEXT,
      data TEXT NOT NULL
    );
  `);

  return _db;
}

export function createAudit(id: string, data: object): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO audits (id, created_at, status, stripe_session_id, tier, data)
    VALUES (?, ?, 'free', NULL, NULL, ?)
  `);
  stmt.run(id, Date.now(), JSON.stringify(data));
}

export function getAudit(id: string): AuditRecord | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM audits WHERE id = ?');
  const row = stmt.get(id) as AuditRecord | undefined;
  return row ?? null;
}

export function markAuditPaid(id: string, tier: string, stripeSessionId: string): void {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE audits
    SET status = 'paid', tier = ?, stripe_session_id = ?
    WHERE id = ?
  `);
  stmt.run(tier, stripeSessionId, id);
}
