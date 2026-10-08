"""Navbar: main pages direct (PHOTOGRAPHY, DESIGNS, SERVICES) + one grouped MORE
dropdown. Keeps logo-left/actions-right + grouped mobile. LF file."""
import re
import sys

P = r"V:\wyzdesign\src\components\Navbar.tsx"
s = open(P, encoding="utf-8", newline="").read()
if "\r" in s:
    sys.exit("FAIL not LF")

def sub1(pat, repl, label, flags=0):
    global s
    s2, n = re.subn(pat, repl, s, count=1, flags=flags)
    if n != 1:
        sys.exit(f"FAIL {label}: {n}")
    s = s2

DATA = '''const NAV_LINKS = [
  { href: "/photography", label: "P H O T O G R A P H Y" },
  { href: "/designs", label: "D E S I G N S" },
  { href: "/services", label: "S E R V I C E S" },
];

const MORE_GROUPS = [
  { title: "S E R V I C E S", links: [
    { href: "/events", label: "E V E N T S" },
    { href: "/plans", label: "P L A N S" },
    { href: "/printing", label: "P R I N T I N G" },
    { href: "/web-design", label: "W E B . D E S I G N" },
  ] },
  { title: "S T O R E", links: [
    { href: "/merch", label: "M E R C H" },
    { href: "/gift-card", label: "G I F T . C A R D" },
    { href: "/loyalty", label: "R E W A R D S" },
    { href: "/featured-artist", label: "F. A. O. T. M." },
  ] },
  { title: "S T U D I O", links: [
    { href: "/about", label: "A B O U T" },
    { href: "/blog", label: "B L O G" },
    { href: "/community", label: "C O M M U N I T Y" },
    { href: "/wyzmind", label: "W Y Z M i N D" },
    { href: "/contact", label: "C O N T A C T" },
    { href: "/faq", label: "F. A. Q." },
  ] },
];

const MORE_LINKS = MORE_GROUPS.flatMap((g) => g.links);
'''
sub1(r"const NAV_CATEGORIES = \[.*?\n\];\n", lambda m: DATA, "data", flags=re.S)

DESKTOP = '''            {/* Nav links */}
            <div className="hidden min-[1440px]:flex items-center">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`px-4 py-3 text-[14px] tracking-[0.2em] font-semibold whitespace-nowrap transition-all duration-[400ms] ${
                    isActive(l.href) ? "text-white dark:text-white" : "text-white/70 dark:text-white/70 hover:text-white dark:hover:text-white hover:scale-105 active:text-white/80"
                  }`}
                  style={isActive(l.href) ? { textShadow: "0 0 8px rgba(255,255,255,0.8)" } : undefined}>
                  {l.label}
                </Link>
              ))}
              <div className="relative" data-cat-dropdown onMouseEnter={() => setOpenCat("more")} onMouseLeave={() => setOpenCat(null)}>
                <button onClick={() => setOpenCat(openCat === "more" ? null : "more")} aria-expanded={openCat === "more"} aria-controls="more-navigation"
                  className={`px-4 py-3 text-[14px] tracking-[0.2em] font-semibold flex items-center gap-1 whitespace-nowrap transition-colors duration-[400ms] ${
                    MORE_LINKS.some(l => isActive(l.href)) ? "text-white dark:text-white" : "text-white/70 dark:text-white/70 hover:text-white dark:hover:text-white active:text-white/80"
                  }`}
                  style={MORE_LINKS.some(l => isActive(l.href)) ? { textShadow: "0 0 8px rgba(255,255,255,0.8)" } : undefined}>
                  M O R E <IoChevronDown className={`w-3 h-3 transition-transform ${openCat === "more" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openCat === "more" && (
                    <motion.div id="more-navigation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 shadow-xl z-50 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden wyz-red-gradient">
                        <video src="/videos/wyz-nav-bg-new.mp4" className="hidden lg:block absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center top" }} autoPlay muted loop playsInline preload="none" />
                      </div>
                      <div className="relative z-10 py-1">
                        {MORE_GROUPS.map((g) => (
                          <div key={g.title}>
                            <p className="px-5 pt-3 pb-1 text-[10px] tracking-[0.25em] font-bold text-white/40 uppercase">{g.title}</p>
                            {g.links.map((l) => (
                              <Link key={l.href} href={l.href}
                                aria-current={isActive(l.href) ? "page" : undefined}
                                className={`block px-5 py-2 text-[13px] tracking-[0.15em] font-semibold transition-colors duration-[400ms] ${
                                  isActive(l.href) ? "text-white bg-white/10 font-bold" : "text-white/70 hover:text-white hover:bg-white/5"
                                }`}>
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            '''
sub1(r"\{/\* Nav links \*/\}.*?(?=\{/\* Inline Search \+ Login \(desktop\) \*/\})",
     lambda m: DESKTOP, "desktop", flags=re.S)

MOBILE = '''              <p className="px-1 pt-1 pb-2 text-[10px] tracking-[0.25em] font-bold text-[#999] dark:text-white/40 uppercase">Portfolio</p>
              {NAV_LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link href={l.href} onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-[15px] tracking-[0.15em] font-semibold ${
                      isActive(l.href) ? "text-[#DF3131]" : "text-[#333333] dark:text-[#e0e0e0] hover:text-[#DF3131]"
                    }`}
                    aria-current={isActive(l.href) ? "page" : undefined}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              {MORE_GROUPS.map((g) => (
                <div key={g.title} className="pt-4">
                  <p className="px-1 pb-2 text-[10px] tracking-[0.25em] font-bold text-[#999] dark:text-white/40 uppercase">{g.title}</p>
                  {g.links.map((l, i) => (
                    <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <Link href={l.href} onClick={() => setMobileOpen(false)}
                        className={`block py-3 text-[15px] tracking-[0.15em] font-semibold ${
                          isActive(l.href) ? "text-[#DF3131]" : "text-[#333333] dark:text-[#e0e0e0] hover:text-[#DF3131]"
                        }`}
                        aria-current={isActive(l.href) ? "page" : undefined}>
                        {l.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ))}
'''
sub1(r"\{NAV_CATEGORIES\.map\(\(cat\) => \(.*?\n(?=            </div>\n          </motion\.div>)",
     lambda m: MOBILE, "mobile", flags=re.S)

for bad in ["NAV_CATEGORIES", "cat.href", "cat.links"]:
    if bad in s:
        sys.exit("FAIL leftover " + bad)
open(P, "w", encoding="utf-8", newline="").write(s)
print("OK nav main+more")
