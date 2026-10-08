// Media sweep: every public route, real Chrome UA (edge middleware blocks
// HeadlessChrome), full scroll to trigger lazy-load. Flags broken images
// (naturalWidth 0), failed media responses (4xx/5xx), next/image requests
// with q != 75 (the SafeImage regression), video element errors, and slow
// (>5s) media fetches. Exit 1 on any hard failure.
//   node _agent/media_sweep.mjs        (WYZ_BASE overrides target)
import { chromium } from "playwright";

const BASE = process.env.WYZ_BASE || "https://www.wyzdesign.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

let ROUTES = [
  "/", "/home", "/photography", "/photography/events", "/photography/urbex",
  "/photography/outdoors", "/photography/studio", "/photography/products",
  "/photography/conceptual", "/events", "/designs", "/web-design", "/services",
  "/printing", "/plans", "/about", "/brands", "/contact", "/blog", "/faq",
  "/gift-card", "/merch", "/merch/concepts", "/wyzmind", "/designs/artfinix",
  "/designs/kid-bode", "/designs/dawneeahs-glow", "/designs/gft-foods",
  "/featured-artist", "/gallery", "/community", "/partnerships", "/referral",
  "/loyalty", "/nomadic-breed", "/dying-breed-crew", "/model-archive",
  "/services/photoshoot", "/services/photo-retouching",
  "/services/event-photography", "/services/consultation",
  "/booking-calendar/photoshoot", "/booking-calendar/consultation",
  "/booking-calendar/event-photography", "/booking-calendar/photo-retouching",
  "/booking", "/legal/privacy", "/legal/terms", "/legal/refund",
  "/legal/shipping", "/legal/copyright",
];
if (process.env.WYZ_ROUTES) ROUTES = process.env.WYZ_ROUTES.split(",").map((s) => s.trim()).filter(Boolean);

const MEDIA_EXT = /\.(jpg|jpeg|png|gif|webp|avif|svg|mp4|webm|mov|m4v)(\?|$)/i;
const SLOW_MS = 5000;
const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });

// Next <Link> prefetch fires for every link scrolled into view, which floods
// page routes and trips the site's 600/min page limiter (false 429s). Prefetch
// carries no media, so abort it; only real page + media requests go through.
await context.route("**/*", (route) => {
  const h = route.request().headers();
  if (h["next-router-prefetch"] || h["purpose"] === "prefetch") return route.abort();
  return route.continue();
});

let failures = 0;
let warnings = 0;

for (const route of ROUTES) {
  const page = await context.newPage();
  const bad = [];     // hard failures for this route
  const warn = [];    // slow media
  const reqFail = []; // network-level failures
  const timers = new Map();

  page.on("response", (res) => {
    const url = res.url();
    if (!MEDIA_EXT.test(url) && !url.includes("/_next/image")) return;
    const status = res.status();
    if (status >= 400) bad.push(`HTTP ${status} ${url.slice(0, 160)}`);
    if (url.includes("/_next/image")) {
      const m = url.match(/[?&]q=(\d+)/);
      if (m && m[1] !== "75") bad.push(`q=${m[1]} (want 75) ${url.slice(0, 160)}`);
    }
    const started = timers.get(url);
    if (started) {
      timers.delete(url);
      const ms = Date.now() - started;
      if (ms > SLOW_MS) warn.push(`${(ms / 1000).toFixed(1)}s ${url.slice(0, 160)}`);
    }
  });
  page.on("request", (req) => {
    const url = req.url();
    if (MEDIA_EXT.test(url) || url.includes("/_next/image")) timers.set(url, Date.now());
  });
  page.on("requestfailed", (req) => {
    const url = req.url();
    const err = req.failure()?.errorText || "failed";
    // ERR_ABORTED is expected when a carousel swaps a <video>/<img> source
    // mid-flight; only real network failures matter here.
    if (err.includes("ERR_ABORTED")) return;
    if (MEDIA_EXT.test(url) || url.includes("/_next/image")) {
      reqFail.push(`${err} ${url.slice(0, 160)}`);
    }
  });

  try {
    let resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
    if (resp && resp.status() === 429) {
      await page.waitForTimeout(4000);
      resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
    }
    if (resp && resp.status() >= 400) bad.push(`HTTP ${resp.status()} route`);
    // full scroll to fire every lazy-load observer
    await page.evaluate(async () => {
      const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
      for (let y = 0; y < document.body.scrollHeight + step; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(2500);

    const dom = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("img")];
      const broken = imgs
        .filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith("data:"))
        .map((i) => (i.currentSrc || i.src || i.srcset || "<no src>").slice(0, 160));
      const vids = [...document.querySelectorAll("video")];
      const badVid = vids
        .filter((v) => v.error || (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE))
        .map((v) => `${v.currentSrc || v.src || "<no src>"} err=${v.error ? v.error.code : "no-source"}`);
      return { totalImgs: imgs.length, broken, totalVids: vids.length, badVid };
    });

    for (const b of dom.broken) bad.push(`img naturalWidth=0 ${b}`);
    for (const b of dom.badVid) bad.push(`video ${b}`);
    for (const f of reqFail) bad.push(`reqfail ${f}`);

    if (bad.length) {
      failures += bad.length;
      console.error(`\nFAIL ${route} (${dom.totalImgs} img, ${dom.totalVids} vid)`);
      for (const b of [...new Set(bad)]) console.error("  " + b);
    } else {
      console.log(`ok ${route} (${dom.totalImgs} img, ${dom.totalVids} vid)`);
    }
    if (warn.length) {
      warnings += warn.length;
      console.warn(`  slow: ${[...new Set(warn)].join(" | ")}`);
    }
  } catch (e) {
    failures++;
    console.error(`\nFAIL ${route}: ${e && e.message ? e.message : String(e)}`);
  } finally {
    await page.close();
    await new Promise((r) => setTimeout(r, 500));
  }
}

await browser.close();
console.log(`\nmedia-sweep: ${failures} failure(s), ${warnings} slow (>${SLOW_MS / 1000}s)`);
if (failures) process.exit(1);
