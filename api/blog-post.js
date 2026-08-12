const { Redis } = require('@upstash/redis');
const fs   = require('fs');
const path = require('path');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const KEY = 'voad:blogs';

async function getBlogs() {
  try {
    const cached = await redis.get(KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
  } catch (_) { /* fall through to file seed */ }
  const file = path.join(process.cwd(), 'data', 'blogs.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const POST_STYLES = `<style>
  .post-hero{position:relative;height:70vh;min-height:420px;max-height:620px;background-size:cover;background-position:center;display:flex;align-items:flex-end;}
  .post-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(13,13,11,.85) 30%,rgba(13,13,11,.15) 100%);}
  .post-hero-inner{position:relative;z-index:1;padding:3rem 4rem;max-width:860px;}
  .post-category{font-size:.62rem;letter-spacing:.26em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem;}
  .post-title{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:300;color:var(--bg);line-height:1.25;margin-bottom:1rem;}
  .post-meta{display:flex;align-items:center;gap:.6rem;font-size:.78rem;color:rgba(248,247,244,.55);letter-spacing:.04em;}
  .post-meta-dot{opacity:.4;}
  .post-body{max-width:760px;}
  .post-content{font-size:1rem;font-weight:300;line-height:1.85;color:var(--text);}
  .post-content p{margin-bottom:1.5rem;}
  .post-content h2{font-size:1.35rem;font-weight:500;margin:2.5rem 0 1rem;line-height:1.3;color:var(--text);}
  .post-content h3{font-size:1.1rem;font-weight:500;margin:2rem 0 .75rem;}
  .post-content ul,.post-content ol{margin:0 0 1.5rem 1.5rem;line-height:1.85;}
  .post-content li{margin-bottom:.4rem;}
  .post-content a{color:var(--text);border-bottom:1px solid var(--accent);text-decoration:none;transition:color .2s;}
  .post-content a:hover{color:var(--accent);}
  .post-content strong{font-weight:500;}
  .post-layout{display:grid;grid-template-columns:1fr 300px;gap:5rem;align-items:start;}
  .post-sidebar{position:sticky;top:5rem;display:flex;flex-direction:column;gap:1.75rem;}
  .sidebar-card{border:1px solid var(--border);border-radius:4px;padding:1.5rem;}
  .sidebar-label{font-size:.6rem;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);margin-bottom:.85rem;}
  .sidebar-author-name{font-size:.95rem;font-weight:500;margin-bottom:.35rem;color:var(--text);}
  .sidebar-author-role{font-size:.82rem;color:var(--muted);font-weight:300;line-height:1.7;margin-bottom:1rem;}
  .sidebar-author-link{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text);text-decoration:none;border-bottom:1px solid var(--border);padding-bottom:2px;transition:border-color .2s;}
  .sidebar-author-link:hover{border-color:var(--text);}
  .sidebar-related-post{display:flex;gap:.85rem;text-decoration:none;color:inherit;padding:.85rem 0;border-bottom:1px solid var(--border);transition:opacity .2s;}
  .sidebar-related-post:last-child{border-bottom:none;padding-bottom:0;}
  .sidebar-related-post:hover{opacity:.7;}
  .sidebar-related-img{width:60px;height:60px;object-fit:cover;border-radius:3px;flex-shrink:0;}
  .sidebar-related-title{font-size:.84rem;font-weight:500;line-height:1.4;margin-bottom:.3rem;color:var(--text);}
  .sidebar-related-meta{font-size:.7rem;color:var(--muted);letter-spacing:.03em;}
  .sidebar-cta-heading{font-size:1rem;font-weight:300;line-height:1.4;margin:.4rem 0 .65rem;color:var(--text);}
  .sidebar-cta-body{font-size:.82rem;color:var(--muted);font-weight:300;line-height:1.7;margin-bottom:1.25rem;}
  .post-cta{margin-top:4rem;padding-top:3rem;border-top:1px solid var(--border);}
  .post-cta-heading{font-size:clamp(1.4rem,3vw,2rem);font-weight:300;margin:.5rem 0 1rem;}
  .post-cta-body{font-size:.95rem;color:var(--muted);font-weight:300;line-height:1.75;margin-bottom:2rem;max-width:480px;}
  .post-cta-links{display:flex;align-items:center;gap:2rem;flex-wrap:wrap;}
  .post-back-link{font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);text-decoration:none;border-bottom:1px solid var(--border);padding-bottom:2px;transition:color .2s,border-color .2s;}
  .post-back-link:hover{color:var(--text);border-color:var(--text);}
  @media(max-width:1080px){.post-layout{grid-template-columns:1fr;gap:3rem;}.post-sidebar{position:static;display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}}
  @media(max-width:768px){.post-hero-inner{padding:2rem 1.5rem;}.post-hero{height:55vh;}}
  @media(max-width:640px){.post-sidebar{grid-template-columns:1fr;}}
