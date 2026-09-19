/**
 * Email Template Management System
 *
 * Stop & Think emails open with a warm, relational paragraph and close with a
 * partnership statement. Both come from the "EmailTemplates" sheet so admins can
 * reword, add, or retire options without a code change or a deploy.
 *
 * The sheet is created and seeded the first time it is missing. It is never
 * overwritten afterwards -- edits made on the sheet are permanent.
 */

// Global holder, populated by loadEmailTemplates(). Like CONFIG and PILLARS_DATA,
// this does not survive between Apps Script executions; every entry point must
// call loadEmailTemplates() before reading it.
var EMAIL_TEMPLATES = { openings: [], closings: [] };

// Placeholder used in the sheet text. Replaced with the student's first name.
const STUDENT_NAME_PLACEHOLDER = "[Student's Name]";

const EMAIL_TEMPLATE_HEADERS = ['Type', 'Category', 'Text', 'Transition', 'Active'];

/**
 * Seed rows for the EmailTemplates sheet: [Type, Category, Text, Transition, Active].
 *
 * Openings pair a warm observation with a transition sentence that pivots to the
 * concern, so one click inserts a finished paragraph. Closings are a single
 * partnership sentence that renders ahead of the standard "These moments..." text.
 */
const DEFAULT_EMAIL_TEMPLATES = [
  [
    'opening',
    'Relational & Connection',
    "I've really enjoyed getting to know " + STUDENT_NAME_PLACEHOLDER + " this year and learning about what makes them shine in our classroom.",
    "Because I care about " + STUDENT_NAME_PLACEHOLDER + "'s ongoing success, I wanted to reach out regarding a few behaviors I observed today.",
    true
  ],
  [
    'opening',
    'Relational & Connection',
    "It has been a pleasure having " + STUDENT_NAME_PLACEHOLDER + " in class—their unique energy and personality bring so much to our community.",
    "To make sure " + STUDENT_NAME_PLACEHOLDER + " continues to thrive, I want to partner with you on addressing a challenge that came up today.",
    true
  ],
  [
    'opening',
    'Relational & Connection',
    "I always look forward to working with " + STUDENT_NAME_PLACEHOLDER + " and watching them engage with our daily activities.",
    "While " + STUDENT_NAME_PLACEHOLDER + " has so many fantastic traits, today we encountered a behavior that doesn't align with what they are capable of.",
    true
  ],
  [
    'opening',
    'Character & Personality Strengths',
    "I deeply value " + STUDENT_NAME_PLACEHOLDER + "'s enthusiasm and positive attitude during class discussions.",
    "Because I care about " + STUDENT_NAME_PLACEHOLDER + "'s ongoing success, I wanted to reach out regarding a few behaviors I observed today.",
    true
  ],
  [
    'opening',
    'Academic & Curiosity Strengths',
    STUDENT_NAME_PLACEHOLDER + " brings fantastic curiosity and bright ideas to our class discussions.",
    "To make sure " + STUDENT_NAME_PLACEHOLDER + " continues to thrive, I want to partner with you on addressing a challenge that came up today.",
    true
  ],
  [
    'opening',
    'Academic & Curiosity Strengths',
    "I am so impressed by " + STUDENT_NAME_PLACEHOLDER + "'s creativity and the hard work they put into their projects.",
    "While " + STUDENT_NAME_PLACEHOLDER + " has so many fantastic traits, today we encountered a behavior that doesn't align with what they are capable of.",
    true
  ],
  [
    'opening',
    'Academic & Curiosity Strengths',
    "When " + STUDENT_NAME_PLACEHOLDER + " locks in on a task, their determination and focus are truly impressive.",
    "Because I care about " + STUDENT_NAME_PLACEHOLDER + "'s ongoing success, I wanted to reach out regarding a few behaviors I observed today.",
    true
  ],
  [
    'closing',
    'Partnership',
    "We are so glad to partner with you in helping " + STUDENT_NAME_PLACEHOLDER + " grow into the respectful, responsible person we know they can be.",
    '',
    true
  ],
  [
    'closing',
    'Partnership',
    "Thank you for partnering with us as " + STUDENT_NAME_PLACEHOLDER + " continues learning and growing this year.",
    '',
    true
  ],
  [
    'closing',
    'Partnership',
    "We are grateful to work alongside you in supporting " + STUDENT_NAME_PLACEHOLDER + "'s growth, both in character and in the classroom.",
    '',
    true
  ],
  [
    'closing',
    'Partnership',
    "Your partnership means a great deal to us as we help " + STUDENT_NAME_PLACEHOLDER + " build the habits that will serve them well beyond our classroom.",
    '',
    true
  ]
];

