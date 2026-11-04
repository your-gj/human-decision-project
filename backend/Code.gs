/**
 * The Human Decision Project — free submission collector (Google Apps Script + Google Sheets)
 *
 * Setup (about 5 minutes, free):
 * 1. Create a new Google Sheet (e.g. "HDP Submissions").
 * 2. In the sheet: Extensions → Apps Script. Delete the sample code and paste this whole file.
 * 3. Change ADMIN_KEY below to your own private key. Save.
 * 4. Deploy → New deployment → type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Deploy, approve the permissions, and copy the Web app URL (ends in /exec).
 * 5. Put that URL into SUBMIT_URL at the top of the script in index.html.
 *
 * Participants can only ADD submissions. Reading the list needs ADMIN_KEY, checked here on
 * Google's server, so the key is never inside the public website.
 */
const ADMIN_KEY = 'CHANGE-ME-to-a-long-private-key';
const SHEET_NAME = 'Submissions';
const MAX_BYTES = 48000; // one Sheets cell holds up to 50,000 characters

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'submit') return json_(saveSubmission_(body.payload));
    if (body.action === 'list') {
      if (String(body.key || '') !== ADMIN_KEY) return json_({ ok: false, error: 'unauthorized' });
      return json_({ ok: true, items: listSubmissions_() });
    }
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: 'bad request' });
  }
}

function doGet() {
  return json_({ ok: true, service: 'human-decision-project' });
}

function saveSubmission_(p) {
  if (!p || !/^human-decision-project\/\d+$/.test(p.schema || '') || !/^HDP-\d{8}-[A-Z0-9]{4,8}$/.test(p.assessmentId || '') || !Array.isArray(p.responses)) {
    return { ok: false, error: 'invalid submission' };
  }
  const raw = JSON.stringify(p);
  if (raw.length > MAX_BYTES) return { ok: false, error: 'too large' };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const last = sh.getLastRow();
    if (last > 1) {
      const ids = sh.getRange(2, 2, last - 1, 1).getValues().map(r => r[0]);
      if (ids.indexOf(p.assessmentId) >= 0) return { ok: true, duplicate: true };
    }
    sh.appendRow([
      new Date(),
      p.assessmentId,
      safe_(p.participant && p.participant.name),
      safe_(p.completedAt),
      Number(p.totals && p.totals.answered) || 0,
      Number(p.totals && p.totals.unanswered) || 0,
      Number(p.timeTakenSeconds) || 0,
      safe_(p.submissionType),
      raw
    ]);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function listSubmissions_() {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 9, last - 1, 1).getValues()
    .map(r => { try { return JSON.parse(r[0]); } catch (_) { return null; } })
    .filter(Boolean);
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Received', 'Assessment ID', 'Name', 'Completed', 'Answered', 'Unanswered', 'Time taken (s)', 'Submission', 'Data']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Stop a name like "=HYPERLINK(...)" being read as a formula.
function safe_(v) {
  const s = String(v == null ? '' : v).slice(0, 120);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
