/**
 * ================================================================================
 * SETUP WIZARD AND SPREADSHEET STRUCTURE
 * ================================================================================
 * Functions for initial system setup and spreadsheet creation
 */

/**
 * Main setup wizard - basic version for Phase 1
 */
function setupWizard() {
  const ui = SpreadsheetApp.getUi();

  // Welcome message
  const welcomeResponse = ui.alert(
    'Student Behavior System Setup',
    'Welcome to the Student Behavior System Setup!\n\n' +
    'This will create all necessary sheets and configure your system.\n\n' +
    'Continue with basic setup?',
    ui.ButtonSet.YES_NO
  );

  if (welcomeResponse !== ui.Button.YES) {
    return;
  }

  try {
    // Create spreadsheet structure
    createSpreadsheetStructure();

    // Save basic configuration
    const basicConfig = {
      schoolConfig: {
        schoolName: 'Sample School',
        districtName: 'Sample District',
        primaryColor: '#4285f4',
        logoUrl: ''
      },
      adminConfig: [
        { title: 'Principal', email: 'principal@school.edu' }
      ],
      emailConfig: {
        goodNewsSubject: 'Good News - Positive Behavior Recognition',
        stopThinkSubject: 'Behavior Update - Opportunity for Growth'
      },
      pillarConfig: {
        useDefaults: true,
        pillars: DEFAULT_PILLARS
      }
    };

    saveConfiguration(basicConfig.schoolConfig, basicConfig.adminConfig, basicConfig.emailConfig, basicConfig.pillarConfig);

    // Mark setup as complete
    PropertiesService.getScriptProperties().setProperties({
      'SETUP_COMPLETE': 'true',
      'SETUP_DATE': new Date().toISOString()
    });

    // Create menu
    createBehaviorSystemMenu();

    ui.alert(
      'Setup Complete!',
      'Basic system setup is complete!\n\n' +
      'You can now:\n' +
      '• Add student data to the Directory sheet\n' +
      '• Customize settings in the System Configuration sheet\n' +
      '• Use the Behavior System menu for additional functions',
      ui.ButtonSet.OK
    );

  } catch (error) {
    Logger.log('Setup error: ' + error.toString());
    ui.alert('Setup Error', 'An error occurred during setup: ' + error.message);
  }
}

/**
 * Create the spreadsheet structure
 */
function createSpreadsheetStructure() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create required sheets
  Object.values(SYSTEM_CONFIG.SHEETS).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Clear existing content
    sheet.clear();

    // Set up each sheet based on its purpose
    setupSheet(sheet, sheetName);
  });
}

/**
 * Set up individual sheets
 */
function setupSheet(sheet, sheetName) {
  switch (sheetName) {
    case SYSTEM_CONFIG.SHEETS.CONFIG:
      setupConfigSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.DIRECTORY:
      setupDirectorySheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.BEHAVIOR_FORM:
      setupBehaviorFormSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.PILLARS:
      setupPillarsSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.ADMIN_CONTACTS:
      setupAdminContactsSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.ATTRIBUTION:
      setupAttributionSheet(sheet);
      break;
  }
}

/**
 * Set up configuration sheet
 */
function setupConfigSheet(sheet) {
  const headers = [['Setting', 'Value', 'Description']];
  sheet.getRange(1, 1, 1, 3).setValues(headers);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 400);
}

/**
 * Set up directory sheet
 */
function setupDirectorySheet(sheet) {
  const headers = [[
    'Student First', 'Student Last', 'Grade', 'Student Email',
    'Parent1 First', 'Parent1 Last', 'Parent1 Email',
    'Parent2 First', 'Parent2 Last', 'Parent2 Email'
  ]];

  sheet.getRange(1, 1, 1, 10).setValues(headers);
  sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 10);

  // Add sample data
  const sampleData = [
    ['John', 'Smith', '7', 'john.smith@school.edu', 'Jane', 'Smith', 'jane.smith@email.com', 'Bob', 'Smith', 'bob.smith@email.com'],
    ['Sarah', 'Johnson', '8', 'sarah.johnson@school.edu', 'Mary', 'Johnson', 'mary.johnson@email.com', '', '', '']
  ];

  sheet.getRange(2, 1, 2, 10).setValues(sampleData);
  sheet.getRange(2, 1, 2, 10).setFontStyle('italic');
}

/**
 * Set up behavior form sheet
 */
function setupBehaviorFormSheet(sheet) {
  const headers = [[
    'Timestamp', 'Teacher Email', 'Student First', 'Student Last', 'Behavior Type',
    'Location', 'Selected Pillars', 'Selected Behaviors', 'Comments', 'Reserved1', 'Reserved2',
    'Student Email', 'Parent1 First', 'Parent1 Last', 'Parent1 Email',
    'Parent2 First', 'Parent2 Last', 'Parent2 Email', 'Admin CC Info', 'Reserved3'
  ]];

  sheet.getRange(1, 1, 1, 20).setValues(headers);
  sheet.getRange(1, 1, 1, 20).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 20);
}

/**
 * Set up pillars sheet
 */
function setupPillarsSheet(sheet) {
  const headers = [['Pillar Name', 'Color', 'Icon', 'Description', 'Positive Behaviors', 'Negative Behaviors']];
  sheet.getRange(1, 1, 1, 6).setValues(headers);
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#f0f0f0');

  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 400);
  sheet.setColumnWidth(6, 400);
}

/**
 * Set up admin contacts sheet
 */
function setupAdminContactsSheet(sheet) {
  const headers = [['Title', 'Email', 'Include in CC', 'Notes']];
  sheet.getRange(1, 1, 1, 4).setValues(headers);
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 4);
}

