import Redis from "ioredis";
import { Redis as UpstashRedis } from "@upstash/redis";
import { logger } from "@/lib/logger";
import { getServiceClient } from "@/lib/supabase";

let redisClient: Redis | null = null;
let upstashClient: UpstashRedis | null = null;

/**
 * Minimal Redis surface used across the app, so the backing client can be
 * swapped without touching call sites.
 */
export interface RedisLike {
  /** Supports the arg styles used here: ("key","val","EX",secs,"NX"), ("key","val","NX"), ("key","val"). */
  set(key: string, value: string, ...args: (string | number)[]): Promise<string | null>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
  sadd(key: string, member: string): Promise<number>;
  scard(key: string): Promise<number>;
  spop(key: string, count?: number): Promise<string[] | string | null>;
  setex(key: string, seconds: number, value: string): Promise<"OK" | null>;
  keys(pattern: string): Promise<string[]>;
  ping(): Promise<string>;
}

/**
 * Prefers Upstash REST (the only reachable Redis on Vercel serverless —
 * ioredis needs raw TCP, which Vercel functions don't allow). Falls back to
 * ioredis for local dev where REDIS_HOST is a real endpoint. This fixes the
 * split-brain where rate limiting used Upstash while zeal cooldowns/locks/
 * redemption records silently failed open against localhost in production.
 */
export function getRedis(): RedisLike {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    if (!upstashClient) {
      upstashClient = new UpstashRedis({ url: upstashUrl, token: upstashToken });
    }
    const r = upstashClient;
    return {
      async set(key, value, ...args) {
        let ex: number | undefined;
        let nx = false;
        for (let i = 0; i < args.length; i++) {
          const token = String(args[i]).toUpperCase();
          if (token === "EX") {
            ex = parseInt(String(args[i + 1]), 10);
            i++;
          } else if (token === "NX") {
            nx = true;
          }
        }
        // Upstash's options are a discriminated union - build the exact
        // variant instead of spreading optionals.
        let res: string | null;
        if (nx && ex !== undefined) res = await r.set(key, value, { ex, nx: true });
        else if (nx) res = await r.set(key, value, { nx: true });
        else if (ex !== undefined) res = await r.set(key, value, { ex });
        else res = await r.set(key, value);
        return res === "OK" ? "OK" : null;
      },
      async get(key) {
        const res = await r.get<string>(key);
        return typeof res === "string" ? res : null;
      },
      async del(key) {
        const res = await r.del(key);
        return typeof res === "number" ? res : 0;
      },
      async sadd(key, member) {
        const res = await r.sadd(key, member);
        return typeof res === "number" ? res : 0;
      },
      async scard(key) {
        const res = await r.scard(key);
        return typeof res === "number" ? res : 0;
      },
      async spop(key, count) {
        if (count !== undefined) {
          const res = await r.spop(key, count);
          return Array.isArray(res) ? res : res ? [res] : [];
        }
        const res = await r.spop(key);
        return typeof res === "string" ? res : null;
      },
      async setex(key, seconds, value) {
        const res = await r.set(key, value, { ex: seconds });
        return res === "OK" ? "OK" : null;
      },
      async keys(pattern) {
        const res = await r.keys(pattern);
        return Array.isArray(res) ? res : [];
      },
      async ping() {
        return r.ping();
      },
    };
  }

  if (!upstashUrl || !upstashToken) {
    logger.warn("wyzmind", "UPSTASH_REDIS_REST_* not set - falling back to ioredis (local dev only)");
  }

  if (!redisClient) {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
    // ioredis emits bare "error" events on connection failures; without a
    // handler Node treats them as fatal. Swallow here - callers handle rejections.
    redisClient.on("error", () => {});
  }
  return redisClient as unknown as RedisLike;
}

/** Normalizes hyphen/underscore Postgres column names to camelCase for callers,
 *  and safely casts the untyped Supabase row. */
function datum(row: any): any {
  if (!row) return null;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return out;
}

export async function findOrCreateUser(email: string, name?: string) {
  const sb = getServiceClient();
  const { data, error } = await sb.from("profiles").upsert(
    {
      email,
      name: name || email.split("@")[0],
      last_login: new Date().toISOString(),
    },
    { onConflict: "email" }
  ).select("email, name, role, provider, created_at")
    .maybeSingle();
  if (error) { logger.error("[wyzmind:findOrCreateUser]", error.message); return null; }
  return datum(data);
}

export async function updateUserIdentity(email: string, data: { provider?: string; providerAccountId?: string; image?: string }) {
  const sb = getServiceClient();
  const patch: Record<string, unknown> = {};
  if (data.provider) patch.provider = data.provider;
  if (data.providerAccountId) patch.provider_account_id = data.providerAccountId;
  if (data.image) patch.avatar_url = data.image;
  if (Object.keys(patch).length === 0) return;
  const { error } = await sb.from("profiles").update(patch).eq("email", email);
  if (error) logger.error("[wyzmind:updateUserIdentity]", error.message);
}

export async function updateUserProfile(email: string, profile: { name?: string; bio?: string; phone?: string; website?: string; avatarUrl?: string; instagram?: string; facebook?: string }) {
  const sb = getServiceClient();
  const patch: Record<string, unknown> = {};
  if (profile.name !== undefined) patch.name = profile.name;
  if (profile.bio !== undefined) patch.bio = profile.bio;
  if (profile.phone !== undefined) patch.phone = profile.phone;
  if (profile.website !== undefined) patch.website = profile.website;
  if (profile.avatarUrl !== undefined) patch.avatar_url = profile.avatarUrl;
  if (profile.instagram !== undefined) patch.instagram = profile.instagram;
  if (profile.facebook !== undefined) patch.facebook = profile.facebook;
  patch.updated_at = new Date().toISOString();
  if (Object.keys(patch).filter(k => k !== "updated_at").length === 0) return null;
  const { data, error } = await sb.from("profiles").update(patch).eq("email", email)
    .select("email, name, role, bio, phone, website, avatar_url, instagram, facebook, provider, created_at")
    .maybeSingle();
  if (error) { logger.error("[wyzmind:updateUserProfile]", error.message); return null; }
  return datum(data);
}

