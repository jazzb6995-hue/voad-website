/* ============================================================
   VOAD — render.js
   Handles: data fetching, project cards, filter, detail page,
            contact form submission.
   ============================================================ */

const CATEGORY_LABELS = {
  'residential':         'Residential Architecture',
  'interior':            'Interior Design',
  'commercial':          'Commercial & Office Design',
  'heritage':            'Heritage Designs',
  'renovation':          'Renovation & Remodeling',
  'turnkey':             'Turnkey Solutions',
  'heritage-commercial': 'Heritage Designs',
  'restoration':         'Heritage Designs',
  'remodeling':          'Renovation & Remodeling',
  'remodelling':         'Renovation & Remodeling'
};

/* ── DATA ──────────────────────────────────────────────────── */

function normalizeProjects(arr) {
  return arr.map(p => {
    if (!Array.isArray(p.gallery)) {
      p.gallery = [p.gallery1, p.gallery2, p.gallery3, p.gallery4].filter(Boolean);
    }
    p.featured = (p.featured === true || String(p.featured).toLowerCase() === 'true' || String(p.featured).toLowerCase() === 'yes');
    return p;
  });
}

function getLocalProjects() {
  return normalizeProjects(PROJECTS.map(p => ({ ...p })));
}

async function fetchFromServer() {
  try {
    const res  = await fetch('/api/projects');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (Array.isArray(data) && data.length) return normalizeProjects(data);
  } catch (e) {
    /* Server not available — use local data silently */
  }
  return null;
}

/* ── CARD HTML ─────────────────────────────────────────────── */

function cardHTML(project) {
  const catLabel = CATEGORY_LABELS[project.category] || project.category;
  return `
    <a href="project.html?id=${project.id}"
       class="proj-card"
       data-category="${project.category}">
      <div class="proj-card-img-wrap">
        <img class="proj-card-img"
             src="${project.cover}"
             alt="${project.title}"
             loading="lazy" />
        <span class="proj-card-badge">${catLabel}</span>
      </div>
      <div class="proj-card-body">
        <h3 class="proj-card-title">${project.title}</h3>
        <p class="proj-card-meta">${project.year}&nbsp;&nbsp;·&nbsp;&nbsp;${project.location}</p>
      </div>
    </a>`;
}

/* ── REVEAL HELPER ─────────────────────────────────────────── */

function revealCards(container) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  container.querySelectorAll('.proj-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 0.09}s`;
    io.observe(el);
  });
}

/* ── HOME PAGE ─────────────────────────────────────────────── */

function initHome() {
  const track    = document.getElementById('featured-projects');
  if (!track) return;
  const viewport = track.parentElement;
  const prevBtn  = document.querySelector('.sl-prev');
  const nextBtn  = document.querySelector('.sl-next');

  function renderFeatured(projects) {
    const featured = projects.filter(p => p.featured);
    const display  = featured.length ? featured : projects.slice(0, 6);
    track.innerHTML = display.map(cardHTML).join('');
    revealCards(track);
    setTimeout(updateArrows, 100);
  }

  function updateArrows() {
    if (!prevBtn || !nextBtn || !viewport) return;
    prevBtn.disabled = viewport.scrollLeft <= 2;
    nextBtn.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 5;
  }

  function slideBy(dir) {
    const card = track.querySelector('.proj-card');
    const amt  = card ? card.offsetWidth + 24 : 400;
    viewport.scrollBy({ left: dir * amt, behavior: 'smooth' });
    setTimeout(updateArrows, 450);
  }

  prevBtn?.addEventListener('click', () => slideBy(-1));
  nextBtn?.addEventListener('click', () => slideBy(1));
  viewport?.addEventListener('scroll', updateArrows, { passive: true });

  renderFeatured(getLocalProjects());
  fetchFromServer().then(live => { if (live) renderFeatured(live); });
}

/* ── FILTER ALIASES ────────────────────────────────────────── */
/* Maps a filter-button value to all category slugs it should match */
const FILTER_ALIASES = {
  'heritage': ['heritage', 'heritage-commercial', 'restoration'],
  'renovation': ['renovation', 'remodeling', 'remodelling']
};

