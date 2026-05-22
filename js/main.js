/* ============================================================
   js/main.js — Shared JavaScript for all pages
   NB Nexa | AI Automation Agency
   ============================================================ */

'use strict';

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── HERO VIDEO: respect reduced motion ───────────────────────
(function respectReducedMotionHeroVideo() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.hero-video-wrap video').forEach((v) => {
    try {
      v.pause();
      v.removeAttribute('autoplay');
      v.style.opacity = '0.25';
    } catch (e) { /* ignore */ }
  });
})();

// ── HEADING & SUBHEADING SCROLL ANIMATIONS ───────────────────
(function initHeadingTextAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function shouldSkipHeading(el) {
    if (el.closest('nav')) return true;
    if (el.classList.contains('reveal')) return true;
    if (el.closest('.reveal')) return true;
    if (el.closest('.anim-1, .anim-2, .anim-3, .anim-4, .anim-5')) return true;
    return false;
  }

  function shouldSkipSub(el) {
    if (el.closest('nav')) return true;
    if (el.closest('.reveal')) return true;
    if (el.closest('.anim-1, .anim-2, .anim-3, .anim-4, .anim-5')) return true;
    return false;
  }

  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        headingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    if (shouldSkipHeading(el)) return;
    const n = parseInt(el.tagName.slice(1), 10);
    if (!Number.isNaN(n)) {
      el.style.setProperty('--heading-anim-delay', `${Math.min(Math.max(n - 1, 0), 4) * 55}ms`);
    }
    el.classList.add('heading-anim');
    headingObserver.observe(el);
  });

  document.querySelectorAll('main h1 + p, main h2 + p, main h3 + p').forEach((el) => {
    if (shouldSkipSub(el)) return;
    el.classList.add('heading-sub-anim');
    headingObserver.observe(el);
  });
})();

// ── NAV SCROLL BEHAVIOUR ─────────────────────────────────────
const topnav = document.querySelector('.topnav');
if (topnav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      topnav.style.background = 'rgba(6, 14, 32, 0.95)';
    } else {
      topnav.style.background = 'rgba(15, 23, 42, 0.7)';
    }
  }, { passive: true });
}

// ── MOBILE NAV TOGGLE ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
      return;
    }
    const id = href.slice(1);
    if (!id) {
      e.preventDefault();
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── ANIMATED COUNTERS ─────────────────────────────────────────
function animateCounter(el, target, duration = 1500, suffix = '') {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + increment, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      const target  = Number(entry.target.dataset.target);
      const suffix  = entry.target.dataset.suffix || '';
      const dur     = Number(entry.target.dataset.duration) || 1500;
      animateCounter(entry.target, target, dur, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── TOOLTIPS ─────────────────────────────────────────────────
document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.style.position = 'relative';
  el.addEventListener('mouseenter', () => {
    const tip = document.createElement('div');
    tip.className = 'tooltip-box';
    tip.textContent = el.dataset.tooltip;
    tip.style.cssText = `
      position:absolute; bottom:calc(100% + 8px); left:50%;
      transform:translateX(-50%);
      background:#0d1117; color:#94a3b8;
      padding:5px 10px; border-radius:6px; font-size:0.75rem;
      border:1px solid #1f2937; white-space:nowrap; z-index:100;
      pointer-events:none;
    `;
    el.appendChild(tip);
  });
  el.addEventListener('mouseleave', () => {
    const tip = el.querySelector('.tooltip-box');
    if (tip) tip.remove();
  });
});

// ── FLASH MESSAGE AUTO-DISMISS ───────────────────────────────
document.querySelectorAll('.flash-msg').forEach(msg => {
  setTimeout(() => {
    msg.style.opacity = '0';
    msg.style.transform = 'translateY(-10px)';
    msg.style.transition = 'all 0.4s ease';
    setTimeout(() => msg.remove(), 400);
  }, 4000);
});

// ── COPY TO CLIPBOARD ────────────────────────────────────────
window.copyToClipboard = function(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.style.color = '#34d399';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.color = '';
      }, 2000);
    }
  });
};

// ── ACTIVE NAV LINK ──────────────────────────────────────────
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || href.endsWith(path))) {
      a.classList.add('active');
    }
  });
})();

// ── SITE FOOTER SOCIAL LINKS (js/social-links.js + Admin → Settings) ─
(function initSiteSocialFooter() {
  var STORAGE_KEY = 'nbnexa-social-links-v1';
  window.NBNEXA_SOCIAL_STORAGE_KEY = STORAGE_KEY;

  function normalizeUrl(raw) {
    if (!raw || typeof raw !== 'string') return '';
    var t = raw.trim();
    if (!t) return '';
    if (/^javascript:/i.test(t)) return '';
    if (/^https?:\/\//i.test(t)) return t;
    if (/^mailto:/i.test(t)) return t;
    if (t.indexOf('//') === 0) return 'https:' + t;
    return 'https://' + t.replace(/^\/+/, '');
  }

  function readFileLinks() {
    var w = window.NBNEXA_SOCIAL_LINKS;
    if (!w || typeof w !== 'object') {
      return { facebook: '', instagram: '', linkedin: '', youtube: '' };
    }
    return {
      facebook: String(w.facebook != null ? w.facebook : '').trim(),
      instagram: String(w.instagram != null ? w.instagram : '').trim(),
      linkedin: String(w.linkedin != null ? w.linkedin : '').trim(),
      youtube: String(w.youtube != null ? w.youtube : '').trim()
    };
  }

  function readLinks() {
    var file = readFileLinks();
    var stored = {};
    var raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      raw = null;
    }
    try {
      stored = JSON.parse(raw || '{}');
    } catch (e2) {
      stored = {};
    }
    function pick(key) {
      var s = stored[key];
      var st = s != null ? String(s).trim() : '';
      if (st) return normalizeUrl(st);
      return normalizeUrl(file[key] || '');
    }
    return {
      facebook: pick('facebook'),
      instagram: pick('instagram'),
      linkedin: pick('linkedin'),
      youtube: pick('youtube')
    };
  }

  var ICON_SVG = {
    facebook: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
  };

  var ORDER = [
    ['facebook', 'Facebook'],
    ['instagram', 'Instagram'],
    ['linkedin', 'LinkedIn'],
    ['youtube', 'YouTube']
  ];

  function renderSocialFooter() {
    var links = readLinks();
    document.querySelectorAll('[data-site-social-footer]').forEach(function (container) {
      container.innerHTML = '';
      ORDER.forEach(function (pair) {
        var key = pair[0];
        var label = pair[1];
        var url = links[key];
        if (!url) return;
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', label);
        a.className = 'site-social-icon';
        a.innerHTML = ICON_SVG[key];
        container.appendChild(a);
      });
      var wrap = container.closest('[data-site-social-footer-wrap]');
      if (wrap) {
        wrap.classList.toggle('hidden', container.children.length === 0);
      }
    });
  }

  renderSocialFooter();
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) renderSocialFooter();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') renderSocialFooter();
  });
  window.NBNEXA_renderSocialFooter = renderSocialFooter;
})();

// ── LAZY LOAD IMAGES ─────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ── LOG ───────────────────────────────────────────────────────
console.log('%c NB Nexa %c AI Automation Agency', 
  'background:#00dbe9;color:#00363a;font-weight:bold;padding:4px 8px;border-radius:4px',
  'color:#00dbe9;font-weight:bold'
);
