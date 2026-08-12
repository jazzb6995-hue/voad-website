const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET);
}

/*
  Fix double-encoded UTF-8 characters using charCodeAt-based replacement.
  The broken characters are Unicode code points stored as individual chars
  rather than the original single character they should represent.

  Pattern: each garbled sequence is a pair (or triple) of Latin-1 surrogates.
  We use String.fromCharCode to build the search pattern so the source file
  encoding never causes a mismatch.
*/
function fixEncoding(str) {
  if (typeof str !== 'string') return str;

  // U+00C2 + U+00B7  ->  U+00B7  (middle dot separator, e.g. "Design Â· Living")
  const garbledDot   = String.fromCharCode(0x00C2, 0x00B7);
  const middleDot    = String.fromCharCode(0x00B7);

  // U+00E2 + U+20AC + U+201D  ->  ' - '  (em dash, per site rules no em dashes)
  const garbledDash  = String.fromCharCode(0x00E2, 0x20AC, 0x201D);

  // U+00E2 + U+20AC + U+2122  ->  apostrophe / right single quote
  const garbledRSQ   = String.fromCharCode(0x00E2, 0x20AC, 0x2122);

  // U+00E2 + U+20AC + U+02DC  ->  left single quote
  const garbledLSQ   = String.fromCharCode(0x00E2, 0x20AC, 0x02DC);

  // U+00E2 + U+20AC + U+0153  ->  left double quote
  const garbledLDQ   = String.fromCharCode(0x00E2, 0x20AC, 0x0153);

  // U+00C2 + U+00A0  ->  regular space (garbled non-breaking space)
  const garbledNBSP  = String.fromCharCode(0x00C2, 0x00A0);

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return str
    .replace(new RegExp(escapeRegex(garbledDot),  'g'), middleDot)
    .replace(new RegExp(escapeRegex(garbledDash), 'g'), ' - ')
    .replace(new RegExp(escapeRegex(garbledRSQ),  'g'), "'")
    .replace(new RegExp(escapeRegex(garbledLSQ),  'g'), "'")
    .replace(new RegExp(escapeRegex(garbledLDQ),  'g'), '"')
    .replace(new RegExp(escapeRegex(garbledNBSP), 'g'), ' ');
}

function fixProject(p) {
  return {
    ...p,
    title:     fixEncoding(p.title),
    tagline:   fixEncoding(p.tagline),
    scope:     fixEncoding(p.scope),
    location:  fixEncoding(p.location),
    shortDesc: fixEncoding(p.shortDesc),
    longDesc:  fixEncoding(p.longDesc),
  };
}

function fixBlog(b) {
  return {
    ...b,
    title:   fixEncoding(b.title),
    excerpt: fixEncoding(b.excerpt),
    content: fixEncoding(b.content),
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try { verifyToken(req); } catch {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    const projects = await redis.get('voad:projects');
    if (!Array.isArray(projects)) return res.status(500).json({ error: 'No projects in Redis' });

    const fixedProjects = projects.map(fixProject);
    await redis.set('voad:projects', fixedProjects);

    const blogs = await redis.get('voad:blogs');
    let blogsFixed = 0;
    if (Array.isArray(blogs)) {
      const fixedBlogs = blogs.map(fixBlog);
      await redis.set('voad:blogs', fixedBlogs);
      blogsFixed = fixedBlogs.length;
    }

    /* Return a sample so we can verify the fix worked */
    const sample = fixedProjects[0] ? {
      id:    fixedProjects[0].id,
      scope: fixedProjects[0].scope,
    } : null;

    return res.json({ ok: true, projectsFixed: fixedProjects.length, blogsFixed, sample });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
