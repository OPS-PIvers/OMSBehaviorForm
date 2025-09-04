

const SESSION_CACHE = CacheService.getScriptCache();

// --- NEW: Pillar Data ---
// Replace the existing PILLARS_DATA constant in EmailSystem.txt with this updated version



/**
 * Properly capitalizes a name with standard capitalization rules
 * @param {string} name - The name to capitalize
 * @return {string} - The properly capitalized name
 */
function capitalizeProperName(name) {
  if (!name) return '';
  
  // Handle empty input
  name = name.trim();
  if (name === '') return '';
  
  // Split by spaces, hyphens, and apostrophes while preserving the separators
  const parts = name.split(/( |-|')/g);
  
  // Capitalize each part (except separators)
  return parts.map(part => {
    // Skip separators
    if (part === ' ' || part === '-' || part === "'") return part;
    
    // Handle Mc and Mac prefixes specially
    if (/^mc/i.test(part)) {
      return 'Mc' + part.charAt(2).toUpperCase() + part.slice(3).toLowerCase();
    }
    if (/^mac/i.test(part) && part.length > 3) {
      return 'Mac' + part.charAt(3).toUpperCase() + part.slice(4).toLowerCase();
    }
    
    // Standard case: capitalize first letter, lowercase rest
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join('');
}

/**
 * Determines which pillars are associated with given behaviors
 * @param {string} behaviorType - "Good News" or "Stop & Think"
 * @param {string|string[]} behaviors - Behaviors text or array
 * @return {string[]} - Array of pillar names
 */
function determinePillarsFromBehaviors(behaviorType, behaviors) {
  loadPillarsData();
  if (!behaviors) return [];
  
  // Convert to array if it's a string
  const behaviorsList = Array.isArray(behaviors) ? 
    behaviors : 
    behaviors.split(',').map(b => b.trim());
  
  const isPositive = behaviorType.includes("Good News");
  const matchedPillars = new Set();
  
  // Check each behavior against each pillar's behavior lists
  behaviorsList.forEach(behavior => {
    PILLARS_DATA.forEach(pillar => {
      const behaviorList = isPositive ? pillar.positiveBehaviors : pillar.negativeBehaviors;
      
      // Check if this behavior is in the pillar's list
      const behaviorLower = behavior.toLowerCase();
      const found = behaviorList.some(pillarBehavior => 
        behaviorLower.includes(pillarBehavior.toLowerCase()) || 
        pillarBehavior.toLowerCase().includes(behaviorLower)
      );
      
      if (found) {
        matchedPillars.add(pillar.name);
      }
    });
  });
  
  // If no pillars matched, return "Responsibility" as default
  if (matchedPillars.size === 0) {
    return ["Responsibility"];
  }
  
  return Array.from(matchedPillars);
}

// Ensure getUserFullName, lookupStudent, calculateLevenshteinDistance etc. are in this file or accessible
// Ensure the Email Sending functions (sendGoodNewsEmail, sendStopAndThinkEmail, create...Body, sendEmailToParents) are here
/**
 * Creates a trigger to run when a form is submitted
 */
/**
 * Creates an onEdit trigger for DirectoryInfo auto-population functionality
 * This enables automatic student lookup when names are entered in the Behavior Form
 */
function createOnEditTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Check if onEdit trigger already exists to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    if (trigger.getHandlerFunction() === 'onEdit') {
      Logger.log('onEdit trigger already exists');
      return;
    }
  }
  
  // Create the onEdit trigger
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  Logger.log('onEdit trigger created successfully for DirectoryInfo auto-population');
}

/**
 * Removes the onEdit trigger if it exists
 */
function removeOnEditTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log(`Removed onEdit trigger with ID: ${trigger.getUniqueId()}`);
      SpreadsheetApp.getActiveSpreadsheet().toast('onEdit trigger removed successfully', 'Trigger Removed', 3);
      return;
    }
  }
  
  Logger.log('No onEdit trigger found to remove');
  SpreadsheetApp.getActiveSpreadsheet().toast('No onEdit trigger found to remove', 'Trigger Status', 3);
}

/**
 * Debug function to log form structure
 */
function logFormStructure(e) {
  Logger.log("Form submission data structure:");
  for (let key in e.namedValues) {
    Logger.log(`Field: "${key}" = ${JSON.stringify(e.namedValues[key])}`);
  }
}

/**
 * Safely get a form value with error checking
 */
