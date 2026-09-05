import { getRedis } from "@/lib/wyzmind";
import { logger } from "@/lib/logger";

/** In-memory fallback for local dev when Upstash/Redis isn't configured. */
interface Pageview {
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

interface AnalyticsEvent {
  id: number;
  event_type: string;
  path: string;
  label: string;
  value: number;
  metadata: string;
  session_id: string;
  created_at: string;
}

let pvSeq = 0;
let evSeq = 0;

/**
 * On Vercel serverless the previous better-sqlite3 approach died because the
 * local data/ dir is ephemeral per invocation. Analytics now lives in Redis
 * (Upstash on Vercel, local ioredis in dev) via a sorted-set per day for
 * pageviews and a plain list for events. getRedis() handles the client
 * selection; if neither is configured the functions fall back to in-memory
 * rings so the API never crashes.
 */
function pvKey(date: string): string {
  return `analytics:pv:${date}`;
}

function evKey(date: string): string {
  return `analytics:ev:${date}`;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function redis(): ReturnType<typeof getRedis> | null {
  try { return getRedis(); } catch { return null; }
}

// ─── PAGEVIEWS ───

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
  const ts = Date.now();
  const pv: Pageview = {
    id: ++pvSeq,
    path: input.path,
    referrer: input.referrer || "",
    user_agent: input.user_agent || "",
    ip_hash: input.ip_hash || "",
    country: input.country || "",
    city: input.city || "",
    device: input.device || "",
    browser: input.browser || "",
    os: input.os || "",
    screen_width: input.screen_width || 0,
    utm_source: input.utm_source || "",
    utm_medium: input.utm_medium || "",
    utm_campaign: input.utm_campaign || "",
    session_id: input.session_id || "",
    duration_ms: input.duration_ms || 0,
    created_at: new Date(ts).toISOString(),
  };
  const r = redis();
  if (r) {
    void r.setex(`${pvKey(todayKey())}:${ts}`, 86400, JSON.stringify(pv)).catch((e: unknown) => logger.warn("analytics:pg", e instanceof Error ? e.message : String(e)));
    return;
  }
  // in-memory no-op fallback: data won't persist, but the request won't crash.
}

export async function getPageviews(filters?: {
  path?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}): Promise<Pageview[]> {
  // In-memory fallback returns nothing — analytics is best-effort.
  const r = redis();
  if (!r) return [];
  const from = filters?.from || "";
  const to = filters?.to || "";
  // Gather matching days' keys. We scan the last `limit` pageviews across the
  // date range by reading all analytics:pv:<date>:* keys. For simplicity and
  // to avoid SCAN in a hot path, we read today + yesterday by default.
  const days: string[] = [];
  if (from || to) {
    const start = from ? new Date(from) : new Date(Date.now() - 30 * 86400000);
    const end = to ? new Date(to) : new Date();
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      days.push(d.toISOString().slice(0, 10));
    }
  } else {
    days.push(todayKey());
  }

  const collected: Pageview[] = [];
  for (const day of days) {
    // eslint-disable-next-line no-await-in-loop
    const keys = await r.keys(`${pvKey(day)}:*`).catch(() => []);
    for (const k of keys) {
      // eslint-disable-next-line no-await-in-loop
      const raw = await r.get(k).catch(() => null);
      if (raw) {
        const pv: Pageview = JSON.parse(raw);
        if (filters?.path && pv.path !== filters.path) continue;
        collected.push(pv);
      }
    }
  }
  return collected
    .sort((a, b) => b.id - a.id)
    .slice(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 100));
}

// ─── EVENTS ───

export function logEvent(event_type: string, path: string, label = "", value = 0, metadata = "{}", session_id = ""): void {
  const ev: AnalyticsEvent = {
    id: ++evSeq,
    event_type,
    path,
    label,
    value,
    metadata,
    session_id,
    created_at: new Date().toISOString(),
  };
  const r = redis();
  if (r) {
    void r.setex(`${evKey(todayKey())}:${ts()}:${event_type}`, 86400, JSON.stringify(ev)).catch((e: unknown) => logger.warn("analytics:ev", e instanceof Error ? e.message : String(e)));
    return;
  }
}

