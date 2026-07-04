/* ── blog.js  ─────────────────────────────────────────────────────────────
   Renders the public blog listing (/blog) and individual post (/blog-post)
   ────────────────────────────────────────────────────────────────────────── */

async function fetchBlogs() {
  const res = await fetch('/api/blogs');
  if (!res.ok) throw new Error('Failed to load posts');
  return res.json();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ────────────────────────────────────────────
   BLOG LISTING  (blog.html)
   ──────────────────────────────────────────── */
async function initBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  try {
    const blogs = await fetchBlogs();
    const published = blogs.filter(b => b.published);

    if (!published.length) {
      grid.innerHTML = '<p class="blog-empty">No posts yet. Check back soon.</p>';
      return;
    }

    grid.innerHTML = published.map(b => `
      <a class="blog-card" href="/blog-post?id=${b.id}" aria-label="${b.title}">
        <div class="blog-card-img-wrap">
          <img class="blog-card-img" src="${b.coverImage}" alt="${b.title}" loading="lazy" />
        </div>
        <div class="blog-card-body">
          <p class="blog-card-category">${b.category}</p>
          <h2 class="blog-card-title">${b.title}</h2>
          <p class="blog-card-excerpt">${b.excerpt}</p>
          <div class="blog-card-meta">
            <span>${formatDate(b.date)}</span>
            <span>${b.readTime}</span>
          </div>
        </div>
      </a>`).join('');

  } catch (e) {
    grid.innerHTML = '<p class="blog-empty">Could not load posts. Please try again later.</p>';
  }
}

/* ────────────────────────────────────────────
   SINGLE POST  (blog-post.html)
   ──────────────────────────────────────────── */
async function initBlogPost() {
  const root = document.getElementById('post-root');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) {
    root.innerHTML = notFoundHTML();
    return;
  }

  try {
    const blogs = await fetchBlogs();
    const post  = blogs.find(b => b.id === id);

    if (!post) {
      root.innerHTML = notFoundHTML();
      return;
    }

    /* Update meta tags for SEO */
    document.title = `${post.title} | VOAD Architecture & Interiors`;
    setMeta('post-description', post.excerpt);
    setMeta('post-canonical',   `https://www.voad.in/blog-post?id=${id}`, true);
    setMeta('og-title',    post.title);
    setMeta('og-description', post.excerpt);
    setMeta('og-url',      `https://www.voad.in/blog-post?id=${id}`);
    setMeta('og-image',    post.coverImage);
    setMeta('tw-title',    post.title);
    setMeta('tw-description', post.excerpt);
    setMeta('tw-image',    post.coverImage);

    root.innerHTML = `
      <div class="post-hero" style="background-image:url('${post.coverImage}');">
        <div class="post-hero-overlay"></div>
        <div class="post-hero-inner">
          <p class="post-category">${post.category}</p>
          <h1 class="post-title">${post.title}</h1>
          <div class="post-meta">
            <span>${formatDate(post.date)}</span>
            <span class="post-meta-dot">&middot;</span>
            <span>${post.readTime}</span>
            <span class="post-meta-dot">&middot;</span>
            <span>${post.author}</span>
          </div>
        </div>
      </div>

      <section class="section section-white">
        <div class="post-body">
          <div class="post-content">
            ${post.content}
          </div>
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
      </section>`;

  } catch (e) {
    root.innerHTML = notFoundHTML();
  }
}

function setMeta(id, value, isHref) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isHref) { el.href = value; } else {
    el.content ? (el.content = value) : (el.textContent = value);
  }
}

/* ────────────────────────────────────────────
   HOME BLOG PREVIEW  (index.html)
   Shows 3 latest published posts
   ──────────────────────────────────────────── */
async function initHomeBlog() {
  const grid = document.getElementById('home-blog-grid');
  if (!grid) return;
  try {
    const blogs     = await fetchBlogs();
    const published = blogs.filter(b => b.published).slice(0, 3);
    if (!published.length) { grid.closest('section').style.display = 'none'; return; }
    grid.innerHTML = published.map(b => `
      <a class="home-blog-card" href="/blog-post?id=${b.id}">
        <div class="home-blog-img-wrap">
          <img src="${b.coverImage}" alt="${b.title}" loading="lazy" />
        </div>
        <div class="home-blog-body">
          <p class="home-blog-cat">${b.category}</p>
          <h3 class="home-blog-title">${b.title}</h3>
          <p class="home-blog-date">${formatDate(b.date)} &middot; ${b.readTime}</p>
        </div>
      </a>`).join('');
  } catch { /* hide section silently if API unavailable */ }
}

function notFoundHTML() {
  return `
    <div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;text-align:center;padding:4rem 2rem;">
      <p style="font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);">Post not found</p>
      <h1 style="font-size:2rem;font-weight:300;">This article does not exist.</h1>
      <a href="/blog" style="font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid var(--text);padding-bottom:2px;">&larr; Back to Journal</a>
    </div>`;
}
