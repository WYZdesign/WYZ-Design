"""Remove the Wix Editor X Partner badge (the gold crown-like emblem the owner
flagged on the right of the footer). Keep the 'Designed & built with precision.'
line. CRLF file."""
import re
import sys

P = r"V:\wyzdesign\src\components\Footer.tsx"
s = open(P, encoding="utf-8", newline="").read()
s2, n = re.subn(r'^[ \t]*<Image src="/images/wix-extracted/common/logo/[^\n]*\n', "", s, flags=re.M)
if n != 1:
    sys.exit(f"FAIL wix logo n={n}")
open(P, "w", encoding="utf-8", newline="").write(s2)
print("OK wix badge removed")
