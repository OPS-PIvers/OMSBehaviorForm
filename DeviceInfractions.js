/**
 * Device Infraction Counts & Alerts
 *
 * Counts "device infraction" behaviors on the Behavior Form per student and per
 * quarter, writes the counts to Directory columns N-R (replacing the old array
 * formulas), and emails a daily 3 PM digest listing students whose count for the
 * current quarter reached a new multiple of the alert step (3, 6, 9, ...).
 *
 * Quarter dates, the alert step, and recipients are saved to the Constants sheet
 * as DEVICE_ALERTS.* keys from the "Quarter Dates & Alert Settings" dialog
 * (DeviceInfractionSettings.html). Alerts already sent are recorded on the
 * "Device Alert Log" sheet so a student is only reported once per level per quarter.
 */

const DEVICE_INFRACTION_TEXT = 'device infraction';
const DEVICE_QUARTER_NAMES = ['Q1', 'Q2', 'Q3', 'Q4'];
const DEVICE_DIRECTORY_FIRST_COL = 14; // Column N: total, then O-R: Q1-Q4
const DEVICE_ALERT_LOG_SHEET = 'Device Alert Log';
const DEVICE_ALERT_DEFAULT_STEP = 3;
// A quarter that ended within this many days is still checked, so infractions
// logged after the 3 PM run on a quarter's last day are not missed.
const DEVICE_ALERT_LOOKBACK_DAYS = 7;

// --- Settings ---

/**
 * Reads the device alert settings from CONFIG. Call loadConstants() first.
 * Dates are "yyyy-MM-dd" strings; an unset date is "".
 */
function getDeviceAlertSettings() {
  const saved = CONFIG.DEVICE_ALERTS || {};
  const step = parseInt(saved.THRESHOLD_STEP, 10);
  const fallbackRecipient = (CONFIG.ADMIN_EMAILS && CONFIG.ADMIN_EMAILS.ASSOCIATE_PRINCIPAL) || '';

  return {
    quarters: DEVICE_QUARTER_NAMES.map(function(name) {
      return {
        name: name,
        start: normalizeDeviceDate(saved[name + '_START']),
        end: normalizeDeviceDate(saved[name + '_END'])
      };
    }),
    thresholdStep: step > 0 ? step : DEVICE_ALERT_DEFAULT_STEP,
    recipients: String(saved.RECIPIENTS || fallbackRecipient).trim()
  };
}

/**
 * Called by the settings dialog. If no quarter dates have been saved yet, the
 * dates are pre-filled from the Directory O-R header text (e.g. "Q1 \n9/1/26-11/3/26").
 */
function getDeviceInfractionSettings() {
  loadConstants();
  const settings = getDeviceAlertSettings();
  if (!settings.quarters.some(isDeviceQuarterConfigured)) {
    fillQuarterDatesFromDirectoryHeaders(settings);
  }
  return settings;
}

/**
 * Called by the settings dialog. Validates and saves the settings to the
 * Constants sheet, then recounts Directory N-R.
 * @param {{quarters: Array<{start: string, end: string}>, thresholdStep: string, recipients: string}} form
 * @return {{success: boolean, message: string}}
 */
function saveDeviceInfractionSettings(form) {
  loadConstants();

  const quarters = DEVICE_QUARTER_NAMES.map(function(name, i) {
    const q = (form.quarters || [])[i] || {};
    return { name: name, start: String(q.start || '').trim(), end: String(q.end || '').trim() };
  });
  const step = Number(form.thresholdStep);
  const recipients = String(form.recipients || '')
    .split(/[,;\s]+/)
    .filter(function(email) { return email; });

  const errors = validateDeviceAlertSettings(quarters, step, recipients);
  if (errors.length > 0) {
    return { success: false, message: errors.join('\n') };
  }

  const values = {};
  quarters.forEach(function(q) {
    values['DEVICE_ALERTS.' + q.name + '_START'] = q.start;
    values['DEVICE_ALERTS.' + q.name + '_END'] = q.end;
  });
  values['DEVICE_ALERTS.THRESHOLD_STEP'] = step;
  values['DEVICE_ALERTS.RECIPIENTS'] = recipients.join(', ');
  setConstantValues(values);

  loadConstants();
  const result = recountDeviceInfractions();
  const studentCount = Object.keys(result.counts).length;
  return {
    success: true,
    message: 'Saved. Directory columns N-R now show counts for ' + studentCount +
      ' student' + (studentCount === 1 ? '' : 's') + ' with device infractions this school year.'
  };
}