/**
 * Set up attribution sheet
 */
function setupAttributionSheet(sheet) {
  const attributionData = [
    ['Student Behavior Management System', '', ''],
    ['', '', ''],
    ['Created by:', ATTRIBUTION.CREATED_BY, ''],
    ['Department:', ATTRIBUTION.DEPARTMENT, ''],
    ['Contact Email:', ATTRIBUTION.CONTACT_EMAIL, ''],
    ['Support Phone:', ATTRIBUTION.SUPPORT_PHONE, ''],
    ['Website:', ATTRIBUTION.WEBSITE, ''],
    ['Version:', ATTRIBUTION.VERSION, ''],
    ['Year:', ATTRIBUTION.YEAR, ''],
    ['License:', ATTRIBUTION.LICENSE, '']
  ];

  sheet.getRange(1, 1, attributionData.length, 3).setValues(attributionData);
  sheet.getRange(1, 1).setFontSize(18).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  sheet.getRange(3, 1, 8, 1).setFontWeight('bold');
  sheet.autoResizeColumns(1, 3);

  // Protect the sheet
  const protection = sheet.protect().setDescription('System attribution - do not modify');
  protection.setWarningOnly(true);
}

/**
 * Save configuration to sheets and properties
 */
function saveConfiguration(schoolConfig, adminConfig, emailConfig, pillarConfig) {
  // Save to Properties Service
  PropertiesService.getScriptProperties().setProperties({
    'SCHOOL_CONFIG': JSON.stringify(schoolConfig),
    'ADMIN_CONFIG': JSON.stringify(adminConfig),
    'EMAIL_CONFIG': JSON.stringify(emailConfig),
    'PILLAR_CONFIG': JSON.stringify(pillarConfig)
  });

  // Save to sheets for user editing
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Update config sheet
  const configSheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.CONFIG);
  if (configSheet) {
    const configData = [
      ['School Name', schoolConfig.schoolName, 'Name of your school'],
      ['District Name', schoolConfig.districtName, 'Name of your district'],
      ['Primary Color', schoolConfig.primaryColor, 'Primary color for branding (hex code)'],
      ['Logo URL', schoolConfig.logoUrl, 'URL to your school logo'],
      ['Good News Subject', emailConfig.goodNewsSubject, 'Subject line for positive behavior emails'],
      ['Stop Think Subject', emailConfig.stopThinkSubject, 'Subject line for improvement behavior emails'],
      ['Send Emails', 'true', 'Whether to actually send emails (true/false)'],
      ['Similarity Threshold', '3', 'Maximum typo tolerance for student name lookup'],
      ['Max Suggestions', '5', 'Maximum number of name suggestions to show']
    ];

    configSheet.getRange(2, 1, configData.length, 3).setValues(configData);
  }

  // Update admin contacts sheet
  const adminSheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.ADMIN_CONTACTS);
  if (adminSheet) {
    const adminData = adminConfig.map(admin => [admin.title, admin.email, 'Yes', '']);
    if (adminData.length > 0) {
      adminSheet.getRange(2, 1, adminData.length, 4).setValues(adminData);
    }
  }

  // Update pillars sheet
  const pillarsSheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.PILLARS);
  if (pillarsSheet) {
    const pillarsData = pillarConfig.pillars.map(pillar => [
      pillar.name,
      pillar.color,
      pillar.iconSymbol,
      pillar.description,
      pillar.positiveBehaviors.join('\n'),
      pillar.negativeBehaviors.join('\n')
    ]);

    if (pillarsData.length > 0) {
      pillarsSheet.getRange(2, 1, pillarsData.length, 6).setValues(pillarsData);
      pillarsSheet.getRange(2, 5, pillarsData.length, 2).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    }
  }
}

/**
 * Create basic menu
 */
function createBehaviorSystemMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 Behavior System')
    .addItem('🚀 Run Setup Wizard', 'setupWizard')
    .addSeparator()
    .addItem('🧪 Test System', 'testSystem')
    .addItem('ℹ️ About This System', 'showSystemInfo')
    .addToUi();
}

/**
 * Test system function
 */
function testSystem() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Test System', 'System test functionality will be implemented in Phase 2.', ui.ButtonSet.OK);
}

/**
 * Show system info
 */
function showSystemInfo() {
  const ui = SpreadsheetApp.getUi();

  ui.alert(
    'About Student Behavior Management System',
    `Student Behavior Management System v${ATTRIBUTION.VERSION}\n\n` +
    `Created by: ${ATTRIBUTION.CREATED_BY}\n` +
    `Department: ${ATTRIBUTION.DEPARTMENT}\n` +
    `Year: ${ATTRIBUTION.YEAR}\n\n` +
    `📧 Support: ${ATTRIBUTION.CONTACT_EMAIL}\n` +
    `📞 Phone: ${ATTRIBUTION.SUPPORT_PHONE}\n` +
    `🌐 Website: ${ATTRIBUTION.WEBSITE}\n\n` +
    `© ${ATTRIBUTION.YEAR} ${ATTRIBUTION.CREATED_BY}. All rights reserved.`,
    ui.ButtonSet.OK
  );
}

/**
 * OnOpen function
 */
function onOpen() {
  if (isSystemSetup()) {
    createBehaviorSystemMenu();
  } else {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('📋 Behavior System')
      .addItem('🚀 Run Setup Wizard', 'setupWizard')
      .addItem('ℹ️ About This System', 'showSystemInfo')
      .addToUi();
  }
}
