const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');
const fs  = require('fs');
const path = require('path');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const KEY = 'voad:blogs';

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function seedIfEmpty() {
  const existing = await redis.get(KEY);
  if (existing && Array.isArray(existing) && existing.length > 0) return existing;
  const file = path.join(process.cwd(), 'data', 'blogs.json');
  const seed = JSON.parse(fs.readFileSync(file, 'utf8'));
  await redis.set(KEY, seed);
  return seed;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  /* ── GET: list all blogs ── */
  if (req.method === 'GET') {
    try {
      const blogs = await seedIfEmpty();
      return res.json(blogs);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── POST: create or update a blog post ── */
  if (req.method === 'POST') {
    try {
      verifyToken(req);
    } catch {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    try {
      const blog = req.body;
      if (!blog || !blog.id) return res.status(400).json({ error: 'Missing blog id' });

      let blogs = await seedIfEmpty();

      const idx = blogs.findIndex(b => b.id === blog.id);
      if (idx >= 0) {
        blogs[idx] = blog;
      } else {
        blogs.unshift(blog);
      }

      await redis.set(KEY, blogs);
      return res.json({ ok: true, blog });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── DELETE: remove a blog post ── */
  if (req.method === 'DELETE') {
    try {
      verifyToken(req);
    } catch {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    try {
      const { id } = req.body || req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      let blogs = await seedIfEmpty();
      blogs = blogs.filter(b => b.id !== id);
      await redis.set(KEY, blogs);
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).end();
};
