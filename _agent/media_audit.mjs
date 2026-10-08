// Media weight + quality audit: every public route, real Chrome UA, full scroll.
// Measures per-route image/video bytes (content-length), counts, the largest
// offenders, images over-served into small boxes (naturalWidth >= 2x displayed),
// oversized stills (>400KB), heavy videos (>3MB), and broken media.
//   node _agent/media_audit.mjs           (WYZ_BASE overrides; WYZ_ROUTES subset)
import { chromium } from "playwright";

const BASE = process.env.WYZ_BASE || "http://localhost:3311";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

let ROUTES = [
  "/", "/photography", "/photography/events", "/photography/urbex", "/photography/outdoors",
  "/photography/studio", "/photography/products", "/photography/conceptual", "/events",
  "/designs", "/designs/artfinix", "/designs/kid-bode", "/designs/dawneeahs-glow", "/designs/gft-foods",
  "/web-design", "/services", "/services/photoshoot", "/services/photo-retouching",
  "/services/event-photography", "/services/consultation", "/printing", "/plans", "/about",
  "/brands", "/contact", "/blog", "/blog/behind-the-scenes-fd-mixer-vol-6", "/blog/logo-design-trends-2026",
  "/blog/how-to-prepare-for-your-photoshoot", "/blog/why-your-brand-needs-a-style-guide",
  "/blog/event-photography-capturing-the-moment", "/blog/the-power-of-retouching",
  "/blog/top-10-branding-trends-2026", "/blog/why-your-business-needs-a-professional-website",
  "/blog/the-art-of-event-photography", "/blog/custom-printing-from-concept-to-creation",
  "/blog/how-to-build-a-strong-social-media-presence", "/blog/freelance-designers-guide-to-client-management",
  "/faq", "/gift-card", "/merch", "/merch/445705140", "/merch/445705133", "/merch/445705121", "/merch/445705122",
  "/merch/concepts", "/wyzmind", "/featured-artist", "/gallery", "/community", "/partnerships",
  "/referral", "/loyalty", "/nomadic-breed", "/dying-breed-crew", "/model-archive", "/booking",
  "/booking-calendar/photoshoot", "/booking-calendar/consultation", "/booking-calendar/event-photography",
  "/booking-calendar/photo-retouching", "/legal/privacy", "/legal/terms", "/legal/refund",
  "/legal/shipping", "/legal/copyright",
];
if (process.env.WYZ_ROUTES) ROUTES = process.env.WYZ_ROUTES.split(",").map((s) => s.trim()).filter(Boolean);

const IMG_BIG = 400 * 1024;
const VID_BIG = 3 * 1024 * 1024;
const OVERSERVE_RATIO = 2.0;

const browser = await chromium.launch();
const context = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
await context.route("**/*", (route) => {
  const h = route.request().headers();
  if (h["next-router-prefetch"] || h["purpose"] === "prefetch") return route.abort();
  return route.continue();
});

const globalMedia = []; // {route,type,url,size}
const rows = [];

for (const route of ROUTES) {
  const page = await context.newPage();
  const media = [];
  let imgBytes = 0, vidBytes = 0, imgCount = 0, vidCount = 0;
  page.on("response", (res) => {
    const ct = res.headers()["content-type"] || "";
    const cl = parseInt(res.headers()["content-length"] || "0", 10);
    if (ct.startsWith("image/")) { imgBytes += cl; imgCount++; media.push({ type: "img", url: res.url(), size: cl }); }
    else if (ct.startsWith("video/")) { vidBytes += cl; vidCount++; media.push({ type: "vid", url: res.url(), size: cl }); }
  });
  try {
    let resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 });
    if (resp && resp.status() === 429) { await page.waitForTimeout(4000); resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 45000 }); }
    for (const sel of ["button:has-text('Enter Site')", "button:has-text('NECESSARY ONLY')"]) {
      try { await page.locator(sel).first().click({ timeout: 1200 }); await page.waitForTimeout(200); } catch {}
    }
    await page.evaluate(async () => {
      const step = Math.max(500, Math.floor(window.innerHeight * 0.9));
      for (let y = 0; y < document.body.scrollHeight + step; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    const dom = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("img")].map(i => {
        const r = i.getBoundingClientRect();
        return { src: i.currentSrc || i.src || "", nw: i.naturalWidth, dw: Math.round(r.width), broken: i.complete && i.naturalWidth === 0 && !(i.src || "").startsWith("data:"), eager: i.loading === "eager" || i.getAttribute("fetchpriority") === "high" };
      });
      return { imgs, vids: document.querySelectorAll("video").length };
    });
    const broken = dom.imgs.filter(i => i.broken);
    const overserved = dom.imgs.filter(i => i.nw >= OVERSERVE_RATIO * i.dw && i.dw > 0 && i.dw < 700 && i.nw >= 1200);
    const bigImgs = media.filter(m => m.type === "img" && m.size > IMG_BIG).sort((a, b) => b.size - a.size);
    const bigVids = media.filter(m => m.type === "vid" && m.size > VID_BIG).sort((a, b) => b.size - a.size);
    rows.push({ route, imgBytes, vidBytes, imgCount, vidCount, broken: broken.length, overserved: overserved.length, bigImgs, bigVids, eager: dom.imgs.filter(i => i.eager).length });
    for (const m of media) globalMedia.push({ route, ...m });
    const flag = (broken.length || bigImgs.length || bigVids.length) ? "  <-- check" : "";
    console.log(`${route}  img ${(imgBytes / 1024 / 1024).toFixed(2)}MB x${imgCount}  vid ${(vidBytes / 1024 / 1024).toFixed(2)}MB x${vidCount}  broken ${broken.length}  overserved ${overserved.length}${flag}`);
  } catch (e) {
    rows.push({ route, error: String(e.message || e) });
    console.log(`${route}  ERROR ${e.message}`);
  } finally { await page.close(); await new Promise(r => setTimeout(r, 300)); }
}

console.log("\n=== TOP 25 LARGEST MEDIA ===");
globalMedia.sort((a, b) => b.size - a.size).slice(0, 25).forEach(m => console.log(`${(m.size / 1024).toFixed(0)}KB  ${m.type}  ${m.route}  ${m.url.replace(BASE, "").slice(0, 120)}`));

console.log("\n=== OVERSIZED STILLS (>400KB) ===");
rows.filter(r => r.bigImgs && r.bigImgs.length).forEach(r => r.bigImgs.forEach(m => console.log(`${(m.size / 1024).toFixed(0)}KB  ${r.route}  ${m.url.replace(BASE, "").slice(0, 120)}`)));

console.log("\n=== HEAVY VIDEOS (>3MB) ===");
rows.filter(r => r.bigVids && r.bigVids.length).forEach(r => r.bigVids.forEach(m => console.log(`${(m.size / 1024 / 1024).toFixed(1)}MB  ${r.route}  ${m.url.replace(BASE, "").slice(0, 120)}`)));

const total = globalMedia.reduce((s, m) => s + m.size, 0);
console.log(`\nroutes ${ROUTES.length}, media requests ${globalMedia.length}, total ${(total / 1024 / 1024).toFixed(1)}MB across the crawl`);
await browser.close();
