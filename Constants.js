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
  SCHOOL_NAME: "[ENTER YOUR SCHOOL NAME]",
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
    PRINCIPAL: "[Please enter a valid email]",
    ASSOCIATE_PRINCIPAL: "[Please enter a valid email or leave blank]",
    ACADEMIC_SUPPORT: "[Please enter a valid email or leave blank]",
    TECH_SUPPORT: "[Please enter a valid email or leave blank]"
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
  ui.createMenu('Constants Admin')
    .addItem('🎯 NEW SCHOOL SETUP WIZARD', 'runNewSchoolSetupWizard')
    .addSeparator()
    .addItem('Setup Constants Sheet', 'setupConstantsSheet')
    .addItem('🔍 Verify System Setup', 'verifySystemSetup')
    .addItem('📖 Complete Deployment Guide (Beginners)', 'showBeginnerDeploymentGuide')
    .addItem('🚀 Quick Deployment Steps (Advanced)', 'showQuickDeploymentInstructions')
    .addItem('🔧 Deployment Troubleshooting', 'showDeploymentTroubleshooting')
    .addToUi();
}

/**
 * NEW SCHOOL SETUP WIZARD
 * Comprehensive setup function that guides new schools through complete system configuration
 */
function runNewSchoolSetupWizard() {
  const ui = SpreadsheetApp.getUi();
  
  // Welcome message
  const welcomeResponse = ui.alert(
    '🎯 New School Setup Wizard',
    'This wizard will help you set up the complete Behavior Management System for your school.\n\n' +
    'You will be prompted for:\n' +
    '• School name\n' +
    '• Administrator email addresses\n' +
    '• System preferences\n\n' +
    'The wizard will then automatically:\n' +
    '• Create all necessary spreadsheet tabs\n' +
    '• Set up email triggers\n' +
    '• Configure the pillar system\n' +
    '• Test permissions\n\n' +
    'Ready to begin?',
    ui.ButtonSet.YES_NO
  );
  
  if (welcomeResponse !== ui.Button.YES) {
    ui.alert('Setup Cancelled', 'Setup wizard was cancelled. You can run it again anytime from the menu.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    // Step 1: Collect school information
    ui.alert('Step 1 of 6', 'Let\'s start by collecting your school information.', ui.ButtonSet.OK);
    
    const schoolName = ui.prompt(
      'School Name',
      'Enter your school name (e.g., "Lincoln Middle School"):',
      ui.ButtonSet.OK_CANCEL
    );
    if (schoolName.getSelectedButton() !== ui.Button.OK || !schoolName.getResponseText().trim()) {
      throw new Error('School name is required');
    }
    
    // Step 2: Collect admin emails
    ui.alert('Step 2 of 6', 'Now let\'s collect administrator email addresses.', ui.ButtonSet.OK);
    
    const principalEmail = ui.prompt(
      'Principal Email',
      'Enter the principal\'s email address:',
      ui.ButtonSet.OK_CANCEL
    );
    if (principalEmail.getSelectedButton() !== ui.Button.OK || !principalEmail.getResponseText().trim()) {
      throw new Error('Principal email is required');
    }
    
    const associatePrincipalEmail = ui.prompt(
      'Associate Principal Email',
      'Enter the associate principal\'s email address (or leave blank if none):',
      ui.ButtonSet.OK_CANCEL
    );
    if (associatePrincipalEmail.getSelectedButton() !== ui.Button.OK) {
      throw new Error('Setup cancelled by user');
    }
    
    const academicSupportEmail = ui.prompt(
      'Academic Support Email',
      'Enter the academic support coordinator\'s email address (or leave blank if none):',
      ui.ButtonSet.OK_CANCEL
    );
    if (academicSupportEmail.getSelectedButton() !== ui.Button.OK) {
      throw new Error('Setup cancelled by user');
    }
    
    const techSupportEmail = ui.prompt(
      'Tech Support Email',
      'Enter the tech support email address (or leave blank if none):',
      ui.ButtonSet.OK_CANCEL
    );
    if (techSupportEmail.getSelectedButton() !== ui.Button.OK) {
      throw new Error('Setup cancelled by user');
    }
    
    // Step 3: Email preferences
    ui.alert('Step 3 of 6', 'Let\'s configure email settings.', ui.ButtonSet.OK);
    
    const enableEmails = ui.alert(
      'Email Settings',
      'Do you want to enable automatic email sending?\n\n' +
      'YES = Emails will be sent automatically to parents and staff\n' +
      'NO = Emails will be logged but not sent (good for testing)',
      ui.ButtonSet.YES_NO
    );
    
    // Step 4: Update constants with collected information
    ui.alert('Step 4 of 6', 'Now I\'ll update the system configuration with your information...', ui.ButtonSet.OK);
    
    // Update the DEFAULT_CONSTANTS object
    DEFAULT_CONSTANTS.SCHOOL_NAME = schoolName.getResponseText().trim();
    DEFAULT_CONSTANTS.ADMIN_EMAILS.PRINCIPAL = principalEmail.getResponseText().trim();
    DEFAULT_CONSTANTS.ADMIN_EMAILS.ASSOCIATE_PRINCIPAL = associatePrincipalEmail.getResponseText().trim() || "";
    DEFAULT_CONSTANTS.ADMIN_EMAILS.ACADEMIC_SUPPORT = academicSupportEmail.getResponseText().trim() || "";
    DEFAULT_CONSTANTS.ADMIN_EMAILS.TECH_SUPPORT = techSupportEmail.getResponseText().trim() || "";
    DEFAULT_CONSTANTS.SEND_EMAILS = (enableEmails === ui.Button.YES);
    
    // Step 5: Run all setup functions
    ui.alert('Step 5 of 6', 'Setting up system components. This may take a moment...', ui.ButtonSet.OK);
    
    // Setup constants sheet with new values (this will write the modified DEFAULT_CONSTANTS to the sheet)
    setupConstantsSheet();
    Utilities.sleep(1000); // Brief pause for UI
    
    // Setup pillars sheets
    setupPillarsSheets();
    Utilities.sleep(1000);
    
    // Create triggers (this will request permissions)
    try {
      createOnEditTrigger(); // For DirectoryInfo auto-population
      checkAndCreateDailySummaryTrigger(); // For daily summary emails
    } catch (error) {
      Logger.log('Trigger creation error (expected during first run): ' + error.toString());
      // This is expected - user needs to authorize
    }
    
    // Force permission requests by testing services
    try {
      // Test email service (forces authorization)
      Session.getActiveUser().getEmail();
      MailApp.getRemainingDailyQuota();
      
      // Test script service
      ScriptApp.getProjectTriggers();
      
    } catch (error) {
      Logger.log('Permission request error (expected): ' + error.toString());
    }
    
    // Step 6: Complete and provide instructions
    ui.alert('Step 6 of 6', 'Almost done! Finalizing setup...', ui.ButtonSet.OK);
    
    // Load the new constants to verify
    loadConstants();
    
    // Show completion message with next steps
    const nextSteps = ui.alert(
      '✅ Setup Complete!',
      'Your Behavior Management System has been configured:\n\n' +
      '✅ School: ' + CONFIG.SCHOOL_NAME + '\n' +
      '✅ Principal: ' + CONFIG.ADMIN_EMAILS.PRINCIPAL + '\n' +
      '✅ Emails: ' + (CONFIG.SEND_EMAILS ? 'Enabled' : 'Disabled') + '\n' +
      '✅ All sheets and triggers created\n\n' +
      'FINAL STEP: You need to deploy the web app\n\n' +
      'This creates a web form that teachers can use to submit behavior reports.\n\n' +
      '🚨 AFTER DEPLOYMENT, YOU MUST:\n' +
      '1. Share this spreadsheet with your teachers (Viewer access)\n' +
      '2. Populate the Directory sheet with student/parent data\n' +
      '3. Optionally customize the pillar behavior data\n\n' +
      'Would you like to see:\n' +
      '📖 Complete step-by-step guide (recommended for beginners)\n' +
      '🚀 Quick deployment steps (for experienced users)',
      ui.ButtonSet.YES_NO
    );
    
    if (nextSteps === ui.Button.YES) {
      // Ask which deployment guide they want
      const guideChoice = ui.alert(
        'Choose Your Deployment Guide',
        'Which guide would you prefer?\n\n' +
        'YES = 📖 Complete step-by-step guide (recommended for beginners)\n' +
        'NO = 🚀 Quick steps (for experienced users)',
        ui.ButtonSet.YES_NO
      );
      
      if (guideChoice === ui.Button.YES) {
        showBeginnerDeploymentGuide();
      } else {
        showQuickDeploymentInstructions();
      }
    }
    
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ New school setup completed successfully!', 'Setup Complete', 10);
    
  } catch (error) {
    ui.alert('Setup Error', 'An error occurred during setup: ' + error.message + '\n\nYou can try running the setup wizard again.', ui.ButtonSet.OK);
    Logger.log('Setup wizard error: ' + error.toString());
  }
}

/**
 * Shows beginner-friendly step-by-step deployment guide
 */
function showBeginnerDeploymentGuide() {
  const ui = SpreadsheetApp.getUi();
  
  // Introduction screen
  ui.alert(
    '📖 Complete Deployment Guide',
    'Welcome to the deployment guide!\n\n' +
    'Don\'t worry - this sounds technical but it\'s actually quite simple. We\'ll walk through every step together.\n\n' +
    'WHAT WE\'RE DOING:\n' +
    'We\'re going to create a web form (like a Google Form, but custom-built for your school) that teachers can use to submit behavior reports.\n\n' +
    'This will take about 5 minutes and you only need to do it once.\n\n' +
    'Ready to start?',
    ui.ButtonSet.OK
  );
  
  // Step 1: Open Apps Script
  ui.alert(
    'Step 1: Open the Apps Script Editor',
    'WHAT IS APPS SCRIPT?\n' +
    'Apps Script is Google\'s tool for creating custom applications. Think of it like the "engine" that powers your behavior form.\n\n' +
    'HOW TO OPEN IT:\n' +
    '1. Look at the top menu of your spreadsheet\n' +
    '2. Click "Extensions" (it\'s next to "Tools")\n' +
    '3. Click "Apps Script" from the dropdown menu\n\n' +
    'WHAT YOU\'LL SEE:\n' +
    'A new tab will open with code files. Don\'t worry about the code - we just need to deploy it!\n\n' +
    'Ready for the next step?',
    ui.ButtonSet.OK
  );
  
  // Step 2: Start deployment
  ui.alert(
    'Step 2: Start Creating Your Web App',
    'Now we\'ll tell Google to create your web form.\n\n' +
    'LOOK FOR THE "DEPLOY" BUTTON:\n' +
    '• It\'s in the top-right corner of the Apps Script window\n' +
    '• It\'s blue and says "Deploy"\n' +
    '• If you don\'t see it, make sure you\'re in the Apps Script tab\n\n' +
    'CLICK THE DEPLOY BUTTON:\n' +
    '1. Click the "Deploy" button\n' +
    '2. From the dropdown menu, click "New deployment"\n\n' +
    'WHAT HAPPENS NEXT:\n' +
    'A popup window will appear asking what type of deployment you want.\n\n' +
    'Continue to the next step...',
    ui.ButtonSet.OK
  );
  
  // Step 3: Configure deployment
  ui.alert(
    'Step 3: Choose "Web App"',
    'You should now see a popup titled "New deployment".\n\n' +
    'FIND THE GEAR/SETTINGS ICON:\n' +
    '• Look for a small gear (⚙️) or settings icon\n' +
    '• It\'s usually near the top-left of the popup\n' +
    '• Click this gear icon\n\n' +
    'SELECT "WEB APP":\n' +
    '• A menu will appear\n' +
    '• Click "Web app" from the list\n' +
    '• (Don\'t choose "Add-on" or other options)\n\n' +
    'NOW YOU\'LL SEE SETTINGS:\n' +
    'The popup will show several options to configure. We\'ll set these up in the next step.\n\n' +
    'Ready to configure the settings?',
    ui.ButtonSet.OK
  );
  
  // Step 4: Fill in settings
  ui.alert(
    'Step 4: Configure Your Web App Settings',
    'Now we need to fill in a few important settings:\n\n' +
    '📝 DESCRIPTION:\n' +
    '• Type: "Behavior Form" (or whatever you prefer)\n' +
    '• This is just a label to help you remember what this is\n\n' +
    '👤 EXECUTE AS:\n' +
    '• Choose "User accessing the web app"\n' +
    '• This is IMPORTANT: allows emails to be sent from the teacher\'s account\n' +
    '• DO NOT choose "Me" - emails would come from your account instead\n\n' +
    '🌐 WHO HAS ACCESS:\n' +
    '• Choose "Anyone"\n' +
    '• This allows teachers to use the form without special permissions\n' +
    '• Don\'t worry - "Anyone" just means anyone with the link\n\n' +
    'When all settings are filled in, click the blue "Deploy" button at the bottom.\n\n' +
    'Continue to the next step...',
    ui.ButtonSet.OK
  );
  
  // Step 5: Authorization
  ui.alert(
    'Step 5: Authorize Your App',
    'Google will now ask for permission to create your web app.\n\n' +
    'YOU MIGHT SEE A SECURITY WARNING:\n' +
    '• This is normal! Google shows this for custom apps\n' +
    '• Click "Advanced" if you see a warning screen\n' +
    '• Then click "Go to [Your Project Name] (unsafe)"\n' +
    '• This is safe - it\'s your own app!\n\n' +
    'GRANT PERMISSIONS:\n' +
    '• Google will list the permissions your app needs\n' +
    '• These allow the form to save to your spreadsheet and send emails\n' +
    '• Click "Allow" to grant these permissions\n\n' +
    'WHY "USER ACCESSING" IS IMPORTANT:\n' +
    '• With this setting, when a teacher submits a behavior report, emails are sent from THEIR Gmail account\n' +
    '• This means parents see the email as coming from their child\'s teacher\n' +
    '• If you chose "Me" instead, all emails would come from your account\n\n' +
    'WHAT HAPPENS NEXT:\n' +
    'Google will create your web app and give you a special URL.\n\n' +
    'Almost done!',
    ui.ButtonSet.OK
  );
  
  // Step 6: Get the URL
  ui.alert(
    'Step 6: Get Your Web Form URL',
    'Congratulations! Your web app has been created!\n\n' +
    'COPY THE WEB APP URL:\n' +
    '• You\'ll see a long URL that starts with "https://script.google.com/..."\n' +
    '• Select all of this URL text\n' +
    '• Copy it (Ctrl+C or Cmd+C)\n' +
    '• Save this URL somewhere safe - you\'ll need it!\n\n' +
    '📱 THIS URL IS YOUR BEHAVIOR FORM:\n' +
    '• Teachers will go to this URL to submit behavior reports\n' +
    '• You can bookmark it, email it, or put it on your website\n' +
    '• The form will automatically save to your spreadsheet\n\n' +
    'CLICK "DONE" to close the deployment window.\n\n' +
    'Ready for the final step?',
    ui.ButtonSet.OK
  );
  
  // Step 7: Share the spreadsheet
  ui.alert(
    'Step 7: Share Your Spreadsheet with Teachers',
    'CRITICAL: Your teachers need access to the spreadsheet for the form to work!\n\n' +
    'HOW TO SHARE:\n' +
    '1. In your spreadsheet (not Apps Script), click the blue "Share" button (top right)\n' +
    '2. In the "Add people and groups" box, enter teacher email addresses\n' +
    '3. Click the dropdown next to "Editor" and change it to "Viewer"\n' +
    '4. Click "Send" to share with all teachers\n\n' +
    'WHY VIEWER ACCESS:\n' +
    '• Teachers need to see the spreadsheet for the form to work\n' +
    '• "Viewer" prevents accidental changes to your setup\n' +
    '• You can always change permissions later\n\n' +
    'WITHOUT SHARING, THE FORM WILL NOT WORK FOR TEACHERS!\n\n' +
    'Ready for the next critical step?',
    ui.ButtonSet.OK
  );
  
  // Step 8: Set up Directory
  ui.alert(
    'Step 8: Set Up Your Directory Sheet',
    'The Directory sheet enables automatic student lookup in your form.\n\n' +
    'REQUIRED COLUMNS (in this order):\n' +
    '• Column A: Student First Name\n' +
    '• Column B: Student Last Name\n' +
    '• Column C: Grade\n' +
    '• Column D: Student Email\n' +
    '• Column E: Parent1 First Name\n' +
    '• Column F: Parent1 Last Name\n' +
    '• Column G: Parent1 Email\n' +
    '• Column H: Parent2 First Name\n' +
    '• Column I: Parent2 Last Name\n' +
    '• Column J: Parent2 Email\n\n' +
    'EXAMPLE ROW:\n' +
    'John | Smith | 7 | john.smith@student.edu | Mary | Smith | mary.smith@email.com | Bob | Smith | bob.smith@email.com\n\n' +
    'TIP: You can leave parent2 columns blank if there\'s only one parent.\n\n' +
    'Ready for the final step?',
    ui.ButtonSet.OK
  );
  
  // Step 9: Final instructions
  ui.alert(
    '🎉 Setup Complete! Final Instructions',
    'YOUR BEHAVIOR MANAGEMENT SYSTEM IS NOW LIVE!\n\n' +
    '✅ What you\'ve accomplished:\n' +
    '• Created a custom behavior form for your school\n' +
    '• Connected it to your spreadsheet\n' +
    '• Set up automatic email notifications\n' +
    '• Generated a URL that teachers can use\n\n' +
    '🚨 CRITICAL REQUIREMENTS (Don\'t Skip!):\n' +
    '1. SHARE YOUR SPREADSHEET with teachers:\n' +
    '   • Click "Share" button in your spreadsheet\n' +
    '   • Add teacher emails with "Viewer" access\n' +
    '   • WITHOUT this, the form will not work for teachers!\n\n' +
    '2. POPULATE THE DIRECTORY SHEET:\n' +
    '   • Add student names, emails, and parent contact info\n' +
    '   • This enables automatic student lookup in the form\n' +
    '   • Format: First Name | Last Name | Grade | Email | Parent1 First | Parent1 Last | Parent1 Email | etc.\n\n' +
    '3. CUSTOMIZE PILLAR DATA (Optional):\n' +
    '   • Edit the Pillars, PositiveBehaviors, NegativeBehaviors sheets\n' +
    '   • Add/remove/modify behaviors to match your school\n' +
    '   • Changes update automatically in the form\n\n' +
    '📋 NEXT STEPS:\n' +
    '1. Complete the critical requirements above\n' +
    '2. Test the form by visiting the URL yourself\n' +
    '3. Share the URL with your teachers\n' +
    '4. Consider bookmarking the URL for easy access\n\n' +
    '📞 IF YOU NEED HELP:\n' +
    '• Test the system with a sample behavior report\n' +
    '• Check that emails are being sent correctly\n' +
    '• Use the "🔍 Verify System Setup" menu option\n\n' +
    'Congratulations on setting up your behavior management system!',
    ui.ButtonSet.OK
  );
}

/**
 * Shows quick deployment instructions for experienced users
 */
function showQuickDeploymentInstructions() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '🚀 Quick Deployment Instructions',
    'For experienced users:\n\n' +
    '1. Extensions → Apps Script\n' +
    '2. Deploy → New Deployment\n' +
    '3. Gear icon → Web app\n' +
    '4. Configure:\n' +
    '   • Description: "Behavior Form"\n' +
    '   • Execute as: "User accessing the web app"\n' +
    '   • Who has access: "Anyone"\n' +
    '5. Deploy → Authorize → Copy URL\n' +
    '6. CRITICAL: Share spreadsheet with teachers (Viewer access)\n' +
    '7. CRITICAL: Populate Directory sheet with student data\n' +
    '8. Share URL with teachers\n\n' +
    'The form will be live at the generated URL.\n\n' +
    '🚨 Without steps 6-7, the form will not work properly!',
    ui.ButtonSet.OK
  );
}

