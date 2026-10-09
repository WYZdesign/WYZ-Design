"""Merge sources into targets (owner-approved). Source <main> -> <section> so it
embeds; target imports + renders it; adds 301s + trims sitemap. LF files."""
import re
import sys

ROOT = r"V:\wyzdesign"
SOURCES = ["referral", "partnerships", "nomadic-breed", "dying-breed-crew", "gift-card", "plans", "web-design"]
TARGETS = {
    "loyalty": ["gift-card", "referral"],
    "services": ["plans", "web-design"],
    "contact": ["partnerships"],
    "about": ["nomadic-breed", "dying-breed-crew"],
}

def die(m):
    sys.exit("FAIL " + m)

for src in SOURCES:
    p = f"{ROOT}\\src\\app\\{src}\\page.tsx"
    s = open(p, encoding="utf-8", newline="").read()
    s2, n1 = re.subn(r"<main(\s[^>]*)?>", r"<section\1>", s, count=1)
    s3, n2 = re.subn(r"</main>", "</section>", s2, count=1)
    if n1 != 1 or n2 != 1:
        die(f"{src}: main {n1}/{n2}")
    open(p, "w", encoding="utf-8", newline="").write(s3)
    print(f"converted {src}")

def pascal(name):
    return "".join(w.capitalize() for w in re.split(r"[-_]", name)) + "Page"

for tgt, srcs in TARGETS.items():
    p = f"{ROOT}\\src\\app\\{tgt}\\page.tsx"
    s = open(p, encoding="utf-8", newline="").read()
    imports = "".join(f'import {pascal(x)} from "@/app/{x}/page";\n' for x in srcs if f'@/app/{x}/page' not in s)
    last = None
    for m in re.finditer(r"^import .*?;\s*$", s, flags=re.M):
        last = m
    if last is None:
        die(f"{tgt}: no imports")
    s = s[:last.end()] + "\n" + imports.rstrip("\n") + s[last.end():]
    block = "\n".join([f'      {{/* merged from /{x} */}}', f'      <{pascal(x)} />'] for x in srcs)
    idx = s.rfind("</main>")
    if idx == -1:
        idx = s.rfind("</>")
    if idx == -1:
        die(f"{tgt}: no closing main")
    s = s[:idx] + block + "\n" + s[idx:]
    open(p, "w", encoding="utf-8", newline="").write(s)
    print(f"embedded {srcs} into {tgt}")

cfg = f"{ROOT}\\next.config.ts"
c = open(cfg, encoding="utf-8", newline="").read()
anchor = '      { source: "/plans-pricing", destination: "/plans", permanent: true },'
if anchor not in c:
    die("next.config anchor")
extra = "\n".join([
    '      { source: "/plans", destination: "/services", permanent: true },',
    '      { source: "/web-design", destination: "/services", permanent: true },',
    '      { source: "/gift-card", destination: "/loyalty", permanent: true },',
    '      { source: "/referral", destination: "/loyalty", permanent: true },',
    '      { source: "/partnerships", destination: "/contact", permanent: true },',
    '      { source: "/nomadic-breed", destination: "/about", permanent: true },',
    '      { source: "/dying-breed-crew", destination: "/about", permanent: true },',
])
c = c.replace(anchor, anchor + "\n" + extra, 1)
open(cfg, "w", encoding="utf-8", newline="").write(c)
print("redirects added")

sm = f"{ROOT}\\src\\app\\sitemap.ts"
s = open(sm, encoding="utf-8", newline="").read()
removed = 0
for src in SOURCES:
    s, n = re.subn(rf'^.*?[\"/]{{1}}{re.escape(src)}[\"\]].*?\r?\n', "", s, flags=re.M | re.I)
    removed += n
open(sm, "w", encoding="utf-8", newline="").write(s)
print(f"sitemap removed {removed} lines")
print("DONE")