function getFormValue(formValues, fieldName, defaultValue = "") {
  if (!formValues || !formValues[fieldName] || !formValues[fieldName][0]) {
    Logger.log(`Warning: Field "${fieldName}" is missing or empty`);
    return defaultValue;
  }
  return formValues[fieldName][0];
}

/**
 * Main function that runs when a form is submitted
 * 
 * @param {Object} e The event object from the form submission
 */
function onFormSubmit(e) {
  loadConstants();
  loadPillarsData();
  try {
    // Log the full structure for debugging
    logFormStructure(e);
    
    // Extract form response values
    const formValues = e.namedValues;
    
    // Get the type of behavior documented with error checking
    const behaviorType = getFormValue(formValues, "Which type of behavior are you documenting?");
    
    // Get student information with proper capitalization
    const studentFirst = capitalizeProperName(getFormValue(formValues, "Student First"));
    const studentLast = capitalizeProperName(getFormValue(formValues, "Student Last"));
    const studentEmail = getFormValue(formValues, "Student Email");
    
    // Get parent information with proper capitalization
    const parent1First = capitalizeProperName(getFormValue(formValues, "Parent1 First"));
    const parent1Last = capitalizeProperName(getFormValue(formValues, "Parent1 Last"));
    const parent1Email = getFormValue(formValues, "Parent1 Email");
    
    const parent2First = capitalizeProperName(getFormValue(formValues, "Parent2 First"));
    const parent2Last = capitalizeProperName(getFormValue(formValues, "Parent2 Last"));
    const parent2Email = getFormValue(formValues, "Parent2 Email");
    
    // Get teacher information
    const teacherEmail = getFormValue(formValues, "Email Address");
    const teacherName = getTeacherName(teacherEmail);
    
    // Log the extracted values for debugging
    Logger.log(`Student: ${studentFirst} ${studentLast}`);
    Logger.log(`Behavior Type: ${behaviorType}`);
    Logger.log(`Teacher: ${teacherName} (${teacherEmail})`);
    
    // Determine behavior type and create appropriate email
    if (behaviorType && behaviorType.includes("Stop & Think")) {
      // Handle Stop and Think behavior
      const location = getFormValue(formValues, "Location (Stop and Think)");
      const behaviors = getFormValue(formValues, "Stop and Think Behaviors");
      const comments = getFormValue(formValues, "Additional comments about the selected \"Stop and Think\" behavior:");
      
      // Determine relevant pillars based on behaviors
      const selectedPillars = determinePillarsFromBehaviors(behaviorType, behaviors);
      
      // Send Stop and Think email with parent names and pillars
      sendStopAndThinkEmail(
        studentFirst, 
        studentLast, 
        parent1Email, 
        parent2Email, 
        location, 
        behaviors, 
        comments,
        teacherEmail,
        teacherName,
        parent1First,
        parent2First,
        null, // ccList - default is empty
        selectedPillars // Pass the identified pillars
      );
      
    } else if (behaviorType && behaviorType.includes("Good News")) {
      // Handle Good News behavior
      const location = getFormValue(formValues, "Location (Good News)");
      const behaviors = getFormValue(formValues, "Good News Behaviors");
      const comments = getFormValue(formValues, "Additional comments about the selected \"Good News\" behavior:");
      
      // Determine relevant pillars based on behaviors
      const selectedPillars = determinePillarsFromBehaviors(behaviorType, behaviors);
      
      // Send Good News email with parent names and pillars
      sendGoodNewsEmail(
        studentFirst, 
        studentLast, 
        parent1Email, 
        parent2Email, 
        location, 
        behaviors, 
        comments,
        teacherEmail,
        teacherName,
        parent1First,
        parent2First,
        null, // ccList - default is empty
        selectedPillars // Pass the identified pillars
      );
    } else {
      Logger.log(`Unrecognized behavior type: "${behaviorType}"`);
    }
    
    // Log successful processing
    Logger.log(`Successfully processed form submission for ${studentFirst} ${studentLast}`);
    
  } catch (error) {
    // Log any errors
    Logger.log(`Error processing form submission: ${error.toString()}`);
    Logger.log(`Error stack: ${error.stack}`);
    MailApp.sendEmail(
      Session.getEffectiveUser().getEmail(),
      "Error in Behavior Form Email System",
      `There was an error processing a behavior form: ${error.toString()}\n\nStack trace: ${error.stack}`
    );
  }
}