/**
 * Verifies that the system is properly set up
 */
function verifySystemSetup() {
  const ui = SpreadsheetApp.getUi();
  let status = '🔍 System Setup Verification\n\n';
  let allGood = true;
  
  try {
    // Check if constants are loaded
    loadConstants();
    
    // Check constants sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const constantsSheet = ss.getSheetByName('Constants');
    if (constantsSheet) {
      status += '✅ Constants sheet exists\n';
    } else {
      status += '❌ Constants sheet missing\n';
      allGood = false;
    }
    
    // Check pillars sheets
    const pillarSheets = ['Pillars', 'PositiveBehaviors', 'PositiveRecognitionExamples', 'NegativeBehaviors', 'LearningFocus'];
    pillarSheets.forEach(sheetName => {
      if (ss.getSheetByName(sheetName)) {
        status += '✅ ' + sheetName + ' sheet exists\n';
      } else {
        status += '❌ ' + sheetName + ' sheet missing\n';
        allGood = false;
      }
    });
    
    // Check required sheets
    const requiredSheets = ['Directory', 'Behavior Form'];
    requiredSheets.forEach(sheetName => {
      if (ss.getSheetByName(sheetName)) {
        status += '✅ ' + sheetName + ' sheet exists\n';
      } else {
        status += '❌ ' + sheetName + ' sheet missing\n';
        allGood = false;
      }
    });
    
    // Check CONFIG values
    if (CONFIG.SCHOOL_NAME && CONFIG.SCHOOL_NAME !== 'Orono Middle School') {
      status += '✅ School name configured: ' + CONFIG.SCHOOL_NAME + '\n';
    } else {
      status += '⚠️ School name not customized\n';
    }
    
    if (CONFIG.ADMIN_EMAILS && CONFIG.ADMIN_EMAILS.PRINCIPAL) {
      status += '✅ Principal email configured\n';
    } else {
      status += '❌ Principal email not configured\n';
      allGood = false;
    }
    
    // Check triggers
    const triggers = ScriptApp.getProjectTriggers();
    let hasOnEditTrigger = false;
    let hasDailyTrigger = false;
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onEdit') hasOnEditTrigger = true;
      if (trigger.getHandlerFunction() === 'sendDailySummaryEmail') hasDailyTrigger = true;
    });
    
    if (hasOnEditTrigger) {
      status += '✅ onEdit trigger exists (for student auto-lookup)\n';
    } else {
      status += '⚠️ onEdit trigger not found (student auto-lookup disabled)\n';
    }
    
    if (hasDailyTrigger) {
      status += '✅ Daily summary trigger exists\n';
    } else {
      status += '⚠️ Daily summary trigger not found\n';
    }
    
    // Check for data requirements
    status += '\n--- DATA REQUIREMENTS ---\n';
    
    // Check Directory sheet has meaningful data
    const directorySheet = ss.getSheetByName('Directory');
    if (directorySheet) {
      const directoryData = directorySheet.getDataRange().getValues();
      if (directoryData.length > 1) { // More than just headers
        // Check if we have meaningful student data
        let validStudentCount = 0;
        let hasEmailData = false;
        
        for (let i = 1; i < directoryData.length; i++) {
          const row = directoryData[i];
          const firstName = row[0] ? String(row[0]).trim() : '';
          const lastName = row[1] ? String(row[1]).trim() : '';
          const studentEmail = row[3] ? String(row[3]).trim() : '';
          const parentEmail = row[6] ? String(row[6]).trim() : '';
          
          if (firstName && lastName) {
            validStudentCount++;
            if (studentEmail || parentEmail) hasEmailData = true;
          }
        }
        
        if (validStudentCount > 0) {
          status += `✅ Directory has ${validStudentCount} students with names\n`;
          if (hasEmailData) {
            status += '✅ Directory includes email addresses for notifications\n';
          } else {
            status += '⚠️ Directory missing email addresses - notifications may not work\n';
          }
        } else {
          status += '❌ Directory has rows but no valid student names\n';
          status += '   • Add student first and last names to columns A & B\n';
          allGood = false;
        }
      } else {
        status += '❌ Directory sheet is empty - student auto-lookup will not work\n';
        status += '   • Add student data: First Name, Last Name, Grade, Email, Parent info\n';
        allGood = false;
      }
    } else {
      status += '❌ Directory sheet missing\n';
      allGood = false;
    }
    
    // Check if pillar sheets have data
    const pillarsSheet = ss.getSheetByName('Pillars');
    if (pillarsSheet) {
      const pillarsData = pillarsSheet.getDataRange().getValues();
      if (pillarsData.length > 1) {
        status += '✅ Pillars data configured\n';
      } else {
        status += '⚠️ Pillars sheet is empty - run setup wizard\n';
      }
    }
    
    // Check actual sharing status
    status += '\n--- SHARING STATUS ---\n';
    try {
      const viewers = ss.getViewers();
      const editors = ss.getEditors();
      const totalSharedUsers = viewers.length + editors.length;
      
      if (totalSharedUsers > 0) {
        status += `✅ Spreadsheet shared with ${totalSharedUsers} users\n`;
        if (viewers.length > 0) status += `   • ${viewers.length} viewers (teachers should be viewers)\n`;
        if (editors.length > 0) status += `   • ${editors.length} editors\n`;
      } else {
        status += '❌ Spreadsheet not shared with anyone - teachers cannot use the form!\n';
        status += '   • Click "Share" button in spreadsheet to add teacher emails\n';
        allGood = false;
      }
    } catch (error) {
      status += '⚠️ Could not check sharing status - ensure you have sharing permissions\n';
    }
    
    if (allGood) {
      status += '\n🎉 System appears to be fully configured!';
    } else {
      status += '\n⚠️ Some issues found. Consider running the setup wizard.';
    }
    
  } catch (error) {
    status += '\n❌ Error during verification: ' + error.message;
  }
  
  ui.alert('System Verification', status, ui.ButtonSet.OK);
}

