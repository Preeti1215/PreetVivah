// Google Apps Script that saves RSVPs from the wedding site into the sheet it is attached to.
// Setup: open the sheet -> Extensions -> Apps Script -> paste this file -> Deploy -> New deployment
// -> type "Web app", Execute as "Me", Who has access "Anyone" -> copy the /exec URL into
// RSVP_SHEET_URL in index.html.

const HEADERS = ['Date & time (IST)', 'Name', 'Attending', 'Guests', 'Arrival', 'Travel', 'Note', 'Invite link name'];
const ATTENDING = { yes: 'Joyfully accepts', maybe: 'Hoping to make it', no: 'Celebrating from afar' };

function save_(p) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    const name = (p.name || '').trim();
    if (!name) return;
    const attending = p.attending || '';
    const row = [
      Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a'), name, ATTENDING[attending] || attending,
      attending === 'no' ? '' : p.count || '', attending === 'no' ? '' : p.arrival || '',
      attending === 'no' ? '' : p.travel || '', p.note || '', p.guest || ''
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

// The site POSTs the RSVP here.
function doPost(e) {
  save_(e.parameter);
  return ContentService.createTextOutput('ok');
}

// The "Confirm my RSVP" button opens this link (used when a direct POST is blocked).
function doGet(e) {
  save_(e.parameter);
  return HtmlService.createHtmlOutput(
    '<body style="font-family:Georgia,serif;text-align:center;padding:48px;color:#6b4220;background:#fbf7ee">' +
    '<h2>Thank you!</h2><p>Your RSVP has been saved. You can close this tab.</p></body>');
}
