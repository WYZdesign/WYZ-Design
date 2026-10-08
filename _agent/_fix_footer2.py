"""Footer v2 (CRLF): drop /work row, pull socials out of brand column into a
centered row under the newsletter block. Line-based."""
import sys

P = r"V:\wyzdesign\src\components\Footer.tsx"
raw = open(P, encoding="utf-8", newline="").read()
if "\r\n" not in raw:
    die = sys.exit
    sys.exit("FAIL: Footer not CRLF")
lines = raw.splitlines(keepends=True)

def idx(pred, start=0):
    for i in range(start, len(lines)):
        if pred(lines[i]):
            return i
    return -1

def die(msg):
    sys.exit("FAIL " + msg)

# 1. /work row
hits = [i for i, l in enumerate(lines) if '{ href: "/work", label: "Work" },' in l]
if len(hits) != 1:
    die(f"/work hits {len(hits)}")
del lines[hits[0]]

# 2. socials block out of brand column (div with max-w-[160px] .. matching </div>)
si = idx(lambda l: "max-w-[160px]" in l)
if si == -1:
    die("socials start")
ei = idx(lambda l: l.strip() == "</div>", si)
if ei == -1:
    die("socials end")
block = "".join(lines[si:ei + 1])
if "SOCIALS.map" not in block:
    die("socials block content")
# also drop a directly-following blank? keep as-is.
del lines[si:ei + 1]

# 3. insert centered socials row between newsletter inner close and outer close
fi = idx(lambda l: l.strip() == "</form>")
if fi == -1:
    die("</form>")
inner = idx(lambda l: l.strip() == "</div>", fi + 1)
outer = idx(lambda l: l.strip() == "</div>", inner + 1)
if inner == -1 or outer == -1:
    die(f"closes inner={inner} outer={outer}")
if lines[fi + 1].strip() != "</div>" or lines[fi + 2].strip() != "</div>":
    die(f"unexpected form tail: {lines[fi+1]!r} {lines[fi+2]!r}")
new = [
    '        <div className="max-w-[115rem] mx-auto px-6 lg:px-12 pb-6 flex justify-center">\r\n',
    '          <div className="flex flex-wrap justify-center gap-3">\r\n',
    '            {SOCIALS.map((s, i) => (\r\n',
    '              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}\r\n',
    '                className={`h-11 w-11 flex items-center justify-center border ${socialBorder} ${socialText} hover:border-white hover:text-white hover:bg-white/10 transition-all rounded-full`}>\r\n',
    '                <s.icon className="w-4 h-4" />\r\n',
    "              </a>\r\n",
    "            ))}\r\n",
    "          </div>\r\n",
    "        </div>\r\n",
]
lines[fi + 3:fi + 3] = new

out = "".join(lines)
if '{ href: "/work"' in out:
    die("/work leftover")
if out.count("max-w-[160px]") != 0:
    die("old socials still in brand column")
if out.count("SOCIALS.map") != 1:
    die(f"SOCIALS.map count {out.count('SOCIALS.map')}")
open(P, "w", encoding="utf-8", newline="").write(out)
print("OK footer v2")
