/* ═══════════════════════════════════════════════════════════════════════
   IRON TRIBE — script.js
   Scroll animations · Navbar · Mobile menu · Cursor · Parallax
   ═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initCursor();
  initNumberCounters();
  initPlanHover();
});


/* ══════════════════════ 1. NAVBAR SCROLL EFFECT ══════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}


/* ══════════════════════ 2. MOBILE MENU ══════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Lock body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}


/* ══════════════════════ 3. SCROLL REVEAL ════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if (!revealEls.length) return;

  // Use IntersectionObserver for performance
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ══════════════════════ 4. ACTIVE NAV LINK ══════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ══════════════════════ 5. CUSTOM CURSOR (DESKTOP) ══════════════════ */
function initCursor() {
  // Only on desktop (pointer: fine)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.id = 'iron-cursor';
  cursor.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 10px; height: 10px;
    background: #f5c400;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: width 0.25s, height 0.25s, opacity 0.25s, background 0.25s;
    mix-blend-mode: difference;
    will-change: transform;
  `;

  const follower = document.createElement('div');
  follower.id = 'iron-cursor-follower';
  follower.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 36px; height: 36px;
    border: 1.5px solid rgba(245,196,0,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, border-color 0.3s;
    will-change: transform;
  `;

  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
  });

  // Animate follower with lerp
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.transform = `translate(calc(-50% + ${followerX}px), calc(-50% + ${followerY}px))`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const interactiveEls = document.querySelectorAll(
    'a, button, .plan-card, .testi-card, .facility-card, .gallery-item'
  );

  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '16px';
      cursor.style.height  = '16px';
      follower.style.width  = '56px';
      follower.style.height = '56px';
      follower.style.borderColor = 'rgba(245,196,0,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '10px';
      cursor.style.height  = '10px';
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(245,196,0,0.5)';
    });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}


/* ══════════════════════ 6. NUMBER COUNTER ANIMATION ════════════════ */
function initNumberCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const parseValue = (text) => {
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.,\s]/g, '');
    return { num, suffix };
  };

  const formatNum = (value, originalSuffix) => {
    if (originalSuffix.includes('/')) return value + originalSuffix;
    if (value >= 1000) return Math.round(value).toLocaleString() + originalSuffix;
    return value % 1 === 0 ? Math.round(value) + originalSuffix : value.toFixed(1) + originalSuffix;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const el = entry.target;
        const original = el.textContent;
        const { num, suffix } = parseValue(original);

        // Special case for 24/7
        if (original === '24/7') return;

        const duration = 1800;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed  = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = num * eased;
          el.textContent = formatNum(current, suffix);
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(stat => observer.observe(stat));
}


/* ══════════════════════ 7. PLAN CARD TILT ═══════════════════════════ */
function initPlanHover() {
  const cards = document.querySelectorAll('.plan-card, .testi-card');
  if (!cards.length || !window.matchMedia('(pointer: fine)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 6;
      const tiltY  = ((cx - x) / cx) * 6;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ══════════════════════ 8. SMOOTH SECTION TRANSITIONS ══════════════ */
// Subtle page-load stagger for hero elements
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-content .reveal-up').forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 130);
  });
});


/* ══════════════════════ 9. NAVBAR LINK CSS ACTIVE STATE ════════════ */
// Inject active nav style
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: #fff !important;
  }
  .nav-link.active::after {
    left: 14px !important;
    right: 14px !important;
    background: #f5c400 !important;
  }
`;
document.head.appendChild(style);
