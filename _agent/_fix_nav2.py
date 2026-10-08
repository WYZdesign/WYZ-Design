"""Navbar v4: line-based, LF, nbsp-safe. Removes /work, groups MORE menu into
SERVICES/STORE/STUDIO (desktop dropdown + mobile), adds close X in overlay.
Uses plain-string concat (no f-strings) for JSX blocks with literal braces."""
import re
import sys

P = r"V:\wyzdesign\src\components\Navbar.tsx"
raw = open(P, encoding="utf-8", newline="").read()
if "\r" in raw:
    sys.exit("FAIL: Navbar not LF")
lines = raw.splitlines(keepends=True)

def idx(pred, start=0):
    for i in range(start, len(lines)):
        if pred(lines[i]):
            return i
    return -1

def die(msg):
    sys.exit("FAIL " + msg)

def drop_line(needle, want=1):
    global lines
    hits = [i for i, l in enumerate(lines) if needle in l]
    if len(hits) != want:
        die(f"drop {needle!r}: {len(hits)} != {want}")
    for i in reversed(hits):
        del lines[i]

# 1. /work from NAV_LINKS
drop_line('{ href: "/work", label: "W O R K" },')

# 2. MORE_LINKS -> MORE_GROUPS (labels verbatim, nbsp preserved)
mi = idx(lambda l: l.startswith("const MORE_LINKS = ["))
if mi == -1:
    die("MORE_LINKS start")
mj = idx(lambda l: l.rstrip("\n") == "];", mi)
if mj == -1:
    die("MORE_LINKS end")
pairs = []
for l in lines[mi:mj + 1]:
    m = re.search(r'\{ href: "([^"]+)", label: "([^"]+)" \}', l)
    if m:
        pairs.append((m.group(1), m.group(2)))
if len(pairs) != 14:
    die(f"MORE_LINKS pairs {len(pairs)} != 14")
lab = dict(pairs)
GROUPS = [
    ("S E R V I C E S", ["/events", "/plans", "/printing", "/web-design"]),
    ("S T O R E", ["/merch", "/gift-card", "/loyalty", "/featured-artist"]),
    ("S T U D I O", ["/about", "/blog", "/community", "/wyzmind", "/contact", "/faq"]),
]
missing = [h for _, hs in GROUPS for h in hs if h not in lab]
if missing:
    die(f"missing hrefs {missing}")
extra = [h for h in lab if h not in {x for _, hs in GROUPS for x in hs}]
if extra:
    die(f"ungrouped hrefs {extra}")
new_block = ["const MORE_GROUPS = [\n"]
for title, hrefs in GROUPS:
    new_block.append('  { title: "' + title + '", links: [\n')
    for h in hrefs:
        new_block.append('    { href: "' + h + '", label: "' + lab[h] + '" },\n')
    new_block.append("  ] },\n")
new_block.append("];\n\n")
new_block.append("const MORE_LINKS = MORE_GROUPS.flatMap((g) => g.links);\n")
lines[mi:mj + 1] = new_block

# 3. ALL_LINKS const (mobile maps groups directly now)
drop_line("const ALL_LINKS = [...NAV_LINKS, ...MORE_LINKS];")

# 4. ALL_PAGES Work entry
drop_line('{ title: "Work", href: "/work"')

# 5. desktop dropdown: {MORE_LINKS.map -> grouped
mi = idx(lambda l: "{MORE_LINKS.map((l) => (" in l)
if mi == -1:
    die("desktop MORE_LINKS.map")
start = mi - 1
if lines[start].strip() != '<div className="relative z-10">':
    die("desktop start line: " + lines[start].strip())
e1 = idx(lambda l: l.strip() == "))}", mi)
end = idx(lambda l: l.strip() == "</div>", e1) if e1 != -1 else -1
if end == -1:
    die("desktop end")
ind = " " * (len(lines[start]) - len(lines[start].lstrip()))
new = [
    ind + '<div className="relative z-10 py-1">\n',
    ind + "  {MORE_GROUPS.map((g) => (\n",
    ind + "    <div key={g.title}>\n",
    ind + '      <p className="px-5 pt-3 pb-1 text-[10px] tracking-[0.25em] font-bold text-white/40 uppercase">{g.title}</p>\n',
    ind + "      {g.links.map((l) => (\n",
    ind + "        <Link key={l.href} href={l.href}\n",
    ind + '          aria-current={isActive(l.href) ? "page" : undefined}\n',
    ind + '          className={`block px-5 py-2 text-[13px] tracking-[0.15em] font-semibold transition-colors duration-[400ms] ${\n',
    ind + '            isActive(l.href) ? "text-white dark:text-white bg-white/10 dark:bg-black/10 font-bold" : "text-white/70 dark:text-white/70 hover:text-white dark:hover:text-white hover:bg-white/5 dark:hover:bg-black/5 active:text-white/80"\n',
    ind + "          }`}>\n",
    ind + "          {l.label}\n",
    ind + "        </Link>\n",
    ind + "      ))}\n",
    ind + "    </div>\n",
    ind + "  ))}\n",
    ind + "</div>\n",
]
lines[start:end + 1] = new