function categoryMatchesFilter(category, filter) {
  if (filter === 'all') return true;
  const group = FILTER_ALIASES[filter];
  return group ? group.includes(category) : category === filter;
}

/* ── PORTFOLIO PAGE ────────────────────────────────────────── */

function attachFilter(container, filterBtns) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      container.querySelectorAll('.proj-card').forEach(card => {
        const match = categoryMatchesFilter(card.dataset.category, filter);
        if (match) {
          card.style.display = 'block';
          requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

async function initPortfolio() {
  const container  = document.getElementById('all-projects');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!container) return;

  function renderAll(projects) {
    container.innerHTML = projects.map(cardHTML).join('');
    container.querySelectorAll('.proj-card').forEach(el => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    attachFilter(container, filterBtns);
  }

  const live = await fetchFromServer();
  renderAll(live || getLocalProjects());
}

/* ── PROJECT DETAIL PAGE ───────────────────────────────────── */

function buildGalleryMarkup(project) {
  const imgs = project.gallery || [];
  if (!imgs.length) return '';

  return `
    <section class="section section-white proj-gallery-section">
      <p class="section-label proj-gallery-label">Photography</p>
      <div class="proj-gallery-grid">
        ${imgs.map((src, i) => `
          <div class="proj-gallery-item">
            <img src="${src}" alt="${project.title} — view ${i + 1}" loading="lazy" />
          </div>`).join('')}
      </div>
    </section>`;
}

async function initProject() {
  const root = document.getElementById('project-root');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id');

  let projects = getLocalProjects();
  let project  = projects.find(p => p.id === id);

  if (!project) {
    const live = await fetchFromServer();
    if (live) {
      projects = live;
      project  = live.find(p => p.id === id);
    }
  }

  if (!project) {
    root.innerHTML = `
      <section class="section section-bg" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;">
        <div>
          <p class="section-label">404</p>
          <h2 class="section-heading">Project not found</h2>
          <a href="portfolio.html" class="about-cta" style="margin-top:2rem;display:inline-flex;">← Back to Portfolio</a>
        </div>
      </section>`;
    return;
  }

  document.title = `${project.title} — VOAD Architecture & Interiors`;

  const idx      = projects.indexOf(project);
  const prev     = projects[(idx - 1 + projects.length) % projects.length];
  const next     = projects[(idx + 1) % projects.length];
  const catLabel = CATEGORY_LABELS[project.category] || project.category;

  const paragraphs = (project.longDesc || project.shortDesc || '')
    .split('\n\n')
    .filter(Boolean)
    .map(p => `<p class="proj-desc-para">${p.trim()}</p>`)
    .join('');

  root.innerHTML = `

    <section class="proj-hero">
      <div class="proj-hero-bg" style="background-image:url('${project.cover}');"></div>
      <div class="proj-hero-overlay"></div>
      <div class="proj-hero-content">
        <a href="portfolio.html" class="proj-back">← All Projects</a>
        <p class="proj-hero-cat">${catLabel}</p>
        <h1>${project.title}</h1>
        <p class="proj-hero-tagline">${project.tagline}</p>
      </div>
    </section>

    <div class="proj-info-bar">
      <div class="proj-info-item">
        <span class="proj-info-label">Year</span>
        <span class="proj-info-value">${project.year}</span>
      </div>
      <div class="proj-info-item">
        <span class="proj-info-label">Location</span>
        <span class="proj-info-value">${project.location}</span>
      </div>
      ${project.area ? `
      <div class="proj-info-item">
        <span class="proj-info-label">Area</span>
        <span class="proj-info-value">${project.area}</span>
      </div>` : ''}
      <div class="proj-info-item">
        <span class="proj-info-label">Scope</span>
        <span class="proj-info-value">${project.scope}</span>
      </div>
    </div>

    <section class="section section-bg proj-desc-section">
      <div class="proj-desc-inner">
        <p class="section-label">Project Notes</p>
        <div class="proj-desc-text">${paragraphs}</div>
      </div>
    </section>

    ${buildGalleryMarkup(project)}

    <nav class="proj-nav-bar" aria-label="Project navigation">
      <a href="project.html?id=${prev.id}" class="proj-nav-link">
        <span class="proj-nav-dir">← Previous</span>
        <span class="proj-nav-name">${prev.title}</span>
      </a>
      <a href="portfolio.html" class="proj-nav-all">All Projects</a>
      <a href="project.html?id=${next.id}" class="proj-nav-link proj-nav-link--right">
        <span class="proj-nav-dir">Next →</span>
        <span class="proj-nav-name">${next.title}</span>
      </a>
    </nav>`;

  /* Wire gallery lightbox */
  const galleryImgs = Array.from(root.querySelectorAll('.proj-gallery-item img'));
  if (galleryImgs.length) initLightbox(galleryImgs);
}

/* ── CONTACT FORM ──────────────────────────────────────────── */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn    = form.querySelector('[type="submit"]');
    const status = document.getElementById('form-status');

    const payload = {
      name:        form.querySelector('#name')?.value.trim()     || '',
      email:       form.querySelector('#email')?.value.trim()    || '',
      phone:       form.querySelector('#phone')?.value.trim()    || '',
      projectType: form.querySelector('#project-type')?.value    || '',
      location:    form.querySelector('#location')?.value.trim() || '',
      message:     form.querySelector('#message')?.value.trim()  || ''
    };

    /* Client-side validation — stop before any fetch */
    if (!payload.name || !payload.email || !payload.message) {
      if (status) {
        status.textContent = 'Please fill in your name, email address, and message.';
        status.style.color = 'var(--accent)';
        status.style.display = 'block';
      }
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled    = true;
    if (status) status.style.display = 'none';

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.ok) {
        form.reset();
        btn.textContent = 'Message Sent ✓';
        if (status) {
          status.textContent = "Thank you — we’ll be in touch within 24 hours.";
          status.style.color = '';
          status.style.display = 'block';
        }
      } else {
        btn.textContent = 'Send Message →';
        btn.disabled    = false;
        if (status) {
          status.textContent = data.error || 'Something went wrong. Please try again.';
          status.style.color = 'var(--accent)';
          status.style.display = 'block';
        }
      }
    } catch (err) {
      btn.textContent = 'Send Message →';
      btn.disabled    = false;
      if (status) {
        status.textContent = 'Something went wrong. Please try again or contact us directly.';
        status.style.color = 'var(--accent)';
        status.style.display = 'block';
      }
    }
  });
}

