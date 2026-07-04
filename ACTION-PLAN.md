# VOAD SEO Action Plan
**Generated:** 4 July 2026 | **Target Score:** 88+/100

---

## CRITICAL — Fix Immediately

### C1. Add all 4 blog posts to sitemap.xml
**Impact:** Google cannot discover blog posts without crawl signals.  
**Effort:** 10 minutes

Add these 4 URLs to `sitemap.xml`:
```xml
<url>
  <loc>https://www.voad.in/blog-post?id=hiring-interior-designer-rajkot</loc>
  <lastmod>2026-07-01</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://www.voad.in/blog-post?id=heritage-haveli-restoration-gujarat</loc>
  <lastmod>2026-06-20</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://www.voad.in/blog-post?id=bungalow-vs-villa-gujarat-climate</loc>
  <lastmod>2026-06-10</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
<url>
  <loc>https://www.voad.in/blog-post?id=turnkey-interior-project-guide</loc>
  <lastmod>2026-05-28</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

### C2. Add telephone number to LocalBusiness schema and contact page
**Impact:** Required for Google local pack eligibility. Without a phone, the business listing is incomplete.  
**Effort:** 15 minutes

Add to `index.html` JSON-LD (inside the LocalBusiness object, after `"foundingDate"`):
```json
"telephone": "+91-XXXXXXXXXX",
```
Also add to contact page with `tel:` href:
```html
<a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a>
```
Replace with the real phone number.

---

### C3. Add BlogPosting schema to blog-post.html (static HTML)
**Impact:** Blog posts currently have zero structured data in static HTML. Google may index them with no rich result eligibility.  
**Effort:** 30 minutes

Add a static `<script type="application/ld+json">` block to `blog-post.html` and update it dynamically via `blog.js` after the post loads. See ACTION-PLAN section below for the schema template.

BlogPosting schema to inject via blog.js after post data loads:
```javascript
const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.coverImage,
  "author": {
    "@type": "Person",
    "name": post.author,
    "url": "https://www.voad.in/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "VOAD Architecture & Interiors",
    "url": "https://www.voad.in"
  },
  "datePublished": post.date,
  "dateModified": post.date,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.voad.in/blog-post?id=${post.id}`
  }
};
const el = document.createElement('script');
el.type = 'application/ld+json';
el.textContent = JSON.stringify(schema);
document.head.appendChild(el);
```

---

## HIGH — Fix Within 1 Week

### H1. Add `defer` to all non-critical scripts
**Impact:** 7 render-blocking scripts are delaying first paint on every page. Adding `defer` will not change functionality (all scripts run after DOM is parsed anyway) but removes them from the critical render path, improving LCP and CLS scores.  
**Effort:** 20 minutes across all HTML files

Change in all HTML files:
```html
<!-- BEFORE -->
<script src="js/motion.js"></script>
<script src="js/config.js?v=4"></script>
<script src="js/data.js?v=4"></script>
<script src="js/render.js?v=4"></script>
<script src="js/main.js?v=4"></script>
<script src="js/settings.js?v=4"></script>
<script src="js/blog.js?v=1"></script>

<!-- AFTER -->
<script defer src="js/motion.js"></script>
<script defer src="js/config.js?v=4"></script>
<script defer src="js/data.js?v=4"></script>
<script defer src="js/render.js?v=4"></script>
<script defer src="js/main.js?v=4"></script>
<script defer src="js/settings.js?v=4"></script>
<script defer src="js/blog.js?v=1"></script>
```
Also add `defer` to GSAP scripts.

---

### H2. Restrict /api/config to authenticated requests
**Impact:** Currently publicly accessible, exposing Cloudinary credentials.  
**Effort:** 15 minutes

In `api/config.js`, add a token check before returning credentials:
```javascript
// Only return config to authenticated admin requests
const auth = req.headers['authorization'] || '';
if (!auth.startsWith('Bearer ')) {
  return res.status(401).json({ error: 'Unauthorised' });
}
```

---

