/**
 * ================================================================================
 * ADVANCED EMAIL SYSTEM - PHASE 4
 * ================================================================================
 * Professional email templates and advanced parent communication
 */

/**
 * Enhanced email processing with administrator CC and tracking
 */
function processAdvancedEmailSubmission(formData) {
  try {
    Logger.log('Processing advanced email submission');

    const config = generateWorkingConfig();
    const pillars = getSystemPillars();

    if (!config || !pillars) {
      throw new Error('System configuration not available');
    }

    // Build comprehensive email data
    const emailData = buildEmailData(formData, config, pillars);

    // Generate professional email content
    const emailContent = generateProfessionalEmailContent(emailData, config);

    // Send emails with CC functionality
    const emailResult = sendEmailWithAdministratorCC(emailContent, emailData, config);

    // Log email activity
    logEmailActivity(emailData, emailResult);

    return emailResult;

  } catch (error) {
    Logger.log('Advanced email processing error: ' + error.toString());
    throw error;
  }
}

/**
 * Build comprehensive email data structure
 */
function buildEmailData(formData, config, pillars) {
  // Get pillar details for selected pillars
  const selectedPillarData = formData.selectedPillars.map(pillarName => {
    return pillars.find(p => p.name === pillarName);
  }).filter(p => p !== undefined);

  // Generate behavior insights
  const behaviorInsights = generateBehaviorInsights(formData, selectedPillarData);

  // Format parent names
  const parentGreeting = formatParentGreeting(formData.parent1First, formData.parent2First);

  return {
    // Basic information
    behaviorType: formData.behaviorType,
    isGoodNews: formData.behaviorType === 'goodnews',
    timestamp: new Date(),

    // Student information
    student: {
      firstName: formData.studentFirst,
      lastName: formData.studentLast,
      fullName: `${formData.studentFirst} ${formData.studentLast}`,
      email: formData.studentEmail
    },

    // Teacher information
    teacher: {
      name: formData.teacherName,
      email: Session.getActiveUser().getEmail()
    },

    // Parent information
    parents: {
      greeting: parentGreeting,
      parent1: {
        firstName: formData.parent1First,
        lastName: formData.parent1Last,
        email: formData.parent1Email
      },
      parent2: {
        firstName: formData.parent2First,
        lastName: formData.parent2Last,
        email: formData.parent2Email
      }
    },

    // Behavior details
    behavior: {
      location: formData.location,
      selectedBehaviors: formData.selectedBehaviors,
      comments: formData.comments,
      pillars: selectedPillarData,
      insights: behaviorInsights
    },

    // System information
    system: {
      schoolName: config.SCHOOL_NAME,
      districtName: config.DISTRICT_NAME,
      primaryColor: config.PRIMARY_COLOR,
      logoUrl: config.LOGO_URL
    }
  };
}

/**
 * Generate behavior insights based on selected pillars and behaviors
 */
function generateBehaviorInsights(formData, pillarData) {
  const insights = {
    pillarCount: pillarData.length,
    behaviorCount: formData.selectedBehaviors.length,
    primaryPillar: pillarData[0],
    pillarSummary: pillarData.map(p => p.name).join(', '),
    recommendedActions: []
  };

  // Generate recommended actions based on behavior type
  if (formData.behaviorType === 'goodnews') {
    insights.recommendedActions = [
      `Celebrate ${formData.studentFirst}'s positive choices`,
      'Encourage continued demonstration of these character traits',
      'Share this success with other family members'
    ];
  } else {
    insights.recommendedActions = [
      `Discuss expectations for behavior at school with ${formData.studentFirst}`,
      'Review the importance of making positive choices',
      'Work together on strategies for improvement'
    ];
  }

  return insights;
}

/**
 * Format parent greeting
 */
function formatParentGreeting(parent1First, parent2First) {
  if (parent1First && parent2First) {
    return `Dear ${parent1First} & ${parent2First}`;
  } else if (parent1First) {
    return `Dear ${parent1First}`;
  } else {
    return 'Dear Parent';
  }
}

/**
 * Generate professional email content
 */
function generateProfessionalEmailContent(emailData, config) {
  const subject = emailData.isGoodNews ?
    config.EMAIL_SUBJECT_GOOD_NEWS :
    config.EMAIL_SUBJECT_STOP_THINK;

  const htmlBody = createProfessionalEmailTemplate(emailData);
  const textBody = createTextEmailTemplate(emailData);

  return {
    subject: subject,
    htmlBody: htmlBody,
    textBody: textBody,
    replyTo: emailData.teacher.email,
    senderName: emailData.teacher.name
  };
}

