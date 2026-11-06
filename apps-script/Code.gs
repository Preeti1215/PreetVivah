// Google Apps Script that saves RSVPs from the wedding site into the sheet it is attached to.
// Setup: open the sheet -> Extensions -> Apps Script -> paste this file -> Deploy -> New deployment
// -> type "Web app", Execute as "Me", Who has access "Anyone" -> copy the /exec URL into
// RSVP_SHEET_URL in index.html.

const HEADERS = ['Date & time (IST)', 'Name', 'Attending', 'Guests', 'Arrival', 'Travel', 'Note', 'guestName', 'Departure'];   // Departure last, so existing rows keep their columns
const ATTENDING = { yes: 'Joyfully accepts', maybe: 'Hoping to make it', no: 'Celebrating from afar' };

function save_(p) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    else sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);   // keep headers current for existing sheets
    sheet.setFrozenRows(1);
    const name = (p.name || '').trim();
    if (!name) return;
    const attending = p.attending || '';
    const row = [
      Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a'), name, ATTENDING[attending] || attending,
      attending === 'no' ? '' : p.count || '', attending === 'no' ? '' : p.arrival || '',
      attending === 'no' ? '' : p.travel || '', p.note || '', p.guestName || '',
      attending === 'no' ? '' : p.departure || ''
    ];
    // A guest who changes their answer updates their existing row instead of adding a duplicate.
    const names = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    const i = names.findIndex(n => String(n).trim().toLowerCase() === name.toLowerCase());
    if (i >= 0 && sheet.getLastRow() > 1) sheet.getRange(i + 2, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

// ---- Cheer stats for the wardrobe cards (Team Groom vs Team Bride, Style vs Story, Juta Chupai bet) ----
// Counts live in a "Cheers" tab: one row per side, column B is how many guests picked it.
const CHEER_TEAMS = ['groom', 'bride', 'sparkle', 'story', 'jgroom', 'jbride'];

function cheerSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Cheers');
  if (!sh) {
    sh = ss.insertSheet('Cheers');
    sh.appendRow(['Side', 'Guests who picked it']);
    CHEER_TEAMS.forEach(t => sh.appendRow([t, 0]));
    sh.setFrozenRows(1);
  }
  return sh;
}

function cheerCounts_() {
  const rows = cheerSheet_().getDataRange().getValues().slice(1);
  const out = {};
  rows.forEach(r => { if (CHEER_TEAMS.indexOf(r[0]) >= 0) out[r[0]] = Number(r[1]) || 0; });
  return out;
}

// One vote per guest per card: "team" is their pick, "undo" the side they switched away from (if any).
function cheer_(p) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = cheerSheet_();
    const rows = sh.getDataRange().getValues();
    const bump = (team, by) => {
      if (CHEER_TEAMS.indexOf(team) < 0) return;
      let i = rows.findIndex(r => r[0] === team);
      if (i < 0) { sh.appendRow([team, 0]); rows.push([team, 0]); i = rows.length - 1; }
      rows[i][1] = Math.max(0, (Number(rows[i][1]) || 0) + by);
      sh.getRange(i + 1, 2).setValue(rows[i][1]);
    };
    bump(p.team, 1);
    if (p.undo && p.undo !== p.team) bump(p.undo, -1);
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// The site POSTs the RSVP (or a cheer) here.
function doPost(e) {
  if (e.parameter.type === 'cheer') { cheer_(e.parameter); return json_(cheerCounts_()); }
  save_(e.parameter);
  return ContentService.createTextOutput('ok');
}

// The "Confirm my RSVP" button opens this link (used when a direct POST is blocked).
function doGet(e) {
  if (e.parameter.action === 'cheers') return json_(cheerCounts_());   // the site reads the cheer stats here
  save_(e.parameter);
  return HtmlService.createHtmlOutput(
    '<body style="font-family:Georgia,serif;text-align:center;padding:48px;color:#6b4220;background:#fbf7ee">' +
    '<h2>Thank you!</h2><p>Your RSVP has been saved. You can close this tab.</p></body>');
}
