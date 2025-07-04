/**
 * ================================================================================
 * UTILITIES AND HELPER FUNCTIONS
 * ================================================================================
 * Various utility functions for system operation
 */

/**
 * Test the basic system functionality
 */
function testBasicSystem() {
  const ui = SpreadsheetApp.getUi();
  const results = [];

  try {
    // Test 1: Configuration
    const config = generateWorkingConfig();
    if (config) {
      results.push('✅ Configuration loaded successfully');
    } else {
      results.push('❌ Configuration failed to load');
    }

    // Test 2: Sheets exist
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const requiredSheets = Object.values(SYSTEM_CONFIG.SHEETS);
    let sheetsExist = true;

    requiredSheets.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        results.push(`✅ Sheet "${sheetName}" exists`);
      } else {
        results.push(`❌ Sheet "${sheetName}" missing`);
        sheetsExist = false;
      }
    });

    // Test 3: Student lookup
    try {
      const lookupResult = lookupStudent('John', 'Smith');
      if (lookupResult) {
        results.push('✅ Student lookup function working');
      } else {
        results.push('❌ Student lookup function failed');
      }
    } catch (error) {
      results.push('❌ Student lookup error: ' + error.message);
    }

    // Test 4: Pillars data
    const pillars = getSystemPillars();
    if (pillars && pillars.length > 0) {
      results.push(`✅ Pillars data loaded (${pillars.length} pillars)`);
    } else {
      results.push('❌ Pillars data not found');
    }

    // Show results
    ui.alert(
      'System Test Results',
      results.join('\n'),
      ui.ButtonSet.OK
    );

  } catch (error) {
    ui.alert('Test Error', 'Error running system test: ' + error.message, ui.ButtonSet.OK);
    Logger.log('System test error: ' + error.toString());
  }
}

/**
 * Validate system data integrity
 */
function validateSystemData() {
  const config = generateWorkingConfig();
  const issues = [];

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Check Directory sheet
    const directorySheet = ss.getSheetByName(config.SHEET_NAMES.DIRECTORY);
    if (directorySheet) {
      const directoryData = directorySheet.getDataRange().getValues();
      for (let i = 1; i < directoryData.length; i++) {
        const row = directoryData[i];
        const studentFirst = row[0];
        const studentLast = row[1];
        const parent1Email = row[6];
        const parent2Email = row[9];

        if (!studentFirst || !studentLast) {
          issues.push(`Row ${i + 1}: Missing student name`);
        }

        if (!parent1Email && !parent2Email) {
          issues.push(`Row ${i + 1}: No parent email addresses`);
        }
      }
    } else {
      issues.push('Directory sheet not found');
    }

    return issues;

  } catch (error) {
    Logger.log('Validation error: ' + error.toString());
    return ['Error during validation: ' + error.message];
  }
}

/**
 * Clear all system data (for testing)
 */
function clearSystemData() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    'Clear System Data',
    'This will remove all configuration and reset the system.\n\nAre you sure?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    try {
      // Clear properties
      PropertiesService.getScriptProperties().deleteAll();

      // Clear sheets (but keep structure)
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      Object.values(SYSTEM_CONFIG.SHEETS).forEach(sheetName => {
        const sheet = ss.getSheetByName(sheetName);
        if (sheet) {
          sheet.clear();
        }
      });

      ui.alert('System Reset', 'All system data has been cleared. Run the setup wizard to reconfigure.', ui.ButtonSet.OK);

    } catch (error) {
      ui.alert('Reset Error', 'Error clearing system data: ' + error.message, ui.ButtonSet.OK);
    }
  }
}

/**
 * Get system statistics
 */
function getSystemStats() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const config = generateWorkingConfig();

    const stats = {
      isSetup: isSystemSetup(),
      totalStudents: 0,
      totalBehaviorReports: 0,
      schoolName: config ? config.SCHOOL_NAME : 'Not configured',
      setupDate: PropertiesService.getScriptProperties().getProperty('SETUP_DATE')
    };

    // Count students
    const directorySheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.DIRECTORY);
    if (directorySheet) {
      stats.totalStudents = Math.max(0, directorySheet.getLastRow() - 1);
    }

    // Count behavior reports
    const behaviorSheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.BEHAVIOR_FORM);
    if (behaviorSheet) {
      stats.totalBehaviorReports = Math.max(0, behaviorSheet.getLastRow() - 1);
    }

    return stats;

  } catch (error) {
    Logger.log('Error getting system stats: ' + error.toString());
    return null;
  }
}

/**
 * Log system information for debugging
 */
function logSystemInfo() {
  const stats = getSystemStats();
  const config = generateWorkingConfig();
  const pillars = getSystemPillars();

  Logger.log('=== SYSTEM INFORMATION ===');
  Logger.log('Setup Status: ' + (stats ? stats.isSetup : 'Unknown'));
  Logger.log('School Name: ' + (config ? config.SCHOOL_NAME : 'Not configured'));
  Logger.log('Students in Directory: ' + (stats ? stats.totalStudents : 'Unknown'));
  Logger.log('Behavior Reports: ' + (stats ? stats.totalBehaviorReports : 'Unknown'));
  Logger.log('Character Pillars: ' + (pillars ? pillars.length : 'Unknown'));
  Logger.log('Attribution: ' + ATTRIBUTION.CREATED_BY + ' v' + ATTRIBUTION.VERSION);
  Logger.log('=========================');
}
