/* ============================================================
   VOAD — Architecture & Interiors · main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADING SCREEN ──────────────────────────────────── */
  const loader     = document.querySelector('.loader');
  const loaderBar  = document.querySelector('.loader-bar');
  const loaderPct  = document.querySelector('.loader-pct');

  if (loader) {
    document.body.style.overflow = 'hidden';
    let pct = 0;

    const tick = setInterval(() => {
      pct += Math.random() * 18 + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(tick);
        if (loaderBar) loaderBar.style.width = '100%';
        if (loaderPct) loaderPct.textContent  = '100%';
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
        }, 400);
      } else {
        if (loaderBar) loaderBar.style.width = pct + '%';
        if (loaderPct) loaderPct.textContent  = Math.round(pct) + '%';
      }
    }, 70);
  }

  /* ── NAVIGATION ──────────────────────────────────────── */
  const nav = document.querySelector('nav');

  // Hero pages start with light (white) nav text
  if (nav) {
    const hasHero = document.querySelector('.hero');
    if (hasHero) nav.classList.add('light');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('light');
      } else {
        nav.classList.remove('scrolled');
        if (hasHero) nav.classList.add('light');
      }
    }, { passive: true });
  }

  // Mark active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── MOBILE NAV ──────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav && mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── TESTIMONIALS SLIDER ─────────────────────────────── */
  const track   = document.querySelector('.testi-track');
  const prevBtn = document.querySelector('.testi-prev');
  const nextBtn = document.querySelector('.testi-next');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    const total = cards.length;
    let idx = 0;

    function goTo(n) {
      idx = ((n % total) + total) % total;
      track.style.transform = `translateX(-${idx * 100}%)`;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(idx + 1));

    // Auto-advance every 6 s
    let autoSlide = setInterval(() => goTo(idx + 1), 6000);

    // Pause on hover
    track.closest('.testi-slider').addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.closest('.testi-slider').addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo(idx + 1), 6000);
    });

    // Touch / swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? idx + 1 : idx - 1);
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    // Fallback: show everything
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ── SMOOTH SCROLL for anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
