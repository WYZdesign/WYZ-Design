"""events/page.tsx: the flyer `img` values are stored pre-percent-encoded, which
makes next/image double-encode them (optimizer 400 -> blank flyers). Decode them
back to true filenames so next/image encodes once. LF file, count asserted."""
import re
import sys
from urllib.parse import unquote

P = r"V:\wyzdesign\src\app\events\page.tsx"
s = open(P, encoding="utf-8", newline="").read()
n = 0

def repl(m):
    global n
    raw = unquote(m.group(1))
    if raw != m.group(1):
        n += 1
    return 'img: "' + raw + '"'

s2 = re.sub(r'img: "(/images/[^"]+)"', repl, s)
if s2.count('img: "/images/event-flyers/') == 0:
    sys.exit("FAIL: no event-flyers img entries found")
if "%2" in re.sub(r'img: "/images/[^"]*"', "", s2):
    pass
# verify no encoded img values remain
m = re.search(r'img: "[^"]*%2[0-9A-Fa-f]', s2)
if m:
    sys.exit("FAIL: encoded img remains: " + m.group(0))
open(P, "w", encoding="utf-8", newline="").write(s2)
print(f"OK events imgs decoded: {n}")
