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

/* Fix double-encoded UTF-8 characters */
function fixEncoding(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/Â·/g, '·')       // middle dot (used as separator)
    .replace(/â€"/g, ' - ')    // em dash → hyphen (per site rules: no em dashes)
    .replace(/â€œ/g, '"')      // left double quote
    .replace(/â€/g, '"') // right double quote
    .replace(/â€˜/g, "'")      // left single quote
    .replace(/â€™/g, "'")      // right single quote (apostrophe)
    .replace(/Â /g, ' ')       // non-breaking space
    .replace(/Ã©/g, 'é')       // é
    .replace(/Ã /g, 'à')       // à
    .replace(/Ã¨/g, 'è');      // è
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

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try { verifyToken(req); } catch {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    const projects = await redis.get('voad:projects');
    if (!Array.isArray(projects)) return res.status(500).json({ error: 'No projects in Redis' });

    const fixed = projects.map(fixProject);
    await redis.set('voad:projects', fixed);

    const blogs = await redis.get('voad:blogs');
    let blogsFixed = 0;
    if (Array.isArray(blogs)) {
      const fixedBlogs = blogs.map(b => ({
        ...b,
        title:   fixEncoding(b.title),
        excerpt: fixEncoding(b.excerpt),
        content: fixEncoding(b.content),
      }));
      await redis.set('voad:blogs', fixedBlogs);
      blogsFixed = fixedBlogs.length;
    }

    return res.json({ ok: true, projectsFixed: fixed.length, blogsFixed });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
