"""Remove the embedded pages' hero so merged targets do not show double headers.
Strips the first nested <section> that contains an <h1> (never the root section)."""
import re
import sys

ROOT = r"V:\wyzdesign\src\app"
FILES = ["plans", "web-design", "gift-card", "referral", "partnerships", "nomadic-breed", "dying-breed-crew"]

def depth_end(s, start):
    depth = 0
    for m in re.finditer(r"<section\b|</section>", s[start:]):
        depth += 1 if m.group().startswith("<s") else -1
        if depth == 0:
            return start + m.end()
    return -1

for name in FILES:
    p = f"{ROOT}\\{name}\\page.tsx"
    s = open(p, encoding="utf-8", newline="").read()
    root = s.find("<section")
    hi = s.find("<h1")
    if root == -1 or hi == -1:
        print(f"SKIP {name} (root={root} h1={hi})")
        continue
    hs = s.rfind("<section", 0, hi)
    if hs == -1 or hs == root:
        print(f"SKIP {name}: hero not a nested <section> (hs={hs}, root={root})")
        continue
    he = depth_end(s, hs)
    if he == -1:
        print(f"SKIP {name}: no matching </section>")
        continue
    s = s[:hs] + s[he:]
    open(p, "w", encoding="utf-8", newline="").write(s)
    print(f"stripped hero from {name}")
print("DONE")