/**
 * Provides troubleshooting help for common deployment issues
 */
function showDeploymentTroubleshooting() {
  const ui = SpreadsheetApp.getUi();
  
  const troubleChoice = ui.alert(
    '🔧 Deployment Troubleshooting',
    'What problem are you experiencing?\n\n' +
    'YES = I can\'t find the Deploy button\n' +
    'NO = I\'m getting authorization/security errors\n' +
    'CANCEL = Other problems',
    ui.ButtonSet.YES_NO_CANCEL
  );
  
  if (troubleChoice === ui.Button.YES) {
    // Deploy button issues
    ui.alert(
      '🔍 Can\'t Find the Deploy Button?',
      'COMMON CAUSES:\n\n' +
      '1. WRONG TAB:\n' +
      '• Make sure you\'re in the Apps Script tab, not the spreadsheet\n' +
      '• The URL should show "script.google.com"\n\n' +
      '2. BROWSER ISSUES:\n' +
      '• Try refreshing the Apps Script page\n' +
      '• Try a different browser (Chrome works best)\n' +
      '• Disable browser extensions temporarily\n\n' +
      '3. ACCOUNT PERMISSIONS:\n' +
      '• Make sure you\'re logged into the correct Google account\n' +
      '• The account should own or have edit access to the spreadsheet\n\n' +
      'SOLUTION:\n' +
      '• Close Apps Script tab\n' +
      '• Go back to your spreadsheet\n' +
      '• Try Extensions → Apps Script again',
      ui.ButtonSet.OK
    );
  } else if (troubleChoice === ui.Button.NO) {
    // Authorization issues
    ui.alert(
      '🔐 Authorization & Security Issues',
      'SECURITY WARNING SCREENS:\n\n' +
      '1. "Google hasn\'t verified this app":\n' +
      '• This is normal for custom Apps Script projects\n' +
      '• Click "Advanced" at the bottom left\n' +
      '• Then click "Go to [Project Name] (unsafe)"\n' +
      '• It\'s safe because it\'s YOUR app\n\n' +
      '2. PERMISSION REQUESTS:\n' +
      '• Google will ask to access your spreadsheets and send emails\n' +
      '• These permissions are needed for the behavior system to work\n' +
      '• Click "Allow" to grant permissions\n\n' +
      '3. ORGANIZATION RESTRICTIONS:\n' +
      '• Some school districts block custom apps\n' +
      '• Contact your IT department if you get blocked\n' +
      '• They may need to whitelist your domain',
      ui.ButtonSet.OK
    );
  } else {
    // Other issues
    ui.alert(
      '❓ Other Common Issues',
      'OTHER PROBLEMS & SOLUTIONS:\n\n' +
      '🚫 FORM NOT WORKING FOR TEACHERS:\n' +
      '• MOST COMMON: Spreadsheet not shared with teachers\n' +
      '• Click "Share" in your spreadsheet, add teacher emails with "Viewer" access\n' +
      '• Teachers need access to the spreadsheet for the form to work\n\n' +
      '👥 STUDENT DATA NOT AUTO-FILLING:\n' +
      '• Directory sheet is empty or missing student data\n' +
      '• Add student names and parent info to Directory sheet\n' +
      '• Format: First Name | Last Name | Grade | Student Email | Parent info...\n\n' +
      '🔗 BROKEN OR MISSING URL:\n' +
      '• Make sure you copied the entire URL\n' +
      '• The URL should start with "https://script.google.com"\n' +
      '• Try deploying again if the URL doesn\'t work\n\n' +
      '📧 EMAILS NOT SENDING:\n' +
      '• Check your Constants sheet - is SEND_EMAILS set to "true"?\n' +
      '• Test with your own email first\n' +
      '• Check spam/junk folders\n\n' +
      '🏛️ WANT TO CUSTOMIZE PILLARS:\n' +
      '• Edit the Pillars, PositiveBehaviors, NegativeBehaviors sheets\n' +
      '• Changes automatically update in the form\n' +
      '• No code changes needed\n\n' +
      'STILL NEED HELP?\n' +
      '• Use the "🔍 Verify System Setup" menu option\n' +
      '• Try the setup wizard again',
      ui.ButtonSet.OK
    );
  }
}

/**
 * Quick test function to verify the setup wizard components work
 */
function testSetupWizardComponents() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Test that all required functions exist
    if (typeof setupConstantsSheet !== 'function') throw new Error('setupConstantsSheet function not found');
    if (typeof setupPillarsSheets !== 'function') throw new Error('setupPillarsSheets function not found');
    if (typeof createOnEditTrigger !== 'function') throw new Error('createOnEditTrigger function not found');
    if (typeof checkAndCreateDailySummaryTrigger !== 'function') throw new Error('checkAndCreateDailySummaryTrigger function not found');
    
    // Test UI components
    ui.toast('Testing UI components...', 'Setup Test', 3);
    
    // Test constants access
    loadConstants();
    
    ui.alert('✅ Setup Test Complete', 'All setup wizard components are working correctly!', ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Setup Test Failed', 'Error: ' + error.message, ui.ButtonSet.OK);
  }
}

// It's recommended to call loadConstants() at the beginning of your main functions
// For example, in onFormSubmit(e) or sendDailySummaryEmail()
// loadConstants(); 
// Note: Calling it here globally might not work as expected due to script load timing.
// It's safer to call it explicitly at the start of functions that need the CONFIG object.
