const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async function handler(req, res) {
  if (req.query.secret !== 'voad-fix-heritage-img-2026') {
    return res.status(401).json({ error: 'forbidden' });
  }
  const blogs = await redis.get('voad:blogs');
  const idx = blogs.findIndex(b => b.id === 'heritage-haveli-renovation-rajkot');
  if (idx < 0) return res.status(404).json({ error: 'blog not found' });

  blogs[idx].coverImage = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80';
  await redis.set('voad:blogs', blogs);
  return res.json({ ok: true, newImage: blogs[idx].coverImage });
};
