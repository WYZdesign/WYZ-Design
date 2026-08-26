import Database from "better-sqlite3";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

let _db: any = null;
let _dbAvailable: boolean | null = null;

export function getAnalyticsDb(): any {
  if (_dbAvailable === false) return null;
  if (_db) return _db;
  try {
    const dir = join(process.cwd(), "data");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    _db = new Database(join(dir, "analytics.db"));
    _db.pragma("journal_mode = WAL");
    initAnalyticsSchema(_db);
    _dbAvailable = true;
    return _db;
  } catch {
    _dbAvailable = false;
    return null;
  }
}

function initAnalyticsSchema(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pageviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      referrer TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      ip_hash TEXT DEFAULT '',
      country TEXT DEFAULT '',
      city TEXT DEFAULT '',
      device TEXT DEFAULT '',
      browser TEXT DEFAULT '',
      os TEXT DEFAULT '',
      screen_width INTEGER DEFAULT 0,
      utm_source TEXT DEFAULT '',
      utm_medium TEXT DEFAULT '',
      utm_campaign TEXT DEFAULT '',
      session_id TEXT DEFAULT '',
      duration_ms INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_pv_path ON pageviews(path);
    CREATE INDEX IF NOT EXISTS idx_pv_created ON pageviews(created_at);
    CREATE INDEX IF NOT EXISTS idx_pv_session ON pageviews(session_id);

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      path TEXT DEFAULT '',
      label TEXT DEFAULT '',
      value REAL DEFAULT 0,
      metadata TEXT DEFAULT '{}',
      session_id TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_ev_type ON events(event_type);
    CREATE INDEX IF NOT EXISTS idx_ev_created ON events(created_at);

    CREATE TABLE IF NOT EXISTS seo_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      title_length INTEGER DEFAULT 0,
      description_length INTEGER DEFAULT 0,
      has_h1 INTEGER DEFAULT 0,
      has_canonical INTEGER DEFAULT 0,
      has_og INTEGER DEFAULT 0,
      has_schema INTEGER DEFAULT 0,
      issues TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_seo_url ON seo_checks(url);
    CREATE INDEX IF NOT EXISTS idx_seo_created ON seo_checks(created_at);
  `);
}

// ─── PAGEVIEWS ───

export interface Pageview {
  id: number;
  path: string;
  referrer: string;
  user_agent: string;
  ip_hash: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  screen_width: number;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  session_id: string;
  duration_ms: number;
  created_at: string;
}

export interface PageviewInput {
  path: string;
  referrer?: string;
  user_agent?: string;
  ip_hash?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  screen_width?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  session_id?: string;
  duration_ms?: number;
}

export function logPageview(input: PageviewInput): void {
  const db = getAnalyticsDb();
  if (!db) return;
  db.prepare(`
    INSERT INTO pageviews (path, referrer, user_agent, ip_hash, country, city, device, browser, os, screen_width, utm_source, utm_medium, utm_campaign, session_id, duration_ms)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.path, input.referrer || "", input.user_agent || "",
    input.ip_hash || "", input.country || "", input.city || "",
    input.device || "", input.browser || "", input.os || "",
    input.screen_width || 0, input.utm_source || "",
    input.utm_medium || "", input.utm_campaign || "",
    input.session_id || "", input.duration_ms || 0
  );
}

