/* ===================================================
   IEEE SSIT — CU Chapter Website
   Main JavaScript
   =================================================== */

'use strict';

// ---------- NAVBAR SCROLL EFFECT ----------
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  updateActiveNavLink();
});

// ---------- BACK TO TOP ----------
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- HAMBURGER MENU ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ---------- SMOOTH SCROLL FOR NAV LINKS ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 76; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---------- ACTIVE NAV LINK ON SCROLL ----------
const sections = document.querySelectorAll('section[id], footer[id]');

function updateActiveNavLink() {
  let currentSection = '';
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// ---------- SCROLL REVEAL ANIMATION ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid items
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sibling, i) => {
          if (sibling === entry.target) delay = i * 80;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ---------- EVENT TABS ----------
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    // Update button states
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show correct content
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === target) {
        content.classList.add('active');

        // Re-trigger reveal for newly shown cards
        content.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => {
            revealObserver.observe(el);
          }, 50);
        });
      }
    });
  });
});

// ---------- COUNTER ANIMATION ----------
function animateCounter(el, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  const isPlus = target.toString().includes('+');
  const numericTarget = parseInt(target.toString().replace(/[^0-9]/g, ''));

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(eased * numericTarget);
    el.textContent = current.toLocaleString() + (isPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Observe stat numbers for counter animation
const statNumEls = document.querySelectorAll('.stat-num, .stat-big');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.textContent.trim();
        // Only animate if it's a number (with optional +)
        if (/^\d[\d,]*\+?$/.test(rawText)) {
          animateCounter(el, rawText);
        }
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNumEls.forEach(el => counterObserver.observe(el));

// ---------- IMPACT SLIDER ----------
(function () {
  const track = document.getElementById('slidesTrack');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  if (!track || !slides.length) return;

  let current = 0;
  let autoTimer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.index); resetAuto(); });
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  startAuto();
})();

// ---------- HERO ANIMATION DELAY ----------
document.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.animationDelay = '0.2s';
  }
});

/* =============================================================
   IMPRESSIVE ENHANCEMENTS
   ============================================================= */

// ---------- PAGE LOADER ----------
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 480);
});

// ---------- SCROLL PROGRESS ----------
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scrollProgressBar');
  if (bar) {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }
}, { passive: true });

// ---------- HERO CANVAS PARTICLE NETWORK ----------
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;
  const N = 55, D = 130;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkPt() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.8
    };
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,87,184,0.5)';
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < D) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,87,184,${(1 - d / D) * 0.2})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { resize(); pts = pts.map(mkPt); }, 200);
  });

  resize();
  pts = Array.from({ length: N }, mkPt);
  frame();
})();

// ---------- TYPEWRITER ----------
(function () {
  const el = document.getElementById('typewriterText');
  if (!el) return;
  const words = ['Technology', 'Ethics', 'Innovation', 'Impact'];
  let wi = 0, ci = words[0].length, del = false, hold = false;
  el.textContent = words[0];

  function tick() {
    if (hold) { hold = false; del = true; setTimeout(tick, 1600); return; }
    const word = words[wi];
    if (!del) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { hold = true; setTimeout(tick, 120); }
      else setTimeout(tick, 115);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 260); }
      else setTimeout(tick, 68);
    }
  }
  setTimeout(tick, 2200);
})();