/**
 * @return {Array<string>} Human-readable problems; empty when the settings are valid.
 */
function validateDeviceAlertSettings(quarters, step, recipients) {
  const errors = [];
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  let previous = null;

  quarters.forEach(function(q) {
    if (!q.start && !q.end) return;
    if (!isoDate.test(q.start) || !isoDate.test(q.end)) {
      errors.push(q.name + ' needs both a start date and an end date.');
      return;
    }
    if (q.start > q.end) {
      errors.push(q.name + ' ends before it starts.');
    }
    if (previous && q.start <= previous.end) {
      errors.push(q.name + ' starts before ' + previous.name + ' ends. Check the years.');
    }
    previous = q;
  });

  if (!quarters.some(isDeviceQuarterConfigured)) {
    errors.push('Enter dates for at least one quarter.');
  }
  if (!(Number.isInteger(step) && step >= 1 && step <= 50)) {
    errors.push('The alert step must be a whole number from 1 to 50.');
  }
  if (recipients.length === 0) {
    errors.push('Add at least one email address to send the alert to.');
  }
  const invalid = recipients.filter(function(email) { return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); });
  if (invalid.length > 0) {
    errors.push('Not a valid email address: ' + invalid.join(', '));
  }
  return errors;
}

/**
 * Writes key/value pairs to the Constants sheet, updating a key's row if it
 * exists and appending a row if it doesn't. Values are stored as plain text so
 * Sheets doesn't turn "2026-09-01" into a date.
 * @param {Object<string, *>} values e.g. {"DEVICE_ALERTS.Q1_START": "2026-09-01"}
 */
function setConstantValues(values) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DEFAULT_CONSTANTS.SHEET_NAMES.CONSTANTS);
  if (!sheet) {
    throw new Error('Constants sheet not found. Run Admin > Setup Constants Sheet first.');
  }

  const lastRow = sheet.getLastRow();
  const keys = lastRow >= 2
    ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().map(function(r) { return String(r[0]).trim(); })
    : [];

  Object.keys(values).forEach(function(key) {
    let index = keys.indexOf(key);
    if (index === -1) {
      keys.push(key);
      index = keys.length - 1;
      sheet.getRange(index + 2, 1).setValue(key);
    }
    sheet.getRange(index + 2, 2).setNumberFormat('@').setValue(String(values[key]));
  });
}

function fillQuarterDatesFromDirectoryHeaders(settings) {
  const directory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAMES.DIRECTORY);
  if (!directory || directory.getLastColumn() < DEVICE_DIRECTORY_FIRST_COL + 4) return;

  const headers = directory.getRange(1, DEVICE_DIRECTORY_FIRST_COL + 1, 1, 4).getDisplayValues()[0];
  headers.forEach(function(text, i) {
    const match = String(text).match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s*[-–]\s*(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    if (!match) return;
    settings.quarters[i].start = toIsoDeviceDate(match[3], match[1], match[2]);
    settings.quarters[i].end = toIsoDeviceDate(match[6], match[4], match[5]);
  });
}

// --- Date helpers ---

function normalizeDeviceDate(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return formatDeviceDate(value);
  }
  const text = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : '';
}

/** Formats a Date as "yyyy-MM-dd" in the script time zone. These strings compare correctly with < and >. */
function formatDeviceDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function toIsoDeviceDate(year, month, day) {
  const fullYear = year.length === 2 ? '20' + year : year;
  return fullYear + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
}

/** "2026-09-01" -> "9/1/26" (matches the existing Directory header style). */
function shortDeviceDate(isoDate) {
  const parts = isoDate.split('-');
  return Number(parts[1]) + '/' + Number(parts[2]) + '/' + parts[0].slice(2);
}

/** "2026-09-01" -> "Sep 1, 2026" */
function longDeviceDate(isoDate) {
  const tz = Session.getScriptTimeZone();
  return Utilities.formatDate(Utilities.parseDate(isoDate, tz, 'yyyy-MM-dd'), tz, 'MMM d, yyyy');
}

function isDeviceQuarterConfigured(quarter) {
  return Boolean(quarter.start && quarter.end);
}

function deviceStudentKey(first, last) {
  return String(first || '').trim().toLowerCase() + '|' + String(last || '').trim().toLowerCase();
}

// --- Counting ---

