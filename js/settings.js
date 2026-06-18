/* ============================================================
   VOAD — settings.js
   Fetches site image settings from /api/settings and applies
   them to elements with data-setting attributes.
   ============================================================ */

async function applySettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const s = await res.json();

    document.querySelectorAll('[data-setting]').forEach(el => {
      const key = el.dataset.setting;
      if (!s[key]) return;
      if (el.tagName === 'IMG') {
        el.src = s[key];
      } else {
        el.style.backgroundImage = `url('${s[key]}')`;
      }
    });
  } catch (_) {}
}

document.addEventListener('DOMContentLoaded', applySettings);
