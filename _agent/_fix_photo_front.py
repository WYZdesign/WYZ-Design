"""One-shot: rebuild photography PhotoFlipCard front as image + black/80 + white title."""
import sys

P = r"V:\wyzdesign\src\app\photography\page.tsx"
s = open(P, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in s else "\n"

start_anchor = '<div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden relative">'
end_anchor = 'transition-colors mb-3">{s.name}</h3>'
i = s.find(start_anchor)
j = s.find(end_anchor)
if i == -1 or j == -1 or j < i:
    sys.exit(f"anchors not found i={i} j={j}")
k = s.find("</div>", j)
if k == -1:
    sys.exit("title close not found")
k += len("</div>")

parts = [
    '<div className="absolute inset-0 overflow-hidden">',
    "",
    '  <Image src={s.img} alt={s.name} fill sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, 25vw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />',
    "",
    '  <div className="absolute inset-0 bg-black/80" />',
    "",
    '  <div className="absolute inset-0 flex items-center justify-center z-10">',
    "",
    '  <h3 className="font-heading font-black text-white text-[24px] sm:text-[28px] tracking-[0.06em] text-center drop-shadow-lg px-4 uppercase">{s.name}</h3>',
    "",
    "  </div>",
]
new = nl.join(parts)
out = s[:i] + new + s[k:]
open(P, "w", encoding="utf-8", newline="").write(out)
print(f"replaced chars {i}..{k} ({k - i} -> {len(new)})")
