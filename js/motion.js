/* ============================================================
   VOAD — Motion Layer
   Lenis smooth scroll · Custom cursor · GSAP animations
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. LENIS SMOOTH SCROLLING ───────────────────────── */
  var lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothTouch: false,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  } else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ── WAIT FOR LOADER TO HIDE ─────────────────────────── */
  function onLoaderDone(cb) {
    var loader = document.querySelector('.loader');
    if (!loader || loader.classList.contains('hidden')) return cb();
    var obs = new MutationObserver(function () {
      if (loader.classList.contains('hidden')) { obs.disconnect(); cb(); }
    });
    obs.observe(loader, { attributes: true, attributeFilter: ['class'] });
  }

  /* ── 2. CUSTOM CURSOR ────────────────────────────────── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.body.classList.add('has-vcursor');

    var ring = document.createElement('div');
    ring.className = 'vcursor-ring';
    var dot = document.createElement('div');
    dot.className = 'vcursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    var mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.transform = 'translate(' + (rx - 20) + 'px,' + (ry - 20) + 'px)';
      dot.style.transform  = 'translate(' + (mx - 3)  + 'px,' + (my - 3)  + 'px)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .pcard, .svc-item, .filter-btn, .testi-card')) {
        ring.classList.add('expanded');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .pcard, .svc-item, .filter-btn, .testi-card')) {
        ring.classList.remove('expanded');
      }
    });
  }

  /* ── 3. HERO PARALLAX (scroll + zoom via GSAP) ───────── */
  function initHeroParallax() {
    var heroBg = document.querySelector('.hero-bg');
    if (!heroBg || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    heroBg.style.animation = 'none'; // hand off from CSS to GSAP
    gsap.fromTo(heroBg, { scale: 1.1 }, { scale: 1.0, duration: 10, ease: 'power1.out' });
    gsap.to(heroBg, {
      yPercent: 32,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ── 4. HERO MOUSE DEPTH ─────────────────────────────── */
  function initHeroMouse() {
    var heroContent = document.querySelector('.hero-content');
    if (!heroContent || window.matchMedia('(pointer: coarse)').matches) return;

    var ticking = false;
    document.addEventListener('mousemove', function (e) {
      if (ticking || window.scrollY > window.innerHeight * 0.5) return;
      ticking = true;
      requestAnimationFrame(function () {
        var x = (e.clientX / window.innerWidth  - 0.5) * -16;
        var y = (e.clientY / window.innerHeight - 0.5) * -10;
        heroContent.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── 5. HERO TEXT LINE REVEAL ────────────────────────── */
  function initHeroText() {
    var h1 = document.querySelector('.hero-content h1');
    if (!h1 || typeof gsap === 'undefined') return;

    var lines = h1.innerHTML.split(/<br\s*\/?>/i);
    h1.innerHTML = lines.map(function (l) {
      return '<span class="vhero-line"><span class="vhero-inner">' + l + '</span></span>';
    }).join('');

    var eyebrow = document.querySelector('.hero-eyebrow');
    var sub     = document.querySelector('.hero-sub');
    var cta     = document.querySelector('.hero-cta');
    var hint    = document.querySelector('.scroll-hint');

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.vhero-inner', { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.1, stagger: 0.16 }, 0);
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.1);
    if (sub)     tl.fromTo(sub,     { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5);
    if (cta)     tl.fromTo(cta,     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.7);
    if (hint)    tl.fromTo(hint,    { opacity: 0 },        { opacity: 1, duration: 0.6 },        0.9);
  }

  /* ── 6. SCROLL REVEAL UPGRADE (GSAP) ─────────────────── */
  function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('.reveal').forEach(function (el) {
      var delay = el.classList.contains('delay-3') ? 0.36
                : el.classList.contains('delay-2') ? 0.24
                : el.classList.contains('delay-1') ? 0.12
                : 0;

      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.9, delay: delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onStart: function () { el.classList.add('visible'); },
        }
      );
    });
  }

  /* ── 7. COUNTER ANIMATION ────────────────────────────── */
  function initCounters() {
    var stats = document.querySelectorAll('.stat-num');
    if (!stats.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el  = entry.target;
        var raw = el.textContent.trim();
        var num = parseInt(raw.replace(/\D/g, ''), 10);
        var sfx = raw.replace(/\d/g, '');
        if (isNaN(num)) return;
        var t0 = performance.now(), dur = 1800;
        (function step(now) {
          var p = Math.min((now - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(e * num) + sfx;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.5 });

    stats.forEach(function (el) { io.observe(el); });
  }

  /* ── 8. MOUSE GLOW IN DARK SECTIONS ─────────────────── */
  function initGlow() {
    document.querySelectorAll('.section-dark').forEach(function (s) {
      s.addEventListener('mousemove', function (e) {
        var r = s.getBoundingClientRect();
        s.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        s.style.setProperty('--gy', (e.clientY - r.top)  + 'px');
        s.classList.add('glow-on');
      }, { passive: true });
      s.addEventListener('mouseleave', function () { s.classList.remove('glow-on'); });
    });
  }

  /* ── 9. MAGNETIC BUTTONS ─────────────────────────────── */
  function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.hero-cta, .contact-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width  / 2) * 0.28;
        var y = (e.clientY - r.top  - r.height / 2) * 0.32;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform .5s cubic-bezier(.25,.8,.25,1)';
        btn.style.transform  = '';
        setTimeout(function () { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ── 10. SERVICE ITEM 3D TILT ────────────────────────── */
  function initTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.svc-item').forEach(function (el) {
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x =  ((e.clientX - r.left) / r.width  - 0.5) * 9;
        var y = -((e.clientY - r.top)  / r.height - 0.5) * 9;
        el.style.transform = 'perspective(900px) rotateY(' + x + 'deg) rotateX(' + y + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .5s ease';
        el.style.transform  = '';
        setTimeout(function () { el.style.transition = ''; }, 500);
      });
    });
  }

  /* ── 11. PAGE-HERO PARALLAX (inner pages) ────────────── */
  function initPageHeroParallax() {
    var bg = document.querySelector('.page-hero-bg');
    if (!bg || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    bg.style.animation = 'none';
    gsap.fromTo(bg, { scale: 1.06 }, { scale: 1.0, duration: 8, ease: 'power1.out' });
    gsap.to(bg, {
      yPercent: 28,
      ease: 'none',
      scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ── INIT ────────────────────────────────────────────── */
  function init() {
    initCursor();
    initHeroParallax();
    initHeroMouse();
    initPageHeroParallax();
    initCounters();
    initGlow();
    initMagnetic();
    initTilt();
    initScrollReveal();
    onLoaderDone(initHeroText);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