export async function isAdmin(email: string): Promise<boolean> {
  const sb = getServiceClient();
  const { data } = await sb.from("profiles").select("role").eq("email", email).maybeSingle();
  return (data as any)?.role === "admin";
}

export async function getAllUsers() {
  const sb = getServiceClient();
  const { data, error } = await sb.from("profiles")
    .select("email, name, role, created_at, last_login, provider")
    .order("created_at", { ascending: false });
  if (error) { logger.error("[wyzmind:getAllUsers]", error.message); return []; }
  return (data as any[] | null || []).map(datum);
}

export async function addNewsletterSubscriber(email: string, active = true) {
  try {
    const sb = getServiceClient();
    // Called with active=false to stake out a "pending confirmation" row
    // before the double opt-in email is confirmed, and with the active=true
    // default once confirmed. Deliberately never sets `unsubscribed_at`
    // here — that column means "this person explicitly opted out" and is
    // owned exclusively by removeNewsletterSubscriber(). Setting it for a
    // brand-new pending signup would make anyone who hasn't clicked the
    // confirmation link yet indistinguishable from a real unsubscribe.
    await sb.from("newsletter_subscribers").upsert(
      {
        email,
        active,
        subscribed_at: new Date().toISOString(),
        ...(active ? { resubscribed_at: new Date().toISOString(), unsubscribed_at: null } : {}),
      },
      { onConflict: "email" }
    );
  } catch (e) { logger.error("[wyzmind:addNewsletterSubscriber]", e); }
}

export async function removeNewsletterSubscriber(email: string) {
  try {
    const sb = getServiceClient();
    await sb.from("newsletter_subscribers").upsert(
      { email, active: false, unsubscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    );
  } catch (e) { logger.error("[wyzmind:removeNewsletterSubscriber]", e); }
}

export async function getNewsletterSubscribers() {
  const sb = getServiceClient();
  const { data, error } = await sb.from("newsletter_subscribers")
    .select("email, subscribed_at")
    .eq("active", true)
    .order("subscribed_at", { ascending: false });
  if (error) { logger.error("[wyzmind:getNewsletterSubscribers]", error.message); return []; }
  return (data as any[] | null || []).map((r) => ({ email: r.email, subscribedAt: r.subscribed_at }));
}

export async function getDashboardStats() {
  const sb = getServiceClient();
  const [totalUsers, adminCount, newsletterSubs] = await Promise.all([
    sb.from("profiles").select("email", { count: "exact", head: true }),
    sb.from("profiles").select("email", { count: "exact", head: true }).eq("role", "admin"),
    sb.from("newsletter_subscribers").select("email", { count: "exact", head: true }).eq("active", true),
  ]);
  return {
    totalUsers: totalUsers.count ?? 0,
    adminCount: adminCount.count ?? 0,
    newsletterSubs: newsletterSubs.count ?? 0,
  };
}

export async function getUserProfile(email: string) {
  const sb = getServiceClient();
  const { data, error } = await sb.from("profiles")
    .select("email, name, role, bio, phone, website, avatar_url, instagram, facebook, provider, created_at")
    .eq("email", email).maybeSingle();
  if (error) { logger.error("[wyzmind:getUserProfile]", error.message); return null; }
  return datum(data);
}

export async function getUserByEmail(email: string) {
  const sb = getServiceClient();
  const { data, error } = await sb.from("profiles")
    .select("email, name, role, created_at, provider")
    .eq("email", email).maybeSingle();
  if (error) { logger.error("[wyzmind:getUserByEmail]", error.message); return null; }
  return datum(data);
}

export async function setCache(key: string, value: unknown, ttl = 3600) {
  const redis = getRedis();
  await redis.setex(key, ttl, JSON.stringify(value));
}

export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function qdrantSearch(query: string, limit = 5): Promise<{ text: string; score: number; source: string }[]> {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const embedResp = await fetch(`${ollamaUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "nomic-embed-text", input: query }),
    });
    const embedData = await embedResp.json();
    const vector = embedData.embeddings?.[0];
    if (!vector) return [];

    const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
    const searchResp = await fetch(`${qdrantUrl}/collections/wyzmind_v3/points/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vector,
        limit,
        with_payload: true,
        with_vector: false,
      }),
    });
    const searchData = await searchResp.json();
    return (searchData.result || []).map((r: any) => ({
      text: r.payload?.text || "",
      score: r.score,
      source: r.payload?.source || "",
    }));
  } catch {
    return [];
  }
}

// Loyalty points live in Supabase now (see zeal-store.ts). Re-export the store
// implementations so existing consumers (e.g. /api/admin add-points) keep the
// same call site without importing the store directly.
export {
  addLoyaltyPoints,
  getLoyaltyHistory,
} from "@/lib/zeal-store";

export async function getLoyaltyPoints(email: string) {
  const sb = getServiceClient();
  const { data, error } = await sb.from("zeal_users")
    .select("points, tier, created_at")
    .eq("email", email).maybeSingle();
  if (error) { logger.error("[wyzmind:getLoyaltyPoints]", error.message); }
  return { points: (data as any)?.points ?? 0, tier: (data as any)?.tier ?? "recruit", joined: (data as any)?.created_at ?? null };
}
