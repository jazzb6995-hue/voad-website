# VOAD Architecture & Interiors — Full SEO Audit Report
**Domain:** https://www.voad.in  
**Audit Date:** 4 July 2026  
**Business Type:** Local Professional Service (Architecture & Interior Design Studio, Rajkot, Gujarat)  
**Priority Keywords:** Interior Designer Rajkot, Architect Rajkot, Architecture Firm Rajkot, Interior Design Company Rajkot

---

## SEO Health Score: 73 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 70 | 15.4 |
| Content Quality | 23% | 72 | 16.6 |
| On-Page SEO | 20% | 78 | 15.6 |
| Schema / Structured Data | 10% | 75 | 7.5 |
| Performance (CWV) | 10% | 55 | 5.5 |
| AI Search Readiness | 10% | 82 | 8.2 |
| Images | 5% | 80 | 4.0 |
| **TOTAL** | 100% | | **73 / 100** |

---

## Executive Summary

VOAD has a solid SEO foundation: correct canonicals, GA4 tracking, comprehensive LocalBusiness schema, robots.txt, sitemap.xml, llms.txt, HSTS, and well-optimised titles and meta descriptions across all main pages. The site is indexable and structured correctly for local search in Rajkot.

However, five significant issues are suppressing rankings:

1. **Blog post pages are invisible to Google** — the static HTML has a generic title/canonical and no structured data. Google's crawler may not execute the JavaScript that renders the real content.
2. **All 4 blog post URLs are missing from the sitemap** — Google has no crawl signal to find them.
3. **7 render-blocking scripts** are delaying Largest Contentful Paint on every page.
4. **No telephone number** anywhere in the LocalBusiness schema — this weakens local pack eligibility.
5. **Cloudinary credentials exposed** via a public `/api/config` endpoint.

---

## Technical SEO

### Crawlability and Indexability

| Check | Status | Detail |
|---|---|---|
| robots.txt | PASS | Correct. Disallows /admin/ and /api/, allows all else. Sitemap referenced. |
| sitemap.xml | PARTIAL | 5 URLs present. All 4 blog post URLs missing. |
| Canonical tags | PASS | Correct on all 5 main pages. |
| HTTP 200 on all pages | PASS | Home, About, Portfolio, Contact, Blog all return 200. |
| 404 handling | PASS | Non-existent URLs correctly return 404. |
| HSTS | PASS | max-age=63072000 (2 years). |
| HTTPS redirect | WARN | Bare domain (voad.in) returns 308 Permanent Redirect. Google prefers 301. Vercel uses 308 by default — low risk but worth noting. |

### Blog Post Indexability (Critical Gap)

The blog post page (`/blog-post?id=...`) is a JavaScript-rendered Single Page Application. The static HTML delivered to Google's crawler contains:

- **Title:** `Article | VOAD Architecture & Interiors` (generic)
- **Canonical:** `https://www.voad.in/blog-post` (missing `?id=` param)
- **H1:** none (injected by JS)
- **JSON-LD:** none (injected by JS)
- **Meta description:** generic placeholder

Google Googlebot does execute JavaScript, but it renders pages in a "second wave" — often days after first crawl — and does not guarantee JS execution. All 4 blog articles are currently at significant risk of being indexed with generic titles and no content signal.

### Security Headers

| Header | Status |
|---|---|
| Strict-Transport-Security | PASS |
| X-Frame-Options: SAMEORIGIN | PASS |
| X-Content-Type-Options: nosniff | PASS |
| Referrer-Policy: strict-origin-when-cross-origin | PASS |
| Permissions-Policy | PASS |
| Content-Security-Policy | MISSING |
| X-XSS-Protection | MISSING (deprecated — not critical) |

### API Security

`GET https://www.voad.in/api/config` returns:
```json
{"cloudName":"dsdqudevc","uploadPreset":"voad_uploads"}
```
This endpoint is publicly accessible with no authentication. It exposes the Cloudinary upload preset name. While Cloudinary upload presets are semi-public by design, any person who finds this URL can use your upload quota. Consider restricting this endpoint to authenticated requests only.

---

## Performance (Core Web Vitals Proxy)

Lab measurements are unavailable without Lighthouse/CrUX. Based on resource analysis:

### Render-Blocking Scripts (LCP Risk — HIGH)

