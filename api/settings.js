const { Redis } = require('@upstash/redis');
const jwt = require('jsonwebtoken');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const DEFAULTS = {
  heroImage:          'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=80',
  portfolioHeroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
  aboutHeroImage:     'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80',
  contactHeroImage:   'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80',
  homeAboutImage:     'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80',
  founderImage:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
  aboutStudioImage:   'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  contactClosingImage:'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&q=80',
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const saved = await redis.get('voad:settings');
    return res.json({ ...DEFAULTS, ...(saved || {}) });
  }

  if (req.method === 'POST') {
    const auth  = (req.headers.authorization || '').replace('Bearer ', '');
    try { jwt.verify(auth, process.env.JWT_SECRET); } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const current = { ...DEFAULTS, ...((await redis.get('voad:settings')) || {}) };
    const updated = { ...current, ...req.body };
    await redis.set('voad:settings', updated);
    return res.json({ ok: true, settings: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