/**
 * Resolves the EmailTemplates sheet name. Falls back to the default when an
 * already-deployed Constants sheet predates the SHEET_NAMES.EMAIL_TEMPLATES key.
 * @returns {string} The sheet name.
 */
function getEmailTemplatesSheetName() {
  if (CONFIG && CONFIG.SHEET_NAMES && CONFIG.SHEET_NAMES.EMAIL_TEMPLATES) {
    return CONFIG.SHEET_NAMES.EMAIL_TEMPLATES;
  }
  return DEFAULT_CONSTANTS.SHEET_NAMES.EMAIL_TEMPLATES;
}

/**
 * Loads opening and closing templates from the EmailTemplates sheet into the
 * global EMAIL_TEMPLATES object. Creates and seeds the sheet if it is missing.
 *
 * @returns {boolean} True if at least one opening and one closing were loaded.
 */
function loadEmailTemplates() {
  loadConstants();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = getEmailTemplatesSheetName();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    Logger.log('EmailTemplates sheet "' + sheetName + '" not found. Creating and seeding it.');
    sheet = setupEmailTemplatesSheet();
    if (!sheet) {
      EMAIL_TEMPLATES = { openings: [], closings: [] };
      return false;
    }
  }

  const data = sheet.getDataRange().getValues();
  EMAIL_TEMPLATES = parseEmailTemplates(data);

  Logger.log('Loaded ' + EMAIL_TEMPLATES.openings.length + ' opening and ' +
             EMAIL_TEMPLATES.closings.length + ' closing templates.');
  return EMAIL_TEMPLATES.openings.length > 0 && EMAIL_TEMPLATES.closings.length > 0;
}

/**
 * Turns raw sheet rows into the EMAIL_TEMPLATES structure, skipping blank and
 * inactive rows. A blank Active cell counts as active so a hand-added row works
 * without the admin needing to know about the column.
 *
 * @param {Array<Array<string>>} data Raw values from the EmailTemplates sheet.
 * @returns {{openings: Array<Object>, closings: Array<Object>}} Parsed templates.
 */
function parseEmailTemplates(data) {
  const templates = { openings: [], closings: [] };
  if (!data || data.length < 2) return templates;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const type = String(row[0] || '').trim().toLowerCase();
    const category = String(row[1] || '').trim();
    const text = String(row[2] || '').trim();
    const transition = String(row[3] || '').trim();
    const activeCell = row[4];

    if (!type || !text) continue;

    // Blank means active; anything explicitly false/no/0 is skipped.
    const activeText = String(activeCell === undefined || activeCell === null ? '' : activeCell).trim().toLowerCase();
    const isActive = activeText === '' || activeText === 'true' || activeText === 'yes' || activeText === '1';
    if (!isActive) continue;

    const template = {
      // Content-derived so the id survives rows being inserted, sorted, or removed
      // on the sheet while a teacher has the form open. A stale id resolves to
      // nothing (and falls back to the default) rather than to a different closing.
      id: type + '-' + hashTemplateText(text),
      category: category || 'General',
      text: text,
      transition: transition
    };

    if (type === 'opening') {
      templates.openings.push(template);
    } else if (type === 'closing') {
      templates.closings.push(template);
    } else {
      Logger.log('Skipping EmailTemplates row ' + (i + 1) + ': unknown type "' + type + '".');
    }
  }

  return templates;
}

/**
 * Small, stable string hash used to build template ids from their text.
 * Not a security primitive -- it only needs to be deterministic and collision-free
 * across a handful of sentences.
 *
 * @param {string} text The template text.
 * @returns {string} A short base-36 hash.
 */
