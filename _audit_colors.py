import re

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    r = int(hex_color[0:2], 16) / 255
    g = int(hex_color[2:4], 16) / 255
    b = int(hex_color[4:6], 16) / 255
    return r, g, b

def linearize(c):
    if c <= 0.03928:
        return c / 12.92
    return ((c + 0.055) / 1.055) ** 2.4

def relative_luminance(hex_color):
    r, g, b = hex_to_rgb(hex_color)
    r = linearize(r)
    g = linearize(g)
    b = linearize(b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(color1, color2):
    l1 = relative_luminance(color1)
    l2 = relative_luminance(color2)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)

white = '#FFFFFF'
dm_page = '#1C1C1E'
dm_surface = '#252528'
WCAG_PASS = 4.5

colors = {
    '--color-wyz-bg': '#FFFFFF',
    '--color-wyz-white': '#FFFFFF',
    '--color-wyz-text': '#333333',
    '--color-wyz-text-secondary': '#666665',
    '--color-wyz-muted': '#666666',
    '--color-wyz-red': '#DF3131',
    '--color-wyz-red-dark': '#B82020',
    '--color-wyz-text-red': '#C00000',
    '--color-wyz-gold': '#D49341',
    '--color-wyz-gold-light': '#F9AD4D',
    '--color-wyz-border': '#E2E2E2',
    '--color-wyz-card': '#FFFFFF',
    '--dm-surface': '#252528',
    '--dm-page': '#1C1C1E',
    '--dm-deep': '#111111',
    '--dm-text': '#e0e0e0',
    '--dm-muted': '#b0b0b0',
    '--dm-border': '#444444',
}

print("=" * 60)
print("COMPREHENSIVE COLOR CONTRAST AUDIT - WYZDESIGN")
print("=" * 60)
print()

print("=" * 60)
print("SECTION 1: ALL CSS VARIABLE COLOR DEFINITIONS")
print("=" * 60)
print()

for name, hex_color in sorted(colors.items()):
    ratio = contrast_ratio(hex_color, white)
    status = 'PASS' if ratio >= WCAG_PASS else '*** FAIL ***'
    print(f"{name}: {hex_color} -> {ratio:.2f}:1 [{status}]")

print()
print("=" * 60)
print("SECTION 2: TEXT COLORS THAT FAIL WCAG AA (4.5:1)")
print("=" * 60)
print()

# Text-only potential colors
text_colors = [
    ('--color-wyz-text', '#333333', 'Body text, foreground'),
    ('--color-wyz-text-secondary', '#666665', 'Secondary text'),
    ('--color-wyz-muted', '#666666', 'Muted text'),
    ('--color-wyz-text-red', '#C00000', 'Accessibility red'),
    ('--color-wyz-red', '#DF3131', 'Brand red'),
    ('--color-wyz-red-dark', '#B82020', 'Dark brand red'),
    ('--color-wyz-gold', '#D49341', 'Brand gold'),
    ('--color-wyz-gold-light', '#F9AD4D', 'Light gold'),
    ('--dm-text', '#e0e0e0', 'Dark mode text'),
    ('--dm-muted', '#b0b0b0', 'Dark mode muted'),
]

for name, hex_color, desc in text_colors:
    ratio = contrast_ratio(hex_color, white)
    status = 'PASS' if ratio >= WCAG_PASS else '*** FAIL ***'
    bg_indicator = ''
    if name.startswith('--color-wyz-') and ratio < WCAG_PASS:
        bg_indicator = ' <-- USABLE ON DARK BG'
    print(f"{name}: {hex_color} ({desc})")
    print(f"  vs white: {ratio:.2f}:1 [{status}]{bg_indicator}")
    print()

print()
print("=" * 60)
print("SECTION 3: DARK MODE TEXT vs DARK BACKGROUNDS")
print("=" * 60)
print()

print("Dark mode text on #1C1C1E (--dm-page):")
ratio = contrast_ratio('#e0e0e0', dm_page)
status = 'PASS' if ratio >= 4.5 else ('PASS (AA large)' if ratio >= 3.0 else 'FAIL')
print(f"  #e0e0e0 -> {ratio:.2f}:1 [{status}]")

ratio = contrast_ratio('#b0b0b0', dm_page)
status = 'PASS' if ratio >= 4.5 else ('PASS (AA large)' if ratio >= 3.0 else 'FAIL')
print(f"  #b0b0b0 -> {ratio:.2f}:1 [{status}]")

ratio = contrast_ratio('#666665', dm_page)
status = 'PASS' if ratio >= 4.5 else ('PASS (AA large)' if ratio >= 3.0 else 'FAIL')
print(f"  #666665 -> {ratio:.2f}:1 [{status}]")

