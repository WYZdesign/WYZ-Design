import { getRedis } from "@/lib/wyzmind";
import { logger } from "@/lib/logger";

/**
 * NSFW content gating configuration and utilities.
 *
 * Bodypaint is the primary gated category. Boudoir/lingerie are also gated.
 * Individual images within any category can be auto-detected as NSFW by the
 * client-side nsfwjs scanner, or manually flagged via the admin panel.
 */

/** Categories that are gated at the album level (always blurred + age-gated). */
export const NSFW_CATEGORIES = ["Boudoir", "Bodypaint"];

/** Threshold for classifying an image as NSFW (Porn + Sexy combined confidence). */
export const NSFW_CONFIDENCE_THRESHOLD = 0.65;

/** Redis key prefix for NSFW scan results. */
const SCAN_PREFIX = "nsfw:scan:";
const AGE_VERIFY_PREFIX = "nsfw:age:";
const SCAN_INDEX_KEY = "nsfw:scan:index";
const AGE_INDEX_KEY = "nsfw:age:index";
const AGE_VERIFY_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

export function isNsfwCategory(category: string): boolean {
  return NSFW_CATEGORIES.some(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
}

export async function getCachedScanResult(
  imagePath: string
): Promise<string | null> {
  try {
    const r = getRedis();
    return await r.get(`${SCAN_PREFIX}${imagePath}`);
  } catch (e) {
    logger.warn("nsfw", `Cache read failed for ${imagePath}: ${(e as Error).message}`);
    return null;
  }
}

export async function cacheScanResult(
  imagePath: string,
  label: string,
  confidence: number
): Promise<void> {
  try {
    const r = getRedis();
    const payload = JSON.stringify({ label, confidence, scannedAt: Date.now() });
    await r.set(`${SCAN_PREFIX}${imagePath}`, payload, "EX", 90 * 24 * 60 * 60);
    await r.sadd(SCAN_INDEX_KEY, imagePath);
  } catch (e) {
    logger.warn("nsfw", `Cache write failed for ${imagePath}: ${(e as Error).message}`);
  }
}

export async function isAgeVerified(email: string): Promise<boolean> {
  try {
    const r = getRedis();
    const val = await r.get(`${AGE_VERIFY_PREFIX}${email}`);
    return val === "1";
  } catch (e) {
    logger.warn("nsfw", `Age verify check failed: ${(e as Error).message}`);
    return false;
  }
}

export async function markAgeVerified(email: string): Promise<void> {
  try {
    const r = getRedis();
    await r.set(`${AGE_VERIFY_PREFIX}${email}`, "1", "EX", AGE_VERIFY_TTL);
    await r.sadd(AGE_INDEX_KEY, email);
  } catch (e) {
    logger.warn("nsfw", `Age verify write failed: ${(e as Error).message}`);
  }
}

export async function getBulkScanResults(
  imagePaths: string[]
): Promise<Map<string, { label: string; confidence: number }>> {
  const results = new Map<string, { label: string; confidence: number }>();
  try {
    const r = getRedis();
    for (const path of imagePaths) {
      const val = await r.get(`${SCAN_PREFIX}${path}`);
      if (val && typeof val === "string") {
        try {
          const parsed = JSON.parse(val) as { label: string; confidence: number };
          results.set(path, parsed);
        } catch { /* skip malformed */ }
      }
    }
  } catch (e) {
    logger.warn("nsfw", `Bulk scan fetch failed: ${(e as Error).message}`);
  }
  return results;
}

export async function clearScanResult(imagePath: string): Promise<void> {
  try {
    const r = getRedis();
    await r.del(`${SCAN_PREFIX}${imagePath}`);
  } catch (e) {
    logger.warn("nsfw", `Cache clear failed for ${imagePath}: ${(e as Error).message}`);
  }
}

/**
 * List all cached scan results using the tracking SET.
 */
export async function listAllScanResults(): Promise<{ path: string; label: string; confidence: number; ts: number }[]> {
  try {
    const r = getRedis();
    // Use sadd/scard — track indexed paths in a SET
    // Since RedisLike doesn't expose smembers, fall through to the raw client
    const rawClient = r as unknown as Record<string, unknown>;
    const smembers = rawClient.smembers as ((key: string) => Promise<string[]>) | undefined;
    if (!smembers) return [];

    const paths = await smembers(SCAN_INDEX_KEY);
    if (!paths || paths.length === 0) return [];

    const results: { path: string; label: string; confidence: number; ts: number }[] = [];
    for (const path of paths) {
      const val = await r.get(`${SCAN_PREFIX}${path}`);
      if (val && typeof val === "string") {
        try {
          const parsed = JSON.parse(val) as { label: string; confidence: number; scannedAt?: number };
          results.push({
            path,
            label: parsed.label,
            confidence: parsed.confidence,
            ts: parsed.scannedAt || 0,
          });
        } catch { /* skip malformed */ }
      }
    }
    return results;
  } catch (e) {
    logger.warn("nsfw", `List scan results failed: ${(e as Error).message}`);
    return [];
  }
}

/**
 * List all age-verified users using the tracking SET.
 */
export async function listAgeVerifiedUsers(): Promise<{ email: string; ts: number }[]> {
  try {
    const r = getRedis();
    const rawClient = r as unknown as Record<string, unknown>;
    const smembers = rawClient.smembers as ((key: string) => Promise<string[]>) | undefined;
    if (!smembers) return [];

    const emails = await smembers(AGE_INDEX_KEY);
    if (!emails || emails.length === 0) return [];

    const results: { email: string; ts: number }[] = [];
    for (const email of emails) {
      const val = await r.get(`${AGE_VERIFY_PREFIX}${email}`);
      if (val === "1") {
        results.push({ email, ts: Date.now() });
      }
    }
    return results;
  } catch (e) {
    logger.warn("nsfw", `List verified users failed: ${(e as Error).message}`);
    return [];
  }
}
