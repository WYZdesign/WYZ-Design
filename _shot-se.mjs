import { chromium } from 'playwright';
import { join } from 'path';
const dir = join(process.cwd(), 'screenshots');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const b = await chromium.launch({ headless: true });
for (const [u, n] of [['home','home'],['about','about'],['designs','designs'],['photography','photography'],['events','events'],['services','services'],['printing','printing'],['web-design','web-design']]) {
  const c = await b.newContext({ viewport:{width:375,height:667}, colorScheme:'dark', isMobile:true, userAgent:UA });
  const p = await c.newPage();
  await p.goto(`http://localhost:3456/${u}`, {waitUntil:'load',timeout:15000});
  await p.waitForTimeout(2000);
  try{await p.locator('button:has-text("ACCEPT ALL")').click({timeout:2000})}catch{}
  await p.waitForTimeout(1000);
  await p.screenshot({path:join(dir,`${n}-se-dark.png`)});
  await c.close();
  console.log(`[DONE] ${n}`);
}
await b.close();
console.log('ALL DONE');
