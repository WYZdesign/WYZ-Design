import { chromium } from 'playwright';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, userAgent: UA });

// 1. Seed storage so we can verify it gets cleared
await page.goto('https://www.wyzdesign.com/clear-cache', { waitUntil: 'load', timeout: 35000 });
await page.evaluate(() => {
  localStorage.setItem('wyz_test_key', 'hello');
  sessionStorage.setItem('wyz_test_sess', 'world');
  document.cookie = 'wyz_test_cookie=1;path=/';
});
// Also seed a CacheStorage entry
await page.evaluate(async () => {
  try {
    const c = await caches.open('wyz-test-cache');
    await c.put('/test-entry', new Response('ok'));
  } catch (e) { console.log('cache seed skipped:', e.message); }
});

// 2. Verify page rendered with the button
console.log('[CHECK] page title:', await page.title());
const btn = page.locator('button:has-text("Clear Everything")');
const btnVisible = await btn.isVisible().catch(() => false);
console.log('[CHECK] "Clear Everything" button visible:', btnVisible);
console.log('[CHECK] page heading:', await page.locator('h1').first().textContent().catch(() => '(no h1)'));

// 3. Click the button
if (btnVisible) {
  await btn.click();
  await page.waitForTimeout(1800);
  console.log('[CHECK] after click status:', await page.locator('p').filter({ hasText: 'Done' }).textContent().catch(() => '(no status)'));

  // 4. Verify cleanup + redirect happened
  const url = page.url();
  console.log('[CHECK] final URL:', url);
  const storageCleared = await page.evaluate(() => {
    return {
      local: localStorage.getItem('wyz_test_key'),
      session: sessionStorage.getItem('wyz_test_sess'),
      cookie: document.cookie.includes('wyz_test_cookie'),
    };
  });
  console.log('[CHECK] storage after clear:', JSON.stringify(storageCleared));

  const redirectedHome = url.includes('/home');
  console.log('[RESULT] redirected to /home:', redirectedHome);
  console.log('[RESULT] localStorage cleared:', storageCleared.local === null);
  console.log('[RESULT] sessionStorage cleared:', storageCleared.session === null);
  console.log('[RESULT] cookie cleared:', storageCleared.cookie === false);
} else {
  console.log('[FAIL] Button not found or not visible');
}

await page.screenshot({ path: 'audit_screenshots/clear-cache-test.png', fullPage: true });
await browser.close();
console.log('--- CLEAR CACHE TEST COMPLETE ---');
