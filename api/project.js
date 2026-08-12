const { Redis } = require('@upstash/redis');
const fs   = require('fs');
const path = require('path');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const KEY = 'voad:projects';

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

async function getProjects() {
  try {
    const cached = await redis.get(KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) return normalizeProjects(cached);
  } catch (_) { /* fall through to file seed */ }
  const file = path.join(process.cwd(), 'data', 'projects.json');
  return normalizeProjects(JSON.parse(fs.readFileSync(file, 'utf8')));
}

function normalizeProjects(arr) {
  return arr.map(p => {
    if (!Array.isArray(p.gallery)) {
      const raw = p.gallery;
      if (typeof raw === 'string' && raw.trim().startsWith('[')) {
        try { p.gallery = JSON.parse(raw.replace(/'/g, '"')); } catch (_) { p.gallery = []; }
      } else {
        p.gallery = [p.gallery1, p.gallery2, p.gallery3, p.gallery4].filter(Boolean);
      }
    }
    p.featured = (p.featured === true || String(p.featured).toLowerCase() === 'true');
    return p;
  });
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildProjectHTML(project, prev, next) {
  const catLabel = CATEGORY_LABELS[project.category] || project.category;
  const paragraphs = (project.longDesc || project.shortDesc || '')
    .split('\n\n').filter(Boolean)
    .map(p => `<p class="proj-desc-para">${esc(p.trim())}</p>`)
    .join('');

  const galleryHTML = (project.gallery || []).length
    ? `<section class="section section-white proj-gallery-section">
        <p class="section-label proj-gallery-label">Photography</p>
        <div class="proj-gallery-grid">
          ${(project.gallery).map((src, i) =>
            `<div class="proj-gallery-item"><img src="${esc(src)}" alt="${esc(project.title)}, view ${i + 1}" loading="lazy" /></div>`
          ).join('')}
        </div>
      </section>`
    : '';

  return `
    <section class="proj-hero">
      <div class="proj-hero-bg" style="background-image:url('${esc(project.cover)}');"></div>
      <div class="proj-hero-overlay"></div>
      <div class="proj-hero-content">
        <a href="/portfolio" class="proj-back">&larr; All Projects</a>
        <p class="proj-hero-cat">${esc(catLabel)}</p>
        <h1>${esc(project.title)}</h1>
        <p class="proj-hero-tagline">${esc(project.tagline)}</p>
      </div>
    </section>
    <div class="proj-info-bar">
      <div class="proj-info-item">
        <span class="proj-info-label">Year</span>
        <span class="proj-info-value">${esc(project.year)}</span>
      </div>
      <div class="proj-info-item">
        <span class="proj-info-label">Location</span>
        <span class="proj-info-value">${esc(project.location)}</span>
      </div>
      ${project.area ? `<div class="proj-info-item"><span class="proj-info-label">Area</span><span class="proj-info-value">${esc(project.area)}</span></div>` : ''}
      <div class="proj-info-item">
        <span class="proj-info-label">Scope</span>
        <span class="proj-info-value">${esc(project.scope)}</span>
      </div>
    </div>
    <section class="section section-bg proj-desc-section">
      <div class="proj-desc-inner">
        <p class="section-label">Project Notes</p>
        <div class="proj-desc-text">${paragraphs}</div>
      </div>
    </section>
    ${galleryHTML}
    <nav class="proj-nav-bar" aria-label="Project navigation">
      <a href="/project/${esc(prev.id)}" class="proj-nav-link">
        <span class="proj-nav-dir">&larr; Previous</span>
        <span class="proj-nav-name">${esc(prev.title)}</span>
      </a>
      <a href="/portfolio" class="proj-nav-all">All Projects</a>
      <a href="/project/${esc(next.id)}" class="proj-nav-link proj-nav-link--right">
        <span class="proj-nav-dir">Next &rarr;</span>
        <span class="proj-nav-name">${esc(next.title)}</span>
      </a>
    </nav>`;
}

function buildPage(project, prev, next) {
  const title     = esc(project.title);
  const desc      = esc((project.shortDesc || `${project.title} by VOAD Architecture & Interiors, Rajkot.`).slice(0, 160));
  const canonical = `https://www.voad.in/project/${esc(project.id)}`;
  const imageUrl  = esc(project.cover);
  const catLabel  = CATEGORY_LABELS[project.category] || project.category;

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://www.voad.in/project/${project.id}`,
        'url': `https://www.voad.in/project/${project.id}`,
        'name': `${project.title} | VOAD Architecture & Interiors, Rajkot`,
        'description': (project.shortDesc || '').slice(0, 160),
        'isPartOf': { '@id': 'https://www.voad.in/#website' },
        'publisher': { '@id': 'https://www.voad.in/#organization' },
        'inLanguage': 'en-IN',
        'primaryImageOfPage': { '@type': 'ImageObject', 'url': project.cover }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.voad.in/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Portfolio', 'item': 'https://www.voad.in/portfolio' },
          { '@type': 'ListItem', 'position': 3, 'name': project.title, 'item': `https://www.voad.in/project/${project.id}` }
        ]
      }
    ]
  });

  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | VOAD Architecture &amp; Interiors, Rajkot</title>
  <meta name="description" content="${desc}" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Ar. Vivek Bosmiya, VOAD Architecture &amp; Interiors" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/favicon.svg" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="VOAD Architecture &amp; Interiors" />
  <meta property="og:title" content="${title} | VOAD Architecture &amp; Interiors" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:alt" content="${title} by VOAD Architecture &amp; Interiors, Rajkot" />
  <meta property="og:locale" content="en_IN" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title} | VOAD Architecture &amp; Interiors" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <script type="application/ld+json">${schema}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-PN9B6JKRVW"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PN9B6JKRVW');</script>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://images.unsplash.com" crossorigin />
  <link rel="preload" as="image" fetchpriority="high" href="${imageUrl}" />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap" onload="this.rel='stylesheet'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap" rel="stylesheet" /></noscript>
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="stylesheet" href="/css/projects.css" />
</head>
<body>
  <div class="loader">
    <span class="loader-logo">V O A D</span>
    <span class="loader-logo-sub">Architecture &amp; Interiors</span>
    <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
    <span class="loader-pct">0%</span>
  </div>
  <div class="mobile-nav" role="dialog" aria-modal="true" aria-label="Navigation">
    <button class="mobile-close" aria-label="Close menu">&times;</button>
    <a href="/">Home</a>
    <a href="/portfolio" class="active">Portfolio</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/blog">Blog</a>
  </div>
  <nav aria-label="Main navigation">
    <a href="/" class="nav-logo" aria-label="VOAD Home">
      <span class="nav-logo-mark">V O A D</span>
      <span class="nav-logo-sub">Architecture &amp; Interiors</span>
    </a>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/portfolio" class="active">Portfolio</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
    <button class="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <main id="project-root">${buildProjectHTML(project, prev, next)}</main>
  <footer>
    <div class="footer-top">
      <div class="footer-brand">
        <span class="footer-logo-mark">V O A D</span>
        <span class="footer-logo-sub">Architecture &amp; Interiors</span>
        <p class="footer-desc">A Rajkot-based architecture and interior design studio specialising in bespoke residences, luxury interiors, heritage designs, commercial spaces, and turnkey project delivery across Gujarat and India.</p>
        <div class="footer-social">
          <a href="https://www.instagram.com/architect.vivekbosmiya" target="_blank" rel="noopener" class="footer-social-link">Instagram</a>
          <a href="https://www.behance.net/vivekbosmiya" target="_blank" rel="noopener" class="footer-social-link">Behance</a>
        </div>
      </div>
      <div class="footer-cols">
        <div>
          <p class="footer-col-head">Navigate</p>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-col-head">Services</p>
          <ul class="footer-links">
            <li><a href="/portfolio?filter=residential">Residential Architecture</a></li>
            <li><a href="/portfolio?filter=interior">Interior Design</a></li>
            <li><a href="/portfolio?filter=commercial">Commercial Design</a></li>
            <li><a href="/portfolio?filter=heritage">Heritage Designs</a></li>
            <li><a href="/portfolio?filter=renovation">Renovation</a></li>
            <li><a href="/portfolio?filter=turnkey">Turnkey Solutions</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-col-head">Contact</p>
          <div class="footer-contact">
            <span class="footer-contact-item">RK Trade Tower, A/612, 150 Feet Ring Road, Rajkot, Gujarat 360006</span>
            <a href="tel:+918160332950" class="footer-contact-item">+91 81603 32950</a>
            <a href="/contact" class="footer-contact-item">Get In Touch &rarr;</a>
            <a href="https://www.instagram.com/architect.vivekbosmiya" target="_blank" rel="noopener" class="footer-contact-item">@architect.vivekbosmiya</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 VOAD Architecture &amp; Interiors. All rights reserved.</span>
      <span>Rajkot, Gujarat &nbsp;&middot;&nbsp; Available across India &nbsp;&middot;&nbsp; <a href="/privacy-policy" style="color:inherit;opacity:.6;">Privacy Policy</a></span>
    </div>
  </footer>
  <script>window.__SSR_PROJECT__ = true;</script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script defer src="/js/motion.js"></script>
  <script defer src="/js/config.js?v=5"></script>
  <script defer src="/js/data.js?v=5"></script>
  <script defer src="/js/render.js?v=5"></script>
  <script defer src="/js/main.js?v=5"></script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const id = req.query.id;

  if (!id) {
    res.setHeader('Location', '/portfolio');
    return res.status(302).end();
  }

  try {
    const projects = await getProjects();
    const idx      = projects.findIndex(p => p.id === id);

    if (idx === -1) {
      res.setHeader('Location', '/portfolio');
      return res.status(302).end();
    }

    const project = projects[idx];
    const prev    = projects[(idx - 1 + projects.length) % projects.length];
    const next    = projects[(idx + 1) % projects.length];

    const html = buildPage(project, prev, next);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);

  } catch (err) {
    console.error('project SSR error:', err);
    res.setHeader('Location', '/portfolio');
    return res.status(302).end();
  }
};
