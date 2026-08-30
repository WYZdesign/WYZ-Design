import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const cookieBtn = page.locator('button:has-text("Accept")');
if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  await cookieBtn.click();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: 'screenshots/se-home-fixed.png', fullPage: false });
console.log('Screenshot saved');
await browser.close();