print()
print("Dark mode text on #252528 (--dm-surface):")
ratio = contrast_ratio('#e0e0e0', dm_surface)
status = 'PASS' if ratio >= 4.5 else ('PASS (AA large)' if ratio >= 3.0 else 'FAIL')
print(f"  #e0e0e0 -> {ratio:.2f}:1 [{status}]")

ratio = contrast_ratio('#b0b0b0', dm_surface)
status = 'PASS' if ratio >= 4.5 else ('PASS (AA large)' if ratio >= 3.0 else 'FAIL')
print(f"  #b0b0b0 -> {ratio:.2f}:1 [{status}]")

print()
print("White text on dark backgrounds:")
ratio = contrast_ratio('#FFFFFF', dm_surface)
status = 'PASS' if ratio >= 4.5 else ('PASS (AA large)' if ratio >= 3.0 else 'FAIL')
print(f"  #FFFFFF on #252528 -> {ratio:.2f}:1 [{status}]")

ratio = contrast_ratio('#FFFFFF', dm_page)
status = 'PASS' if ratio >= 4.5 else ('PASS (AA large)' if ratio >= 3.0 else 'FAIL')
print(f"  #FFFFFF on #1C1C1E -> {ratio:.2f}:1 [{status}]")

print()
print("=" * 60)
print("SECTION 4: SPECIFIC QUESTIONS")
print("=" * 60)
print()

print("Q1: --color-wyz-text-red (#C00000) analysis:")
ratio = contrast_ratio('#C00000', white)
print(f"  vs white: {ratio:.2f}:1")
print(f"  Comment in code says '~5.5:1 on white' - ACTUAL: {ratio:.2f}:1")
if abs(ratio - 5.5) < 0.3:
    print("  VERDICT: Comment is accurate!")
else:
    print(f"  VERDICT: Comment is off by {abs(ratio - 5.5):.2f}")

print()
print("Q2: Dark mode red (#FF5252) boosted color analysis:")
ratio = contrast_ratio('#FF5252', dm_surface)
print(f"  #FF5252 vs #252528: {ratio:.2f}:1")

ratio = contrast_ratio('#FF5252', dm_page)
print(f"  #FF5252 vs #1C1C1E: {ratio:.2f}:1")

ratio = contrast_ratio('#FF5252', '#DF3131')
print(f"  #FF5252 vs #DF3131 (red on red bg): {ratio:.2f}:1 - BAD!")

print()
print("=" * 60)
print("SECTION 5: HARDCODED COLORS IN CSS")
print("=" * 60)
print()

hardcoded = [
    ('#333333', 'body text, foreground'),
    ('#FFFFFF', 'white'),
    ('#DF3131', 'brand red'),
    ('#B82020', 'dark red'),
    ('#D49341', 'gold'),
    ('#F9AD4D', 'light gold'),
    ('#E2E2E2', 'border'),
    ('#C90000', 'gradient red'),
    ('#E63C3C', 'gradient mid'),
    ('#C00000', 'text red'),
    ('#FF5252', 'dark mode boosted red'),
    ('#1a1a1a', 'dark'),
    ('#f5f5f5', 'light gray'),
    ('#ccc', 'scrollbar'),
    ('#999', 'scrollbar hover'),
    ('#888', 'placeholder'),
]

for hex_color, desc in hardcoded:
    ratio = contrast_ratio(hex_color, white)
    status = 'PASS' if ratio >= WCAG_PASS else '*** FAIL ***'
    print(f"{hex_color} ({desc}): {ratio:.2f}:1 [{status}]")

print()
print("=" * 60)
print("SUMMARY: FAILING TEXT COLORS ON WHITE")
print("=" * 60)
print()
print("The following text colors FAIL WCAG AA 4.5:1 on white:")
print()

failing = [
    ('#D49341', 'gold'),
    ('#F9AD4D', 'light gold'),
]

for hex_color, desc in failing:
    ratio = contrast_ratio(hex_color, white)
    print(f"  {hex_color} ({desc}): {ratio:.2f}:1 - NEEDS FIX")

print()
print("=" * 60)
print("BORDER COLORS (not text, but checked):")
print("=" * 60)
print()

border_colors = [
    ('#E2E2E2', 'light border'),
    ('#ccc', 'scrollbar thumb'),
    ('#444', 'dark border'),
    ('#3a3a3d', 'dark mode border'),
]

for hex_color, desc in border_colors:
    ratio = contrast_ratio(hex_color, white)
    print(f"{hex_color} ({desc}): {ratio:.2f}:1")

print()
print("=" * 60)
print("END OF AUDIT")
print("=" * 60)
