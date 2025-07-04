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
