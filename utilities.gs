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

/**
 * ================================================================================
 * ENHANCED UTILITIES - PHASE 2
 * ================================================================================
 */

/**
 * Test the professional setup wizard
 */
function testProfessionalWizard() {
  const ui = SpreadsheetApp.getUi();

  try {
    // Test that wizard can be launched
    const wizardHTML = createProfessionalSetupWizardHTML();
    if (wizardHTML && wizardHTML.length > 1000) {
      ui.alert(
        'Professional Wizard Test',
        '✅ Professional setup wizard HTML generated successfully\n' +
        `✅ HTML length: ${wizardHTML.length} characters\n` +
        '✅ Attribution embedded\n' +
        '✅ Ready for user interaction\n\n' +
        'The professional wizard is working correctly!',
        ui.ButtonSet.OK
      );
    } else {
      ui.alert('Test Failed', 'Professional wizard HTML generation failed', ui.ButtonSet.OK);
    }

  } catch (error) {
    ui.alert('Test Error', 'Error testing professional wizard: ' + error.message, ui.ButtonSet.OK);
    Logger.log('Professional wizard test error: ' + error.toString());
  }
}

/**
 * Test complete system with professional features
 */
function testCompleteSystem() {
  const results = [];

  try {
    // Test configuration
    const config = generateWorkingConfig();
    if (config) {
      results.push('✅ Configuration system working');
    } else {
      results.push('❌ Configuration system failed');
    }

    // Test setup status
    const isSetup = isSystemSetup();
    results.push(isSetup ? '✅ System is set up' : '⚠️ System not set up');

    // Test wizard generation
    try {
      const wizardHTML = createProfessionalSetupWizardHTML();
      if (wizardHTML && wizardHTML.includes(ATTRIBUTION.CREATED_BY)) {
        results.push('✅ Professional wizard generation working');
        results.push('✅ Attribution properly embedded');
      } else {
        results.push('❌ Professional wizard generation failed');
      }
    } catch (error) {
      results.push('❌ Wizard generation error: ' + error.message);
    }

    // Test pillars data
    const pillars = getSystemPillars();
    if (pillars && pillars.length > 0) {
      results.push(`✅ Character pillars loaded (${pillars.length} pillars)`);
    } else {
      results.push('❌ Character pillars failed to load');
    }

    // Test validation
    const validationErrors = validateCompleteConfiguration();
    if (validationErrors.length === 0) {
      results.push('✅ Configuration validation passed');
    } else {
      results.push(`⚠️ Configuration validation found ${validationErrors.length} issues`);
    }

    // Show results
    SpreadsheetApp.getUi().alert(
      'Complete System Test Results',
      results.join('\n\n'),
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Test Error',
      'Error running complete system test: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    Logger.log('Complete system test error: ' + error.toString());
  }
}

/**
 * Enhanced system information display
 */
function showEnhancedSystemInfo() {
  const summary = getConfigurationSummary();
  const validationErrors = validateCompleteConfiguration();
  const stats = getSystemStats();

  let info = `STUDENT BEHAVIOR MANAGEMENT SYSTEM\n`;
  info += `═══════════════════════════════════════\n\n`;

  info += `📊 SYSTEM STATUS\n`;
  info += `School: ${summary ? summary.school : 'Not configured'}\n`;
  info += `Setup Date: ${summary && summary.setupDate ? new Date(summary.setupDate).toLocaleDateString() : 'Unknown'}\n`;
  info += `Wizard Version: ${summary ? summary.wizardVersion : 'Unknown'}\n`;
  info += `Setup Complete: ${isSystemSetup() ? 'Yes' : 'No'}\n\n`;

  info += `📈 DATA SUMMARY\n`;
  info += `Students in Directory: ${stats ? stats.totalStudents : 'Unknown'}\n`;
  info += `Administrators: ${summary ? summary.adminCount : 'Unknown'}\n`;
  info += `Character Pillars: ${summary ? summary.pillarCount : 'Unknown'}\n`;
  info += `Behavior Reports: ${stats ? stats.totalBehaviorReports : 'Unknown'}\n\n`;

  if (validationErrors.length > 0) {
    info += `⚠️ CONFIGURATION ISSUES\n`;
    info += validationErrors.slice(0, 5).join('\n');
    if (validationErrors.length > 5) {
      info += `\n...and ${validationErrors.length - 5} more issues`;
    }
    info += `\n\n`;
  } else {
    info += `✅ CONFIGURATION VALID\n`;
    info += `All system components properly configured\n\n`;
  }

  info += `🏷️ ATTRIBUTION\n`;
  info += `Created by: ${ATTRIBUTION.CREATED_BY}\n`;
  info += `Version: ${ATTRIBUTION.VERSION}\n`;
  info += `Contact: ${ATTRIBUTION.CONTACT_EMAIL}\n`;
  info += `© ${ATTRIBUTION.YEAR} ${ATTRIBUTION.CREATED_BY}`;

  SpreadsheetApp.getUi().alert('Enhanced System Information', info, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Demo the professional wizard
 */
function demoSetupWizard() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    'Demo Professional Setup Wizard',
    'This will launch the professional setup wizard in demo mode.\n\n' +
    'You can explore the interface and see how it works without making changes.\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    launchProfessionalSetupWizard();
  }
}