/**
 * Counts Behavior Form submissions whose behaviors (column H) include a device
 * infraction, keyed by student name. One submission counts once, even if it
 * lists both a phone and a computer infraction. Only submissions between the
 * first configured quarter's start and the last configured quarter's end count
 * toward the total.
 * @return {Object<string, {first: string, last: string, grade: *, total: number, quarters: Array<number>}>}
 */
function countDeviceInfractions(ss, settings) {
  const counts = {};
  const configured = settings.quarters.filter(isDeviceQuarterConfigured);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
  if (!sheet || sheet.getLastRow() < 2 || configured.length === 0) return counts;

  const yearStart = configured[0].start;
  const yearEnd = configured[configured.length - 1].end;
  const numCols = Math.min(20, sheet.getLastColumn()); // A (timestamp) through T (grade level)
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, numCols).getValues();

  rows.forEach(function(row) {
    if (String(row[7] || '').toLowerCase().indexOf(DEVICE_INFRACTION_TEXT) === -1) return;

    const first = String(row[2] || '').trim();
    const last = String(row[3] || '').trim();
    if (!first && !last) return;

    const submitted = row[0] instanceof Date ? row[0] : new Date(row[0]);
    if (isNaN(submitted.getTime())) return;
    const day = formatDeviceDate(submitted);
    if (day < yearStart || day > yearEnd) return;

    const key = deviceStudentKey(first, last);
    if (!counts[key]) {
      counts[key] = { first: first, last: last, grade: numCols >= 20 ? row[19] : '', total: 0, quarters: [0, 0, 0, 0] };
    }
    const entry = counts[key];
    entry.total++;
    settings.quarters.forEach(function(q, i) {
      if (isDeviceQuarterConfigured(q) && day >= q.start && day <= q.end) {
        entry.quarters[i]++;
      }
    });
  });

  return counts;
}

/**
 * Recounts device infractions and writes them to Directory N (total) and O-R
 * (Q1-Q4), overwriting any formulas there. The O-R headers are rewritten from
 * the saved quarter dates. Does nothing to the Directory until at least one
 * quarter has dates, so existing formulas stay put until the settings are saved.
 * @return {{settings: Object, counts: Object}}
 */
function recountDeviceInfractions() {
  loadConstants();
  const settings = getDeviceAlertSettings();
  if (!settings.quarters.some(isDeviceQuarterConfigured)) {
    Logger.log('Device infractions: no quarter dates saved yet, skipping recount.');
    return { settings: settings, counts: {} };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const directory = ss.getSheetByName(CONFIG.SHEET_NAMES.DIRECTORY);
  if (!directory) {
    throw new Error('Sheet "' + CONFIG.SHEET_NAMES.DIRECTORY + '" not found.');
  }

  // Teachers can submit at the same time; only one recount writes at once.
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const counts = countDeviceInfractions(ss, settings);
    writeDeviceDirectoryHeaders(directory, settings);

    const lastRow = directory.getLastRow();
    if (lastRow >= 2) {
      const students = directory.getRange(2, 1, lastRow - 1, 3).getValues(); // A first, B last, C grade
      const output = students.map(function(student) {
        if (!String(student[0]).trim() && !String(student[1]).trim()) {
          return ['', '', '', '', ''];
        }
        const entry = counts[deviceStudentKey(student[0], student[1])];
        if (entry) {
          // Prefer the Directory's spelling and grade in the alert email.
          entry.first = String(student[0]).trim();
          entry.last = String(student[1]).trim();
          if (student[2] !== '') entry.grade = student[2];
        }
        return [entry ? entry.total : 0].concat(settings.quarters.map(function(q, i) {
          if (!isDeviceQuarterConfigured(q)) return '';
          return entry ? entry.quarters[i] : 0;
        }));
      });
      directory.getRange(2, DEVICE_DIRECTORY_FIRST_COL, output.length, 5).setValues(output);
    }

    Logger.log('Device infractions recounted for ' + Object.keys(counts).length + ' students.');
    return { settings: settings, counts: counts };
  } finally {
    lock.releaseLock();
  }
}

function writeDeviceDirectoryHeaders(directory, settings) {
  const range = directory.getRange(1, DEVICE_DIRECTORY_FIRST_COL, 1, 5);
  const totalHeader = range.getFormulas()[0][0] || !range.getDisplayValues()[0][0]
    ? 'Device Infractions\nTotal'
    : range.getValues()[0][0];

  const quarterHeaders = settings.quarters.map(function(q) {
    return isDeviceQuarterConfigured(q)
      ? q.name + '\n' + shortDeviceDate(q.start) + '-' + shortDeviceDate(q.end)
      : q.name;
  });
  range.setValues([[totalHeader].concat(quarterHeaders)]);
}

