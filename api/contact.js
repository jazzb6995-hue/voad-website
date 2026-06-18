const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, phone, projectType, location, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#B85C38;margin-bottom:4px;">New Enquiry — VOAD Architecture</h2>
      <hr style="border:1px solid #eee;margin:16px 0;" />
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;width:140px;">Name</td><td style="padding:6px 0;"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;">${email}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Phone</td><td style="padding:6px 0;">${phone || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Project Type</td><td style="padding:6px 0;">${projectType || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Location</td><td style="padding:6px 0;">${location || '—'}</td></tr>
      </table>
      <hr style="border:1px solid #eee;margin:16px 0;" />
      <p style="color:#333;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
      <hr style="border:1px solid #eee;margin:24px 0 8px;" />
      <p style="color:#aaa;font-size:12px;">Sent from voadarchitecture.com contact form</p>
    </div>`;

  const toEmail = process.env.NOTIFICATION_EMAIL || 'jash.bavishi1@gmail.com';

  try {
    await resend.emails.send({
      from:    'VOAD Website <onboarding@resend.dev>',
      to:      toEmail,
      replyTo: email,
      subject: `New Enquiry from ${name} — VOAD`,
      html
    });
    res.json({ ok: true });
  } catch (e) {
    console.error('Resend error:', e);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
};
