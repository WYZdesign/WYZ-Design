"""Photography v2 (mixed CR endings): drop WorkCrossSwitch import+usage; move the
Model Archive nav dots out of the overflow-hidden carousel to a static centered
row directly under the cards (hidden while the apply form is open)."""
import re
import sys

P = r"V:\wyzdesign\src\app\photography\page.tsx"
s = open(P, encoding="utf-8", newline="").read()

crlf2 = s.count("\r\r\n")
crlf = s.count("\r\n") - crlf2
lf = s.count("\n") - crlf2 - crlf
eol = "\r\r\n" if crlf2 >= max(crlf, lf) else ("\r\n" if crlf >= lf else "\n")
print(f"eol={eol!r} crlf2={crlf2} crlf={crlf} lf={lf}")

def die(msg):
    sys.exit("FAIL " + msg)

# 1. import line
s, n = re.subn(r'import WorkCrossSwitch from "@/components/WorkCrossSwitch";[ \t]*\r*\n', "", s, count=1)
if n != 1:
    die(f"import n={n}")

# 2. usage line
s, n = re.subn(r"^[ \t]*<WorkCrossSwitch current=\"photography\" />[ \t]*\r*\n", "", s, flags=re.M, count=1)
if n != 1:
    die(f"usage n={n}")

# 3. carve dots block (Navigation Dots .. just before Nav Arrows)
i1 = s.find("  {/* Navigation Dots */}")
i2 = s.find("{/* Nav Arrows */}", i1)
if i1 == -1 or i2 == -1:
    die(f"dots anchors {i1} {i2}")
block = s[i1:i2]
if "featuredModels.map" not in block or "bottom-4" not in block:
    die("dots block mismatch")
# keep the 2-space indent that belonged to the Nav Arrows line
s = s[:i1] + "  " + s[i2:]

# 4. insert static centered dots before the Become A Model Form comment
anchor = "{/* Become A Model Form */}"
if s.count(anchor) != 1:
    die(f"form anchor {s.count(anchor)}")
new = eol.join([
    "  {/* Navigation Dots */}",
    "  {!showModelForm && (",
    '  <div className="mt-5 flex items-center justify-center gap-1.5">',
    "  {featuredModels.map((_, i) => (",
    "    <button",
    "      key={i}",
    "      onClick={() => setModelIdx(i)}",
    '      className="p-1 border-0 bg-transparent flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] cursor-pointer"',
    "      aria-label={`Model ${i + 1}`}",
    "    >",
    '    <span className={`rounded-full transition-all duration-300 ${i === modelIdx ? "bg-[#DF3131] w-4 h-1.5" : "bg-white/50 dark:bg-white/40 w-1.5 h-1.5"}`} />',
    "  </button>",
    "  ))}",
    "  </div>",
    "  )}",
    "",
])
new = new.replace("\n", eol) if eol != "\n" else new
# new already joined with eol; ensure last element "" gives trailing eol
if not new.endswith(eol):
    new += eol
s = s.replace(anchor, new + anchor, 1)

if "WorkCrossSwitch" in s:
    die("WorkCrossSwitch leftover")
if s.count("Navigation Dots") != 1:
    die(f"dots comments {s.count('Navigation Dots')}")
if s.count("bottom-4") != s.count("absolute bottom-4") or "bottom-4" in s.split("Navigation Dots")[0][-2000:]:
    pass  # other sections may use bottom-4; only assert dots block moved:
if "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5" in s:
    die("old absolute dots still present")
open(P, "w", encoding="utf-8", newline="").write(s)
print("OK photo v2")
