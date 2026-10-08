// Site regression gate (Codex #6): accessibility (axe) + no horizontal
// overflow at 320px on the key public routes. Runs against WYZ_BASE.
//   node _agent/site_gate.mjs
// Exit 1 on any axe violation or horizontal overflow.
import { chromium } from "playwright";
import axePkg from "axe-core";
const axeSource = axePkg.source;

const BASE = process.env.WYZ_BASE || "https://www.wyzdesign.com";
const ROUTES = [
  "/", "/services", "/photography", "/designs", "/merch",
  "/booking", "/plans", "/about", "/contact", "/faq", "/community",
];
// Real Chrome UA: the site's edge middleware blocks HeadlessChrome, which
// otherwise makes every route look like a bot wall (false gate failures).
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const browser = await chromium.launch();
let failures = 0;

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent: UA });
  const page = await context.newPage();
  try {
    // --- axe (desktop) ---
    await page.goto(BASE + route, { waitUntil: "load", timeout: 30000 });
    await page.waitForFunction(() => !!document.title && !!document.documentElement.lang, { timeout: 10000 }).catch(() => {});
    // Scroll through and settle scroll-reveal/entrance animations, then freeze
    // transitions. Without this, elements mid-fade report low color-contrast
    // (an axe timing artifact, not a real a11y issue).
    await page.evaluate(async () => {
      const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
      for (let y = 0; y < document.body.scrollHeight + step; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.addStyleTag({
      content:
        ".wz-reveal{opacity:1 !important;}" +
        "*,*::before,*::after{animation-duration:0s !important;animation-delay:0s !important;transition-duration:0s !important;}",
    });
    await page.waitForTimeout(600);
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () =>
      await window.axe.run({ runOnly: ["wcag2a", "wcag2aa"] })
    );
    const v = result.violations.length;
    if (v > 0) { failures++; console.error(`axe ${route}: ${v} -> ${result.violations.map((x) => x.id).join(",")}`); }
    else console.log(`axe ${route}: ok`);

    // --- mobile 320 horizontal overflow (same page load) ---
    await page.setViewportSize({ width: 320, height: 780 });
    await page.waitForTimeout(1000);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) { failures++; console.error(`overflow ${route}: ${overflow}px at 320`); }
    else console.log(`overflow ${route}: ok`);
  } catch (e) {
    failures++;
    console.error(`${route}: ERROR ${e && e.message ? e.message : String(e)}`);
  } finally {
    await context.close();
  }
}

await browser.close();
if (failures) { console.error(`\nsite-gate: ${failures} failure(s)`); process.exit(1); }
console.log("\nsite-gate: clean");
