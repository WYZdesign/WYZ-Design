import os
import re

# Search for --color-wyz-text-red usage
results_red = []
results_text_red = []
results_DF3131 = []
for root, dirs, files in os.walk(r'V:\wyzdesign'):
    for file in files:
        if file.endswith('.css') or file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for i, line in enumerate(f, 1):
                        if '--color-wyz-text-red' in line:
                            results_text_red.append(f'{filepath}:{i}: {line.strip()}')
                        if '#C00000' in line or '#c00000' in line:
                            results_red.append(f'{filepath}:{i}: {line.strip()}')
                        if '#DF3131' in line or '#df3131' in line:
                            results_DF3131.append(f'{filepath}:{i}: {line.strip()}')
            except:
                pass

print('=== Usages of --color-wyz-text-red ===')
for r in results_text_red[:30]:
    print(r)
if not results_text_red:
    print('  (none found)')

print()
print('=== Usages of #C00000 (raw text-red value) ===')
for r in results_red[:30]:
    print(r)
if not results_red:
    print('  (none found)')

print()
print('=== Usages of #DF3131 (brand red) ===')
for r in results_DF3131[:30]:
    print(r)
if not results_DF3131:
    print('  (none found)')