/**
 * Helper function to get teacher name from email
 */
function getTeacherName(email) {
  // Default name if we can't find a better one
  let teacherName = "Your Teacher";
  
  try {
    // Try to extract a name from the email
    const emailName = email.split('@')[0];
    // Convert from format like "john.doe" to "John Doe"
    if (emailName.includes('.')) {
      teacherName = emailName.split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
  } catch (e) {
    Logger.log(`Error getting teacher name: ${e.toString()}`);
  }
  
  return teacherName;
}

/**
 * Sends a Stop and Think email to parents with optional CC to administrators
 * Updated to include parent names, CC list, and selected pillars.
 */
function sendStopAndThinkEmail(studentFirst, studentLast, parent1Email, parent2Email, location, behaviors, comments, teacherEmail, teacherName, parent1First, parent2First, ccList, selectedPillars) {
  loadConstants();
  loadPillarsData();
  const subject = CONFIG.EMAIL_SUBJECT_STOP_THINK;

  // Create the email body - passing pillars and parent names
  let body = createStopThinkEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars);

  // Send email to parents with optional CC to admins
  sendEmailToParents(subject, body, parent1Email, parent2Email, teacherEmail, teacherName, ccList);
}

/**
 * Sends a Good News email to parents with optional CC to administrators
 * Updated to include parent names, CC list, and selected pillars.
 */
function sendGoodNewsEmail(studentFirst, studentLast, parent1Email, parent2Email, location, behaviors, comments, teacherEmail, teacherName, parent1First, parent2First, ccList, selectedPillars) {
  loadConstants();
  loadPillarsData();
  const subject = CONFIG.EMAIL_SUBJECT_GOOD_NEWS;

  // Create the email body - passing pillars and parent names
  let body = createGoodNewsEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars);

  // Send email to parents with optional CC to admins
  sendEmailToParents(subject, body, parent1Email, parent2Email, teacherEmail, teacherName, ccList);
}

/**
 * Creates HTML content safely without syntax errors
 * Add this to your WebAppBehaviorForm.txt file
 */
function buildSafeHTML(parts) {
  // Takes an array of HTML parts and joins them safely
  return parts.join("");
}

