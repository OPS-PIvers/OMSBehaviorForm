/**
 * ================================================================================
 * EMAIL SYSTEM AND STUDENT LOOKUP
 * ================================================================================
 * Core email functionality and student directory management
 */

/**
 * Look up student information from directory
 */
function lookupStudent(firstName, lastName) {
  try {
    const config = generateWorkingConfig();
    if (!config) {
      return { success: false, message: 'System not configured.' };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const directorySheet = ss.getSheetByName(config.SHEET_NAMES.DIRECTORY);

    if (!directorySheet) {
      return { success: false, message: 'Directory sheet not found.' };
    }

    const data = directorySheet.getDataRange().getValues();
    const searchName = (firstName + ' ' + lastName).toLowerCase();

    // Try exact match first
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const studentFirstName = row[0] ? String(row[0]).trim() : '';
      const studentLastName = row[1] ? String(row[1]).trim() : '';

      if (studentFirstName.toLowerCase() === firstName.toLowerCase() &&
          studentLastName.toLowerCase() === lastName.toLowerCase()) {
        return {
          success: true,
          studentFirst: studentFirstName,
          studentLast: studentLastName,
          studentEmail: row[3] || '',
          parent1First: row[4] || '',
          parent1Last: row[5] || '',
          parent1Email: row[6] || '',
          parent2First: row[7] || '',
          parent2Last: row[8] || '',
          parent2Email: row[9] || ''
        };
      }
    }

    // If no exact match, look for suggestions
    const suggestions = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const studentFirstName = row[0] ? String(row[0]).trim() : '';
      const studentLastName = row[1] ? String(row[1]).trim() : '';

      if (studentFirstName && studentLastName) {
        const fullName = (studentFirstName + ' ' + studentLastName).toLowerCase();
        const distance = calculateLevenshteinDistance(searchName, fullName);

        if (distance <= config.SIMILARITY_THRESHOLD) {
          suggestions.push({
            firstName: studentFirstName,
            lastName: studentLastName,
            distance: distance
          });
        }
      }
    }

    if (suggestions.length > 0) {
      suggestions.sort((a, b) => a.distance - b.distance);
      return {
        success: false,
        suggestions: suggestions.slice(0, config.MAX_SUGGESTIONS)
      };
    }

    return { success: false, message: 'Student not found in directory.' };

  } catch (error) {
    Logger.log('Error in lookupStudent: ' + error.toString());
    return { success: false, message: 'Error during lookup: ' + error.message };
  }
}

/**
 * ================================================================================
 * WEB APP FORM PROCESSING - PHASE 3 ENHANCEMENT
 * ================================================================================
 */

/**
 * Enhanced form processing with advanced email system
 */
function processWebAppFormSubmission(formData) {
  try {
    Logger.log('Processing web app form submission with advanced email system');

    // Validate form data
    const validationErrors = validateWebAppFormData(formData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: 'Validation errors: ' + validationErrors.join(', ')
      };
    }

    // Save form data to spreadsheet
    saveFormDataToSpreadsheet(formData);

    // Process advanced email with CC and tracking
    const emailResult = processAdvancedEmailSubmission(formData);

    // Log successful submission
    const studentName = `${formData.studentFirst} ${formData.studentLast}`;
    Logger.log(`Form submitted successfully for ${studentName}`);

    let message = `Form submitted successfully for ${studentName}.`;
    if (emailResult.success) {
      message += ` Email sent to ${emailResult.recipients.length} parent(s)`;
      if (emailResult.ccRecipients && emailResult.ccRecipients.length > 0) {
        message += ` with CC to ${emailResult.ccRecipients.length} administrator(s)`;
      }
      message += '.';
    } else {
      message += ' However, email sending failed: ' + emailResult.message;
    }

    return {
      success: true,
      message: message,
      emailResult: emailResult
    };

  } catch (error) {
    Logger.log('Error processing web app form: ' + error.toString());
    return {
      success: false,
      message: 'Error processing form: ' + error.message
    };
  }
}

/**
 * Validate web app form data
 */