function ts(): number {
  return Date.now();
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

const EMPTY_SUMMARY = (days: number): AnalyticsSummary => ({
  period: `${days}d`, total_pageviews: 0, unique_visitors: 0, unique_pages: 0,
  avg_duration_ms: 0, top_pages: [], top_referrers: [], top_utm_sources: [],
  device_breakdown: [], browser_breakdown: [], os_breakdown: [], daily_views: [],
  bounce_rate: 0, pages_per_session: 0,
});

export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const r = redis();
  if (!r) return EMPTY_SUMMARY(days);
  try {
    const now = Date.now();
    const from = new Date(now - days * 86400000).toISOString().slice(0, 10);
    const to = new Date().toISOString().slice(0, 10);

    // Gather pageviews from Redis keys across the date range
    const allPvs: Pageview[] = [];
    const daily: Record<string, Pageview[]> = {};
    for (let d = new Date(from); d <= new Date(to); d.setUTCDate(d.getUTCDate() + 1)) {
      const day = d.toISOString().slice(0, 10);
      const keys = await r.keys(`${pvKey(day)}:*`).catch(() => []);
      for (const k of keys) {
        const raw = await r.get(k).catch(() => null);
        if (raw) {
          const pv: Pageview = JSON.parse(raw);
          allPvs.push(pv);
          (daily[day] ||= []).push(pv);
        }
      }
    }

    if (allPvs.length === 0) return EMPTY_SUMMARY(days);

    const total_pageviews = allPvs.length;
    const unique_visitors = new Set(allPvs.map((p) => p.ip_hash).filter(Boolean)).size;
    const unique_pages = new Set(allPvs.map((p) => p.path)).size;
    const avg_duration_ms = Math.round(allPvs.reduce((s, p) => s + p.duration_ms, 0) / total_pageviews);

    const byPath = new Map<string, { views: number; dur: number }>();
    const byRef = new Map<string, number>();
    const byUtm = new Map<string, number>();
    const byDevice = new Map<string, number>();
    const byBrowser = new Map<string, number>();
    const byOs = new Map<string, number>();

    for (const pv of allPvs) {
      const p = byPath.get(pv.path) || { views: 0, dur: 0 };
      byPath.set(pv.path, { views: p.views + 1, dur: p.dur + pv.duration_ms });
      const ref = pv.referrer || "(direct)";
      byRef.set(ref, (byRef.get(ref) || 0) + 1);
      const utm = pv.utm_source || "(none)";
      byUtm.set(utm, (byUtm.get(utm) || 0) + 1);
      const dev = pv.device || "unknown";
      byDevice.set(dev, (byDevice.get(dev) || 0) + 1);
      const br = pv.browser || "other";
      byBrowser.set(br, (byBrowser.get(br) || 0) + 1);
      const os = pv.os || "other";
      byOs.set(os, (byOs.get(os) || 0) + 1);
    }

    const top_pages = [...byPath.entries()].map(([path, v]) => ({ path, views: v.views, avg_duration: Math.round(v.dur / v.views) })).sort((a, b) => b.views - a.views).slice(0, 10);
    const top_referrers = [...byRef.entries()].map(([referrer, count]) => ({ referrer, count })).sort((a, b) => b.count - a.count).slice(0, 10);
    const top_utm_sources = [...byUtm.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 10);
    const device_breakdown = [...byDevice.entries()].map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count);
    const browser_breakdown = [...byBrowser.entries()].map(([browser, count]) => ({ browser, count })).sort((a, b) => b.count - a.count).slice(0, 8);
    const os_breakdown = [...byOs.entries()].map(([os, count]) => ({ os, count })).sort((a, b) => b.count - a.count).slice(0, 8);

    // Bounce rate: sessions with only 1 pageview
    const sessions = new Map<string, number>();
    for (const pv of allPvs) {
      if (pv.session_id) sessions.set(pv.session_id, (sessions.get(pv.session_id) || 0) + 1);
    }
    const singlePage = [...sessions.values()].filter((v) => v === 1).length;
    const bounce_rate = sessions.size > 0 ? Math.round((singlePage / sessions.size) * 100) : 0;
    const pages_per_session = sessions.size > 0 ? Math.round((total_pageviews / sessions.size) * 10) / 10 : 0;

    const daily_views = Object.entries(daily).sort().map(([date, pvs]) => ({
      date,
      views: pvs.length,
      unique: new Set(pvs.map((p) => p.ip_hash).filter(Boolean)).size,
    }));

    return {
      period: `${days}d`, total_pageviews, unique_visitors, unique_pages, avg_duration_ms,
      top_pages, top_referrers, top_utm_sources, device_breakdown, browser_breakdown, os_breakdown,
      daily_views, bounce_rate, pages_per_session,
    };
  } catch (e) {
    logger.error("analytics:summary", e);
    return EMPTY_SUMMARY(days);
  }
}

// ─── SEO CHECK ───
// SEO checks are now persisted in Supabase via /api/analytics GET?tab=seo
// (the in-memory SQLite was never viable on Vercel). Keeping the types
// for API compatibility but log/getSeoCheck now no-ops.

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

export function logSeoCheck(_check: Omit<SeoCheck, "id" | "created_at">): void {
  // SEO checks now run on-demand via /api/analytics?tab=seo (external fetch).
  // Local persistence removed (SQLite dead on Vercel).
}

export function getSeoHistory(_url?: string, _limit = 50): SeoCheck[] {
  // Not persisted locally; use the on-demand SEO checker in /api/analytics.
  return [];
}

export function getLatestSeoScores(): { url: string; score: number; last_check: string }[] {
  return [];
}
