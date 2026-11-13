const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const FIXES = {
  'commercial-office-interior-rajkot':  { category: 'Commercial', readTime: '6 min read' },
  'heritage-haveli-renovation-rajkot':  { category: 'Heritage',   readTime: '7 min read' },
  'turnkey-interior-what-it-means':     { category: 'Interior',   readTime: '5 min read' },
  'residential-architecture-rajkot':    { category: 'Architecture', readTime: '7 min read' },
  'luxury-interior-design-rajkot':      { category: 'Interior',   readTime: '6 min read' },
  'renovation-vs-new-construction':     { category: 'Renovation', readTime: '6 min read' },
};

module.exports = async function handler(req, res) {
  if (req.query.secret !== 'voad-fix-blogs2-2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const blogs = await redis.get('voad:blogs') || [];
  let fixed = 0;

  const updated = blogs.map(b => {
    if (!FIXES[b.id]) return b;
    const patch = FIXES[b.id];
    const out = { ...b, ...patch, published: true };
    // rename cover -> coverImage if needed
    if (out.cover && !out.coverImage) {
      out.coverImage = out.cover;
      delete out.cover;
    }
    fixed++;
    return out;
  });

  await redis.set('voad:blogs', updated);
  return res.json({ ok: true, fixed });
};
