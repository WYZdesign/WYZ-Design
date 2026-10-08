"""Navbar restructure (owner ask 2026-10-08/09): logo left + actions right;
every top-level category gets its own dropdown (desktop) and grouped section
(mobile). LF file; regex anchors with asserts."""
import re
import sys

P = r"V:\wyzdesign\src\components\Navbar.tsx"
s = open(P, encoding="utf-8", newline="").read()
if "\r" in s:
    sys.exit("FAIL: Navbar not LF")

def sub1(pattern, repl, label, flags=0):
    global s
    s2, n = re.subn(pattern, repl, s, count=1, flags=flags)
    if n != 1:
        sys.exit(f"FAIL {label}: {n}")
    s = s2

# 1. data block
DATA = '''const NAV_CATEGORIES = [
  { href: "/photography", label: "P H O T O G R A P H Y", links: [
    { href: "/photography/events", label: "E V E N T S" },
    { href: "/photography/studio", label: "S T U D I O" },
    { href: "/photography/products", label: "P R O D U C T S" },
    { href: "/photography/outdoors", label: "O U T D O O R S" },
    { href: "/photography/urbex", label: "U R B E X" },
    { href: "/photography/conceptual", label: "C O N C E P T U A L" },
  ] },
  { href: "/designs", label: "D E S I G N S", links: [
    { href: "/designs/artfinix", label: "A R T F I N I X" },
    { href: "/designs/kid-bode", label: "K I D . B O D E" },
    { href: "/designs/dawneeahs-glow", label: "D A W N E E A H S" },
    { href: "/designs/gft-foods", label: "G F T . F O O D S" },
  ] },
  { href: "/services", label: "S E R V I C E S", links: [
    { href: "/services/photoshoot", label: "P H O T O S H O O T" },
    { href: "/services/photo-retouching", label: "R E T O U C H I N G" },
    { href: "/services/event-photography", label: "E V E N T . P H O T O" },
    { href: "/services/consultation", label: "C O N S U L T A T I O N" },
    { href: "/web-design", label: "W E B . D E S I G N" },
    { href: "/printing", label: "P R I N T I N G" },
  ] },
  { href: "/merch", label: "S T O R E", links: [
    { href: "/merch", label: "M E R C H" },
    { href: "/gift-card", label: "G I F T . C A R D" },
    { href: "/loyalty", label: "R E W A R D S" },
    { href: "/featured-artist", label: "F. A. O. T. M." },
  ] },
  { href: "/about", label: "S T U D I O", links: [
    { href: "/about", label: "A B O U T" },
    { href: "/blog", label: "B L O G" },
    { href: "/community", label: "C O M M U N I T Y" },
    { href: "/wyzmind", label: "W Y Z M i N D" },
    { href: "/contact", label: "C O N T A C T" },
    { href: "/faq", label: "F. A. Q." },
  ] },
];
'''
sub1(r"const NAV_LINKS = \[.*?const MORE_LINKS = MORE_GROUPS\.flatMap\(\(g\) => g\.links\);\n",
     lambda m: DATA, "data block", flags=re.S)

# 2. state
sub1(r"const \[moreOpen, setMoreOpen\] = useState\(false\);",
     "const [openCat, setOpenCat] = useState<string | null>(null);", "state")

# 3. outside-touch close effect (mobile)
sub1(r"const close = \(e: TouchEvent \| MouseEvent\) => \{ const target = e\.target as HTMLElement; if \(!target\.closest\(\"\[data-more-dropdown\]\"\) && !target\.closest\(\"\[data-more-btn\]\"\)\) setMoreOpen\(false\); \};",
     "const close = (e: TouchEvent | MouseEvent) => { const target = e.target as HTMLElement; if (!target.closest(\"[data-cat-dropdown]\")) setOpenCat(null); };",
     "touch close")

# 4. container alignment
sub1(r'<div className="flex items-center justify-center gap-4 lg:gap-10 h-16 lg:h-20">',
     '<div className="flex items-center justify-between gap-4 lg:gap-8 h-16 lg:h-20">', "container")

# 5. desktop nav block
DESKTOP = '''{/* Nav links */}
            <div className="hidden min-[1440px]:flex items-center">
              {NAV_CATEGORIES.map((cat) => (
                <div key={cat.href} data-cat-dropdown className="relative" onMouseEnter={() => setOpenCat(cat.href)} onMouseLeave={() => setOpenCat(null)}>
                  <Link href={cat.href}
                    aria-current={isActive(cat.href) ? "page" : undefined}
                    aria-expanded={openCat === cat.href}
                    onFocus={() => setOpenCat(cat.href)}
                    className={`px-4 py-3 text-[14px] tracking-[0.2em] font-semibold flex items-center gap-1 whitespace-nowrap transition-all duration-[400ms] ${
                      isActive(cat.href) ? "text-white dark:text-white" : "text-white/70 dark:text-white/70 hover:text-white dark:hover:text-white hover:scale-105 active:text-white/80"
                    }`}
                    style={isActive(cat.href) ? { textShadow: "0 0 8px rgba(255,255,255,0.8)" } : undefined}>
                    {cat.label} <IoChevronDown className={`w-3 h-3 transition-transform ${openCat === cat.href ? "rotate-180" : ""}`} />
                  </Link>
                  <AnimatePresence>
                    {openCat === cat.href && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-60 shadow-xl z-50 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden wyz-red-gradient">
                          <video src="/videos/wyz-nav-bg-new.mp4" className="hidden lg:block absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center top" }} autoPlay muted loop playsInline preload="none" />
                        </div>
                        <div className="relative z-10 py-1">
                          {cat.links.map((l) => (
                            <Link key={l.href} href={l.href}
                              aria-current={isActive(l.href) ? "page" : undefined}
                              className={`block px-5 py-2.5 text-[13px] tracking-[0.15em] font-semibold transition-colors duration-[400ms] ${
                                isActive(l.href) ? "text-white bg-white/10 font-bold" : "text-white/70 hover:text-white hover:bg-white/5"
                              }`}>
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            '''
sub1(r"            \{/\* Nav links \*/\}.*?(?=            \{/\* Inline Search \+ Login \(desktop\) \*/\})",
     lambda m: DESKTOP, "desktop block", flags=re.S)

# 6. mobile menu block
MOBILE = '''              {NAV_CATEGORIES.map((cat) => (
                <div key={cat.href} className="pt-3">
                  <Link href={cat.href} onClick={() => setMobileOpen(false)}
                    className="block py-2 text-[12px] tracking-[0.25em] font-bold uppercase text-[#DF3131]">
                    {cat.label}
                  </Link>
                  {cat.links.map((l, i) => (
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
sub1(r"              <p className=\"px-1 pt-1 pb-2[^\n]*>Portfolio</p>.*?\n(?=            </div>\n          </motion\.div>)",
     lambda m: MOBILE, "mobile block", flags=re.S)

# checks
for bad in ["MORE_LINKS", "MORE_GROUPS", "NAV_LINKS", "moreOpen", "setMoreOpen"]:
    if bad in s:
        sys.exit("FAIL leftover " + bad)
if s.count("NAV_CATEGORIES") < 3:
    sys.exit("FAIL NAV_CATEGORIES count " + str(s.count("NAV_CATEGORIES")))
open(P, "w", encoding="utf-8", newline="").write(s)
print("OK nav categories + alignment")