### H3. Create a Google Business Profile (GBP)
**Impact:** This is the #1 local SEO action. Without GBP, VOAD cannot rank in the Google Maps pack for "interior designer Rajkot" — where most local purchase-intent queries go.  
**Effort:** 1-2 hours  
**Action:** Go to business.google.com, create listing for "VOAD Architecture & Interiors", verify by postcard or phone, add photos, services, and a link to voad.in.

---

### H4. Fix blog post static HTML title and canonical
**Impact:** Google indexes what is in the static HTML on first crawl. The generic title and canonical mean posts may be indexed incorrectly before JS renders.  
**Effort:** Already partially done via JS — add a server-side solution or pre-populated meta tags per blog ID.

Short-term fix without SSR: In `blog.js`, after updating the title, also push a canonical update. This is already done — but the static fallback needs to be more specific. Consider adding a `<noscript>` redirect or pre-rendering blog post pages.

---

### H5. Shorten About and Blog title tags
**Impact:** Titles over ~60 characters get truncated in Google SERPs, reducing click-through rate.  

| Page | Current (chars) | Suggested |
|---|---|---|
| About | 69 | `Ar. Vivek Bosmiya | Architect & Interior Designer, Rajkot` (58) |
| Blog | 63 | `Journal | Architecture & Interior Design | VOAD Rajkot` (54) |

---

## MEDIUM — Fix Within 1 Month

### M1. Add Content-Security-Policy header
Add to `vercel.json` headers:
```json
{ "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src * data:; connect-src *;" }
```

---

### M2. Add `priceRange` to LocalBusiness schema
```json
"priceRange": "₹₹₹"
```

---

### M3. Expand blog articles to 800-1200 words
Current articles are 400-600 words — sufficient for branding but not competitive for commercial keywords. Expand each article with:
- More Rajkot/Gujarat-specific references
- Specific project examples (without names if confidential)
- Cost ranges or timelines relevant to Gujarat market

---

### M4. Add structured FAQ sections to blog posts
Adding FAQPage schema to high-traffic blog articles increases eligibility for Google AI Overviews and FAQ rich results.

---

### M5. Fix H1 keyword optimisation
Current H1s are creative/brand copy with no target keywords. While title tags are optimised, H1 is a confirmed ranking signal:

| Page | Current H1 | Suggested H1 |
|---|---|---|
| Home | "Designing the SpacesThat Shape Experiences" | "Architecture & Interior Design Studio in Rajkot" |
| About | "About VOAD" | "Meet the Architect Behind VOAD, Rajkot" |
| Portfolio | "Our Portfolio" | "Architecture & Interior Design Portfolio, Rajkot" |

Note: Only change if design allows. The brand copy is strong — consider making the H1 the eyebrow line visible to crawlers.

---

### M6. Submit updated sitemap to Google Search Console
After adding blog post URLs to sitemap, re-submit at search.google.com/search-console.

---

## LOW — Backlog

### L1. Add `aggregateRating` to LocalBusiness schema
Once Google Business Profile is set up and reviews accumulate, pull the rating into schema:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "12"
}
```

### L2. Add breadcrumb navigation to blog posts
The breadcrumb schema is on main pages but not on blog post pages. Add visible breadcrumb nav and schema: Home > Journal > [Article Title].

### L3. Build backlinks
Priority targets:
- Submit to Archello, ArchDaily India, Dezeen (project submissions)
- Get featured in local Rajkot/Gujarat news/lifestyle sites
- Guest post on Indian interior design blogs
- List on Houzz, India Mart architect directories

### L4. Add video content
Google increasingly ranks pages with embedded video for how-to and design queries. A 2-minute walkthrough video of a completed project embedded on a blog post significantly increases dwell time.

### L5. Add `@type: ArchitectureService` to schema
More specific service type than generic ProfessionalService.

---

## Score Projection After Fixes

| Fix Group | Points Gained | New Score |
|---|---|---|
| Current baseline | | 73 |
| C1-C3 (Critical fixes) | +6 | 79 |
| H1-H5 (High priority) | +5 | 84 |
| GBP created + verified | +3 | 87 |
| M1-M6 (Medium) | +3 | 90 |
| L1-L5 (Low/backlog) | +2 | 92 |
