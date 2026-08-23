import { rateLimit as redisRateLimit } from "./rate-limit-redis";

export async function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): Promise<{ ok: boolean; remaining: number }> {
  const result = await redisRateLimit(key, limit, windowMs);
  return { ok: result.ok, remaining: result.remaining };
}
