import { timingSafeEqual, createHash } from "node:crypto";

const ALLOWED_MIME: Record<string, string[]> = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"],
  videos: ["video/mp4", "video/webm", "video/quicktime"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateUpload(file: File): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: "No file provided" };
  if (file.size > MAX_FILE_SIZE) return { valid: false, error: "File exceeds 10MB limit" };
  const category = file.type.startsWith("video/") ? "videos" : "images";
  const allowed = ALLOWED_MIME[category];
  if (!allowed?.includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type}` };
  }
  return { valid: true };
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

export function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, timeoutMs = 15000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, options, timeoutMs);
    } catch (err: unknown) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries reached");
}

export function safeEquals(a: string, b: string): boolean {
  const pa = Buffer.concat([Buffer.from(a, "utf8"), Buffer.alloc(256)]);
  const pb = Buffer.concat([Buffer.from(b, "utf8"), Buffer.alloc(256)]);
  return timingSafeEqual(pa, pb);
}

export function getClientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "")
    .split(",")[0]
    .trim() || "unknown";
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) return "no-salt-configured";
  return createHash("sha256").update(ip + salt).digest("hex").slice(0, 16);
}
