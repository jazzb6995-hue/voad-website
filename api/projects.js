const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');
const fs  = require('fs');
const path = require('path');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const KEY = 'voad:projects';

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function seedIfEmpty() {
  const existing = await redis.get(KEY);
  if (existing && Array.isArray(existing) && existing.length > 0) return existing;
  const file = path.join(process.cwd(), 'data', 'projects.json');
  const seed = JSON.parse(fs.readFileSync(file, 'utf8'));
  await redis.set(KEY, seed);
  return seed;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  /* ── GET: list all projects ── */
  if (req.method === 'GET') {
    try {
      const projects = await seedIfEmpty();
      return res.json(projects);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── POST: create or update a project ── */
  if (req.method === 'POST') {
    try {
      verifyToken(req);
    } catch {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    try {
      const project  = req.body;
      if (!project || !project.id) return res.status(400).json({ error: 'Missing project id' });

      let projects = await seedIfEmpty();

      const idx = projects.findIndex(p => p.id === project.id);
      if (idx >= 0) {
        projects[idx] = project;
      } else {
        projects.unshift(project);
      }

      await redis.set(KEY, projects);
      return res.json({ ok: true, project });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── DELETE: remove a project ── */
  if (req.method === 'DELETE') {
    try {
      verifyToken(req);
    } catch {
      return res.status(401).json({ error: 'Unauthorised' });
    }
    try {
      const { id } = req.body || req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });

      let projects = await seedIfEmpty();
      projects = projects.filter(p => p.id !== id);
      await redis.set(KEY, projects);
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).end();
};
