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
  const container = document.getElementById('featured-projects');
  if (!container) return;

  const order = ['residential', 'interior', 'commercial', 'heritage', 'renovation', 'turnkey'];

  function renderFeatured(projects) {
    const featured = order.map(cat =>
      projects.find(p => p.category === cat && p.featured) ||
      projects.find(p => p.category === cat)
    ).filter(Boolean).slice(0, 6);
    container.innerHTML = featured.map(cardHTML).join('');
    revealCards(container);
  }

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

    btn.textContent = 'Sending…';
    btn.disabled    = true;

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const data = await res.json();

      form.reset();
      btn.textContent = 'Message Sent ✓';

      if (status) {
        status.textContent = data.ok
          ? "Thank you — we'll be in touch within 24 hours."
          : (data.error || "Message sent.");
        status.style.display = 'block';
      }
    } catch (err) {
      btn.textContent = 'Send Message →';
      btn.disabled    = false;
      if (status) {
        status.textContent = 'Something went wrong. Please try again or email us directly.';
        status.style.display = 'block';
      }
    }

    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.disabled    = false;
    }, 10000);
  });
}
