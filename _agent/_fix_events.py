"""Events: hero + carousel videos start at 5s (was 7s); hero gets a defensive
muted play() on loadedmetadata so autoplay never needs a click."""
import re
import sys

P = r"V:\wyzdesign\src\app\events\page.tsx"
s = open(P, encoding="utf-8", newline="").read()

pairs = [
    ("e.currentTarget.currentTime = 7", "e.currentTarget.currentTime = 5", 3),
    ("vid.currentTime = 7", "vid.currentTime = 5", 2),
    ("// 7s start point", "// 5s start point", 1),
]
for old, new, want in pairs:
    n = s.count(old)
    if n != want:
        sys.exit(f"FAIL count={n} want={want}: {old!r}")
    s = s.replace(old, new)

# hero-only defensive play() (onTimeUpdate follows ONLY the hero's onLoadedMetadata)
pat = re.compile(r"onLoadedMetadata=\{\(e\) => \{ e\.currentTarget\.currentTime = 5; \}\}(\s*)onTimeUpdate=")
s, n = pat.subn(
    r"onLoadedMetadata={(e) => { const v = e.currentTarget; v.currentTime = 5; void v.play().catch(() => {}); }}\1onTimeUpdate=",
    s,
)
if n != 1:
    sys.exit(f"FAIL hero play n={n}")

open(P, "w", encoding="utf-8", newline="").write(s)
print("OK events (5s start x5, hero play insurance)")
