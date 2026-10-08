"""Designs v2 (CRLF): drop WorkCrossSwitch, ScrollArrows fn+usages, merch arrow
buttons, dead FiArrowLeft import. Line-based."""
import sys

P = r"V:\wyzdesign\src\app\designs\page.tsx"
raw = open(P, encoding="utf-8", newline="").read()
if "\r\n" not in raw:
    sys.exit("FAIL: designs not CRLF")
lines = raw.splitlines(keepends=True)

def idx(pred, start=0):
    for i in range(start, len(lines)):
        if pred(lines[i]):
            return i
    return -1

def die(msg):
    sys.exit("FAIL " + msg)

# 1. imports
hits = [i for i, l in enumerate(lines) if l.strip() == 'import WorkCrossSwitch from "@/components/WorkCrossSwitch";']
if len(hits) != 1:
    die(f"wcx import {len(hits)}")
del lines[hits[0]]
hits = [i for i, l in enumerate(lines) if "FiArrowLeft" in l]
if len(hits) != 1:
    die(f"FiArrowLeft {len(hits)}")
lines[hits[0]] = lines[hits[0]].replace(", FiArrowLeft", "")

# 2. ScrollArrows function block
fi = idx(lambda l: l.startswith("function ScrollArrows("))
if fi == -1:
    die("fn start")
end = idx(lambda l: l.rstrip("\r\n") == "}", fi)
if end == -1:
    die("fn end")
# consume one trailing blank line if present
stop = end + 1
if stop < len(lines) and lines[stop].strip() == "":
    stop += 1
del lines[fi:stop]

# 3. usages + WorkCrossSwitch usage + merch buttons (single-line JSX)
needles = ["<ScrollArrows scrollRef=", '<WorkCrossSwitch current="design" />',
           "merchScrollRef.current?.scrollBy"]
for nd in needles:
    hits = [i for i, l in enumerate(lines) if nd in l]
    want = {"<ScrollArrows scrollRef=": 3, '<WorkCrossSwitch current="design" />': 1,
            "merchScrollRef.current?.scrollBy": 2}[nd]
    if len(hits) != want:
        die(f"{nd!r}: {len(hits)} != {want}")
    for i in reversed(hits):
        del lines[i]

# 4. comment
hits = [i for i, l in enumerate(lines) if "MERCH WIDGET (with scroll arrows)" in l]
if len(hits) != 1:
    die(f"comment {len(hits)}")
lines[hits[0]] = lines[hits[0]].replace(" (with scroll arrows)", "")

out = "".join(lines)
for bad in ["WorkCrossSwitch", "ScrollArrows", "FiArrowLeft"]:
    if bad in out:
        die(f"leftover {bad}")
if out.count("merchScrollRef") != 1:  # useRef decl + ref={} usage => 2 (decl+ref)
    if out.count("merchScrollRef") != 2:
        die(f"merchScrollRef count {out.count('merchScrollRef')}")
open(P, "w", encoding="utf-8", newline="").write(out)
print("OK designs v2")
