"""edge_audit.py - find elements that touch (or nearly touch) the viewport edges at 320px."""
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "https://www.wyzdesign.com"
OUT = Path(r"W:\WYZ_Command_Center\_STATE\web_shots\narrow")
ROUTES = ["/", "/merch", "/booking", "/printing", "/services", "/photography", "/about",
          "/contact", "/gallery", "/faq", "/blog", "/plans", "/events", "/fd",
          "/designs", "/web-design", "/community"]
CHROME_UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
             "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")

# elements that are SUPPOSED to bleed edge-to-edge
FULLBLEED_OK = ("animate-marquee", "wyz-marquee", "faq-marquee", "SmoothCarousel",
                "carousel", "marquee-infinite")

JS = r"""
() => {
  const vw = window.innerWidth, THRESH = 14;
  const offenders = [];
  const isFullBleed = (el) => {
    // ancestor chain: if any ancestor is a known full-bleed track, OK
    let a = el;
    for (let i=0; i<8 && a; i++, a=a.parentElement) {
      const c = (a.className||'').toString();
      if (c.includes('animate-marquee') || c.includes('wyz-marquee') || c.includes('faq-marquee')
          || c.includes('carousel') || c.includes('Carousel') || c.includes('marquee-infinite')) return true;
      if (a.tagName==='VIDEO' || a.tagName==='CANVAS') return true;
      const cs = getComputedStyle(a);
      if (cs.position==='fixed' && a.getBoundingClientRect().width>=vw-2) return true;
    }
    return false;
  };
  const desc = (el) => {
    const cls = (el.className||'').toString().slice(0,70);
    let txt = (el.innerText||'').trim().slice(0,40).replace(/\n/g,' ');
    return `${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}.${cls} :: "${txt}"`;
  };
  for (const el of document.querySelectorAll('p,h1,h2,h3,h4,h5,li,button,a,img,span,input,textarea,div,section,article')) {
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) continue;
    if (r.width > vw * 0.97 && r.height > vw * 0.97) continue; // full-square bg
    const top = r.top + scrollY;
    const leftGap = r.left, rightGap = vw - r.right;
    const touchesL = leftGap < THRESH, touchesR = rightGap < THRESH;
    if (!touchesL && !touchesR) continue;
    if (isFullBleed(el)) continue;
    // skip pure background/decor layers
    const cs = getComputedStyle(el);
    if (cs.position==='absolute' && cs.pointerEvents==='none') continue;
    if (cs.backgroundColor==='rgba(0, 0, 0, 0)' && !el.innerText && el.tagName!=='IMG'
        && el.tagName!=='INPUT' && el.tagName!=='TEXTAREA' && el.tagName!=='BUTTON') continue;
    offenders.push({y: Math.round(top), l: Math.round(leftGap), r: Math.round(rightGap),
                    w: Math.round(r.width), h: Math.round(r.height),
                    fixed: cs.position==='fixed', d: desc(el)});
  }
  // dedupe by rounded y+side
  const seen = new Set(); const uniq = [];
  for (const o of offenders.sort((a,b)=>a.y-b.y)) {
    const k = (o.l < 14 ? 'L' : '') + (o.r < 14 ? 'R' : '') + Math.round(o.y/12);
    if (seen.has(k)) continue; seen.add(k); uniq.push(o);
    if (uniq.length >= 40) break;
  }
  return uniq;
}
"""

def main():
    report = {}
    with sync_playwright() as p:
        b = p.chromium.launch()
        for route in ROUTES:
            try:
                ctx = b.new_context(viewport={"width": 320, "height": 720}, user_agent=CHROME_UA,
                                    is_mobile=True, has_touch=True, device_scale_factor=1)
                pg = ctx.new_page()
                pg.goto(BASE + route, wait_until="load", timeout=45000)
                pg.wait_for_timeout(1500)
                try:
                    btn = pg.get_by_text("ENTER SITE", exact=False).first
                    if btn.count() and btn.is_visible(): btn.click(timeout=3000); pg.wait_for_timeout(2200)
                except Exception: pass
                for label in ("NECESSARY ONLY", "Accept All"):
                    try:
                        c = pg.get_by_text(label, exact=False).first
                        if c.count() and c.is_visible(): c.click(timeout=3000); pg.wait_for_timeout(400); break
                    except Exception: pass
                y = 0
                while True:
                    y += 720
                    pg.evaluate(f"window.scrollTo(0,{y})")
                    pg.wait_for_timeout(140)
                    if pg.evaluate("window.scrollY + window.innerHeight >= document.body.scrollHeight - 4"): break
                    if y > 60000: break
                pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(400)
                offs = pg.evaluate(JS)
                report[route] = offs
                print(f"{route}: {len(offs)} edge-touchers", flush=True)
                for o in offs[:6]:
                    print(f"   y={o['y']} L={o['l']} R={o['r']} {o['d'][:110]}", flush=True)
                ctx.close()
            except Exception as e:
                print(f"{route}: ERR {str(e)[:150]}", flush=True)
                report[route] = [{"error": str(e)[:200]}]
                try: ctx.close()
                except Exception: pass
        b.close()
    (OUT / "edge_audit.json").write_text(json.dumps(report, indent=1))
    print("WROTE", OUT / "edge_audit.json")

main()