/* ── IMAGE LIGHTBOX ────────────────────────────────────────── */

function initLightbox(imgs) {
  if (!imgs.length) return;

  /* Build overlay once */
  const lb = document.createElement('div');
  lb.id = 'proj-lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <button class="lb-close" aria-label="Close">&times;</button>
    <button class="lb-arrow lb-prev" aria-label="Previous">&#8592;</button>
    <button class="lb-arrow lb-next" aria-label="Next">&#8594;</button>
    <div class="lb-img-wrap"><img class="lb-img" src="" alt="" /></div>
    <p class="lb-counter"></p>`;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lb-img');
  const lbCounter = lb.querySelector('.lb-counter');
  const lbClose   = lb.querySelector('.lb-close');
  const lbPrev    = lb.querySelector('.lb-prev');
  const lbNext    = lb.querySelector('.lb-next');
  let   current   = 0;

  function show(i) {
    current = i;
    lbImg.src = imgs[i].src;
    lbImg.alt = imgs[i].alt;
    lbCounter.textContent = `${i + 1} / ${imgs.length}`;
    lbPrev.style.opacity = i === 0 ? '.25' : '1';
    lbNext.style.opacity = i === imgs.length - 1 ? '.25' : '1';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', close);
  lb.querySelector('.lb-backdrop').addEventListener('click', close);
  lbPrev.addEventListener('click', () => { if (current > 0) show(current - 1); });
  lbNext.addEventListener('click', () => { if (current < imgs.length - 1) show(current + 1); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   { if (current > 0) show(current - 1); }
    if (e.key === 'ArrowRight')  { if (current < imgs.length - 1) show(current + 1); }
  });

  /* Wire gallery thumbnails */
  imgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => show(i));
  });
}