function validateWebAppFormData(formData) {
  const errors = [];

  if (!formData.studentFirst || !formData.studentFirst.trim()) {
    errors.push('Student first name is required');
  }

  if (!formData.studentLast || !formData.studentLast.trim()) {
    errors.push('Student last name is required');
  }

  if (!formData.teacherName || !formData.teacherName.trim()) {
    errors.push('Teacher name is required');
  }

  if (!formData.parent1Email && !formData.parent2Email) {
    errors.push('At least one parent email is required');
  }

  if (formData.parent1Email && !isValidEmail(formData.parent1Email)) {
    errors.push('Parent 1 email format is invalid');
  }

  if (formData.parent2Email && !isValidEmail(formData.parent2Email)) {
    errors.push('Parent 2 email format is invalid');
  }

  if (!formData.selectedPillars || formData.selectedPillars.length === 0) {
    errors.push('At least one character pillar must be selected');
  }

  if (!formData.selectedBehaviors || formData.selectedBehaviors.length === 0) {
    errors.push('At least one behavior must be selected');
  }

  if (!formData.location || !formData.location.trim()) {
    errors.push('Location is required');
  }

  if (!['goodnews', 'stopthink'].includes(formData.behaviorType)) {
    errors.push('Invalid behavior type');
  }

  return errors;
}

/**
 * Check if email format is valid
 */
function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Save form data to spreadsheet
 */
function saveFormDataToSpreadsheet(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const config = generateWorkingConfig();
    const behaviorSheet = ss.getSheetByName(config.SHEET_NAMES.BEHAVIOR_FORM);

    if (!behaviorSheet) {
      throw new Error('Behavior form sheet not found');
    }

    // Prepare row data
    const rowData = [
      new Date(), // Timestamp
      Session.getActiveUser().getEmail(), // Teacher Email
      formData.studentFirst,
      formData.studentLast,
      formData.behaviorType === 'goodnews' ? 'Good News' : 'Stop & Think',
      formData.location,
      formData.selectedPillars.join(', '),
      formData.selectedBehaviors.join(', '),
      formData.comments || '',
      '', // Reserved1
      '', // Reserved2
      formData.studentEmail || '',
      formData.parent1First || '',
      formData.parent1Last || '',
      formData.parent1Email || '',
      formData.parent2First || '',
      formData.parent2Last || '',
      formData.parent2Email || '',
      '', // Admin CC Info - will be added in email phase
      '' // Reserved3
    ];

    // Append the row
    behaviorSheet.appendRow(rowData);

    Logger.log('Form data saved to spreadsheet successfully');

  } catch (error) {
    Logger.log('Error saving form data to spreadsheet: ' + error.toString());
    throw error;
  }
}

/**
 * Send behavior email notification (enhanced version)
 */
function sendBehaviorEmailNotification(formData, config) {
  try {
    // Build email data
    const emailData = {
      type: formData.behaviorType,
      studentFirst: formData.studentFirst,
      studentLast: formData.studentLast,
      teacherName: formData.teacherName,
      teacherEmail: Session.getActiveUser().getEmail(),
      parent1Email: formData.parent1Email,
      parent2Email: formData.parent2Email,
      parent1First: formData.parent1First,
      parent2First: formData.parent2First,
      location: formData.location,
      behaviors: formData.selectedBehaviors.join(', '),
      comments: formData.comments,
      pillars: formData.selectedPillars
    };

    // Create email body
    const emailBody = createEnhancedEmailBody(emailData, config);

    // Determine subject
    const subject = formData.behaviorType === 'goodnews' ?
      config.EMAIL_SUBJECT_GOOD_NEWS :
      config.EMAIL_SUBJECT_STOP_THINK;

    // Collect recipients
    const recipients = [];
    if (formData.parent1Email && isValidEmail(formData.parent1Email)) {
      recipients.push(formData.parent1Email);
    }
    if (formData.parent2Email && isValidEmail(formData.parent2Email) && !recipients.includes(formData.parent2Email)) {
      recipients.push(formData.parent2Email);
    }

    if (recipients.length === 0) {
      return { success: false, message: 'No valid parent email addresses found' };
    }

    // Send email
    if (config.SEND_EMAILS) {
      MailApp.sendEmail({
        to: recipients.join(','),
        subject: subject,
        htmlBody: emailBody,
        replyTo: emailData.teacherEmail,
        name: emailData.teacherName
      });

      Logger.log(`Email sent to: ${recipients.join(', ')}`);
      return { success: true, message: 'Email sent successfully' };
    } else {
      Logger.log('TEST MODE - Email would be sent to: ' + recipients.join(', '));
      return { success: true, message: 'Test mode - email not actually sent' };
    }

  } catch (error) {
    Logger.log('Error sending behavior email: ' + error.toString());
    return { success: false, message: 'Failed to send email: ' + error.message };
  }
}