The following scripts load synchronously in `<head>` or before `</body>` without `defer` or `async`, blocking the browser's render thread on every page:

| Script | Size | Blocking |
|---|---|---|
| gsap.min.js (CDN) | 71 KB | Yes |
| ScrollTrigger.min.js (CDN) | 42 KB | Yes |
| js/motion.js | unknown | Yes |
| js/config.js | unknown | Yes |
| js/data.js | unknown | Yes |
| js/render.js | unknown | Yes |
| js/main.js | unknown | Yes |
| js/settings.js | unknown | Yes |
| js/blog.js | unknown | Yes |

**Total blocking JS: at minimum 113 KB from CDN alone before first paint.** This is the single biggest performance issue on the site and directly impacts LCP scores.

### Google Fonts (FCP Risk)

`fonts.googleapis.com` is loaded as a render-blocking stylesheet. Adding `font-display: swap` (already handled by Google Fonts via `display=swap` in the URL) is correct. The preconnect hints to `fonts.googleapis.com` and `fonts.gstatic.com` are in place — this is good.

### Asset Sizes

| Asset | Size |
|---|---|
| style.css | 25.2 KB |
| projects.css | 10.8 KB |
| index.html | 28.6 KB |
| about.html | 20.4 KB |

HTML and CSS sizes are reasonable. No issues.

### Image Optimisation

- All images use Unsplash CDN with `auto=format&fit=crop` — automatic WebP delivery where supported. Good.
- `loading="lazy"` applied to all `<img>` tags checked. Good.
- No alt text missing on any checked page. Good.

---

## On-Page SEO

### Title Tags

| Page | Title | Length | Assessment |
|---|---|---|---|
| Home | Interior Designer in Rajkot \| VOAD Architecture & Interiors | 59 | PASS — primary keyword first |
| About | About VOAD \| Ar. Vivek Bosmiya, Architect & Interior Designer, Rajkot | 69 | WARN — 69 chars, may truncate in SERP (limit ~60) |
| Portfolio | Architecture & Interior Design Portfolio \| VOAD Rajkot | 54 | PASS |
| Contact | Contact VOAD \| Architect & Interior Designer in Rajkot, Gujarat | 63 | WARN — slightly over limit |
| Blog | Journal \| Architecture & Interior Design Insights \| VOAD Rajkot | 63 | WARN — slightly over limit |
| Blog Post (static) | Article \| VOAD Architecture & Interiors | 38 | FAIL — generic, not post-specific |

### Meta Descriptions

All main pages have unique, well-written meta descriptions within the 150-160 character range. No issues.

### H1 Tags

| Page | H1 | Count | Issue |
|---|---|---|---|
| Home | "Designing the SpacesThat Shape Experiences" | 1 | Missing space between lines (rendering artefact, no SEO keywords) |
| About | "About VOAD" | 1 | Very short, no keyword |
| Portfolio | "Our Portfolio" | 1 | Generic, no keyword |
| Contact | "Get In Touch" | 1 | Generic |
| Blog | "Journal" | 1 | Generic |

The home H1 text contains no target keywords (Interior Designer, Rajkot, Architecture). While the title tag is optimised, the H1 is a missed opportunity.

### Internal Linking

All pages link to each other via nav and footer. Portfolio filter links are in place. Blog links to contact and portfolio from article CTAs. Internal linking structure is healthy.

---

## Content Quality (E-E-A-T)

### Expertise / Authoritativeness / Trustworthiness

| Signal | Status |
|---|---|
| Named author (Ar. Vivek Bosmiya) on all blog posts | PASS |
| Years of experience stated (9 years, 70+ projects) | PASS |
| Geographic specificity (Rajkot, Gujarat) | PASS |
| Instagram + Behance sameAs links | PASS |
| No phone number visible on contact page (placeholder only) | FAIL |
| No Google Business Profile link | MISSING |
| No testimonials with verifiable names on blog posts | MISSING |

### Blog Content Quality

All 4 seed articles are well-structured with:
- Specific, relevant H2 headings
- Internal links to /contact, /portfolio, /about
- No em dashes (as required)
- Appropriate article length (400-600 words)
- Author attribution
- Category and read time metadata