function createSimplifiedEmailBody(type, studentFirst, studentLast, parent1First, parent2First,
                                location, behaviors, comments, teacherName, selectedPillars = []) {
  loadConstants();
  loadPillarsData();
  // Sanitize inputs
  const safeStudentFirst = studentFirst ? studentFirst.replace(/[<>]/g, '') : '';
  const safeLocation = location ? location.replace(/[<>]/g, '') : '';
  const safeComments = comments ? comments.replace(/[<>]/g, '') : ''; // Basic sanitize
  const safeTeacherName = teacherName ? teacherName.replace(/[<>]/g, '') : '';
  const safeParent1First = parent1First ? parent1First.replace(/[<>]/g, '') : '';
  const safeParent2First = parent2First ? parent2First.replace(/[<>]/g, '') : '';

  // Format parent greeting
  let parentGreeting = "Dear";
  if (safeParent1First && safeParent1First.trim() !== '') {
    parentGreeting += ` ${safeParent1First}`;
    if (safeParent2First && safeParent2First.trim() !== '') {
      parentGreeting += ` & ${safeParent2First}`;
    }
  } else {
    parentGreeting += " Parent";
  }

  // Location with article
  const locationWithArticle = safeLocation.toLowerCase().startsWith('the ') || safeLocation.toLowerCase().startsWith('a ') || safeLocation.toLowerCase().startsWith('an ') ?
    safeLocation : `the ${safeLocation}`;

  // --- NEW: Pillar Integration ---
  let pillarColor = "#dddddd"; // Default header/border color
  let pillarListHtml = "";
  if (selectedPillars && selectedPillars.length > 0) {
    const firstPillarName = selectedPillars[0];
    const firstPillarData = PILLARS_DATA.find(p => p.name === firstPillarName);
    if (firstPillarData) {
      pillarColor = firstPillarData.color;
    }

    pillarListHtml = `<p style="margin-top: 10px;"><strong>Character Pillar${selectedPillars.length > 1 ? 's' : ''} Involved:</strong> ${selectedPillars.map(pName => {
        const pData = PILLARS_DATA.find(p => p.name === pName);
        // Style the pillar name with its color
        return pData ? `<span style="color:${pData.color}; font-weight:bold;">${pData.name}</span>` : pName;
      }).join(', ')}</p>`;
  }
  // --- END NEW ---


  // Format behaviors (expecting an array now)
  let cleanedBehaviors = "";
  if (Array.isArray(behaviors) && behaviors.length > 0) {
     // Simple list for now
     cleanedBehaviors = "<ul>" + behaviors.map(b => `<li>${b.replace(/[<>]/g, '')}</li>`).join('') + "</ul>";
  } else if (typeof behaviors === 'string' && behaviors) {
     // Fallback for string, basic display
     cleanedBehaviors = `<p>${behaviors.replace(/[<>]/g, '')}</p>`;
  }


  // Build email parts
  const htmlParts = [];

  // Head and style
  htmlParts.push("<!DOCTYPE html><html><head><style>");
  htmlParts.push("body{font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#333;max-width:600px;margin:0 auto;padding:20px;}");
  htmlParts.push(".email-container{border:1px solid #ddd;border-radius:8px;overflow:hidden;}");
  // --- NEW: Use pillar color for header border ---
  htmlParts.push(`.header{padding:15px 20px; border-top: 5px solid ${pillarColor}; border-bottom:1px solid #ddd;}`);
  // --- END NEW ---

  // Header text styling based on type
  if (type === 'goodnews') {
    htmlParts.push(".header h2{margin:0;color:#2e7d32;font-size:20px;}"); // Greenish for good news title
  } else {
    htmlParts.push(".header h2{margin:0;color:#b71c1c;font-size:20px;}"); // Reddish for stop/think title
  }

  htmlParts.push(".date{font-size:14px;margin-top:5px; color: #555;}");
  htmlParts.push(".content{padding:20px;background-color:#fff;}");
  htmlParts.push(".comments-box{background-color:#f5f5f5;padding:15px;margin:15px 0;border-radius:4px;border-left: 4px solid #ccc;}");
  htmlParts.push(".comments-box strong { color: #333; }"); // Style comment header
  htmlParts.push(".footer{background-color:#f9f9f9;padding:12px 20px;font-size:12px;color:#777;border-top:1px solid #ddd;}");
  htmlParts.push("</style></head><body>");

  // Email content
  htmlParts.push("<div class=\"email-container\">");

  // Header
  const headerTitle = type === 'goodnews' ? `Good News about ${safeStudentFirst}!` : `Behavior Update for ${safeStudentFirst}`;
  htmlParts.push(`<div class="header"><h2>${headerTitle}</h2>`);
  htmlParts.push(`<div class="date">Date: ${new Date().toLocaleDateString()}</div></div>`);

  // Content Area
  htmlParts.push("<div class=\"content\">");

  // Greeting
  htmlParts.push(`<p>${parentGreeting},</p>`);

  // Main message
  if (type === 'goodnews') {
    htmlParts.push(`<p>We wanted to share some positive news! Today, ${safeStudentFirst} demonstrated positive character traits in ${locationWithArticle}. Specifically, we observed:</p>`);
  } else {
    htmlParts.push(`<p>${safeStudentFirst} had a "Stop and Think" moment today in ${locationWithArticle}. This involved the following behavior${behaviors.length > 1 ? 's' : ''}:</p>`);
  }

  // Behaviors List
  htmlParts.push(cleanedBehaviors);

  // --- NEW: Insert Pillar List ---
  htmlParts.push(pillarListHtml);
  // --- END NEW ---

  // Add comments if available
  if (safeComments && safeComments.trim() !== "") {
    // Use nl2br for comments to preserve line breaks
    const commentsWithBreaks = safeComments.replace(/\n/g, '<br>');
    htmlParts.push(`<div class="comments-box"><p><strong>Teacher's Comments:</strong><br>${commentsWithBreaks}</p></div>`);
  }

  // Closing message based on type
  if (type === 'goodnews') {
    htmlParts.push(`<p>We recognized ${safeStudentFirst} for these positive actions contributing to our school community. Please join us in celebrating this achievement!</p>`);
  } else {
    htmlParts.push(`<p>These moments provide opportunities for growth and learning about making positive choices. We encourage you to discuss this with ${safeStudentFirst} at home to reinforce expectations for behavior at school.</p>`);
    htmlParts.push(`<p>If you have any questions, please don't hesitate to reach out.</p>`);
  }

  // Signature
  htmlParts.push(`<p>Sincerely,</p><p>${safeTeacherName}</p>`);

  // Footer
  htmlParts.push("</div>"); // End of content div
  htmlParts.push(`<div class="footer"><p>This message was sent from the ${CONFIG.SCHOOL_NAME} Behavior System.</p></div>`);
  htmlParts.push("</div></body></html>");

  // Join parts safely
  return buildSafeHTML(htmlParts); // Assumes buildSafeHTML exists and simply joins the array
}