export function getPageviews(filters?: {
  path?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}): Pageview[] {
  const db = getAnalyticsDb();
  if (!db) return [];
  let where = "WHERE 1=1";
  const params: any[] = [];
  if (filters?.path) { where += " AND path = ?"; params.push(filters.path); }
  if (filters?.from) { where += " AND created_at >= ?"; params.push(filters.from); }
  if (filters?.to) { where += " AND created_at <= ?"; params.push(filters.to); }
  const limit = filters?.limit || 100;
  const offset = filters?.offset || 0;
  return db.prepare(`SELECT * FROM pageviews ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset) as Pageview[];
}

// ─── EVENTS ───

export interface AnalyticsEvent {
  id: number;
  event_type: string;
  path: string;
  label: string;
  value: number;
  metadata: string;
  session_id: string;
  created_at: string;
}

export function logEvent(event_type: string, path: string, label = "", value = 0, metadata = "{}", session_id = ""): void {
  const db = getAnalyticsDb();
  if (!db) return;
  db.prepare("INSERT INTO events (event_type, path, label, value, metadata, session_id) VALUES (?, ?, ?, ?, ?, ?)").run(event_type, path, label, value, metadata, session_id);
}

// ─── ANALYTICS SUMMARY ───

export interface AnalyticsSummary {
  period: string;
  total_pageviews: number;
  unique_visitors: number;
  unique_pages: number;
  avg_duration_ms: number;
  top_pages: { path: string; views: number; avg_duration: number }[];
  top_referrers: { referrer: string; count: number }[];
  top_utm_sources: { source: string; count: number }[];
  device_breakdown: { device: string; count: number }[];
  browser_breakdown: { browser: string; count: number }[];
  os_breakdown: { os: string; count: number }[];
  daily_views: { date: string; views: number; unique: number }[];
  bounce_rate: number;
  pages_per_session: number;
}

export function getAnalyticsSummary(days = 30): AnalyticsSummary {
  const db = getAnalyticsDb();
  if (!db) return { period: `${days}d`, total_pageviews: 0, unique_visitors: 0, unique_pages: 0, avg_duration_ms: 0, top_pages: [], top_referrers: [], top_utm_sources: [], device_breakdown: [], browser_breakdown: [], os_breakdown: [], daily_views: [], bounce_rate: 0, pages_per_session: 0 };
  const from = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  const totals = db.prepare(`
    SELECT COUNT(*) as total, COUNT(DISTINCT ip_hash) as unique_visitors, COUNT(DISTINCT path) as unique_pages, AVG(duration_ms) as avg_duration
    FROM pageviews WHERE created_at >= ?
  `).get(from) as any;

  const top_pages = db.prepare(`
    SELECT path, COUNT(*) as views, AVG(duration_ms) as avg_duration
    FROM pageviews WHERE created_at >= ?
    GROUP BY path ORDER BY views DESC LIMIT 10
  `).all(from) as any[];

  const top_referrers = db.prepare(`
    SELECT referrer, COUNT(*) as count FROM pageviews
    WHERE created_at >= ? AND referrer != '' AND referrer IS NOT NULL
    GROUP BY referrer ORDER BY count DESC LIMIT 10
  `).all(from) as any[];

  const top_utm_sources = db.prepare(`
    SELECT utm_source as source, COUNT(*) as count FROM pageviews
    WHERE created_at >= ? AND utm_source != '' AND utm_source IS NOT NULL
    GROUP BY utm_source ORDER BY count DESC LIMIT 10
  `).all(from) as any[];

  const device_breakdown = db.prepare(`
    SELECT device, COUNT(*) as count FROM pageviews
    WHERE created_at >= ? AND device != ''
    GROUP BY device ORDER BY count DESC
  `).all(from) as any[];

  const browser_breakdown = db.prepare(`
    SELECT browser, COUNT(*) as count FROM pageviews
    WHERE created_at >= ? AND browser != ''
    GROUP BY browser ORDER BY count DESC LIMIT 8
  `).all(from) as any[];

  const os_breakdown = db.prepare(`
    SELECT os, COUNT(*) as count FROM pageviews
    WHERE created_at >= ? AND os != ''
    GROUP BY os ORDER BY count DESC LIMIT 8
  `).all(from) as any[];

  const daily_views = db.prepare(`
    SELECT substr(created_at, 1, 10) as date, COUNT(*) as views, COUNT(DISTINCT ip_hash) as unique
    FROM pageviews WHERE created_at >= ?
    GROUP BY date ORDER BY date
  `).all(from) as any[];

  // Bounce rate: sessions with only 1 pageview / total sessions
  const sessions = db.prepare(`
    SELECT session_id, COUNT(*) as views FROM pageviews
    WHERE created_at >= ? AND session_id != ''
    GROUP BY session_id
  `).all(from) as any[];
  const singlePage = sessions.filter((s: any) => s.views === 1).length;
  const bounceRate = sessions.length > 0 ? singlePage / sessions.length : 0;

  // Pages per session
  const totalViews = sessions.reduce((a: number, s: any) => a + s.views, 0);
  const pps = sessions.length > 0 ? totalViews / sessions.length : 0;

  return {
    period: `${days}d`,
    total_pageviews: totals?.total || 0,
    unique_visitors: totals?.unique_visitors || 0,
    unique_pages: totals?.unique_pages || 0,
    avg_duration_ms: Math.round(totals?.avg_duration || 0),
    top_pages,
    top_referrers,
    top_utm_sources,
    device_breakdown,
    browser_breakdown,
    os_breakdown,
    daily_views,
    bounce_rate: Math.round(bounceRate * 100),
    pages_per_session: Math.round(pps * 10) / 10,
  };
}

// ─── SEO CHECK ───

export interface SeoCheck {
  id: number;
  url: string;
  score: number;
  title_length: number;
  description_length: number;
  has_h1: number;
  has_canonical: number;
  has_og: number;
  has_schema: number;
  issues: string;
  created_at: string;
}

export function logSeoCheck(check: Omit<SeoCheck, "id" | "created_at">): void {
  const db = getAnalyticsDb();
  if (!db) return;
  db.prepare(`
    INSERT INTO seo_checks (url, score, title_length, description_length, has_h1, has_canonical, has_og, has_schema, issues)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(check.url, check.score, check.title_length, check.description_length, check.has_h1, check.has_canonical, check.has_og, check.has_schema, check.issues);
}

export function getSeoHistory(url?: string, limit = 50): SeoCheck[] {
  const db = getAnalyticsDb();
  if (!db) return [];
  if (url) {
    return db.prepare("SELECT * FROM seo_checks WHERE url = ? ORDER BY created_at DESC LIMIT ?").all(url, limit) as SeoCheck[];
  }
  return db.prepare("SELECT * FROM seo_checks ORDER BY created_at DESC LIMIT ?").all(limit) as SeoCheck[];
}

export function getLatestSeoScores(): { url: string; score: number; last_check: string }[] {
  const db = getAnalyticsDb();
  if (!db) return [];
  return db.prepare(`
    SELECT url, score, MAX(created_at) as last_check
    FROM seo_checks GROUP BY url ORDER BY last_check DESC
  `).all() as any[];
}
