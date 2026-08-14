"""Generate WYZ Design PWA icons from the crown master.
Run: python generate-icons.py
Requires: pip install Pillow
Source master: ../public/wyz-crown.png (the real WYZ crown logo)
"""
from PIL import Image
import os

SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512]
RED = (223, 49, 49, 255)  # #DF3131 brand red
MASTER = os.path.join("..", "public", "wyz-crown.png")

crown = Image.open(MASTER).convert("RGBA")

def make_icon(size, maskable=False):
    if maskable:
        canvas = Image.new("RGBA", (size, size), RED)
        inner = int(size * 0.80)
        glyph = crown.resize((inner, inner), Image.LANCZOS)
        off = (size - inner) // 2
        canvas.paste(glyph, (off, off), glyph)
        return canvas
    return crown.resize((size, size), Image.LANCZOS)

for s in SIZES:
    make_icon(s).save(f"icon-{s}x{s}.png", "PNG", optimize=True)
    print(f"Created icon-{s}x{s}.png")

# maskable variants
for s in [192, 512]:
    make_icon(s, maskable=True).save(f"icon-{s}x{s}-maskable.png", "PNG", optimize=True)
    print(f"Created icon-{s}x{s}-maskable.png")

print("Done! All icons generated from the WYZ crown.")