// --- Daily digest ---

/**
 * Time-driven trigger handler (daily, 3 PM). Recounts, then emails the
 * recipients a table of students whose quarter count reached a multiple of the
 * alert step that hasn't been reported yet. Sends nothing when no one did.
 */
function sendDeviceInfractionDigest() {
  const result = recountDeviceInfractions();
  const settings = result.settings;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!settings.recipients) {
    Logger.log('Device infraction digest: no recipients saved, nothing sent.');
    return;
  }

  const logSheet = getDeviceAlertLogSheet(ss);
  const sections = buildDeviceDigestSections(result.counts, settings, readDeviceAlertLevels(logSheet));
  if (sections.length === 0) {
    Logger.log('Device infraction digest: no students reached a new level.');
    return;
  }

  MailApp.sendEmail({
    to: settings.recipients,
    subject: createDeviceDigestSubject(sections),
    htmlBody: createDeviceDigestHTML(sections, settings, ss.getUrl(), false),
    name: CONFIG.SCHOOL_NAME + ' Behavior System',
    noReply: true
  });
  appendDeviceAlertLog(logSheet, sections);
  Logger.log('Device infraction digest sent to ' + settings.recipients);
}

/**
 * Menu action. Sends the digest to the person clicking, listing every student
 * at or above the alert step this quarter (already-reported ones included).
 * Nothing is written to the Device Alert Log.
 */
function sendTestDeviceInfractionDigest() {
  const ui = SpreadsheetApp.getUi();
  const result = recountDeviceInfractions();
  const settings = result.settings;

  if (getDeviceQuartersToCheck(settings).length === 0) {
    ui.alert('No quarter is in session today. Check the dates in Device Infractions > Quarter Dates & Alert Settings.');
    return;
  }

  const sections = buildDeviceDigestSections(result.counts, settings, {});
  if (sections.length === 0) {
    ui.alert('No student has ' + settings.thresholdStep + ' or more device infractions this quarter, so there is nothing to preview yet.');
    return;
  }

  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail({
    to: me,
    subject: '[Test] ' + createDeviceDigestSubject(sections),
    htmlBody: createDeviceDigestHTML(sections, settings, SpreadsheetApp.getActiveSpreadsheet().getUrl(), true),
    name: CONFIG.SCHOOL_NAME + ' Behavior System'
  });
  ui.alert('Test alert sent to ' + me + '.');
}

/**
 * Quarters to check today: in session now, or ended within the lookback window.
 * @return {Array<{quarter: Object, index: number}>}
 */
function getDeviceQuartersToCheck(settings) {
  const today = formatDeviceDate(new Date());
  const lookback = formatDeviceDate(new Date(Date.now() - DEVICE_ALERT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000));
  const result = [];
  settings.quarters.forEach(function(q, i) {
    if (isDeviceQuarterConfigured(q) && q.start <= today && q.end >= lookback) {
      result.push({ quarter: q, index: i });
    }
  });
  return result;
}

/**
 * @param {Object<string, number>} alertedLevels Highest level already reported,
 *   keyed by quarter start + "|" + student key.
 * @return {Array<{quarter: Object, rows: Array}>} One section per quarter with at least one student.
 */
function buildDeviceDigestSections(counts, settings, alertedLevels) {
  const step = settings.thresholdStep;

  return getDeviceQuartersToCheck(settings).map(function(item) {
    const rows = [];
    Object.keys(counts).forEach(function(key) {
      const entry = counts[key];
      const count = entry.quarters[item.index];
      const level = Math.floor(count / step) * step;
      if (level < step) return;
      if (level <= (alertedLevels[item.quarter.start + '|' + key] || 0)) return;
      rows.push({ key: key, entry: entry, count: count, level: level });
    });

    rows.sort(function(a, b) {
      return b.count - a.count ||
        a.entry.last.localeCompare(b.entry.last) ||
        a.entry.first.localeCompare(b.entry.first);
    });
    return { quarter: item.quarter, rows: rows };
  }).filter(function(section) {
    return section.rows.length > 0;
  });
}

