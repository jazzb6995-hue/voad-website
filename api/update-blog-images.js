const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const KEY = 'voad:blogs';

// New cover images — chosen to match each blog's topic and feel authentic
const IMAGE_MAP = {
  // Ahmedabad: modern Indian residential exterior — clean lines, warm stone
  'architect-ahmedabad':
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',

  // Surat: warm, custom-feeling luxury living room — rich fabrics, considered lighting
  'interior-designer-surat':
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',

  // Vadodara: elegant heritage-inflected interior — arched doorway, layered warmth
  'home-design-vadodara':
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',

  // Rajkot architecture firm: architect reviewing drawings with a client — process and trust
  'best-architecture-firm-rajkot':
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',

  // Gujarat residential: natural stone, warm tones, earthy materials — feels like Gujarat
  'residential-interior-gujarat':
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
};

module.exports = async function handler(req, res) {
  if (req.query.secret !== 'voad-img-2026') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    let blogs = await redis.get(KEY);
    if (!blogs || !Array.isArray(blogs)) {
      return res.status(404).json({ error: 'No blogs found in Redis' });
    }

    let updated = 0;
    blogs = blogs.map(b => {
      if (IMAGE_MAP[b.id]) {
        updated++;
        return { ...b, coverImage: IMAGE_MAP[b.id] };
      }
      return b;
    });

    await redis.set(KEY, blogs);
    return res.json({ ok: true, updated, ids: Object.keys(IMAGE_MAP) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
