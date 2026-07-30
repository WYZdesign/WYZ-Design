import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_IPS = ["156.59.198.135", "156.59.198.136", "216.244.66.227"];
const BLOCKED_BOTS = ["semrush","ahrefs","mj12bot","dotbot","blexbot","petalbot","yandexbot","bytespider","gptbot","ccbot","claudebot","anthropic-ai","cohere-ai","amazonbot","meta-externalagent","facebookbot"];

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const API_MAX = 20;
const PAGE_MAX = 60;

function log(level: string, msg: string, data?: Record<string, unknown>) {
  const entry = { t: new Date().toISOString(), l: level, m: msg, ...data };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

function isLimited(key: string, max: number): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }
  entry.count++;
  if (entry.count > max) {
    return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { limited: false, retryAfter: 0 };
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of RATE_LIMIT_MAP) {
    if (now > v.resetAt) RATE_LIMIT_MAP.delete(k);
  }
}, 60_000).unref();

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const start = Date.now();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = req.headers.get("user-agent")?.toLowerCase() || "";

  if (BLOCKED_IPS.includes(ip)) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (BLOCKED_BOTS.some(bot => ua.includes(bot))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Response-Time", `${Date.now() - start}ms`);
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  if (path.startsWith("/api/") && !path.startsWith("/api/auth") && !path.startsWith("/api/health") && !path.startsWith("/api/media")) {
    const cl = parseInt(req.headers.get("content-length") || "0", 10);
    if (cl > 10_000_000) {
      return new NextResponse(JSON.stringify({ error: "Request body exceeds 10MB limit" }), {
        status: 413, headers: { "Content-Type": "application/json" },
      });
    }
    const ct = req.headers.get("content-type") || "";
    if (req.method !== "GET" && req.method !== "HEAD" && !ct.includes("application/json") && !ct.includes("multipart/form-data") && !ct.includes("application/x-www-form-urlencoded")) {
      return new NextResponse(JSON.stringify({ error: "Unsupported Content-Type" }), {
        status: 415, headers: { "Content-Type": "application/json" },
      });
    }

    const { limited, retryAfter } = isLimited(`api:${ip}`, API_MAX);
    if (limited) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) },
      });
    }
    const finalize = () => {
      log("info", "api_request", { path, method: req.method, ms: Date.now() - start });
    };
    setTimeout(finalize, 0);
  }

  if (!path.startsWith("/api/") && !path.startsWith("/_next/") && !path.includes(".")) {
    const { limited, retryAfter } = isLimited(`page:${ip}`, PAGE_MAX);
    if (limited) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) },
      });
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm|woff2?|css|js)).*)",
};