/**
 * Create professional HTML email template
 */
function createProfessionalEmailTemplate(emailData) {
  const primaryColor = emailData.system.primaryColor;
  const isGoodNews = emailData.isGoodNews;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isGoodNews ? 'Good News' : 'Behavior Update'}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Email-safe CSS */
    * { box-sizing: border-box; }
    body, table, td, p { margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f8f9fa;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, color-mix(in srgb, ${primaryColor} 80%, black) 100%);
      color: #ffffff;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 400;
    }
    .header .subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }
    .logo {
      max-width: 120px;
      max-height: 60px;
      margin-bottom: 16px;
      border-radius: 8px;
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 24px;
      color: #1a1a1a;
    }
    .main-message {
      font-size: 16px;
      margin-bottom: 24px;
      line-height: 1.7;
    }
    .pillar-section {
      background: linear-gradient(90deg, color-mix(in srgb, ${primaryColor} 8%, white) 0%, white 100%);
      border-left: 4px solid ${primaryColor};
      padding: 20px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .pillar-title {
      font-size: 16px;
      font-weight: 600;
      color: ${primaryColor};
      margin-bottom: 12px;
    }
    .pillar-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }
    .pillar-badge {
      background: ${primaryColor};
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }
    .behavior-section {
      background: ${isGoodNews ? '#e8f5e8' : '#fff3cd'};
      border: 1px solid ${isGoodNews ? '#c3e6cb' : '#ffeaa7'};
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .behavior-title {
      font-size: 16px;
      font-weight: 600;
      color: ${isGoodNews ? '#155724' : '#856404'};
      margin-bottom: 12px;
    }
    .behavior-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .behavior-item {
      padding: 8px 0;
      border-bottom: 1px solid ${isGoodNews ? '#d4edda' : '#fff3cd'};
      font-size: 15px;
    }
    .behavior-item:last-child {
      border-bottom: none;
    }
    .behavior-item::before {
      content: "${isGoodNews ? '✅' : '⚠️'}";
      margin-right: 8px;
    }
    .comments-section {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .comments-title {
      font-size: 16px;
      font-weight: 600;
      color: #495057;
      margin-bottom: 12px;
    }
    .comments-text {
      font-style: italic;
      line-height: 1.6;
      color: #495057;
    }
    .action-section {
      background: color-mix(in srgb, ${primaryColor} 5%, white);
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .action-title {
      font-size: 16px;
      font-weight: 600;
      color: ${primaryColor};
      margin-bottom: 12px;
    }
    .action-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .action-item {
      padding: 6px 0;
      font-size: 15px;
    }
    .action-item::before {
      content: "💡";
      margin-right: 8px;
    }
    .signature-section {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }
    .teacher-signature {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .teacher-name {
      font-weight: 600;
      color: ${primaryColor};
    }
    .footer {
      background: #f8f9fa;
      padding: 24px;
      border-top: 1px solid #e9ecef;
    }
    .footer-info {
      font-size: 13px;
      color: #6c757d;
      margin-bottom: 8px;
    }
    .attribution {
      font-size: 11px;
      color: #999999;
      text-align: center;
      border-top: 1px solid #e9ecef;
      padding-top: 12px;
      margin-top: 12px;
    }
    .attribution a {
      color: #666666;
      text-decoration: none;
    }

    /* Mobile responsiveness */
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 10px;
        border-radius: 8px;
      }
      .header {
        padding: 24px 16px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 24px 16px;
      }
      .pillar-list {
        flex-direction: column;
      }
      .pillar-badge {
        display: inline-block;
        margin-bottom: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      ${emailData.system.logoUrl ? `<img src="${emailData.system.logoUrl}" alt="School Logo" class="logo">` : ''}
      <h1>${isGoodNews ? `🌟 Good News about ${emailData.student.firstName}!` : `📋 Behavior Update for ${emailData.student.firstName}`}</h1>
      <p class="subtitle">
        ${emailData.system.schoolName}${emailData.system.districtName ? ' • ' + emailData.system.districtName : ''}
      </p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <!-- Greeting -->
      <div class="greeting">
        ${emailData.parents.greeting},
      </div>

      <!-- Main Message -->
      <div class="main-message">
        ${isGoodNews ?
          `We're excited to share some wonderful news! Today, ${emailData.student.firstName} demonstrated exceptional character traits in <strong>${emailData.behavior.location}</strong>. We believe it's important to recognize and celebrate these positive moments that contribute to our school community.` :
          `We wanted to update you about ${emailData.student.firstName}'s behavior today in <strong>${emailData.behavior.location}</strong>. This presents a valuable opportunity for growth and learning as we work together to support ${emailData.student.firstName}'s character development.`
        }
      </div>

      <!-- Character Pillars -->
      ${emailData.behavior.pillars.length > 0 ? `
      <div class="pillar-section">
        <div class="pillar-title">
          Character Trait${emailData.behavior.pillars.length > 1 ? 's' : ''} ${isGoodNews ? 'Demonstrated' : 'to Focus On'}:
        </div>
        <div class="pillar-list">
          ${emailData.behavior.pillars.map(pillar => `
            <span class="pillar-badge" style="background: ${pillar.color};">
              ${pillar.iconSymbol} ${pillar.name}
            </span>
          `).join('')}
        </div>
        <p style="margin: 0; font-size: 14px; color: #666;">
          ${emailData.behavior.pillars.map(pillar => pillar.description).join(' • ')}
        </p>
      </div>
      ` : ''}

      <!-- Specific Behaviors -->
      <div class="behavior-section">
        <div class="behavior-title">
          ${isGoodNews ? 'Positive Behaviors Observed:' : 'Behaviors to Address:'}
        </div>
        <ul class="behavior-list">
          ${emailData.behavior.selectedBehaviors.map(behavior => `
            <li class="behavior-item">${behavior}</li>
          `).join('')}
        </ul>
      </div>

      <!-- Teacher Comments -->
      ${emailData.behavior.comments ? `
      <div class="comments-section">
        <div class="comments-title">Teacher's Observations:</div>
        <div class="comments-text">"${emailData.behavior.comments}"</div>
      </div>
      ` : ''}

      <!-- Recommended Actions -->
      <div class="action-section">
        <div class="action-title">
          ${isGoodNews ? 'Ways to Celebrate at Home:' : 'Ways to Support at Home:'}
        </div>
        <ul class="action-list">
          ${emailData.behavior.insights.recommendedActions.map(action => `
            <li class="action-item">${action}</li>
          `).join('')}
        </ul>
      </div>

      <!-- Closing Message -->
      <div class="main-message">
        ${isGoodNews ?
          `We're proud to have ${emailData.student.firstName} as part of our school community and wanted to share this positive moment with you. Thank you for your partnership in supporting ${emailData.student.firstName}'s character development.` :
          `These moments provide valuable learning opportunities. We appreciate your partnership in helping ${emailData.student.firstName} develop positive character traits and make good choices. Please feel free to reach out if you have any questions or would like to discuss strategies for supporting ${emailData.student.firstName} at home.`
        }
      </div>

      <!-- Signature -->
      <div class="signature-section">
        <div class="teacher-signature">
          Warm regards,<br>
          <span class="teacher-name">${emailData.teacher.name}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-info">
        <strong>Date:</strong> ${emailData.timestamp.toLocaleDateString()}<br>
        <strong>Time:</strong> ${emailData.timestamp.toLocaleTimeString()}<br>
        <strong>Location:</strong> ${emailData.behavior.location}
      </div>

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
 * Create text-only email template (fallback)
 */
function createTextEmailTemplate(emailData) {
  const isGoodNews = emailData.isGoodNews;

  return `
${emailData.system.schoolName}${emailData.system.districtName ? ' - ' + emailData.system.districtName : ''}
${isGoodNews ? 'GOOD NEWS' : 'BEHAVIOR UPDATE'} - ${emailData.student.firstName} ${emailData.student.lastName}

${emailData.parents.greeting},

${isGoodNews ?
  `We're excited to share some wonderful news! Today, ${emailData.student.firstName} demonstrated exceptional character traits in ${emailData.behavior.location}.` :
  `We wanted to update you about ${emailData.student.firstName}'s behavior today in ${emailData.behavior.location}. This presents a valuable opportunity for growth and learning.`
}

CHARACTER TRAITS ${isGoodNews ? 'DEMONSTRATED' : 'TO FOCUS ON'}:
${emailData.behavior.pillars.map(pillar => `• ${pillar.name}: ${pillar.description}`).join('\n')}

${isGoodNews ? 'POSITIVE BEHAVIORS OBSERVED' : 'BEHAVIORS TO ADDRESS'}:
${emailData.behavior.selectedBehaviors.map(behavior => `• ${behavior}`).join('\n')}

${emailData.behavior.comments ? `TEACHER'S OBSERVATIONS:\n"${emailData.behavior.comments}"\n` : ''}

${isGoodNews ? 'WAYS TO CELEBRATE AT HOME' : 'WAYS TO SUPPORT AT HOME'}:
${emailData.behavior.insights.recommendedActions.map(action => `• ${action}`).join('\n')}

${isGoodNews ?
  `We're proud to have ${emailData.student.firstName} as part of our school community and wanted to share this positive moment with you.` :
  `These moments provide valuable learning opportunities. Please feel free to reach out if you have any questions.`
}

Warm regards,
${emailData.teacher.name}

---
Date: ${emailData.timestamp.toLocaleDateString()}
Time: ${emailData.timestamp.toLocaleTimeString()}
Location: ${emailData.behavior.location}

Powered by Student Behavior Management System
Created by ${ATTRIBUTION.CREATED_BY} | Support: ${ATTRIBUTION.CONTACT_EMAIL}
  `;
}

/**
 * Send email with administrator CC functionality
 */
function sendEmailWithAdministratorCC(emailContent, emailData, config) {
  try {
    // Collect parent recipients
    const parentRecipients = [];
    if (emailData.parents.parent1.email && isValidEmail(emailData.parents.parent1.email)) {
      parentRecipients.push(emailData.parents.parent1.email);
    }
    if (emailData.parents.parent2.email && isValidEmail(emailData.parents.parent2.email) &&
        !parentRecipients.includes(emailData.parents.parent2.email)) {
      parentRecipients.push(emailData.parents.parent2.email);
    }

    if (parentRecipients.length === 0) {
      return { success: false, message: 'No valid parent email addresses found' };
    }

    // Get administrator CC list
    const adminCCList = getAdministratorCCList(config);

    // Prepare email options
    const mailOptions = {
      to: parentRecipients.join(','),
      subject: emailContent.subject,
      htmlBody: emailContent.htmlBody,
      replyTo: emailData.teacher.email,
      name: emailContent.senderName
    };

    // Add CC if administrators are configured
    if (adminCCList.length > 0) {
      mailOptions.cc = adminCCList.join(',');
    }

    // Send email if enabled
    if (config.SEND_EMAILS) {
      MailApp.sendEmail(mailOptions);

      Logger.log(`Email sent successfully to: ${parentRecipients.join(', ')}`);
      if (adminCCList.length > 0) {
        Logger.log(`CC sent to administrators: ${adminCCList.join(', ')}`);
      }

      return {
        success: true,
        message: 'Email sent successfully',
        recipients: parentRecipients,
        ccRecipients: adminCCList,
        sentAt: new Date()
      };
    } else {
      Logger.log('TEST MODE - Email would be sent to: ' + parentRecipients.join(', '));
      if (adminCCList.length > 0) {
        Logger.log('TEST MODE - CC would be sent to: ' + adminCCList.join(', '));
      }

      return {
        success: true,
        message: 'Test mode - email not actually sent',
        recipients: parentRecipients,
        ccRecipients: adminCCList,
        sentAt: new Date()
      };
    }

  } catch (error) {
    Logger.log('Error sending email with administrator CC: ' + error.toString());
    return {
      success: false,
      message: 'Failed to send email: ' + error.message,
      error: error.toString()
    };
  }
}

/**
 * Get administrator CC list from configuration
 */
function getAdministratorCCList(config) {
  const adminEmails = [];

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const adminSheet = ss.getSheetByName(config.SHEET_NAMES.ADMIN_CONTACTS);

    if (adminSheet) {
      const adminData = adminSheet.getDataRange().getValues();

      // Skip header row and collect active administrators
      for (let i = 1; i < adminData.length; i++) {
        const [title, email, includeCC] = adminData[i];

        if (email && isValidEmail(email) && includeCC === 'Yes') {
          adminEmails.push(email);
        }
      }
    }

    // Fallback to config admin emails if sheet is empty
    if (adminEmails.length === 0 && config.ADMIN_EMAILS) {
      Object.values(config.ADMIN_EMAILS).forEach(email => {
        if (email && isValidEmail(email)) {
          adminEmails.push(email);
        }
      });
    }

  } catch (error) {
    Logger.log('Error getting administrator CC list: ' + error.toString());
  }

  return adminEmails;
}

/**
 * Log email activity for tracking
 */
function logEmailActivity(emailData, emailResult) {
  try {
    const logEntry = {
      timestamp: new Date(),
      studentName: emailData.student.fullName,
      teacherName: emailData.teacher.name,
      behaviorType: emailData.behaviorType,
      location: emailData.behavior.location,
      pillars: emailData.behavior.pillars.map(p => p.name).join(', '),
      behaviors: emailData.behavior.selectedBehaviors.join('; '),
      parentRecipients: emailResult.recipients ? emailResult.recipients.join(', ') : '',
      adminCCRecipients: emailResult.ccRecipients ? emailResult.ccRecipients.join(', ') : '',
      success: emailResult.success,
      errorMessage: emailResult.message || ''
    };

    // Log to Apps Script logs
    Logger.log('Email activity: ' + JSON.stringify(logEntry));

    // Store in Properties Service for retrieval
    const existingLogs = PropertiesService.getScriptProperties().getProperty('EMAIL_ACTIVITY_LOG');
    let logs = existingLogs ? JSON.parse(existingLogs) : [];

    // Keep only last 100 entries to avoid storage limits
    logs.push(logEntry);
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }

    PropertiesService.getScriptProperties().setProperty('EMAIL_ACTIVITY_LOG', JSON.stringify(logs));

  } catch (error) {
    Logger.log('Error logging email activity: ' + error.toString());
  }
}

/**
 * Get email activity log
 */
function getEmailActivityLog() {
  try {
    const logs = PropertiesService.getScriptProperties().getProperty('EMAIL_ACTIVITY_LOG');
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    Logger.log('Error retrieving email activity log: ' + error.toString());
    return [];
  }
}

/**
 * Enhanced email validation
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
}

/**
 * ================================================================================
 * EMAIL CONFIGURATION MANAGEMENT - PHASE 4 ENHANCEMENT
 * ================================================================================
 */

/**
 * Update email configuration settings
 */
function updateEmailConfiguration(newSettings) {
  try {
    const currentConfig = getStoredConfiguration();
    if (!currentConfig) {
      throw new Error('Current configuration not found');
    }

    // Update email configuration
    const updatedEmailConfig = {
      ...currentConfig.emailConfig,
      ...newSettings
    };

    // Save updated configuration
    PropertiesService.getScriptProperties().setProperty(
      'EMAIL_CONFIG',
      JSON.stringify(updatedEmailConfig)
    );

    // Update configuration sheet if it exists
    updateEmailConfigurationSheet(updatedEmailConfig);

    Logger.log('Email configuration updated successfully');
    return { success: true, message: 'Email configuration updated successfully' };

  } catch (error) {
    Logger.log('Error updating email configuration: ' + error.toString());
    return { success: false, message: 'Error updating configuration: ' + error.message };
  }
}

/**
 * Update email configuration sheet
 */
function updateEmailConfigurationSheet(emailConfig) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const configSheet = ss.getSheetByName('System Configuration');

    if (!configSheet) return;

    const data = configSheet.getDataRange().getValues();

    // Update email-related settings
    for (let i = 1; i < data.length; i++) {
      const setting = data[i][0];

      if (setting === 'Good News Subject') {
        configSheet.getRange(i + 1, 2).setValue(emailConfig.goodNewsSubject);
      } else if (setting === 'Stop Think Subject') {
        configSheet.getRange(i + 1, 2).setValue(emailConfig.stopThinkSubject);
      }
    }

  } catch (error) {
    Logger.log('Error updating email configuration sheet: ' + error.toString());
  }
}

/**
 * Test email delivery to specific address
 */
function testEmailDelivery(emailAddress, behaviorType) {
  try {
    if (!isValidEmail(emailAddress)) {
      return { success: false, message: 'Invalid email address format' };
    }

    const testData = createSampleEmailData();
    testData.behaviorType = behaviorType || 'goodnews';
    testData.parent1Email = emailAddress;
    testData.parent2Email = '';
    testData.comments = `This is a test email delivery to ${emailAddress}. If you received this message, the email system is configured correctly.`;

    const result = processAdvancedEmailSubmission(testData);

    return {
      success: result.success,
      message: result.success ?
        `Test email sent successfully to ${emailAddress}` :
        `Failed to send test email: ${result.message}`,
      deliveryResult: result
    };

  } catch (error) {
    Logger.log('Error in test email delivery: ' + error.toString());
    return {
      success: false,
      message: 'Error sending test email: ' + error.message
    };
  }
}

/**
 * Get email system statistics
 */
function getEmailSystemStatistics() {
  try {
    const logs = getEmailActivityLog();
    const config = generateWorkingConfig();

    const stats = {
      totalEmailsSent: logs.filter(log => log.success).length,
      totalEmailsFailed: logs.filter(log => !log.success).length,
      goodNewsEmails: logs.filter(log => log.behaviorType === 'goodnews' && log.success).length,
      stopThinkEmails: logs.filter(log => log.behaviorType === 'stopthink' && log.success).length,
      emailsEnabled: config ? config.SEND_EMAILS : false,
      lastEmailSent: logs.length > 0 ? new Date(logs[logs.length - 1].timestamp) : null,
      averageEmailsPerDay: 0
    };

    // Calculate average emails per day
    if (logs.length > 0 && stats.lastEmailSent) {
      const firstEmailDate = new Date(logs[0].timestamp);
      const daysDiff = Math.max(1, Math.ceil((stats.lastEmailSent - firstEmailDate) / (1000 * 60 * 60 * 24)));
      stats.averageEmailsPerDay = Math.round((stats.totalEmailsSent / daysDiff) * 10) / 10;
    }

    return stats;

  } catch (error) {
    Logger.log('Error getting email statistics: ' + error.toString());
    return null;
  }
}

/**
 * Validate email system configuration
 */
function validateEmailSystemConfiguration() {
  const issues = [];

  try {
    const config = generateWorkingConfig();

    if (!config) {
      issues.push('❌ System configuration not found');
      return issues;
    }

    // Check email configuration
    if (!config.EMAIL_SUBJECT_GOOD_NEWS) {
      issues.push('❌ Good news email subject not configured');
    } else {
      issues.push('✅ Good news email subject configured');
    }

    if (!config.EMAIL_SUBJECT_STOP_THINK) {
      issues.push('❌ Stop & think email subject not configured');
    } else {
      issues.push('✅ Stop & think email subject configured');
    }

    // Check admin configuration
    const adminEmails = getAdministratorCCList(config);
    if (adminEmails.length === 0) {
      issues.push('⚠️ No administrators configured for CC');
    } else {
      issues.push(`✅ ${adminEmails.length} administrator(s) configured for CC`);
    }

    // Check email sending status
    if (config.SEND_EMAILS) {
      issues.push('✅ Email sending enabled');
    } else {
      issues.push('⚠️ Email sending disabled (test mode)');
    }

    // Check template functionality
    try {
      const testData = createSampleEmailData();
      const emailData = buildEmailData(testData, config, getSystemPillars());
      const emailContent = generateProfessionalEmailContent(emailData, config);

      if (emailContent.htmlBody && emailContent.htmlBody.length > 1000) {
        issues.push('✅ Email template generation working');
      } else {
        issues.push('❌ Email template generation failed');
      }
    } catch (error) {
      issues.push('❌ Email template error: ' + error.message);
    }

    // Check character pillars
    const pillars = getSystemPillars();
    if (pillars && pillars.length > 0) {
      issues.push(`✅ Character pillars available (${pillars.length})`);
    } else {
      issues.push('❌ No character pillars configured');
    }

  } catch (error) {
    issues.push('❌ Validation error: ' + error.message);
  }

  return issues;
}

/**
 * Generate email system health report
 */
function generateEmailSystemHealthReport() {
  try {
    const stats = getEmailSystemStatistics();
    const validationIssues = validateEmailSystemConfiguration();
    const logs = getEmailActivityLog();

    const report = {
      timestamp: new Date(),
      statistics: stats,
      validation: validationIssues,
      recentActivity: logs.slice(-5), // Last 5 activities
      healthScore: calculateEmailSystemHealthScore(stats, validationIssues)
    };

    return report;

  } catch (error) {
    Logger.log('Error generating email system health report: ' + error.toString());
    return null;
  }
}

/**
 * Calculate email system health score
 */
function calculateEmailSystemHealthScore(stats, validationIssues) {
  let score = 100;

  // Deduct points for validation issues
  const errorCount = validationIssues.filter(issue => issue.includes('❌')).length;
  const warningCount = validationIssues.filter(issue => issue.includes('⚠️')).length;

  score -= (errorCount * 15); // -15 points per error
  score -= (warningCount * 5); // -5 points per warning

  // Deduct points for failed emails
  if (stats && stats.totalEmailsFailed > 0) {
    const failureRate = stats.totalEmailsFailed / (stats.totalEmailsSent + stats.totalEmailsFailed);
    score -= (failureRate * 30); // Up to -30 points for failures
  }

  return Math.max(0, Math.round(score));
}
