/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");

const targets = [
  { name: "merch-desktop", width: 1440, height: 900, mobile: false },
  { name: "merch-mobile", width: 390, height: 844, mobile: true },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  for (const target of targets) {
    const page = await browser.newPage({
      viewport: { width: target.width, height: target.height },
      isMobile: target.mobile,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    });
    await page.goto("http://localhost:3105/merch", { waitUntil: "networkidle", timeout: 60_000 });
    await page.screenshot({
      path: `screenshots/current/${target.name}-2026-10-08.png`,
      fullPage: true,
    });
    const enterStore = page.getByRole("button", { name: "Enter Store" });
    if (await enterStore.count()) {
      await enterStore.scrollIntoViewIfNeeded();
      await enterStore.click();
      await page.waitForTimeout(1_500);
      await page.screenshot({
        path: `screenshots/current/${target.name}-store-open-2026-10-08.png`,
        fullPage: false,
      });
    }
    if (target.mobile) {
      for (const position of [0, 900, 2100, 3900, 5800]) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), position);
        await page.waitForTimeout(1_000);
        await page.screenshot({
          path: `screenshots/current/${target.name}-y${position}-2026-10-08.png`,
          fullPage: false,
        });
      }
    }
    await page.close();
  }
  await browser.close();
}

capture().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