**Gap:** Blog posts are 400-600 words each. For competitive local SEO keywords (e.g., "interior designer Rajkot"), content of 800-1200 words with more specific Rajkot/Gujarat references will outrank shorter articles.

### Thin Content Pages

Portfolio and blog listing pages contain almost no static text content (the content is loaded via JavaScript from the API). From a crawler's perspective, these pages appear thin unless JavaScript is executed.

---

## Schema / Structured Data

### What is Implemented (Good)

| Schema Type | Page | Status |
|---|---|---|
| LocalBusiness + ProfessionalService | Home | PASS — comprehensive |
| WebSite + WebPage | Home | PASS |
| FAQPage (4 questions) | Home | PASS |
| Person (Ar. Vivek Bosmiya) | About | PASS |
| BreadcrumbList | About, Portfolio, Contact | PASS |
| CollectionPage | Portfolio | PASS |
| ContactPage | Contact | PASS |
| Blog | Blog listing | PASS |

### Missing / Broken Schema

| Issue | Impact |
|---|---|
| No `telephone` in LocalBusiness schema | High — reduces local pack eligibility |
| No `Article` or `BlogPosting` schema on blog post pages | High — blog posts will not get rich results |
| Blog post schema is JS-rendered, not in static HTML | Critical — Google may not see it |
| LocalBusiness schema has no `priceRange` | Low |
| LocalBusiness schema has no `aggregateRating` | Medium — no reviews currently |

---

## AI Search Readiness (GEO)

| Signal | Status |
|---|---|
| llms.txt present | PASS |
| FAQ schema (AI Overviews eligible) | PASS |
| Specific named person (Ar. Vivek Bosmiya) | PASS |
| Geographic specificity (Rajkot, Gujarat) | PASS |
| Blog content with citeable facts | PASS |
| Clear service list | PASS |
| No telephone/contact in llms.txt | MISSING |

The llms.txt file is a strong signal for ChatGPT and Perplexity indexing. The FAQPage schema makes the homepage eligible for Google AI Overviews for branded queries.

---

## Local SEO

| Signal | Status |
|---|---|
| LocalBusiness schema | PASS |
| Address (Rajkot, Gujarat, postalCode 360001) | PASS |
| GeoCoordinates | PASS |
| Opening hours | PASS |
| AreaServed (City, State, Country) | PASS |
| Telephone in schema | FAIL |
| Google Business Profile (GBP) | NOT VERIFIED |
| NAP consistency across site | PARTIAL — no phone |
| Reviews / aggregateRating | MISSING |

**Google Business Profile is the most important local SEO action not yet taken.** Without a GBP listing, VOAD cannot appear in the local map pack for "interior designer Rajkot" searches — which is where most local commercial intent traffic goes.

---

## Backlinks (Common Crawl Baseline)

No Moz or Bing API credentials available. Common Crawl baseline:

- Domain: voad.in
- Age: relatively new domain (custom domain recently connected)
- Social profiles: Instagram (@architect.vivekbosmiya), Behance (vivekbosmiya) — these provide some domain authority signals
- No external editorial backlinks detected via available tools

Backlinks are the largest gap for competitive keyword rankings. The site's technical and content foundation is ready; link acquisition is the next growth lever.

---

## Sitemap Coverage

| URL | In Sitemap |
|---|---|
| https://www.voad.in/ | YES |
| https://www.voad.in/portfolio | YES |
| https://www.voad.in/about | YES |
| https://www.voad.in/contact | YES |
| https://www.voad.in/blog | YES |
| https://www.voad.in/blog-post?id=hiring-interior-designer-rajkot | NO |
| https://www.voad.in/blog-post?id=heritage-haveli-restoration-gujarat | NO |
| https://www.voad.in/blog-post?id=bungalow-vs-villa-gujarat-climate | NO |
| https://www.voad.in/blog-post?id=turnkey-interior-project-guide | NO |

---

## What Is Working Well

- All main pages return 200 with correct canonicals
- Comprehensive LocalBusiness + FAQPage schema on homepage
- GA4 tracking on all pages
- Open Graph + Twitter Card on all pages
- robots.txt and sitemap.xml in place
- HSTS and 4 security headers active
- llms.txt for AI search visibility
- Blog with internal links and named authorship
- All images have alt text and use lazy loading
- Clean URL structure (no .html extensions)