/**
 * Creates the email body for Good News behaviors
 * Passes parent names and pillars to the simplified body creator.
 */
function createGoodNewsEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars) {
  // Use the simplified body function, passing all necessary arguments including pillars
  return createSimplifiedEmailBody(
    'goodnews',
    studentFirst, studentLast,
    parent1First, parent2First,
    location, behaviors, comments, teacherName,
    selectedPillars // Pass pillars
  );
}

/**
 * Creates the email body for Stop and Think behaviors
 * Passes parent names and pillars to the simplified body creator.
 */
function createStopThinkEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars) {
  // Use the simplified body function, passing all necessary arguments including pillars
  return createSimplifiedEmailBody(
    'stopthink',
    studentFirst, studentLast,
    parent1First, parent2First,
    location, behaviors, comments, teacherName,
    selectedPillars // Pass pillars
  );
}

/**
 * Sends an email to parents, handling multiple recipients and CC list.
 *
 * @param {string} subject The email subject.
 * @param {string} body The HTML email body.
 * @param {string} parent1Email First parent's email address.
 * @param {string} parent2Email Second parent's email address.
 * @param {string} teacherEmail Teacher's email address (for 'from' and 'replyTo').
 * @param {string} teacherName Teacher's name (for display).
 * @param {string[]} [ccList=[]] An array of email addresses to CC.
 */
function sendEmailToParents(subject, body, parent1Email, parent2Email, teacherEmail, teacherName, ccList = []) {
  loadConstants();
  const recipients = [];
  if (parent1Email && parent1Email.trim() !== "" && parent1Email.includes('@')) {
    recipients.push(parent1Email.trim());
  }
  if (parent2Email && parent2Email.trim() !== "" && parent2Email.includes('@') && !recipients.includes(parent2Email.trim())) {
    // Avoid adding duplicate email if parents share one
    recipients.push(parent2Email.trim());
  }

  // Filter and join valid CC emails
  const validCcList = ccList.filter(email => email && email.trim() !== "" && email.includes('@'));
  const ccEmails = validCcList.join(',');

  if (recipients.length > 0) {
    const emailTo = recipients.join(',');
    const mailOptions = {
      htmlBody: body,
      name: teacherName, // Display name for the sender
      replyTo: teacherEmail,
      cc: ccEmails // Add CC recipients if any
    };

    if (CONFIG.SEND_EMAILS) {
      try {
         // Prefer GmailApp to send "from" the teacher if permissions allow
        mailOptions.from = teacherEmail; // Set the "from" address for GmailApp
        GmailApp.sendEmail(emailTo, subject, "", mailOptions); // Plain text body is ignored when htmlBody is present
        Logger.log(`Email sent via GmailApp from ${teacherEmail} to: ${emailTo}${ccEmails ? ', CC: ' + ccEmails : ''}`);
      } catch (e) {
         // Fallback to MailApp if GmailApp fails (permissions, etc.)
        Logger.log(`GmailApp failed (likely permissions): ${e.toString()}. Falling back to MailApp.`);
        // Remove 'from' if using MailApp, as it sends from the script owner or a generic address
        delete mailOptions.from;
        mailOptions.name = `${teacherName} (via ${CONFIG.SCHOOL_NAME} System)`; // Modify sender name for MailApp
        mailOptions.to = emailTo;
        mailOptions.subject = subject;
        MailApp.sendEmail(mailOptions);
        Logger.log(`Email sent via MailApp (system sender) to: ${emailTo}${ccEmails ? ', CC: ' + ccEmails : ''}`);
      }
    } else {
      Logger.log(`--- TEST MODE ---`);
      Logger.log(`Would send email from: ${teacherEmail}`);
      Logger.log(`To: ${emailTo}`);
      if (ccEmails) Logger.log(`CC: ${ccEmails}`);
      Logger.log(`Subject: ${subject}`);
      Logger.log(`HTML Body Length: ${body.length}`);
      // Logger.log(`Body: ${body}`); // Optional: log full body, can be long
    }
  } else {
    Logger.log("No valid parent email addresses found. Email not sent.");
  }
}

