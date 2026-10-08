"""home/page.tsx: model image paths are stored pre-percent-encoded, so next/image
double-encodes them (optimizer 400). Decode to true filenames. LF file."""
import re
import sys
from urllib.parse import unquote

P = r"V:\wyzdesign\src\app\home\page.tsx"
s = open(P, encoding="utf-8", newline="").read()
n = 0

def repl(m):
    global n
    raw = unquote(m.group(1))
    if raw != m.group(1):
        n += 1
    return '"' + raw + '"'

s2 = re.sub(r'"(/images/models/[^"]*%[0-9A-Fa-f]{2}[^"]*)"', repl, s)
m = re.search(r'"/images/models/[^"]*%[0-9A-Fa-f]{2}', s2)
if m:
    sys.exit("FAIL encoded home img remains: " + m.group(0))
open(P, "w", encoding="utf-8", newline="").write(s2)
print(f"OK home imgs decoded: {n}")
