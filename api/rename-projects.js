const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const KEY = 'voad:projects';

const RENAMES = {
  'The-Ivory-House':    'the-ivory-house',
  'The-Framed-Residence': 'the-framed-residence',
  'THE-BRICK-HOUSE':    'the-brick-house',
};

const TITLE_FIXES = {
  'THE BRICK HOUSE': 'The Brick House',
};

module.exports = async function handler(req, res) {
  if (req.query.secret !== 'voad-rename-2026') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    let projects = await redis.get(KEY);
    if (!projects || !Array.isArray(projects)) {
      return res.status(404).json({ error: 'No projects found in Redis' });
    }

    let renamed = 0;
    let titleFixed = 0;

    projects = projects.map(p => {
      let updated = { ...p };
      if (RENAMES[p.id]) {
        updated.id = RENAMES[p.id];
        renamed++;
      }
      if (TITLE_FIXES[p.title]) {
        updated.title = TITLE_FIXES[p.title];
        titleFixed++;
      }
      return updated;
    });

    await redis.set(KEY, projects);
    return res.json({ ok: true, renamed, titleFixed, ids: projects.map(p => p.id) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