/**
 * Creates a menu item in the Google Sheet to run functions manually
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Behavior System')
    .addItem('🎯 NEW SCHOOL SETUP WIZARD', 'runNewSchoolSetupWizard')
    .addSeparator()
    .addItem('📖 Complete Deployment Guide (Beginners)', 'showBeginnerDeploymentGuide')
    .addItem('🚀 Quick Deployment Steps (Advanced)', 'showQuickDeploymentInstructions')
    .addItem('🔍 Verify System Setup', 'verifySystemSetup')
    .addItem('🔧 Deployment Troubleshooting', 'showDeploymentTroubleshooting')
    .addSeparator()
    .addItem('Create Edit Trigger (Student Auto-Lookup)', 'createOnEditTrigger')
    .addSeparator()
    .addItem('Test Good News Email', 'testGoodNewsEmail')
    .addItem('Test Stop and Think Email', 'testStopThinkEmail')
    .addSeparator()
    .addItem('Process All Form Responses', 'processAllFormResponses')
    .addItem('Log Form Field Names', 'logFormFieldNames')
    .addSeparator()
    .addItem('Parse Execution Logs from Column A', 'parseAllLogsInColumnA')
    .addSeparator()
    .addSubMenu(ui.createMenu('Admin')
      .addItem('Setup Constants Sheet', 'setupConstantsSheet')
      .addItem('Setup Pillars Sheets', 'setupPillarsSheets')
      .addItem('Setup Daily Summary Trigger (3PM)', 'checkAndCreateDailySummaryTrigger')
      .addItem('Remove Daily Summary Trigger', 'removeDailySummaryTrigger')
      .addSeparator()
      .addItem('Create Edit Trigger (Student Auto-Lookup)', 'createOnEditTrigger')
      .addItem('Remove Edit Trigger', 'removeOnEditTrigger')
      .addItem('Send Test Summary Email Now', 'sendTestDailySummaryEmail')
    )
    .addToUi();
}

/**
 * Useful function to debug form field names
 */
function logFormFieldNames() {
  loadConstants();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
  
  // Get header row
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Log all column headers
  Logger.log("Form field names:");
  headerRow.forEach((header, index) => {
    Logger.log(`Column ${index + 1}: "${header}"`);
  });
  
  // Show a notification
  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Column headers logged. Check View > Logs to see field names.",
    "Field Names Logged"
  );
}

/**
 * Test Functions
 */
function testGoodNewsEmail() {
  loadConstants();
  loadPillarsData();
  sendGoodNewsEmail(
    "Sarah", 
    "Johnson", 
    "parent1@example.com", 
    "parent2@example.com", 
    "Classroom", 
    "helping others, showing kindness", 
    "Sarah helped a classmate who was struggling with their work.",
    Session.getEffectiveUser().getEmail(),
    "Test Teacher"
  );
}

function testStopThinkEmail() {
  loadConstants();
  loadPillarsData();
  sendStopAndThinkEmail(
    "John", 
    "Smith", 
    "parent1@example.com", 
    "parent2@example.com", 
    "Classroom", 
    "calling out, needing frequent reminders", 
    "John had difficulty focusing during math today.",
    Session.getEffectiveUser().getEmail(),
    "Test Teacher"
  );
}

/**
 * Processes all form responses and sends emails for each
 * Use this to catch up if the trigger wasn't working
 */
function processAllFormResponses() {
  loadConstants();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
  
  // Get all data
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Create a map of column indices to field names
  const fieldMap = {};
  headers.forEach((header, index) => {
    fieldMap[header] = index;
  });
  
  // Log the field map for debugging
  Logger.log("Field map:");
  Logger.log(JSON.stringify(fieldMap));
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Build namedValues object dynamically based on headers
    const namedValues = {};
    headers.forEach((header, index) => {
      namedValues[header] = [row[index]];
    });
    
    // Process this response
    const formResponse = { namedValues: namedValues };
    
    try {
      onFormSubmit(formResponse);
      
      // Add a small delay to avoid hitting quotas
      Utilities.sleep(1000);
    } catch (error) {
      Logger.log(`Error processing row ${i+1}: ${error.toString()}`);
    }
  }
  
  // Show a notification that processing is complete
  SpreadsheetApp.getActiveSpreadsheet().toast("All form responses have been processed!", "Process Complete");
}