import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const pages = [
  { url: 'https://www.wyzdesign.com/home', name: 'home' },
  { url: 'https://www.wyzdesign.com/about', name: 'about' },
  { url: 'https://www.wyzdesign.com/services', name: 'services' },
  { url: 'https://www.wyzdesign.com/designs', name: 'designs' },
  { url: 'https://www.wyzdesign.com/events', name: 'events' },
  { url: 'https://www.wyzdesign.com/photography', name: 'photography' },
  { url: 'https://www.wyzdesign.com/web-design', name: 'web-design' },
  { url: 'https://www.wyzdesign.com/printing', name: 'printing' },
  { url: 'https://www.wyzdesign.com/featured-artist', name: 'featured-artist' },
];

const screenshotDir = join(process.cwd(), 'screenshots');
await mkdir(screenshotDir, { recursive: true });

const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

const browser = await chromium.launch({ headless: true });

async function dismissModals(page) {
  // Dismiss cookie banner
  try {
    const acceptBtn = page.locator('button:has-text("ACCEPT ALL"), button:has-text("Save Preferences")');
    if (await acceptBtn.count() > 0 && await acceptBtn.first().isVisible()) {
      await acceptBtn.first().click({ timeout: 2000 }).catch(() => {});
    }
  } catch (e) {}

  // Dismiss splash if present
  try {
    const enterBtn = page.locator('button:has-text("Enter Site")');
    if (await enterBtn.count() > 0 && await enterBtn.first().isVisible()) {
      await enterBtn.first().click({ timeout: 2000 }).catch(() => {});
    }
  } catch (e) {}
}

async function capturePage(pageInfo) {
  const { url, name } = pageInfo;
  console.log(`[START] ${name}`);

  try {
    // 1. Desktop Light (Full page)
    const dLight = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', userAgent: DESKTOP_UA });
    await dLight.goto(url, { waitUntil: 'load', timeout: 30000 });
    await dLight.waitForTimeout(600);
    await dismissModals(dLight);
    await dLight.waitForTimeout(400);
    await dLight.screenshot({ path: join(screenshotDir, `${name}-desktop-light.png`), fullPage: true });
    await dLight.close();

    // 2. Desktop Dark (Full page)
    const dDark = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', userAgent: DESKTOP_UA });
    await dDark.goto(url, { waitUntil: 'load', timeout: 30000 });
    await dDark.waitForTimeout(600);
    await dismissModals(dDark);
    await dDark.waitForTimeout(400);
    await dDark.screenshot({ path: join(screenshotDir, `${name}-desktop-dark.png`), fullPage: true });
    await dDark.close();

    // 3. Mobile Light (Full page)
    const mLight = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'light', isMobile: true, userAgent: MOBILE_UA });
    await mLight.goto(url, { waitUntil: 'load', timeout: 30000 });
    await mLight.waitForTimeout(600);
    await dismissModals(mLight);
    await mLight.waitForTimeout(400);
    await mLight.screenshot({ path: join(screenshotDir, `${name}-mobile-light.png`), fullPage: true });
    await mLight.close();

    // 4. Mobile Dark (Full page)
    const mDark = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', isMobile: true, userAgent: MOBILE_UA });
    await mDark.goto(url, { waitUntil: 'load', timeout: 30000 });
    await mDark.waitForTimeout(600);
    await dismissModals(mDark);
    await mDark.waitForTimeout(400);
    await mDark.screenshot({ path: join(screenshotDir, `${name}-mobile-dark.png`), fullPage: true });
    await mDark.close();

    console.log(`[DONE] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
  }
}

// Run in batches of 3
for (let i = 0; i < pages.length; i += 3) {
  const chunk = pages.slice(i, i + 3);
  await Promise.all(chunk.map(p => capturePage(p)));
}

await browser.close();
console.log('ALL FULL-PAGE UNCLUTTERED SCREENSHOTS CAPTURED');
