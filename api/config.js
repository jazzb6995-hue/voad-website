module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  res.json({
    cloudName:    process.env.CLOUDINARY_CLOUD_NAME    || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || ''
  });
};
