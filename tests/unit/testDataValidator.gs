/**
 * Unit Tests for DataValidator.gs
 *
 * To run these tests, you would typically use a test runner in Google Apps Script
 * or execute them manually and check the Logger.log output.
 * Assumes testUtils.gs (with assertEquals, etc.) is available.
 */

// Mock SYSTEM_CONFIG for tests if DataValidator relies on it for sheet names
const TEST_SYSTEM_CONFIG = {
  SHEETS: {
    DIRECTORY: 'Directory',
    BEHAVIOR_FORM_LOG: 'Behavior Form',
    // Add other sheet names if validateSheetStructure is tested more deeply
  }
};

function runDataValidatorTests() {
  console.log('Starting DataValidator Tests...');
  let testsPassed = 0;
  let testsFailed = 0;

  // --- Test Suite for sanitizeInput ---
  console.log('Testing DataValidator.sanitizeInput()...');
  try {
    assertEquals('test input', DataValidator.sanitizeInput(' test input '), 'Sanitize basic string');
    assertEquals('test&amp;input', DataValidator.sanitizeInput('test&input', 'text'), 'Sanitize HTML entity (&)');
    assertEquals('&lt;script&gt;', DataValidator.sanitizeInput('<script>', 'text'), 'Sanitize HTML tags (< >)');
    assertEquals('test@example.com', DataValidator.sanitizeInput(' Test@Example.com ', 'email'), 'Sanitize email');
    assertEquals('john doe', DataValidator.sanitizeInput('John Doe!123', 'name'), 'Sanitize name (remove numbers/symbols)');
    assertEquals('john o&#039;reilly-smith', DataValidator.sanitizeInput('John O\'Reilly-Smith', 'name'), 'Sanitize name (keep allowed symbols)');
    assertEquals('abc123xyz', DataValidator.sanitizeInput('abc123xyz@#$', 'alphanumeric'), 'Sanitize alphanumeric');
    assertEquals('123.45', DataValidator.sanitizeInput('123.45abc', 'numeric'), 'Sanitize numeric');
    assertEquals('', DataValidator.sanitizeInput(null), 'Sanitize null input');
    assertEquals('', DataValidator.sanitizeInput(undefined), 'Sanitize undefined input');
    assertEquals('true', DataValidator.sanitizeInput(true), 'Sanitize boolean true (as string)'); // Current behavior
    assertEquals('false', DataValidator.sanitizeInput(false), 'Sanitize boolean false (as string)'); // Current behavior
    console.log('DataValidator.sanitizeInput() PASSED');
    testsPassed++;
  } catch (e) {
    console.error('DataValidator.sanitizeInput() FAILED: ' + e.message);
    testsFailed++;
  }

  // --- Test Suite for validateEmailFormat ---
  console.log('Testing DataValidator.validateEmailFormat()...');
  try {
    assertTrue(DataValidator.validateEmailFormat('test@example.com').valid, 'Valid email');
    assertFalse(DataValidator.validateEmailFormat('test@example').valid, 'Invalid email (no TLD)');
    assertFalse(DataValidator.validateEmailFormat('test example.com').valid, 'Invalid email (space)');
    assertFalse(DataValidator.validateEmailFormat('').valid, 'Invalid email (empty string)');
    assertFalse(DataValidator.validateEmailFormat(null).valid, 'Invalid email (null)');
    assertEquals('Email is required and cannot be empty.', DataValidator.validateEmailFormat('').error, 'Correct error for empty email');
    console.log('DataValidator.validateEmailFormat() PASSED');
    testsPassed++;
  } catch (e) {
    console.error('DataValidator.validateEmailFormat() FAILED: ' + e.message);
    testsFailed++;
  }

  // --- Test Suite for validateStudentName ---
  console.log('Testing DataValidator.validateStudentName()...');
  try {
    assertTrue(DataValidator.validateStudentName('John Doe').valid, 'Valid student name');
    assertTrue(DataValidator.validateStudentName('O\'Malley-Smith Jr.').valid, 'Valid student name with symbols');
    assertFalse(DataValidator.validateStudentName('J').valid, 'Invalid student name (too short)');
    assertFalse(DataValidator.validateStudentName('John123').valid, 'Invalid student name (contains numbers)');
    assertFalse(DataValidator.validateStudentName('').valid, 'Invalid student name (empty)');
    assertEquals('Student name must be at least 2 characters long.', DataValidator.validateStudentName('J').error, 'Correct error for short name');
    console.log('DataValidator.validateStudentName() PASSED');
    testsPassed++;
  } catch (e) {
    console.error('DataValidator.validateStudentName() FAILED: ' + e.message);
    testsFailed++;
  }

  // --- Test Suite for validateObject ---
  console.log('Testing DataValidator.validateObject()...');
  try {
    const rules = {
      name: { type: 'name', required: true },
      email: { type: 'email', required: true },
      age: { type: 'number', required: false, min: 18 },
      bio: { type: 'string', minLength: 5, warnIfMissing: true, warnIfMissingMessage: "A short bio is recommended."}
    };
    const validData = { name: 'Valid Name', email: 'valid@email.com', age: 20 };
    const invalidData = { name: 'N', email: 'invalid', age: 17 };
    const incompleteData = { name: 'Valid Name', email: 'valid@email.com' };


    let result = DataValidator.validateObject(validData, rules);
    assertTrue(result.isValid, 'validateObject with valid data');

    result = DataValidator.validateObject(invalidData, rules);
    assertFalse(result.isValid, 'validateObject with invalid data');
    assertTrue(Object.keys(result.errors).includes('name'), 'validateObject invalid data - name error exists');
    assertTrue(Object.keys(result.errors).includes('email'), 'validateObject invalid data - email error exists');
    assertTrue(Object.keys(result.errors).includes('age'), 'validateObject invalid data - age error exists');

    result = DataValidator.validateObject(incompleteData, rules);
    assertTrue(result.isValid, 'validateObject with incomplete but valid required fields');
    assertTrue(Object.keys(result.warnings).includes('bio'), 'validateObject includes warning for missing optional field');

    console.log('DataValidator.validateObject() PASSED');
    testsPassed++;
  } catch (e) {
    console.error('DataValidator.validateObject() FAILED: ' + e.message);
    testsFailed++;
  }

  // --- Mock Spreadsheet and Sheet for validateSpreadsheetStructure tests (Conceptual) ---
  // Full testing of this would require more complex mocking of SpreadsheetApp services.
  // This is a simplified conceptual test.
  console.log('Testing DataValidator.validateSpreadsheetStructure() (Conceptual)...');
  const mockSpreadsheetApp = {
    getActiveSpreadsheet: () => ({
      getSheetByName: (name) => {
        if (name === TEST_SYSTEM_CONFIG.SHEETS.DIRECTORY) {
          return {
            getName: () => TEST_SYSTEM_CONFIG.SHEETS.DIRECTORY,
            getLastRow: () => 1, // Has headers
            getLastColumn: () => 10,
            getRange: (r,c,nr,nc) => ({
              getValues: () => [['Student First', 'Student Last', 'Grade', 'Student Email',
                                 'Parent1 First', 'Parent1 Last', 'Parent1 Email',
                                 'Parent2 First', 'Parent2 Last', 'Parent2 Email']]
            })
          };
        }
        if (name === TEST_SYSTEM_CONFIG.SHEETS.BEHAVIOR_FORM_LOG) {
            return {
                getName: () => TEST_SYSTEM_CONFIG.SHEETS.BEHAVIOR_FORM_LOG,
                getLastRow: () => 0, // Empty sheet
                getLastColumn: () => 0,
                 getRange: (r,c,nr,nc) => ({
                    getValues: () => [[]]
                })
            };
        }
        return null; // Sheet not found
      }
    })
  };
  // Temporarily override SpreadsheetApp if possible, or pass mock into validator
  const originalSpreadsheetApp = (typeof SpreadsheetApp !== 'undefined') ? SpreadsheetApp : null;
  const originalSystemConfig = (typeof SYSTEM_CONFIG !== 'undefined') ? SYSTEM_CONFIG : null;

  try {
    // @ts-ignore // To allow overriding global SpreadsheetApp for test
    SpreadsheetApp = mockSpreadsheetApp;
    // @ts-ignore
    SYSTEM_CONFIG = TEST_SYSTEM_CONFIG;

    let issues = DataValidator.validateSpreadsheetStructure();
    // Should have one issue for BEHAVIOR_FORM_LOG being empty.
    assertTrue(issues.some(issue => issue.includes("Behavior Form Log sheet 'Behavior Form' is empty")), 'validateSpreadsheetStructure identifies empty sheet');

    // Example of a missing sheet
    // @ts-ignore
    SYSTEM_CONFIG.SHEETS.MISSING_SHEET = 'MissingSheet';
    issues = DataValidator.validateSpreadsheetStructure();
    assertTrue(issues.some(issue => issue.includes("Missing required sheet: MissingSheet")), 'validateSpreadsheetStructure identifies missing sheet');
    // @ts-ignore
    delete SYSTEM_CONFIG.SHEETS.MISSING_SHEET;


    console.log('DataValidator.validateSpreadsheetStructure() (Conceptual) PASSED');
    testsPassed++;
  } catch (e) {
    console.error('DataValidator.validateSpreadsheetStructure() (Conceptual) FAILED: ' + e.message);
    testsFailed++;
  } finally {
    // Restore original SpreadsheetApp and SYSTEM_CONFIG
    if (originalSpreadsheetApp) {
        // @ts-ignore
        SpreadsheetApp = originalSpreadsheetApp;
    }
    if (originalSystemConfig) {
        // @ts-ignore
        SYSTEM_CONFIG = originalSystemConfig;
    } else {
        // @ts-ignore
        delete SYSTEM_CONFIG; // if it was defined only for this test
    }
  }


  console.log(`\nDataValidator Tests Summary: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  if (testsFailed > 0) {
      throw new Error(`${testsFailed} DataValidator test(s) failed.`);
  }
  return testsPassed === (testsPassed + testsFailed);
}

// Example of how you might call this if running manually in Apps Script Editor
// function runAllMyTests() {
//   runDataValidatorTests();
//   // runOtherModuleTests();
// }
