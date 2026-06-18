/**
 * VOAD — Google Apps Script
 * ─────────────────────────────────────────────────────────────
 * INSTRUCTIONS:
 *  1. Go to script.google.com → New Project
 *  2. Delete all existing code
 *  3. Paste this entire file
 *  4. Click Deploy → New Deployment → Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy the deployment URL
 *  6. Paste it into js/config.js  →  appsScriptUrl: 'PASTE_HERE'
 *  7. Set liveFromSheets: true in js/config.js
 * ─────────────────────────────────────────────────────────────
 * ADDING A PROJECT: open the "Projects" sheet, add a new row.
 * DELETING A PROJECT: delete that row in the "Projects" sheet.
 * FORM SUBMISSIONS: appear automatically in the "Contact" sheet.
 * ─────────────────────────────────────────────────────────────
 */

// ── GET: returns project list OR health check ──────────────────
function doGet(e) {
  const type = (e.parameter && e.parameter.type) || 'projects';

  if (type === 'projects') {
    return respond(getProjects());
  }

  // health check: ?type=ping
  return respond({ status: 'ok', time: new Date().toISOString() });
}

// ── POST: saves contact form submission ────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.type === 'contact') saveContact(body);
  } catch (_) { /* silent — no-cors requests have no response */ }
  return respond({ ok: true });
}

// ── READ PROJECTS FROM SHEET ───────────────────────────────────
function getProjects() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Projects');

  if (!sheet) return [];

  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];

  var headers = rows[0].map(function(h) {
    return String(h).trim();
  });

  return rows.slice(1)
    .filter(function(r) { return r[0]; }) // skip empty rows
    .map(function(r) {
      var obj = {};
      headers.forEach(function(h, i) {
        obj[h] = r[i] !== undefined && r[i] !== null ? String(r[i]).trim() : '';
      });
      return obj;
    });
}

// ── SAVE CONTACT SUBMISSION ────────────────────────────────────
function saveContact(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Contact');

  // Create Contact sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Contact');
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Phone',
      'Project Type', 'Location', 'Message'
    ]);
    // Freeze header row
    sheet.setFrozenRows(1);
    // Bold headers
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    data.name        || '',
    data.email       || '',
    data.phone       || '',
    data.projectType || '',
    data.location    || '',
    data.message     || ''
  ]);
}

// ── JSON RESPONSE HELPER ───────────────────────────────────────
function respond(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