function hashTemplateText(text) {
  let hash = 0;
  const input = String(text);
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash = hash | 0; // Force 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Creates the EmailTemplates sheet and writes the seed rows.
 *
 * Existing sheets are left completely alone -- unlike setupPillarsSheets(), this
 * never clears or rewrites admin-edited content.
 *
 * @returns {Sheet|null} The sheet, or null if it could not be created.
 */
function setupEmailTemplatesSheet() {
  loadConstants();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = getEmailTemplatesSheetName();

  const existing = ss.getSheetByName(sheetName);
  if (existing) {
    Logger.log('EmailTemplates sheet already exists. Leaving it untouched.');
    return existing;
  }

  const sheet = ss.insertSheet(sheetName);
  sheet.getRange(1, 1, 1, EMAIL_TEMPLATE_HEADERS.length).setValues([EMAIL_TEMPLATE_HEADERS]);
  sheet.getRange(1, 1, 1, EMAIL_TEMPLATE_HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);

  sheet.getRange(2, 1, DEFAULT_EMAIL_TEMPLATES.length, EMAIL_TEMPLATE_HEADERS.length)
       .setValues(DEFAULT_EMAIL_TEMPLATES);

  sheet.setColumnWidth(1, 90);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 460);
  sheet.setColumnWidth(4, 460);
  sheet.setColumnWidth(5, 70);
  sheet.getRange(2, 3, DEFAULT_EMAIL_TEMPLATES.length, 2).setWrap(true);

  Logger.log('Created and seeded EmailTemplates sheet with ' + DEFAULT_EMAIL_TEMPLATES.length + ' rows.');
  return sheet;
}

/**
 * Menu action: makes sure the sheet exists, then shows it.
 */
function openEmailTemplatesSheet() {
  const sheet = setupEmailTemplatesSheet();
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Could not open the EmailTemplates sheet.');
    return;
  }
  sheet.activate();
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Edit the Text and Transition columns to change what teachers can insert. Set Active to FALSE to retire an option.',
    'Email Templates',
    8
  );
}

/**
 * Replaces the student-name placeholder with a real first name.
 *
 * @param {string} text Template text, possibly containing the placeholder.
 * @param {string} studentFirst The student's first name.
 * @returns {string} Personalized text.
 */
function personalizeTemplateText(text, studentFirst) {
  if (!text) return '';
  const name = studentFirst ? String(studentFirst).trim() : '';
  if (!name) return String(text);
  return String(text).split(STUDENT_NAME_PLACEHOLDER).join(name);
}

/**
 * Builds the full opening paragraph (warm observation + transition) for a template.
 *
 * @param {Object} template An entry from EMAIL_TEMPLATES.openings.
 * @param {string} studentFirst The student's first name.
 * @returns {string} The personalized paragraph.
 */
function buildOpeningParagraph(template, studentFirst) {
  if (!template) return '';
  const parts = [];
  if (template.text) parts.push(personalizeTemplateText(template.text, studentFirst));
  if (template.transition) parts.push(personalizeTemplateText(template.transition, studentFirst));
  return parts.join(' ');
}

/**
 * Default opening paragraph, used by the legacy Google Forms path and the test
 * functions, which have no template picker of their own.
 *
 * @param {string} studentFirst The student's first name.
 * @returns {string} The first active opening, personalized, or '' if none exist.
 */
function getDefaultOpeningMessage(studentFirst) {
  loadEmailTemplates();
  if (!EMAIL_TEMPLATES.openings.length) return '';
  return buildOpeningParagraph(EMAIL_TEMPLATES.openings[0], studentFirst);
}

/**
 * Default closing sentence, used by the legacy Google Forms path and the test
 * functions, which have no template picker of their own.
 *
 * @param {string} studentFirst The student's first name.
 * @returns {string} The first active closing, personalized, or '' if none exist.
 */
function getDefaultClosingMessage(studentFirst) {
  loadEmailTemplates();
  if (!EMAIL_TEMPLATES.closings.length) return '';
  return personalizeTemplateText(EMAIL_TEMPLATES.closings[0].text, studentFirst);
}

/**
 * Looks up a closing template by id and personalizes it. The web app sends the id
 * rather than the text, so the wording that goes out is always the admin's.
 *
 * @param {string} closingId Template id from EMAIL_TEMPLATES.closings.
 * @param {string} studentFirst The student's first name.
 * @returns {string} The personalized closing, or '' if the id is unknown.
 */
function resolveClosingMessage(closingId, studentFirst) {
  loadEmailTemplates();
  if (!closingId) return '';
  const match = EMAIL_TEMPLATES.closings.find(function(c) { return c.id === closingId; });
  if (!match) {
    Logger.log('Unknown closing template id "' + closingId + '".');
    return '';
  }
  return personalizeTemplateText(match.text, studentFirst);
}
