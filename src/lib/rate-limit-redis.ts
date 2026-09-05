import { logger } from "@/lib/logger";

let redis: any = null;
let redisAvailable = false;

async function initRedis() {
  if (redisAvailable) return redis;
  try {
    let Redis: any;
    try {
      const mod = await import("@upstash/redis");
      Redis = mod.Redis;
    } catch {
      logger.warn("rate-limit", "@upstash/redis not installed — using in-memory fallback");
      return null;
    }
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      redis = new Redis({ url, token });
      await redis.ping();
      redisAvailable = true;
      logger.info("rate-limit", "Upstash Redis connected");
    } else {
      logger.warn("rate-limit", "Upstash env vars not set — using in-memory fallback");
    }
  } catch {
    logger.warn("rate-limit", "Upstash Redis unavailable — using in-memory fallback");
  }
  return redis;
}

export async function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  if (!redisAvailable) {
    await initRedis();
  }

  const now = Date.now();
  const windowSec = Math.ceil(windowMs / 1000);
  const redisKey = `ratelimit:${key}`;

  if (redisAvailable && redis) {
    try {
      const current = await redis.incr(redisKey);
      if (current === 1) {
        await redis.expire(redisKey, windowSec);
      } else {
        // Always reset the TTL on each request — prevents the INCR-EXPIRE race
        // where a second concurrent request could let the window slide past the
        // original expiry without a matching EXPIRE.
        await redis.expire(redisKey, windowSec);
      }
      const ttl = await redis.ttl(redisKey);
      return {
        ok: current <= limit,
        remaining: Math.max(0, limit - current),
        resetAt: now + (ttl > 0 ? ttl * 1000 : windowMs),
      };
    } catch (e) {
      logger.error("rate-limit:redis", e);
      redisAvailable = false;
      redis = null;
    }
  }

  return inMemoryRateLimit(key, limit, windowMs);
}

const inMemoryBuckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS = 10000;

function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = inMemoryBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    if (inMemoryBuckets.size >= MAX_BUCKETS) inMemoryBuckets.clear();
    inMemoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  entry.count++;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt };
}

export async function checkRedisHealth(): Promise<boolean> {
  if (!redisAvailable) {
    await initRedis();
  }
  if (!redisAvailable) return false;
  try {
    await redis.ping();
    return true;
  } catch {
    redisAvailable = false;
    return false;
  }
}