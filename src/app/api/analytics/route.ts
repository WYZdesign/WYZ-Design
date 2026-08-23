import { NextRequest, NextResponse } from "next/server";
import { logPageview, logEvent, getAnalyticsSummary, getPageviews } from "@/lib/analytics";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { createHash } from "crypto";

function parseUA(ua: string) {
  let device = "desktop";
  if (/mobile|android|iphone|ipad/i.test(ua)) device = /ipad|tablet/i.test(ua) ? "tablet" : "mobile";

  let browser = "other";
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  let os = "other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";

  return { device, browser, os };
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + "wyz-salt-2026").digest("hex").slice(0, 16);
}

function isAdmin(session: any): boolean {
  const email = (session?.user?.email || "").toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email);
}

async function runSeoChecks(): Promise<{ check: string; status: string; detail?: string }[]> {
  const checks: { check: string; status: string; detail?: string }[] = [];
  const base = "https://wyzdesign.com";

  // Check meta descriptions on key pages
  const pages = ["/", "/home", "/about", "/services", "/designs", "/contact", "/portfolio", "/testimonials", "/photography", "/partnerships"];
  for (const p of pages) {
    try {
      const r = await fetch(`${base}${p}`, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(5000) });
      const html = await r.text();
      const hasMeta = /<meta\s+name=["']description["']/i.test(html);
      const hasTitle = /<title>[^<]+<\/title>/i.test(html);
      const hasH1 = /<h1[\s>]/i.test(html);
      const hasOg = /<meta\s+property=["']og:image["']/i.test(html);
      const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);

      if (hasMeta) checks.push({ check: `Meta description: ${p}`, status: "pass" });
      else checks.push({ check: `Meta description: ${p}`, status: "fail", detail: "Missing <meta name=\"description\">" });

      if (hasTitle) checks.push({ check: `Title tag: ${p}`, status: "pass" });
      else checks.push({ check: `Title tag: ${p}`, status: "fail", detail: "Missing <title>" });

      if (hasH1) checks.push({ check: `H1 tag: ${p}`, status: "pass" });
      else checks.push({ check: `H1 tag: ${p}`, status: "warn", detail: "No <h1> found" });

      if (hasOg) checks.push({ check: `OG image: ${p}`, status: "pass" });
      else checks.push({ check: `OG image: ${p}`, status: "warn", detail: "Missing og:image meta" });

      if (hasViewport) checks.push({ check: `Viewport: ${p}`, status: "pass" });
      else checks.push({ check: `Viewport: ${p}`, status: "fail", detail: "Missing viewport meta, not mobile-friendly" });
    } catch {
      checks.push({ check: `Page fetch: ${p}`, status: "fail", detail: "Could not fetch page" });
    }
  }

  // Check sitemap
  try {
    const r = await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
    const xml = await r.text();
    const urlCount = (xml.match(/<url>/g) || []).length;
    if (urlCount > 5) checks.push({ check: "Sitemap.xml", status: "pass", detail: `${urlCount} URLs` });
    else checks.push({ check: "Sitemap.xml", status: "warn", detail: `Only ${urlCount} URLs found` });
  } catch {
    checks.push({ check: "Sitemap.xml", status: "fail", detail: "Could not fetch sitemap" });
  }

  // Check robots.txt
  try {
    const r = await fetch(`${base}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    const txt = await r.text();
    if (/User-agent|User-Agent/i.test(txt)) checks.push({ check: "robots.txt", status: "pass" });
    else checks.push({ check: "robots.txt", status: "warn", detail: "Missing User-agent directive" });
  } catch {
    checks.push({ check: "robots.txt", status: "fail", detail: "Could not fetch robots.txt" });
  }

  // Check SSL
  try {
    const r = await fetch(base, { signal: AbortSignal.timeout(5000) });
    if (r.url.startsWith("https://")) checks.push({ check: "SSL/HTTPS", status: "pass" });
    else checks.push({ check: "SSL/HTTPS", status: "fail", detail: "Not redirecting to HTTPS" });
  } catch {
    checks.push({ check: "SSL/HTTPS", status: "fail", detail: "Could not verify" });
  }

  // Check JSON-LD structured data
  try {
    const r = await fetch(`${base}/home`, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(5000) });
    const html = await r.text();
    if (/application\/ld\+json/.test(html)) checks.push({ check: "JSON-LD structured data", status: "pass" });
    else checks.push({ check: "JSON-LD structured data", status: "warn", detail: "No structured data found on homepage" });
  } catch {
    checks.push({ check: "JSON-LD structured data", status: "fail", detail: "Could not check" });
  }

  return checks;
}

/**
 * POST /api/analytics — log a pageview or event
 * Body: { path, referrer?, user_agent?, session_id?, event_type?, label?, value?, metadata? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ua = body.user_agent || req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    const parsed = parseUA(ua);

    // Extract UTM params from referrer or body
    let utm_source = body.utm_source || "";
    let utm_medium = body.utm_medium || "";
    let utm_campaign = body.utm_campaign || "";
    if (body.referrer) {
      try {
        const url = new URL(body.referrer);
        utm_source = utm_source || url.searchParams.get("utm_source") || "";
        utm_medium = utm_medium || url.searchParams.get("utm_medium") || "";
        utm_campaign = utm_campaign || url.searchParams.get("utm_campaign") || "";
      } catch {}
    }

    if (body.event_type) {
      logEvent(body.event_type, body.path || "", body.label || "", body.value || 0, JSON.stringify(body.metadata || {}), body.session_id || "");
      return NextResponse.json({ ok: true });
    }

    logPageview({
      path: body.path || "/",
      referrer: body.referrer || "",
      user_agent: ua,
      ip_hash: hashIp(ip),
      device: parsed.device,
      browser: parsed.browser,
      os: parsed.os,
      screen_width: body.screen_width || 0,
      utm_source, utm_medium, utm_campaign,
      session_id: body.session_id || "",
      duration_ms: body.duration_ms || 0,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true }); // silent fail — tracking shouldn't break UX
  }
}

/**
 * GET /api/analytics — get analytics summary or raw pageviews
 * @query tab — summary | pageviews
 * @query days — for summary (default 30)
 * @query path — filter pageviews
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tab = req.nextUrl.searchParams.get("tab") || "summary";
    const days = parseInt(req.nextUrl.searchParams.get("days") || "30");

    if (tab === "pageviews") {
      const path = req.nextUrl.searchParams.get("path") || undefined;
      const from = req.nextUrl.searchParams.get("from") || undefined;
      const to = req.nextUrl.searchParams.get("to") || undefined;
      const limit = parseInt(req.nextUrl.searchParams.get("limit") || "200");
      return NextResponse.json({ pageviews: getPageviews({ path, from, to, limit }) });
    }

    if (tab === "seo") {
      const checks = await runSeoChecks();
      return NextResponse.json({ checks, checkedAt: new Date().toISOString(), period: "on-demand" });
    }

    return NextResponse.json(getAnalyticsSummary(days));
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