/**
 * Create enhanced email body with better formatting
 */
function createEnhancedEmailBody(emailData, config) {
  const isGoodNews = emailData.type === 'goodnews';

  // Format parent greeting
  let parentGreeting = "Dear";
  if (emailData.parent1First) {
    parentGreeting += ` ${emailData.parent1First}`;
    if (emailData.parent2First) {
      parentGreeting += ` & ${emailData.parent2First}`;
    }
  } else {
    parentGreeting += " Parent";
  }

  // Create pillar information
  let pillarInfo = '';
  if (emailData.pillars && emailData.pillars.length > 0) {
    const pillars = getSystemPillars();
    const pillarDetails = emailData.pillars.map(pillarName => {
      const pillar = pillars.find(p => p.name === pillarName);
      return pillar ? `<span style="color: ${pillar.color}; font-weight: bold;">${pillar.name}</span>` : pillarName;
    }).join(', ');

    pillarInfo = `
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0;"><strong>Character Trait${emailData.pillars.length > 1 ? 's' : ''} Demonstrated:</strong> ${pillarDetails}</p>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${isGoodNews ? 'Good News' : 'Behavior Update'}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      background-color: #f8f9fa;
    }
    .email-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      margin: 20px;
    }
    .header {
      background: linear-gradient(135deg, ${config.PRIMARY_COLOR} 0%, color-mix(in srgb, ${config.PRIMARY_COLOR} 80%, black) 100%);
      color: white;
      padding: 30px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 400;
    }
    .header .school-info {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 32px 24px;
    }
    .content p {
      margin-bottom: 16px;
    }
    .behavior-details {
      background: ${isGoodNews ? '#e8f5e8' : '#fff3cd'};
      border-left: 4px solid ${isGoodNews ? '#28a745' : '#ffc107'};
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .behavior-details h3 {
      margin: 0 0 12px 0;
      color: ${isGoodNews ? '#155724' : '#856404'};
    }
    .comments-section {
      background: #f8f9fa;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 24px;
      border-top: 1px solid #e9ecef;
      font-size: 13px;
      color: #6c757d;
    }
    .attribution {
      text-align: center;
      font-size: 11px;
      color: #999;
      border-top: 1px solid #eee;
      padding-top: 12px;
      margin-top: 12px;
    }
    .attribution a {
      color: #666;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>${isGoodNews ? `Good News about ${emailData.studentFirst}!` : `Behavior Update for ${emailData.studentFirst}`}</h1>
      <div class="school-info">
        ${config.SCHOOL_NAME}${config.DISTRICT_NAME ? ' • ' + config.DISTRICT_NAME : ''}
      </div>
    </div>

    <div class="content">
      <p>${parentGreeting},</p>

      <p>${isGoodNews ?
        `We wanted to share some positive news! Today, ${emailData.studentFirst} demonstrated wonderful character traits in ${emailData.location}.` :
        `We wanted to update you about ${emailData.studentFirst}'s behavior today in ${emailData.location}. This provides an opportunity for growth and learning.`
      }</p>

      ${pillarInfo}

      <div class="behavior-details">
        <h3>${isGoodNews ? 'Positive Behaviors Observed:' : 'Behaviors to Address:'}</h3>
        <p style="margin: 0;">${emailData.behaviors}</p>
      </div>

      ${emailData.comments ? `
        <div class="comments-section">
          <h4 style="margin: 0 0 8px 0;">Teacher's Comments:</h4>
          <p style="margin: 0;">${emailData.comments}</p>
        </div>
      ` : ''}

      <p>${isGoodNews ?
        `We recognized ${emailData.studentFirst} for these positive actions that contribute to our school community. Please join us in celebrating this achievement!` :
        `These moments provide valuable opportunities for growth. We encourage you to discuss this with ${emailData.studentFirst} at home to reinforce our shared expectations for positive behavior.`
      }</p>

      ${!isGoodNews ? '<p>If you have any questions or would like to discuss this further, please don\'t hesitate to reach out.</p>' : ''}

      <p>Thank you for your partnership in ${emailData.studentFirst}'s education.</p>

      <p>Sincerely,<br><strong>${emailData.teacherName}</strong></p>
    </div>

    <div class="footer">
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Location:</strong> ${emailData.location}</p>
      <p>This message was sent from the ${config.SCHOOL_NAME} Behavior Management System.</p>

      <div class="attribution">
        Powered by Student Behavior Management System |
        Created by <a href="${ATTRIBUTION.WEBSITE}">${ATTRIBUTION.CREATED_BY}</a> |
        Support: <a href="mailto:${ATTRIBUTION.CONTACT_EMAIL}">${ATTRIBUTION.CONTACT_EMAIL}</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function calculateLevenshteinDistance(str1, str2) {
  const matrix = [];

  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Get user's full name for teacher field
 */
function getUserFullName() {
  try {
    const email = Session.getActiveUser().getEmail();
    if (email) {
      const namePart = email.split('@')[0];
      if (namePart.includes('.')) {
        return namePart.split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return '';
  } catch (error) {
    Logger.log('Error getting user name: ' + error.toString());
    return '';
  }
}

/**
 * Basic email sending function (to be enhanced in later phases)
 */
function sendBehaviorEmail(emailData) {
  try {
    const config = generateWorkingConfig();
    if (!config) {
      return { success: false, message: 'System not configured.' };
    }

    // Basic email construction
    const subject = emailData.type === 'goodnews' ?
      config.EMAIL_SUBJECT_GOOD_NEWS :
      config.EMAIL_SUBJECT_STOP_THINK;

    const body = createBasicEmailBody(emailData, config);

    // Send email
    if (config.SEND_EMAILS) {
      const recipients = [];
      if (emailData.parent1Email) recipients.push(emailData.parent1Email);
      if (emailData.parent2Email) recipients.push(emailData.parent2Email);

      if (recipients.length > 0) {
        MailApp.sendEmail({
          to: recipients.join(','),
          subject: subject,
          htmlBody: body,
          replyTo: emailData.teacherEmail,
          name: emailData.teacherName
        });

        Logger.log(`Email sent to: ${recipients.join(', ')}`);
      }
    } else {
      Logger.log('TEST MODE - Email would be sent');
    }

    return { success: true, message: 'Email sent successfully' };

  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
    return { success: false, message: 'Error sending email: ' + error.message };
  }
}

/**
 * Create basic email body (to be enhanced in later phases)
 */
function createBasicEmailBody(emailData, config) {
  const isGoodNews = emailData.type === 'goodnews';

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${config.PRIMARY_COLOR}; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background: #f5f5f5; padding: 15px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${config.SCHOOL_NAME}</h1>
    <h2>${isGoodNews ? 'Good News!' : 'Behavior Update'}</h2>
  </div>

  <div class="content">
    <p>Dear Parent,</p>

    <p>${isGoodNews ?
      `We wanted to share some positive news about ${emailData.studentFirst}!` :
      `We wanted to update you about ${emailData.studentFirst}'s behavior today.`
    }</p>

    <p><strong>Location:</strong> ${emailData.location}</p>
    <p><strong>Behaviors:</strong> ${emailData.behaviors}</p>

    ${emailData.comments ? `<p><strong>Comments:</strong> ${emailData.comments}</p>` : ''}

    <p>Sincerely,<br>${emailData.teacherName}</p>
  </div>

  <div class="footer">
    <p>This message was sent from the ${config.SCHOOL_NAME} Behavior System.</p>
    <p>Powered by Student Behavior Management System | Created by ${ATTRIBUTION.CREATED_BY}</p>
  </div>
</body>
</html>
  `;
}
