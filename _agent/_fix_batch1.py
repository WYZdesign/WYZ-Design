"""Batch 1 (owner asks 2026-10-08/09):
 - home hero: drop the ParticleBackground "comet" layer + its import; make the
   logo-intro videos full-bleed (inset-0 + object-cover).
 - footer (CRLF): remove the extra centered crown; frame the bg video to top-left
   (hide the "Pattern Soup" watermark) and add a bottom-right darkening gradient.
"""
import re
import sys


def die(m):
    sys.exit("FAIL " + m)


# ---------- home (LF) ----------
HP = r"V:\wyzdesign\src\app\home\page.tsx"
h = open(HP, encoding="utf-8", newline="").read()
if "\r" in h:
    die("home not LF")

old_imp = 'import ParticleBackground from "@/components/ParticleBackground";\n'
if h.count(old_imp) != 1:
    die(f"home import {h.count(old_imp)}")
h = h.replace(old_imp, "", 1)

h, n = re.subn(r"^[ \t]*<ParticleBackground count=\{25\}[^\n]*\n", "", h, flags=re.M)
if n != 1:
    die(f"home particles n={n}")

old_cls = 'className="absolute w-full h-full object-cover"'
if h.count(old_cls) != 1:
    die(f"home videoplaylist class {h.count(old_cls)}")
h = h.replace(old_cls, 'className="absolute inset-0 w-full h-full object-cover"', 1)
open(HP, "w", encoding="utf-8", newline="").write(h)
print("home OK")

# ---------- footer (CRLF) ----------
FP = r"V:\wyzdesign\src\components\Footer.tsx"
f = open(FP, encoding="utf-8", newline="").read()
crlf = "\r\n" in f

# extra crown block
crown = re.search(
    r"[ \t]*<div className=\"mt-10 flex justify-center\">\s*<Image src=\"/wyz-crown-square\.png\"[^>]*/>\s*</div>\s*\r?\n",
    f,
)
if not crown:
    die("footer crown block not found")
f = f[:crown.start()] + f[crown.end():]

# frame video to top-left
old_pos = 'style={{ objectPosition: "center top" }}'
if f.count(old_pos) != 1:
    die(f"footer objectPosition {f.count(old_pos)}")
f = f.replace(old_pos, 'style={{ objectPosition: "left top" }}', 1)

# bottom-right darkening overlay after the black/15 layer
anchor = '<div className="absolute inset-0 bg-black/15 dark:bg-black/15" />'
if f.count(anchor) != 1:
    die(f"footer black/15 {f.count(anchor)}")
nl = "\r\n" if crlf else "\n"
overlay = (
    anchor
    + nl
    + '      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0) 52%, rgba(0,0,0,0.85) 100%)" }} />'
)
f = f.replace(anchor, overlay, 1)

open(FP, "w", encoding="utf-8", newline="").write(f)
print("footer OK")
