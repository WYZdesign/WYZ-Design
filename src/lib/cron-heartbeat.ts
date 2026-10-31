import { getRedis } from "@/lib/wyzmind";
import { logger } from "@/lib/logger";

/**
 * Cron heartbeat. Each scheduled route calls markCronRun() when it finishes so
 * the admin panel can show whether the automation actually ran and whether it
 * succeeded, instead of the "invisible automations" gap.
 *
 * Stored in Redis (same store as rate limiting), 14-day TTL, one small key per
 * job. No values or secrets are written.
 */

export interface CronJobDef {
  id: string;
  path: string;
  schedule: string;
  label: string;
  cadenceMinutes: number;
}

export const CRON_JOBS: CronJobDef[] = [
  { id: "health", path: "/api/health", schedule: "Every 5 min", label: "Health probe", cadenceMinutes: 5 },
  { id: "booking-whatsnext", path: "/api/cron/booking-whatsnext", schedule: "Daily 16:00 UTC", label: "Day-before booking reminder", cadenceMinutes: 1440 },
  { id: "cleanup-orders", path: "/api/cron/cleanup-orders", schedule: "Daily 07:00 UTC", label: "Abandoned checkout cleanup", cadenceMinutes: 1440 },
  { id: "delivery-outreach", path: "/api/cron/delivery-outreach", schedule: "Daily 15:00 UTC", label: "Delivery outreach drip", cadenceMinutes: 1440 },
];

export interface CronRun {
  at: string;
  ok: boolean;
  detail: string;
}

export interface CronJobStatus extends CronJobDef {
  lastRun: CronRun | null;
  ageMinutes: number | null;
  status: "ok" | "failed" | "stale" | "never";
}

export interface IntegrationStatus {
  name: string;
  configured: boolean;
  note: string;
}

const TTL_SECONDS = 60 * 60 * 24 * 14;

export async function markCronRun(id: string, ok: boolean, detail = ""): Promise<void> {
  try {
    const r = getRedis();
    const payload: CronRun = { at: new Date().toISOString(), ok, detail: detail.slice(0, 300) };
    await r.set(`cron:last:${id}`, JSON.stringify(payload), "EX", TTL_SECONDS);
  } catch (e) {
    logger.warn("cron:heartbeat", e instanceof Error ? e.message : String(e));
  }
}

export async function getCronStatus(): Promise<CronJobStatus[]> {
  const now = Date.now();
  let runs: Record<string, CronRun> = {};
  try {
    const r = getRedis();
    const entries = await Promise.all(
      CRON_JOBS.map(async (job) => {
        const raw = await r.get(`cron:last:${job.id}`).catch(() => null);
        if (!raw) return [job.id, null] as const;
        try {
          return [job.id, JSON.parse(raw) as CronRun] as const;
        } catch {
          return [job.id, null] as const;
        }
      })
    );
    runs = Object.fromEntries(entries.filter(([, v]) => v !== null)) as Record<string, CronRun>;
  } catch (e) {
    logger.warn("cron:status", e instanceof Error ? e.message : String(e));
  }

  return CRON_JOBS.map((job) => {
    const lastRun = runs[job.id] || null;
    const ageMinutes = lastRun ? Math.max(0, Math.round((now - Date.parse(lastRun.at)) / 60000)) : null;
    // Allow one missed tick before calling it stale (plus a small grace).
    const stale = ageMinutes !== null && ageMinutes > job.cadenceMinutes * 2 + 10;
    const status: CronJobStatus["status"] =
      !lastRun ? "never" : stale ? "stale" : lastRun.ok ? "ok" : "failed";
    return { ...job, lastRun, ageMinutes, status };
  });
}

/** Which integrations are configured. Booleans only, never the values. */
export function getIntegrationStatus(): IntegrationStatus[] {
  const has = (k: string) => Boolean(process.env[k] && String(process.env[k]).trim());
  return [
    { name: "Stripe payments", configured: has("STRIPE_SECRET_KEY"), note: "Checkout and payment records" },
    { name: "Printful fulfillment", configured: has("PRINTFUL_API_KEY") && has("PRINTFUL_STORE_ID"), note: "Merch print-on-demand" },
    { name: "Resend email", configured: has("RESEND_API_KEY"), note: "Transactional and outreach email" },
    { name: "Google Drive gallery", configured: has("GOOGLE_DRIVE_API_KEY"), note: "Live photo and model galleries" },
    { name: "Supabase database", configured: has("NEXT_PUBLIC_SUPABASE_URL") && (has("SUPABASE_SERVICE_ROLE_KEY") || has("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")), note: "Forms, orders, gift cards" },
    { name: "Redis (Upstash)", configured: has("UPSTASH_REDIS_REST_URL") && has("UPSTASH_REDIS_REST_TOKEN"), note: "Rate limits, analytics, zeal" },
    { name: "OpenRouter (AI concepts)", configured: has("OPENROUTER_API_KEY"), note: "Concept generator" },
    { name: "Discord webhook", configured: has("DISCORD_WEBHOOK_URL"), note: "Ops notifications" },
  ];
}