</style>`;

function buildPostHTML(post, related) {
  const relatedHTML = related.map(r => `
    <a class="sidebar-related-post" href="/blog/${esc(r.id)}">
      <img class="sidebar-related-img" src="${esc(r.coverImage)}?auto=format&amp;fit=crop&amp;w=120&amp;h=120&amp;q=70" alt="${esc(r.title)}" loading="lazy" />
      <div>
        <p class="sidebar-related-title">${esc(r.title)}</p>
        <p class="sidebar-related-meta">${esc(r.category)} &middot; ${esc(r.readTime)}</p>
      </div>
    </a>`).join('');

  return `
    <div class="post-hero" style="background-image:url('${esc(post.coverImage)}');">
      <div class="post-hero-overlay"></div>
      <div class="post-hero-inner">
        <p class="post-category">${esc(post.category)}</p>
        <h1 class="post-title">${esc(post.title)}</h1>
        <div class="post-meta">
          <span>${formatDate(post.date)}</span>
          <span class="post-meta-dot">&middot;</span>
          <span>${esc(post.readTime)}</span>
          <span class="post-meta-dot">&middot;</span>
          <span>${esc(post.author)}</span>
        </div>
      </div>
    </div>
    <section class="section section-white">
      <div class="post-layout">
        <div class="post-body">
          <div class="post-content">${post.content}</div>
          <div class="post-cta">
            <p class="section-label">Start a Project</p>
            <h2 class="post-cta-heading">Ready to Work Together?</h2>
            <p class="post-cta-body">Every project at VOAD begins with a conversation. Tell us about your space and we will take it from there.</p>
            <div class="post-cta-links">
              <a href="/contact" class="contact-btn">Get In Touch &rarr;</a>
              <a href="/blog" class="post-back-link">&larr; Back to Journal</a>
            </div>
          </div>
        </div>
        <aside class="post-sidebar">
          <div class="sidebar-card">
            <p class="sidebar-label">Written By</p>
            <p class="sidebar-author-name">${esc(post.author || 'Ar. Vivek Bosmiya')}</p>
            <p class="sidebar-author-role">Architect and Interior Designer. Principal at VOAD Architecture &amp; Interiors, Rajkot. Over a decade of practice across residential, heritage, and commercial projects in Gujarat and beyond.</p>
            <a href="/about" class="sidebar-author-link">About the Studio &rarr;</a>
          </div>
          ${related.length ? `<div class="sidebar-card"><p class="sidebar-label">Related Articles</p>${relatedHTML}</div>` : ''}
          <div class="sidebar-card">
            <p class="sidebar-label">Start a Project</p>
            <h3 class="sidebar-cta-heading">Ready to Design Your Space?</h3>
            <p class="sidebar-cta-body">Every project begins with a conversation. Tell us about your home or workspace.</p>
            <a href="/contact" class="contact-btn" style="font-size:.78rem;padding:.6rem 1.2rem;">Get In Touch &rarr;</a>
          </div>
        </aside>
      </div>
    </section>`;
}

function buildPage(post, related) {
  const title      = esc(post.title);
  const excerpt    = esc(post.excerpt);
  const canonical  = `https://www.voad.in/blog/${esc(post.id)}`;
  const imageUrl   = esc(post.coverImage);

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt,
        'image': post.coverImage,
        'author': { '@type': 'Person', 'name': post.author || 'Ar. Vivek Bosmiya', 'url': 'https://www.voad.in/about' },
        'publisher': {
          '@type': 'Organization', 'name': 'VOAD Architecture & Interiors',
          'url': 'https://www.voad.in',
          'logo': { '@type': 'ImageObject', 'url': 'https://www.voad.in/favicon.svg' }
        },
        'datePublished': post.date,
        'dateModified': post.date,
        'url': `https://www.voad.in/blog/${post.id}`,
        'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://www.voad.in/blog/${post.id}` },
        'isPartOf': { '@id': 'https://www.voad.in/blog#blog' }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.voad.in/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Journal', 'item': 'https://www.voad.in/blog' },
          { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': `https://www.voad.in/blog/${post.id}` }
        ]
      }
    ]
  });

  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | VOAD Architecture &amp; Interiors</title>
  <meta name="description" content="${excerpt}" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Ar. Vivek Bosmiya, VOAD Architecture &amp; Interiors" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/favicon.svg" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="VOAD Architecture &amp; Interiors" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${excerpt}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:locale" content="en_IN" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${excerpt}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <script type="application/ld+json">${schema}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-PN9B6JKRVW"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PN9B6JKRVW');</script>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://images.unsplash.com" crossorigin />
  <link rel="preload" as="image" fetchpriority="high" href="${imageUrl}?auto=format&amp;fit=crop&amp;w=1800&amp;q=80" />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap" onload="this.rel='stylesheet'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap" rel="stylesheet" /></noscript>
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="stylesheet" href="/css/projects.css" />
  ${POST_STYLES}
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
    <a href="/portfolio">Portfolio</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/blog" class="active">Blog</a>
  </div>
  <nav aria-label="Main navigation">
    <a href="/" class="nav-logo" aria-label="VOAD Home">
      <span class="nav-logo-mark">V O A D</span>
      <span class="nav-logo-sub">Architecture &amp; Interiors</span>
    </a>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/portfolio">Portfolio</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
      <li><a href="/blog" class="active">Blog</a></li>
    </ul>
    <button class="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <main id="post-root">${buildPostHTML(post, related)}</main>
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
  <script>window.__SSR_BLOG_POST__ = true;</script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script defer src="/js/motion.js"></script>
  <script defer src="/js/main.js?v=4"></script>
  <script defer src="/js/blog.js?v=1"></script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const id = req.query.id;

  if (!id) {
    res.setHeader('Location', '/blog');
    return res.status(302).end();
  }

  try {
    const blogs = await getBlogs();
    const post  = blogs.find(b => b.id === id && b.published);

    if (!post) {
      res.setHeader('Location', '/blog');
      return res.status(302).end();
    }

    const sameCategory = blogs.filter(b => b.published && b.id !== post.id && b.category === post.category);
    const otherPosts   = blogs.filter(b => b.published && b.id !== post.id && b.category !== post.category);
    const related      = [...sameCategory, ...otherPosts].slice(0, 3);

    const html = buildPage(post, related);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);

  } catch (err) {
    console.error('blog-post SSR error:', err);
    res.setHeader('Location', '/blog');
    return res.status(302).end();
  }
};