# 6. close X inside mobile overlay + profile block padding
mi = idx(lambda l: "onTouchMove={(e) => e.stopPropagation()}>" in l)
if mi == -1:
    die("overlay onTouchMove")
lines[mi + 1:mi + 1] = [
    '            <button aria-label="Close menu" onClick={() => setMobileOpen(false)}\n',
    '              className="absolute top-4 right-4 z-30 w-11 h-11 flex items-center justify-center text-[#333] dark:text-[#e0e0e0] border border-[#E2E2E2] dark:border-[#333] rounded-full bg-white dark:bg-[#252528] active:scale-95 transition-all">\n',
    '              <HiX className="w-6 h-6" />\n',
    "            </button>\n",
]
pi = idx(lambda l: '<div className="px-6 pt-2 pb-4 border-b border-[#E2E2E2] dark:border-[#333]">' in l)
if pi == -1:
    die("profile block")
if pi < mi:
    die("profile block before overlay")
lines[pi] = lines[pi].replace("px-6 pt-2", "pl-6 pr-16 pt-2")

# 7. mobile menu grouped
mi = idx(lambda l: "{ALL_LINKS.map((l, i) => (" in l)
if mi == -1:
    die("mobile ALL_LINKS.map")
start = mi - 1
if "flex-1 overflow-y-auto px-6 py-5" not in lines[start]:
    die("mobile start: " + lines[start].strip())
e1 = idx(lambda l: l.strip() == "))}", mi)
end = idx(lambda l: l.strip() == "</div>", e1) if e1 != -1 else -1
if end == -1:
    die("mobile end")
ind = " " * (len(lines[start]) - len(lines[start].lstrip()))

def motion_block(indent, href_expr, label_expr, delay):
    return [
        indent + "  <motion.div key={" + href_expr + '} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ' + delay + " }}>\n",
        indent + "    <Link href={" + href_expr + "} onClick={() => setMobileOpen(false)}\n",
        indent + "      className={`block py-3 text-[15px] tracking-[0.15em] font-semibold ${\n",
        indent + "        isActive(" + href_expr + ') ? "text-[#DF3131]" : "text-[#333333] dark:text-[#e0e0e0] hover:text-[#DF3131]"\n',
        indent + "      }`}\n",
        indent + '      aria-current={isActive(' + href_expr + ') ? "page" : undefined}>\n',
        indent + "      {" + label_expr + "}\n",
        indent + "    </Link>\n",
        indent + "  </motion.div>\n",
    ]

new = [ind + '<div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">\n']
new.append(ind + '  <p className="px-1 pt-1 pb-2 text-[10px] tracking-[0.25em] font-bold text-[#999] dark:text-white/40 uppercase">Portfolio</p>\n')
new.append(ind + "  {NAV_LINKS.map((l, i) => (\n")
new += motion_block(ind + "    ", "l.href", "l.label", "i * 0.03")
new.append(ind + "  ))}\n")
new.append(ind + "  {MORE_GROUPS.map((g) => (\n")
new.append(ind + '    <div key={g.title} className="pt-4">\n')
new.append(ind + '      <p className="px-1 pb-2 text-[10px] tracking-[0.25em] font-bold text-[#999] dark:text-white/40 uppercase">{g.title}</p>\n')
new.append(ind + "      {g.links.map((l, i) => (\n")
new += motion_block(ind + "        ", "l.href", "l.label", "i * 0.03")
new.append(ind + "      ))}\n")
new.append(ind + "    </div>\n")
new.append(ind + "  ))}\n")
new.append(ind + "</div>\n")
lines[start:end + 1] = new

out = "".join(lines)
for bad in ['{ href: "/work"', '{ title: "Work"', "ALL_LINKS"]:
    if bad in out:
        die("leftover " + repr(bad))
if out.count("MORE_GROUPS") < 4:
    die("MORE_GROUPS count " + str(out.count("MORE_GROUPS")))
if out.count("onTouchMove={(e) => e.stopPropagation()}>") != 1:
    die("overlay anchor lost")
if "<HiX" not in out:
    die("HiX missing")
if "{NAV_LINKS.map((l, i) => (" not in out:
    die("mobile NAV_LINKS.map missing")
if out.count("isActive(") < 6:
    die("isActive refs dropped: " + str(out.count("isActive(")))
open(P, "w", encoding="utf-8", newline="").write(out)
print("OK nav v4")
