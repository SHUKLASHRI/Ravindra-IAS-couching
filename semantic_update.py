import re

with open('ravindra-ias.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Semantic Header Wrap
html = html.replace('<!-- TICKER -->', '<header>\n  <!-- TICKER -->')
# We need to close header after the navbar and mobile menu
html = html.replace('</div>\n\n  <!-- HERO -->', '</div>\n</header>\n\n  <!-- MAIN -->\n<main>\n  <!-- HERO -->')

# 2. Main Wrap close just before FOOTER
html = html.replace('<!-- FOOTER -->', '</main>\n\n  <!-- FOOTER -->')

# 3. Add ARIA tags to hamburger
html = html.replace('<button class="hamburger" id="hamburger" aria-label="Menu">', '<button class="hamburger" id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobileMenu">')

# 4. Images lazy loading: the original code already has loading="lazy" for all the images BELOW the fold. Let's verify that. 
# It looks like the toppers images have it. The hero image does not have it.

# 5. Add ARIA to FAQ buttons
html = html.replace('<button class="faq-q" onclick="toggleFaq(this)">', '<button class="faq-q" aria-expanded="false" onclick="toggleFaq(this)">')

# We can update the Javascript to handle the aria-expanded toggling
js_update = """
    // ── HAMBURGER ──
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    function closeMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }
"""

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the hamburger logic in JS
js = re.sub(r'// ── HAMBURGER ──.*?\}', js_update.strip(), js, flags=re.DOTALL)

# Update the FAQ JS logic to toggle aria-expanded
faq_update = """
    // ── FAQ ──
    function toggleFaq(btn) {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      
      // Close all open FAQs
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      
      // Open the clicked one if it wasn't open
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    }
"""
js = re.sub(r'// ── FAQ ──.*?\}', faq_update.strip(), js, flags=re.DOTALL)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

with open('ravindra-ias.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Semantic updates applied successfully")
