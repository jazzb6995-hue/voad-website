module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();

  res.json({
    cloudName:    process.env.CLOUDINARY_CLOUD_NAME    || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || ''
  });
};
