// ── NAVBAR scroll ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.remove('transparent');
        navbar.classList.add('solid');
      } else {
        navbar.classList.add('transparent');
        navbar.classList.remove('solid');
      }
    });

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

    // ── COUNTER ANIMATION ──
    function animateCounter(el) {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.count === '500' ? '+' : '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 25);
    }
    const counters = document.querySelectorAll('[data-count]');
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));

    // ── SCROLL REVEAL ──
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(r => revealObs.observe(r));

    // ── ACTIVE NAV on scroll ──
    const sections = document.querySelectorAll('section[id], div[id="home"]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

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

    // ── SPOTLIGHT EFFECT on topper cards ──
    document.querySelectorAll('.topper-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });

    // ── FORM VALIDATION ──
    document.getElementById('contactForm').addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      function setError(id, show) {
        const g = document.getElementById('grp-' + id);
        if (show) { g.classList.add('has-error'); valid = false; }
        else g.classList.remove('has-error');
      }
      const name = document.getElementById('f-name');
      const parent = document.getElementById('f-parent');
      const phone = document.getElementById('f-phone');
      const course = document.getElementById('f-course');
      setError('name', name.value.trim().length < 2);
      setError('parent', parent.value.trim().length < 2);
      setError('phone', !/^\+?[0-9\s\-]{10,13}$/.test(phone.value.trim()));
      setError('course', course.value === '');
      if (valid) {
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }
    });

    // ── BOTTOM NAV ──
    function setBnActive(el) {
      document.querySelectorAll('.bn-item').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
    }

    // ── CUSTOM CURSOR & CANVAS INTERACTIVE BACKGROUND ──
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const canvas = document.getElementById('bg-canvas');
    let ctx = null;
    let isTouchDevice = false;

    // Check if device supports fine hover
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      isTouchDevice = true;
    }

    let mouse = { x: -1000, y: -1000, r: 100 }; // r is repelling radius
    let cursorOutlinePos = { x: -1000, y: -1000 };

    if (!isTouchDevice && cursorDot && cursorOutline && canvas) {
      ctx = canvas.getContext('2d');
      let w, h;
      let particles = [];

      function initCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        particles = [];
        
        // Create polka dots on a rough grid but with slight offsets to look organic but clean
        const gap = 40;
        for (let x = gap / 2; x < w; x += gap) {
          for (let y = gap / 2; y < h; y += gap) {
            particles.push({
              ox: x, // original x
              oy: y, // original y
              x: x,  // current x
              y: y,  // current y
              color: `rgba(232, 89, 12, 0.08)`, // matching the translucent vibe
              radius: Math.random() > 0.5 ? 1.5 : 2
            });
          }
        }
      }

      window.addEventListener('resize', initCanvas);
      initCanvas();

      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Update direct dot immediately
        cursorDot.style.transform = `translate(calc(${mouse.x}px - 50%), calc(${mouse.y}px - 50%))`;
      });

      // Handle interactive elements hover effect for custom cursor
      document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorDot.style.transform = `translate(calc(${mouse.x}px - 50%), calc(${mouse.y}px - 50%)) scale(1.5)`;
          cursorOutline.style.transform = `translate(calc(${cursorOutlinePos.x}px - 50%), calc(${cursorOutlinePos.y}px - 50%)) scale(1.5)`;
          if(cursorOutline) cursorOutline.style.backgroundColor = 'rgba(232, 89, 12, 0.25)';
        });
        el.addEventListener('mouseleave', () => {
          cursorDot.style.transform = `translate(calc(${mouse.x}px - 50%), calc(${mouse.y}px - 50%)) scale(1)`;
          cursorOutline.style.transform = `translate(calc(${cursorOutlinePos.x}px - 50%), calc(${cursorOutlinePos.y}px - 50%)) scale(1)`;
          if(cursorOutline) cursorOutline.style.backgroundColor = 'rgba(232, 89, 12, 0.15)';
        });
      });

      function animate() {
        // Linearly interpolate the outline for a smooth trailing effect
        cursorOutlinePos.x += (mouse.x - cursorOutlinePos.x) * 0.15;
        cursorOutlinePos.y += (mouse.y - cursorOutlinePos.y) * 0.15;
        cursorOutline.style.transform = `translate(calc(${cursorOutlinePos.x}px - 50%), calc(${cursorOutlinePos.y}px - 50%))`;

        ctx.clearRect(0, 0, w, h);

        particles.forEach(p => {
          // Calculate distance from mouse
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Force logic: push particles away from mouse
          if (dist < mouse.r) {
            const force = (mouse.r - dist) / mouse.r;
            const dirX = dx / dist;
            const dirY = dy / dist;
            
            p.x -= dirX * force * 5; // push strength
            p.y -= dirY * force * 5;
          }

          // Return particles to original position
          p.x += (p.ox - p.x) * 0.05; // spring strength
          p.y += (p.oy - p.y) * 0.05;

          // Draw the particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        requestAnimationFrame(animate);
      }
      
      animate();
    }