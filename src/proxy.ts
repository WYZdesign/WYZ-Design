import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit-redis";

const BLOCKED_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "nmap",
  "nessus",
  "masscan",
  "zgrab",
  "acunetix",
  "netsparker",
  "burpcollaborator",
  "fuzz",
  "libwww-perl",
  "curl/7.35",
  "python-requests",
  "go-http-client",
  "scrapy",
  "wpscan",
  "joomscan",
  "headlesschrome",
  "petalbot",
  "dotbot",
  "mj12bot",
  "semrushbot",
  "ahrefsbot",
  "majestic-seo",
  "rogerbot",
  "exabot",
  "yandexbot",
  "baiduspider",
  "archive.org_bot",
  "sogou",
  "iaskspider",
  "bytespider",
  "ltx71",
  "blexbot",
  "uptimerobot",
  "gptbot",
  "ccbot",
  "claudebot",
  "anthropic-ai",
  "cohere-ai",
  "amazonbot",
  "meta-externalagent",
  "crawler",
];

const BLOCKED_IPS = ["156.59.198.135", "156.59.198.136", "216.244.66.227"];

const BLOCKED_PATH_PATTERNS = [
  /\/(\.env|\.git|\.aws|\.ssh)(\/|$)/i,
  /\/wp-admin(\/|$)/i,
  /\/wp-login\.php/i,
  /\/\.htaccess/i,
  /\/\.DS_Store/i,
  /\/\.well-known\/acme-challenge\/(?!.*valid)/i,
  /\/admin\/?$.*\.(php|asp|aspx|jsp)$/i,
  /\/config\.php/i,
  /\/phpmyadmin/i,
  /\/mysql/i,
  /\/server-status/i,
  /\/cgi-bin/i,
  /\/\.git\/config/i,
  /\/\.env\.local/i,
  /\/webpack.config/i,
  /\/package\.json/i,
  /\/tsconfig\.json/i,
  /\/sql(\/|$)/i,
  /\/backup/i,
  /\/\.vscode/i,
  /\/\.idea/i,
  /\/\.tmp/i,
  /\/\.old/i,
  /\/\.bak/i,
  /\/\.log/i,
];

const USER_AGENT_BLOCKED = "Blocked by WYZ Design edge security";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ua = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  const isApi = pathname.startsWith("/api/");
  const isAdmin = pathname.startsWith("/api/admin") || pathname.startsWith("/api/telemetry");

  if (BLOCKED_IPS.includes(ip)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (BLOCKED_USER_AGENTS.some((b) => ua.toLowerCase().includes(b))) {
    return new NextResponse(USER_AGENT_BLOCKED, { status: 403 });
  }

  if (BLOCKED_PATH_PATTERNS.some((re) => re.test(pathname))) {
    return new NextResponse(USER_AGENT_BLOCKED, { status: 403 });
  }

  if (isApi && !pathname.startsWith("/api/auth") && !pathname.startsWith("/api/health")) {
    const cl = parseInt(req.headers.get("content-length") || "0", 10);
    if (cl > 10_000_000) {
      return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 10MB limit" } }, { status: 413 });
    }

    const ct = req.headers.get("content-type") || "";
    if (req.method !== "GET" && req.method !== "HEAD" && !ct.includes("application/json") && !ct.includes("multipart/form-data") && !ct.includes("application/x-www-form-urlencoded")) {
      return NextResponse.json({ error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Unsupported Content-Type" } }, { status: 415 });
    }

    const key = `${req.method}:${pathname}:${ip}`;
    const limit = isAdmin ? 30 : req.method === "GET" ? 120 : 20;
    const windowMs = 60_000;
    try {
      const result = await rateLimit(key, limit, windowMs);
      if (!result.ok) {
        const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
        return NextResponse.json(
          {
            error: {
              code: "RATE_LIMITED",
              message: "Too many requests. Please slow down and try again shortly.",
              retryAfter,
            },
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(result.remaining),
              "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
            },
          }
        );
      }

      const res = NextResponse.next();
      res.headers.set("X-RateLimit-Limit", String(limit));
      res.headers.set("X-RateLimit-Remaining", String(result.remaining));
      res.headers.set("X-RateLimit-Reset", String(Math.floor(result.resetAt / 1000)));
      res.headers.set("X-Request-Id", crypto.randomUUID());
      return res;
    } catch {
      // Rate limiter failure must never block the site — allow through.
      const res = NextResponse.next();
      res.headers.set("X-Request-Id", crypto.randomUUID());
      return res;
    }
  }

  if (!isApi && !pathname.startsWith("/_next/") && !pathname.includes(".")) {
    try {
      const result = await rateLimit(`page:${ip}`, 60, 60_000);
      if (!result.ok) {
        return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many requests" } }, {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)) },
        });
      }
    } catch {
      /* fail open */
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Request-Id", crypto.randomUUID());
  return res;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/_next/data/:path*",
    "/((?!_next/static|_next/image|favicon.ico|images/|videos/|icons/|fonts/|splash/|manifest.json|sw.js|og-image.png|opengraph-image.png|wyz-crown.png|wyz-crown-square.png|wyz-og-image.png).*)",
  ],
};