function getDeviceAlertLogSheet(ss) {
  let sheet = ss.getSheetByName(DEVICE_ALERT_LOG_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(DEVICE_ALERT_LOG_SHEET);
    sheet.getRange(1, 1, 1, 9)
      .setValues([['Sent', 'Quarter', 'Quarter Start', 'Student First', 'Student Last', 'Grade', 'Quarter Count', 'Alert Level', 'Year Total']])
      .setFontWeight('bold');
    sheet.getRange('C:C').setNumberFormat('@');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** @return {Object<string, number>} Highest alert level sent, keyed by quarter start + "|" + student key. */
function readDeviceAlertLevels(logSheet) {
  const levels = {};
  const lastRow = logSheet.getLastRow();
  if (lastRow < 2) return levels;

  logSheet.getRange(2, 1, lastRow - 1, 8).getValues().forEach(function(row) {
    const key = normalizeDeviceDate(row[2]) + '|' + deviceStudentKey(row[3], row[4]);
    const level = Number(row[7]) || 0;
    if (level > (levels[key] || 0)) levels[key] = level;
  });
  return levels;
}

function appendDeviceAlertLog(logSheet, sections) {
  const now = new Date();
  const rows = [];
  sections.forEach(function(section) {
    section.rows.forEach(function(r) {
      rows.push([now, section.quarter.name, section.quarter.start, r.entry.first, r.entry.last,
        r.entry.grade, r.count, r.level, r.entry.total]);
    });
  });
  logSheet.getRange(logSheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function countDeviceDigestStudents(sections) {
  const keys = {};
  sections.forEach(function(section) {
    section.rows.forEach(function(r) { keys[r.key] = true; });
  });
  return Object.keys(keys).length;
}

function createDeviceDigestSubject(sections) {
  const students = countDeviceDigestStudents(sections);
  const quarterNames = sections.map(function(s) { return s.quarter.name; }).join(' & ');
  return 'Device infractions: ' + students + ' student' + (students === 1 ? '' : 's') +
    ' reached a new level (' + quarterNames + ')';
}

/**
 * Builds the digest email. Styles are inline and the layout uses tables so it
 * renders the same in Gmail on desktop and mobile.
 */
function createDeviceDigestHTML(sections, settings, sheetUrl, isTest) {
  const tz = Session.getScriptTimeZone();
  const step = settings.thresholdStep;
  const students = countDeviceDigestStudents(sections);
  const today = Utilities.formatDate(new Date(), tz, 'EEEE, MMMM d, yyyy');
  const bodyFont = 'font-family:Roboto,Arial,Helvetica,sans-serif;';
  const headingFont = 'font-family:Lexend,Arial,Helvetica,sans-serif;';
  const cell = 'padding:12px 16px;border-top:1px solid #e0e0e0;' + bodyFont;
  const headCell = 'padding:10px 16px;background-color:#eaecf5;color:#1d2a5d;font-size:12px;font-weight:700;' +
    'text-transform:uppercase;letter-spacing:0.04em;' + bodyFont;

  const testNote = isTest ? `
    <tr><td style="padding:20px 28px 0;">
      <div style="padding:12px 16px;border-radius:8px;background-color:#f3f3f3;color:#333333;font-size:14px;line-height:1.5;${bodyFont}">
        <strong>Test copy, sent only to you.</strong> It lists every student at ${step} or more this quarter,
        including students already reported. Nothing was added to the Device Alert Log.
      </div>
    </td></tr>` : '';

  const sectionsHTML = sections.map(function(section) {
    const q = section.quarter;
    const rowsHTML = section.rows.map(function(r) {
      const grade = r.entry.grade !== '' && r.entry.grade !== undefined
        ? `<div style="margin-top:2px;font-size:13px;color:#666666;">Grade ${escapeHTML(r.entry.grade)}</div>`
        : '';
      return `
        <tr>
          <td style="${cell}font-size:15px;color:#333333;">
            <div style="font-weight:500;">${escapeHTML(r.entry.first + ' ' + r.entry.last)}</div>${grade}
          </td>
          <td align="center" style="${cell}font-size:15px;color:#333333;">${r.entry.total}</td>
          <td align="center" style="${cell}">
            <span style="display:inline-block;min-width:24px;padding:4px 10px;border-radius:999px;background-color:#f5e3e3;color:#941c1d;font-size:15px;font-weight:700;">${r.count}</span>
          </td>
        </tr>`;
    }).join('');

    return `
      <tr><td style="padding:20px 28px 0;">
        <div style="${headingFont}font-size:16px;font-weight:600;color:#1d2a5d;">${q.name}</div>
        <div style="margin:2px 0 12px;font-size:13px;color:#666666;${bodyFont}">${longDeviceDate(q.start)} to ${longDeviceDate(q.end)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:8px;border-collapse:separate;overflow:hidden;">
          <tr>
            <th align="left" style="${headCell}">Student</th>
            <th align="center" style="${headCell}">Year total</th>
            <th align="center" style="${headCell}">${q.name} count</th>
          </tr>
          ${rowsHTML}
        </table>
      </td></tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f6fa;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6fa;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:8px;border-collapse:separate;overflow:hidden;">
        <tr><td style="padding:24px 28px;background-color:#1d2a5d;border-bottom:4px solid #ad2122;">
          <div style="${bodyFont}font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#c0c7e0;">${escapeHTML(CONFIG.SCHOOL_NAME)}</div>
          <div style="${headingFont}margin-top:4px;font-size:22px;font-weight:700;color:#ffffff;">Device infraction alert</div>
          <div style="${bodyFont}margin-top:4px;font-size:14px;color:#c0c7e0;">${today}</div>
        </td></tr>
        ${testNote}
        <tr><td style="padding:24px 28px 0;${bodyFont}font-size:15px;line-height:1.6;color:#333333;">
          ${students} student${students === 1 ? '' : 's'} reached a new device infraction level.
          A student is listed each time their count for the quarter reaches a multiple of ${step}
          (${step}, ${step * 2}, ${step * 3}, and so on). Counts start over at zero each quarter.
        </td></tr>
        ${sectionsHTML}
        <tr><td style="padding:28px 28px 8px;">
          <a href="${escapeHTML(sheetUrl)}" style="display:inline-block;padding:12px 20px;border-radius:8px;background-color:#2d3f89;color:#ffffff;text-decoration:none;font-size:15px;font-weight:500;${bodyFont}">Open the behavior spreadsheet</a>
        </td></tr>
        <tr><td style="padding:16px 28px 24px;${bodyFont}font-size:12px;line-height:1.5;color:#808080;">
          Counts come from device infractions logged on the Behavior Form. Quarter dates and the alert step are set in the
          spreadsheet under Behavior System &gt; Device Infractions &gt; Quarter Dates &amp; Alert Settings.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// --- Menu actions ---

function showDeviceInfractionSettings() {
  const template = HtmlService.createTemplateFromFile('DeviceInfractionSettings');
  // Escape "<" so the JSON can't close the <script> tag it's injected into.
  template.settingsJson = JSON.stringify(getDeviceInfractionSettings()).replace(/</g, '\\u003c');
  const html = template.evaluate().setWidth(480).setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Device Infraction Settings');
}

function recountDeviceInfractionsFromMenu() {
  const ui = SpreadsheetApp.getUi();
  const result = recountDeviceInfractions();
  if (!result.settings.quarters.some(isDeviceQuarterConfigured)) {
    ui.alert('Save the quarter dates first: Device Infractions > Quarter Dates & Alert Settings.');
    return;
  }
  const studentCount = Object.keys(result.counts).length;
  ui.alert('Recount finished. ' + studentCount + ' student' + (studentCount === 1 ? ' has' : 's have') +
    ' device infractions this school year.');
}

function turnOnDeviceInfractionAlerts() {
  loadConstants();
  const ui = SpreadsheetApp.getUi();
  const settings = getDeviceAlertSettings();
  if (!settings.quarters.some(isDeviceQuarterConfigured)) {
    ui.alert('Save the quarter dates first: Device Infractions > Quarter Dates & Alert Settings.');
    return;
  }

  removeDeviceInfractionDigestTrigger();
  ScriptApp.newTrigger('sendDeviceInfractionDigest')
    .timeBased()
    .atHour(15)
    .everyDays(1)
    .create();

  ui.alert('The daily device infraction alert is on. It runs between 3 and 4 PM, sends to ' +
    settings.recipients + ', and comes from ' + Session.getEffectiveUser().getEmail() +
    '. Days when no student reaches a new level send nothing.');
}

function turnOffDeviceInfractionAlerts() {
  const removed = removeDeviceInfractionDigestTrigger();
  SpreadsheetApp.getUi().alert(removed > 0
    ? 'The daily device infraction alert is off.'
    : 'The daily device infraction alert was not on for your account. Triggers belong to the person who turned them on.');
}

/** @return {number} How many triggers were removed. */
function removeDeviceInfractionDigestTrigger() {
  let removed = 0;
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'sendDeviceInfractionDigest') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });
  return removed;
}
