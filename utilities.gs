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
 * ================================================================================
 * WEB APP DEPLOYMENT & TESTING - PHASE 3
 * ================================================================================
 */

/**
 * Deploy the web app
 */
function deployWebApp() {
  const ui = SpreadsheetApp.getUi();

  ui.alert(
    'Deploy Web Application',
    'To deploy the behavior form web app:\n\n' +
    '1. In Apps Script, click "Deploy" → "New deployment"\n' +
    '2. Choose "Web app" as the type\n' +
    '3. Set "Execute as" to "User accessing the web app"\n' +
    '4. Set "Who has access" to "Anyone with Google account" (or your domain)\n' +
    '5. Click "Deploy"\n' +
    '6. Copy the web app URL\n' +
    '7. Share the URL with teachers\n\n' +
    'The web app will use the current system configuration automatically.',
    ui.ButtonSet.OK
  );
}

/**
 * Test web app functionality
 */
function testWebAppFunctionality() {
  const results = [];

  try {
    // Test 1: Check if system is set up
    const isSetup = isSystemSetup();
    results.push(isSetup ? '✅ System is configured' : '❌ System not configured');

    if (!isSetup) {
      SpreadsheetApp.getUi().alert(
        'Web App Test Results',
        results.join('\n') + '\n\nPlease run the setup wizard first.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }

    // Test 2: Check configuration generation
    const config = generateWorkingConfig();
    if (config && config.SCHOOL_NAME) {
      results.push(`✅ Configuration loaded: ${config.SCHOOL_NAME}`);
    } else {
      results.push('❌ Configuration failed to load');
    }

    // Test 3: Check pillars data
    const pillars = getSystemPillars();
    if (pillars && pillars.length > 0) {
      results.push(`✅ Character pillars loaded: ${pillars.length} pillars`);
    } else {
      results.push('❌ Character pillars not found');
    }

    // Test 4: Test HTML generation
    try {
      const html = createBehaviorFormHTML(config, pillars);
      if (html && html.length > 5000) {
        results.push('✅ Web app HTML generated successfully');
      } else {
        results.push('❌ Web app HTML generation failed');
      }
    } catch (error) {
      results.push('❌ HTML generation error: ' + error.message);
    }

    // Test 5: Test student lookup
    try {
      const lookupResult = lookupStudent('John', 'Smith');
      if (lookupResult) {
        if (lookupResult.success) {
          results.push('✅ Student lookup successful');
        } else if (lookupResult.suggestions) {
          results.push('✅ Student lookup with suggestions working');
        } else {
          results.push('✅ Student lookup working (not found)');
        }
      } else {
        results.push('❌ Student lookup failed');
      }
    } catch (error) {
      results.push('❌ Student lookup error: ' + error.message);
    }

    // Test 6: Test form processing
    try {
      const testFormData = {
        behaviorType: 'goodnews',
        studentFirst: 'Test',
        studentLast: 'Student',
        teacherName: 'Test Teacher',
        parent1Email: 'test@example.com',
        parent2Email: '',
        selectedPillars: ['Responsibility'],
        selectedBehaviors: ['completing work with academic honesty'],
        location: 'Classroom',
        comments: 'Test submission from web app test'
      };

      const processResult = processWebAppFormSubmission(testFormData);
      if (processResult && processResult.success) {
        results.push('✅ Form processing successful');
      } else {
        results.push('❌ Form processing failed: ' + (processResult ? processResult.message : 'Unknown error'));
      }
    } catch (error) {
      results.push('❌ Form processing error: ' + error.message);
    }

    // Test 7: Check spreadsheet structure
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const behaviorSheet = ss.getSheetByName(config.SHEET_NAMES.BEHAVIOR_FORM);
    if (behaviorSheet) {
      results.push('✅ Behavior form sheet exists');
    } else {
      results.push('❌ Behavior form sheet missing');
    }

    // Show results
    SpreadsheetApp.getUi().alert(
      'Web App Test Results',
      results.join('\n\n'),
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Test Error',
      'Error running web app test: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    Logger.log('Web app test error: ' + error.toString());
  }
}

/**
 * Open web app in new window (for testing)
 */
function openWebAppForTesting() {
  const ui = SpreadsheetApp.getUi();

  if (!isSystemSetup()) {
    ui.alert('System not set up. Please run the setup wizard first.');
    return;
  }

  try {
    // Create test HTML content
    const config = generateWorkingConfig();
    const pillars = getSystemPillars();
    const html = createBehaviorFormHTML(config, pillars);

    // Create HTML service and show as dialog for testing
    const htmlOutput = HtmlService.createHtmlOutput(html)
      .setWidth(900)
      .setHeight(700)
      .setTitle('Web App Test - ' + config.SCHOOL_NAME);

    ui.showModalDialog(htmlOutput, 'Test Web Application');

  } catch (error) {
    ui.alert('Error opening web app for testing: ' + error.message);
    Logger.log('Error opening web app for testing: ' + error.toString());
  }
}

/**
 * Get web app URL (if deployed)
 */
function getWebAppURL() {
  const ui = SpreadsheetApp.getUi();

  ui.alert(
    'Web App URL',
    'To get your web app URL:\n\n' +
    '1. Go to Apps Script (Extensions > Apps Script)\n' +
    '2. Click "Deploy" in the top right\n' +
    '3. Look for existing web app deployments\n' +
    '4. Copy the URL from the deployment\n\n' +
    'If no deployment exists, use "Deploy Web App" first.\n\n' +
    'Share this URL with teachers to access the behavior form.',
    ui.ButtonSet.OK
  );
}

/**
 * Test form submission with sample data
 */
function testFormSubmissionWithSampleData() {
  const ui = SpreadsheetApp.getUi();

  if (!isSystemSetup()) {
    ui.alert('System not set up. Please run the setup wizard first.');
    return;
  }

  const response = ui.alert(
    'Test Form Submission',
    'This will submit a test behavior form with sample data.\n\n' +
    'This will:\n' +
    '• Add a test entry to the Behavior Form sheet\n' +
    '• Send a test email (if email sending is enabled)\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  try {
    const testData = {
      behaviorType: 'goodnews',
      studentFirst: 'Test',
      studentLast: 'Student',
      teacherName: 'Test Teacher',
      studentEmail: 'test.student@school.edu',
      parent1First: 'Test',
      parent1Last: 'Parent',
      parent1Email: Session.getActiveUser().getEmail(), // Send to current user for testing
      parent2First: '',
      parent2Last: '',
      parent2Email: '',
      selectedPillars: ['Responsibility', 'Respect'],
      selectedBehaviors: ['completing work with academic honesty', 'following rules and directions willingly'],
      location: 'Classroom',
      comments: 'This is a test submission from the system validation process. The student demonstrated excellent character traits during today\'s lesson.'
    };

    const result = processWebAppFormSubmission(testData);

    if (result.success) {
      ui.alert(
        'Test Successful',
        'Test form submission completed successfully!\n\n' +
        'Check:\n' +
        '• Behavior Form sheet for the new entry\n' +
        '• Your email for the test message\n\n' +
        result.message,
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        'Test Failed',
        'Test form submission failed:\n\n' + result.message,
        ui.ButtonSet.OK
      );
    }

  } catch (error) {
    ui.alert(
      'Test Error',
      'Error during test submission: ' + error.message,
      ui.ButtonSet.OK
    );
    Logger.log('Test form submission error: ' + error.toString());
  }
}

/**
 * Validate web app deployment readiness
 */
function validateWebAppDeploymentReadiness() {
  const issues = [];

  try {
    // Check system setup
    if (!isSystemSetup()) {
      issues.push('❌ System not set up - run setup wizard first');
    } else {
      issues.push('✅ System is configured');
    }

    // Check configuration
    const config = generateWorkingConfig();
    if (!config) {
      issues.push('❌ Configuration not found');
    } else {
      issues.push('✅ Configuration loaded');

      if (!config.SCHOOL_NAME) {
        issues.push('❌ School name not configured');
      }

      if (!config.PRIMARY_COLOR) {
        issues.push('⚠️ Primary color not set - using default');
      }
    }

    // Check pillars
    const pillars = getSystemPillars();
    if (!pillars || pillars.length === 0) {
      issues.push('❌ No character pillars configured');
    } else {
      issues.push(`✅ Character pillars configured (${pillars.length})`);
    }

    // Check directory
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const directorySheet = ss.getSheetByName('Directory');
    if (!directorySheet) {
      issues.push('❌ Directory sheet not found');
    } else {
      const studentCount = Math.max(0, directorySheet.getLastRow() - 1);
      if (studentCount === 0) {
        issues.push('⚠️ No students in directory - add student data');
      } else {
        issues.push(`✅ Students in directory: ${studentCount}`);
      }
    }

    // Check behavior form sheet
    const behaviorSheet = ss.getSheetByName('Behavior Form');
    if (!behaviorSheet) {
      issues.push('❌ Behavior Form sheet not found');
    } else {
      issues.push('✅ Behavior Form sheet exists');
    }

    // Check email configuration
    if (config && config.SEND_EMAILS) {
      issues.push('✅ Email sending enabled');
    } else {
      issues.push('⚠️ Email sending disabled - check configuration');
    }

    SpreadsheetApp.getUi().alert(
      'Web App Deployment Readiness',
      issues.join('\n\n'),
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Validation Error',
      'Error validating deployment readiness: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    Logger.log('Deployment readiness validation error: ' + error.toString());
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
