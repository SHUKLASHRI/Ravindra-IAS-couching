import re
import os

with open('ravindra-ias.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract and replace style
style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
style_match = style_pattern.search(content)
if style_match:
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(style_match.group(1).strip())
    content = style_pattern.sub('<link rel=\"stylesheet\" href=\"styles.css\" />', content, count=1)

# Extract and replace script
script_pattern = re.compile(r'<script>(.*?)</script>', re.DOTALL)
script_match = script_pattern.search(content)
if script_match:
    with open('main.js', 'w', encoding='utf-8') as f:
        f.write(script_match.group(1).strip())
    content = script_pattern.sub('<script src=\"main.js\" defer></script>', content, count=1)

with open('ravindra-ias.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Extraction complete!')
