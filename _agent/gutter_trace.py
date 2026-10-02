from playwright.sync_api import sync_playwright
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")
TARGETS = [
    ("/merch", "Print-on-Demand via Printful"),
    ("/merch", "Click to expand the store"),
    ("/printing", "Get your art and photos custom printed"),
    ("/services", "From photography to web design"),
    ("/plans", "Affordable plans for any budget"),
    ("/events", "Let our team handle the planning"),
    ("/events", "Stay up to date with all our future"),
    ("/fd", "Event brainstorm engine"),
    ("/web-design", "WYZ DESIGN - WEB DEVELOPMENT"),
    ("/web-design", "From concept to launch"),
]
JS = """
(fragment) => {
  const els = [...document.querySelectorAll('p,h1,h2,h3,h4,li,button,a,span,div')];
  const el = els.find(e => (e.innerText||'').trim().startsWith(fragment) && e.getBoundingClientRect().height >= 8);
  if (!el) return {err: 'not found'};
  const vw = window.innerWidth;
  const chain = [];
  let a = el;
  for (let i = 0; i < 7 && a && a !== document.body; i++, a = a.parentElement) {
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    chain.push({tag: a.tagName, cls: (a.className||'').toString().slice(0,90),
      padL: cs.paddingLeft, padR: cs.paddingRight, L: Math.round(r.left), R: Math.round(vw - r.right)});
  }
  return {vw, chain};
}
"""
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 320, "height": 720}, user_agent=UA, is_mobile=True, has_touch=True)
    pg = ctx.new_page()
    route = None
    for r, frag in TARGETS:
        if r != route:
            pg.goto("https://www.wyzdesign.com" + r, wait_until="load", timeout=45000)
            pg.wait_for_timeout(1800)
            pg.evaluate("window.scrollTo(0,document.body.scrollHeight/2)"); pg.wait_for_timeout(400)
            pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(250)
            route = r
        res = pg.evaluate(JS, frag)
        print(f"--- {r} :: {frag[:40]!r}")
        if res.get("err"):
            print("   ERR", res["err"]); continue
        for c in res["chain"]:
            print(f"   {c['tag']:<6} padL={c['padL']:<6} padR={c['padR']:<6} L={c['L']:<4} R={c['R']:<4} {c['cls'][:80]!r}")
    ctx.close(); b.close()
