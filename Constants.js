/**
 * Constants Management System
 * 
 * This script manages application constants by storing them in a dedicated spreadsheet ("Constants"),
 * allowing for easy updates without changing the code.
 */

// Global object to hold all configuration constants loaded from the sheet.
// This will be populated by the loadConstants function.
var CONFIG = {};

/**
 * The default set of constants. This object is used to initially populate the 
 * "Constants" sheet if it's empty or needs to be reset. The keys in this object,
 * including nested ones, will be flattened into "KEY.SUB_KEY" format in the sheet.
 */
const DEFAULT_CONSTANTS = {
  SCHOOL_NAME: "Orono Middle School",
  EMAIL_SUBJECT_GOOD_NEWS: "Good News Moment - Demonstrating Character!",
  EMAIL_SUBJECT_STOP_THINK: "Stop & Think Moment - Opportunity for Growth",
  SHEET_NAMES: {
    DIRECTORY: "Directory",
    BEHAVIOR_FORM: "Behavior Form",
    CONSTANTS: "Constants",
    PILLARS: "Pillars",
    POSITIVE_BEHAVIORS: "PositiveBehaviors",
    POSITIVE_RECOGNITION: "PositiveRecognitionExamples",
    NEGATIVE_BEHAVIORS: "NegativeBehaviors",
    LEARNING_FOCUS: "LearningFocus"
  },
  ADMIN_EMAILS: {
    PRINCIPAL: "kimberly.vaneyll@orono.k12.mn.us",
    ASSOCIATE_PRINCIPAL: "sara.hunstiger@orono.k12.mn.us",
    ACADEMIC_SUPPORT: "kelly.hubert@orono.k12.mn.us",
    TECH_SUPPORT: "paul.ivers@orono.k12.mn.us"
  },
  SEND_EMAILS: true,
  SIMILARITY_THRESHOLD: 3,
  MAX_SUGGESTIONS: 5
};

/**
 * Loads all constants from the "Constants" sheet into the global CONFIG object.
 * If the sheet is not found, it logs an error. This function should be called
 * at the start of any process that relies on these constants.
 * 
 * @returns {boolean} True if constants were loaded successfully, false otherwise.
 */
function loadConstants() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const constantsSheet = ss.getSheetByName(DEFAULT_CONSTANTS.SHEET_NAMES.CONSTANTS);

  if (!constantsSheet) {
    Logger.log(`Error: Constants sheet "${DEFAULT_CONSTANTS.SHEET_NAMES.CONSTANTS}" not found. Please run the setup function.`);
    // Try to create and populate it automatically
    setupConstantsSheet();
    // Attempt to load again
    const newSheet = ss.getSheetByName(DEFAULT_CONSTANTS.SHEET_NAMES.CONSTANTS);
    if(!newSheet){
      return false;
    }
    const data = newSheet.getDataRange().getValues();
    return processConstantsData(data);
  }

  const data = constantsSheet.getDataRange().getValues();
  return processConstantsData(data);
}

/**
 * Helper function to process the raw data from the constants sheet and populate CONFIG.
 * @param {Array<Array<string>>} data The 2D array of data from the sheet.
 * @returns {boolean} True if processing was successful.
 */
function processConstantsData(data) {
    // Reset CONFIG to ensure it's clean before loading new values
    CONFIG = {};
    let loadedCount = 0;

    // Start from row 1 to skip header
    for (let i = 1; i < data.length; i++) {
        const key = data[i][0];
        let value = data[i][1];

        if (key) {
            // Attempt to parse boolean and numeric values from string
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'true') {
                    value = true;
                } else if (value.toLowerCase() === 'false') {
                    value = false;
                } else if (!isNaN(value) && value.trim() !== '') {
                    value = Number(value);
                }
            }
            
            // Set nested properties in CONFIG using dot notation (e.g., "SHEET_NAMES.DIRECTORY")
            const keys = key.split('.');
            let current = CONFIG;
            for (let j = 0; j < keys.length - 1; j++) {
                current = current[keys[j]] = current[keys[j]] || {};
            }
            current[keys[keys.length - 1]] = value;
            loadedCount++;
        }
    }
    Logger.log(`Successfully loaded ${loadedCount} constants into the CONFIG object.`);
    return true;
}


/**
 * Creates and populates the "Constants" sheet if it doesn't exist.
 * This function is intended to be run manually once from the script editor or a menu item.
 */
function setupConstantsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let constantsSheet = ss.getSheetByName(DEFAULT_CONSTANTS.SHEET_NAMES.CONSTANTS);

  // Create the sheet if it doesn't exist
  if (!constantsSheet) {
    constantsSheet = ss.insertSheet(DEFAULT_CONSTANTS.SHEET_NAMES.CONSTANTS);
    SpreadsheetApp.getActiveSpreadsheet().toast('Created "Constants" sheet.');
  }

  // Set headers
  constantsSheet.getRange("A1:B1").setValues([["Constant Name", "Value"]]).setFontWeight("bold");

  // Flatten the DEFAULT_CONSTANTS object to write to the sheet
  const constantsArray = [];
  const flattenObject = (obj, prefix = '') => {
    Object.keys(obj).forEach(key => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], pre + key);
      } else {
        constantsArray.push([pre + key, obj[key]]);
      }
    });
  };

  flattenObject(DEFAULT_CONSTANTS);

  // Write the flattened constants to the sheet
  if (constantsArray.length > 0) {
    constantsSheet.getRange(2, 1, constantsArray.length, 2).setValues(constantsArray);
  }

  // Auto-resize columns for better readability
  constantsSheet.autoResizeColumns(1, 2);
  
  SpreadsheetApp.getActiveSpreadsheet().toast('Constants sheet has been set up successfully.');
}

/**
 * Adds a menu item to the Google Sheet UI to run the setup function.
 * This should be called from the main onOpen trigger in your project.
 */
function addConstantsMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Admin')
    .addItem('Setup Constants Sheet', 'setupConstantsSheet')
    .addToUi();
}

// It's recommended to call loadConstants() at the beginning of your main functions
// For example, in onFormSubmit(e) or sendDailySummaryEmail()
// loadConstants(); 
// Note: Calling it here globally might not work as expected due to script load timing.
// It's safer to call it explicitly at the start of functions that need the CONFIG object.
