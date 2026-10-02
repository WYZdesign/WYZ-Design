import json
from playwright.sync_api import sync_playwright
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")
ROUTES = ["/", "/merch", "/booking", "/printing", "/services", "/photography", "/about",
          "/contact", "/gallery", "/faq", "/blog", "/plans", "/events", "/fd",
          "/designs", "/web-design", "/community"]

JS = r"""
() => {
  const vw = window.innerWidth;
  const out = {tight: [], firstSec: null};
  const fs = document.querySelector('main section, body > section, section');
  if (fs) { const cs = getComputedStyle(fs);
    out.firstSec = {cls: (fs.className||'').toString().slice(0,70),
      padL: cs.paddingLeft, padR: cs.paddingRight}; }
  for (const el of document.querySelectorAll('p,h1,h2,h3,h4,li,button,a,span')) {
    const t = (el.innerText||'').trim();
    if (!t || t.length < 3) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 8 || r.width < 20) continue;
    const L = r.left, R = vw - r.right;
    if (L >= 20 || R >= 20) continue;
    if (r.width > vw*0.97) continue;
    // skip items inside marquee/carousel tracks
    let a = el, inMq = false;
    for (let i=0;i<8&&a;i++,a=a.parentElement){
      const c=(a.className||'').toString();
      if (c.includes('animate-marquee')||c.includes('wyz-marquee')||c.includes('Carousel')||c.includes('carousel')){inMq=true;break;}
    }
    if (inMq) continue;
    out.tight.push({L:Math.round(L), R:Math.round(R), y: Math.round(r.top+scrollY),
      cls:(el.className||'').toString().slice(0,60), t:t.slice(0,34).replace(/\n/g,' ')});
    if (out.tight.length >= 8) break;
  }
  return out;
}
"""
report = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for route in ROUTES:
        ctx = b.new_context(viewport={"width": 320, "height": 720}, user_agent=UA, is_mobile=True, has_touch=True)
        pg = ctx.new_page()
        try:
            pg.goto("https://www.wyzdesign.com"+route, wait_until="load", timeout=45000)
            pg.wait_for_timeout(2200)
            y=0
            while True:
                y+=720
                pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(120)
                if pg.evaluate("window.scrollY+window.innerHeight>=document.body.scrollHeight-4") or y>60000: break
            pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(300)
            res = pg.evaluate(JS)
            report[route]=res
            print(f"== {route} firstSec padL={res['firstSec']['padL'] if res['firstSec'] else '?'} cls={res['firstSec']['cls'][:50] if res['firstSec'] else ''}")
            for t in res["tight"]:
                print(f"   L={t['L']} R={t['R']} y={t['y']} {t['cls'][:44]!r} :: {t['t']!r}")
        except Exception as e:
            print(route, "ERR", str(e)[:120])
        ctx.close()
    b.close()
open(r"W:\WYZ_Command_Center\_STATE\web_shots\narrow\tight_audit.json","w").write(json.dumps(report,indent=1))
print("WROTE tight_audit.json")
