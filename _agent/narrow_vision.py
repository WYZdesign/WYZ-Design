"""narrow_vision.py - 320px screenshots + marquee spacing metrics for all pages."""
import json, re, sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "https://www.wyzdesign.com"
OUT = Path(r"W:\WYZ_Command_Center\_STATE\web_shots\narrow")
OUT.mkdir(parents=True, exist_ok=True)
ROUTES = ["/", "/merch", "/booking", "/printing", "/services", "/photography", "/about",
          "/contact", "/gallery", "/faq", "/blog", "/plans", "/events", "/fd",
          "/designs", "/web-design", "/community"]
if len(sys.argv) > 1:
    ROUTES = sys.argv[1:]
CHROME_UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
             "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")

PAUSE_CSS = "*,*::before,*::after{animation-play-state:paused!important;transition-duration:0s!important}"

MEASURE_JS = r"""
() => {
  const out = {side: {}, marquees: [], overflow: {}};
  out.overflow.scrollW = document.documentElement.scrollWidth;
  out.overflow.vw = window.innerWidth;
  // side insets from visible text blocks
  const sel = 'p,h1,h2,h3,h4,li,button,a,span,div';
  const lefts = [], rights = [];
  const vw = window.innerWidth;
  for (const el of document.querySelectorAll('p,h1,h2,h3,h4,li,button')) {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 6) continue;
    if (r.width > vw * 0.97) continue;           // full-bleed skip
    if (r.left < -2 || r.left > vw * 0.6) continue;
    lefts.push(Math.round(r.left));
    rights.push(Math.round(vw - r.right));
  }
  lefts.sort((a,b)=>a-b); rights.sort((a,b)=>a-b);
  const p = (arr,q)=> arr.length ? arr[Math.floor(arr.length*q)] : null;
  out.side = {n: lefts.length, minL: lefts[0] ?? null, p10L: p(lefts,0.10),
              medL: p(lefts,0.50), minR: rights[0] ?? null, p10R: p(rights,0.10),
              medR: p(rights,0.50)};
  // marquee blocks
  const mqSel = '[class*="animate-marquee"], .wyz-marquee-track, .faq-marquee, [class*="marquee-infinite"]';
  const els = [...document.querySelectorAll(mqSel)];
  const seen = new Set();
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.height < 4) continue;
    // walk up for spacing container
    let anc = el, pad = null, gap = null;
    for (let i = 0; i < 6 && anc; i++, anc = anc.parentElement) {
      const cs = getComputedStyle(anc);
      const pt = parseFloat(cs.paddingTop)||0, pb = parseFloat(cs.paddingBottom)||0;
      const mt = parseFloat(cs.marginTop)||0, mb = parseFloat(cs.marginBottom)||0;
      if (pt||pb||mt||mb) { pad = {tag: anc.tagName, cls: (anc.className||'').toString().slice(0,120),
          pt, pb, mt, mb, rectTop: Math.round(anc.getBoundingClientRect().top + scrollY),
          rectH: Math.round(anc.getBoundingClientRect().height)};
        gap = {above: Math.round(r.top - anc.getBoundingClientRect().top),
               below: Math.round(anc.getBoundingClientRect().bottom - r.bottom)};
        break;
      }
    }
    const key = Math.round(r.top + scrollY);
    if (seen.has(key)) continue;
    seen.add(key);
    out.marquees.push({y: key, h: Math.round(r.height),
      cls: (el.className||'').toString().slice(0,90), pad, gap});
  }
  return out;
}
"""

def slug(route):
    s = route.strip("/").replace("/", "_") or "home"
    return re.sub(r"[^a-z0-9_]+", "", s.lower())

def enter_and_dismiss(pg):
    try:
        btn = pg.get_by_text("ENTER SITE", exact=False).first
        if btn.count() and btn.is_visible():
            btn.click(timeout=3000); pg.wait_for_timeout(2500)
    except Exception: pass
    for label in ("NECESSARY ONLY", "Accept All"):
        try:
            c = pg.get_by_text(label, exact=False).first
            if c.count() and c.is_visible():
                c.click(timeout=3000); pg.wait_for_timeout(500); break
        except Exception: pass

def stepped_scroll(pg, h=720):
    y = 0
    while True:
        y += h
        pg.evaluate(f"window.scrollTo(0,{y})")
        pg.wait_for_timeout(160)
        if pg.evaluate("window.scrollY + window.innerHeight >= document.body.scrollHeight - 4"):
            break
        if y > 60000: break
    pg.wait_for_timeout(600)
    pg.evaluate("window.scrollTo(0,0)")
    pg.wait_for_timeout(400)

def settle_reveals(pg, timeout=10000):
    """Deterministic captures: block until every ScrollReveal wrapper's opacity
    transition has finished (computed opacity settles at 1 only when the
    transition completes), so screenshots never catch half-revealed sections."""
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

def main():
    report = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for route in ROUTES:
            sl = slug(route)
            entry = {"shots": [], "errors": [],
                     "meta": {"route": route, "viewport": {"width": 320, "height": 720},
                              "captured_at": time.strftime("%Y-%m-%dT%H:%M:%S%z")}}
            try:
                ctx = browser.new_context(viewport={"width": 320, "height": 720},
                    user_agent=CHROME_UA, is_mobile=True, has_touch=True, device_scale_factor=1)
                pg = ctx.new_page()
                resp = pg.goto(BASE + route, wait_until="load", timeout=45000)
                entry["status"] = resp.status if resp else None
                pg.wait_for_timeout(1500)
                enter_and_dismiss(pg)
                stepped_scroll(pg)
                settle_reveals(pg)
                pg.add_style_tag(content=PAUSE_CSS)
                pg.wait_for_timeout(300)
                # overflow at 360 too
                m320 = pg.evaluate(MEASURE_JS)
                pg.set_viewport_size({"width": 360, "height": 720})
                pg.wait_for_timeout(300)
                ov360 = pg.evaluate("document.documentElement.scrollWidth")
                pg.set_viewport_size({"width": 320, "height": 720})
                pg.wait_for_timeout(300)
                entry["m320"] = m320
                entry["scrollW_360"] = ov360
                # full-page
                fp = OUT / f"n320_{sl}.png"
                pg.screenshot(path=str(fp), full_page=True)
                entry["shots"].append(fp.name)
                # marquee closeups (cap 4/page)
                for i, mq in enumerate(m320.get("marquees", [])[:4]):
                    pg.evaluate(f"window.scrollTo(0, {max(0, mq['y'] - 260)})")
                    pg.wait_for_timeout(350)
                    mp = OUT / f"n320_{sl}_mq{i}.png"
                    pg.screenshot(path=str(mp))
                    entry["shots"].append(mp.name)
                ctx.close()
            except Exception as e:
                entry["errors"].append(str(e)[:200])
                try: ctx.close()
                except Exception: pass
            report[route] = entry
            print(f"{route} status={entry.get('status')} mq={len(entry.get('m320',{}).get('marquees',[]))} "
                  f"side={entry.get('m320',{}).get('side',{})} ov360={entry.get('scrollW_360')} "
                  f"shots={len(entry['shots'])} err={len(entry['errors'])}", flush=True)
        browser.close()
    outp = OUT / "narrow_metrics.json"
    old = {}
    if outp.exists():
        try: old = json.loads(outp.read_text())
        except Exception: old = {}
    old.update(report)
    outp.write_text(json.dumps(old, indent=1))
    print("WROTE", outp)

main()
