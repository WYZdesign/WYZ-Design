import json, sys, time
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else "https://www.wyzdesign.com"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")
ROUTES = ["/", "/merch", "/booking", "/printing", "/services", "/photography", "/about",
          "/contact", "/gallery", "/faq", "/blog", "/plans", "/events", "/fd",
          "/designs", "/web-design", "/community"]
THRESH = 24
WIDTHS = [320, 360]

def settle_reveals(pg, timeout=10000):
    """Block until every ScrollReveal wrapper's opacity transition has finished
    (computed opacity settles at 1 only when the transition completes), so
    captures and gutter measurements are deterministic."""
    try:
        pg.wait_for_function(
            "() => [...document.querySelectorAll('div[style]')]"
            ".filter(e => e.style.opacity !== '')"
            ".every(e => getComputedStyle(e).opacity === '1')",
            timeout=timeout,
        )
    except Exception:
        pass
    pg.wait_for_timeout(250)

JS = r"""
() => {
  const vw = window.innerWidth;
  const out = {tight: []};
  for (const el of document.querySelectorAll('p,h1,h2,h3,h4,li,button,a,span')) {
    const t = (el.innerText||'').trim();
    if (!t || t.length < 3) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 8 || r.width < 20) continue;
    const L = r.left, R = vw - r.right;
    if (L >= 24 || R >= 24) continue;
    if (r.width > vw*0.97) continue;
    let a = el, inMq = false;
    for (let i=0;i<8&&a;i++,a=a.parentElement){
      const c=(a.className||'').toString();
      if (c.includes('animate-marquee')||c.includes('wyz-marquee')||c.includes('Carousel')||c.includes('carousel')){inMq=true;break;}
    }
    if (inMq) continue;
    out.tight.push({L:Math.round(L), R:Math.round(R), y: Math.round(r.top+scrollY),
      cls:(el.className||'').toString().slice(0,70), t:t.slice(0,40).replace(/\n/g, ' ')});
  }
  return out;
}
"""
report = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for width in WIDTHS:
        for route in ROUTES:
            ctx = b.new_context(viewport={"width": width, "height": 720}, user_agent=UA, is_mobile=True, has_touch=True)
            pg = ctx.new_page()
            try:
                pg.goto(BASE+route, wait_until="load", timeout=45000)
                pg.wait_for_timeout(2000)
                y = 0
                while True:
                    y += 720
                    pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(100)
                    if pg.evaluate("window.scrollY+window.innerHeight>=document.body.scrollHeight-4") or y > 60000: break
                pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(250)
                settle_reveals(pg)
                res = pg.evaluate(JS)
                report[f"{route}@{width}"] = {
                    "route": route,
                    "viewport": f"{width}x720",
                    "captured_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
                    "tight": res["tight"],
                }
                if res["tight"]:
                    print(f"== {route}@{width} ({len(res['tight'])} <{THRESH}px)")
                    for t in res["tight"]:
                        print(f"   L={t['L']} R={t['R']} y={t['y']} {t['cls'][:56]!r} :: {t['t']!r}")
                else:
                    print(f"== {route}@{width} OK")
            except Exception as e:
                print(route, width, "ERR", str(e)[:120])
            ctx.close()
    b.close()
open(r"W:\WYZ_Command_Center\_STATE\web_shots\narrow\gutter24_audit.json", "w").write(json.dumps(report, indent=1))
print("WROTE gutter24_audit.json")
