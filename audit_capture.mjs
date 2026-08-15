import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const pages = [
  { url: 'https://www.wyzdesign.com/home', name: 'wyz-home' },
  { url: 'https://www.wyzdesign.com/about', name: 'wyz-about' },
  { url: 'https://www.wyzdesign.com/services', name: 'wyz-services' },
  { url: 'https://www.wyzdesign.com/designs', name: 'wyz-designs' },
  { url: 'https://www.wyzdesign.com/events', name: 'wyz-events' },
  { url: 'https://www.wyzdesign.com/photography', name: 'wyz-photography' },
  { url: 'https://www.wyzdesign.com/printing', name: 'wyz-printing' },
  { url: 'https://www.wyzdesign.com/web-design', name: 'wyz-web-design' },
  { url: 'https://www.wyzdesign.com/plans', name: 'wyz-plans' },
  { url: 'https://www.wyzdesign.com/merch', name: 'wyz-merch' },
  { url: 'https://www.wyzdesign.com/featured-artist', name: 'wyz-featured-artist' },
  { url: 'https://www.wyzdesign.com/case-studies', name: 'wyz-case-studies' },
  { url: 'https://muse.wyzdesign.com/muse/landing', name: 'muse-landing' },
];

const screenshotDir = join(process.cwd(), 'audit_screenshots');
await mkdir(screenshotDir, { recursive: true });

const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

const browser = await chromium.launch({ headless: true });

async function dismissModals(page) {
  try {
    const cookieBtns = page.locator('button:has-text("ACCEPT ALL"), button:has-text("Save Preferences"), button:has-text("Accept"), button:has-text("I agree")');
    if (await cookieBtns.count() > 0 && await cookieBtns.first().isVisible()) {
      await cookieBtns.first().click({ timeout: 1500 }).catch(() => {});
    }
  } catch (e) {}
}

async function triggerScrolls(page) {
  await page.evaluate(async () => {
    const scrollStep = 400;
    const scrollDelay = 80;
    const totalHeight = document.body.scrollHeight;
    for (let current = 0; current < totalHeight; current += scrollStep) {
      window.scrollTo(0, current);
      await new Promise(r => setTimeout(r, scrollDelay));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 200));
  });
}

async function captureOne(pageInfo) {
  const { url, name } = pageInfo;
  console.log(`[START] ${name}`);

  try {
    // 1. Desktop Dark
    const dDark = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', userAgent: DESKTOP_UA });
    await dDark.goto(url, { waitUntil: 'load', timeout: 35000 });
    await dDark.waitForTimeout(800);
    await dismissModals(dDark);
    await triggerScrolls(dDark);
    await dDark.waitForTimeout(500);
    await dDark.screenshot({ path: join(screenshotDir, `${name}-desktop-dark.png`), fullPage: true });
    await dDark.close();

    // 2. Desktop Light
    const dLight = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', userAgent: DESKTOP_UA });
    await dLight.goto(url, { waitUntil: 'load', timeout: 35000 });
    await dLight.waitForTimeout(800);
    await dismissModals(dLight);
    await triggerScrolls(dLight);
    await dLight.waitForTimeout(500);
    await dLight.screenshot({ path: join(screenshotDir, `${name}-desktop-light.png`), fullPage: true });
    await dLight.close();

    // 3. Mobile Dark
    const mDark = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', isMobile: true, userAgent: MOBILE_UA });
    await mDark.goto(url, { waitUntil: 'load', timeout: 35000 });
    await mDark.waitForTimeout(800);
    await dismissModals(mDark);
    await triggerScrolls(mDark);
    await mDark.waitForTimeout(500);
    await mDark.screenshot({ path: join(screenshotDir, `${name}-mobile-dark.png`), fullPage: true });
    await mDark.close();

    // 4. Mobile Light
    const mLight = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'light', isMobile: true, userAgent: MOBILE_UA });
    await mLight.goto(url, { waitUntil: 'load', timeout: 35000 });
    await mLight.waitForTimeout(800);
    await dismissModals(mLight);
    await triggerScrolls(mLight);
    await mLight.waitForTimeout(500);
    await mLight.screenshot({ path: join(screenshotDir, `${name}-mobile-light.png`), fullPage: true });
    await mLight.close();

    console.log(`[SUCCESS] ${name}`);
  } catch (err) {
    console.error(`[ERROR] ${name}: ${err.message}`);
  }
}

// Capture sequentially or in small pairs
for (const p of pages) {
  await captureOne(p);
}

await browser.close();
console.log('--- ALL VISUAL AUDIT SCREENSHOTS COMPLETED ---');
