/**
 * Comprehensive error handling and user feedback system
 */

class ErrorHandler {
  static handleUserError(error, context = '') {
    const userMessage = this.getUserFriendlyMessage(error);
    this.logError(error, context, 'USER_ERROR');
    return {
      success: false,
      message: userMessage,
      showToUser: true
    };
  }

  static handleSystemError(error, context = '') {
    this.logError(error, context, 'SYSTEM_ERROR');
    this.notifyAdministrators(error, context);
    return {
      success: false,
      message: 'A system error occurred. Administrators have been notified.',
      showToUser: true
    };
  }

  static getUserFriendlyMessage(error) {
    const errorMap = {
      'PERMISSION_DENIED': 'You don\'t have permission to perform this action. Please contact your administrator.',
      'NETWORK_ERROR': 'Network connection problem. Please check your internet connection and try again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'STUDENT_NOT_FOUND': 'Student not found in directory. Please verify the name spelling.',
      'EMAIL_SEND_FAILED': 'Email could not be sent. Please contact your administrator.',
      'DATA_CORRUPTION': 'Data integrity issue detected. Please contact support immediately.'
    };

    return errorMap[error.type] || 'An unexpected error occurred. Please try again.';
  }

  static logError(error, context, severity) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack || 'No stack trace',
      context: context,
      severity: severity,
      user: Session.getActiveUser().getEmail() // Assumes Session is available
    };

    // Store in Properties Service for later analysis
    this.storeErrorLog(logEntry);
  }

  static storeErrorLog(logEntry) {
    // Placeholder for storing error logs, e.g., using PropertiesService or a Spreadsheet
    console.log("Logging error: ", JSON.stringify(logEntry));
    // Example: PropertiesService.getScriptProperties().setProperty('error_log_' + logEntry.timestamp, JSON.stringify(logEntry));
  }

  static notifyAdministrators(error, context) {
    try {
      // generateWorkingConfig() is assumed to be defined elsewhere
      // const config = generateWorkingConfig();
      const config = typeof generateWorkingConfig !== 'undefined' ? generateWorkingConfig() : null; // defensive call
      if (config && config.ADMIN_EMAILS) {
        const adminEmails = Object.values(config.ADMIN_EMAILS).filter(email => email);

        if (adminEmails.length > 0) {
          // MailApp.sendEmail is assumed to be available in Google Apps Script environment
          if (typeof MailApp !== 'undefined' && MailApp.sendEmail) {
            MailApp.sendEmail({
              to: adminEmails.join(','),
              subject: 'Behavior System Error Alert',
              body: `System Error Detected:\n\nError: ${error.toString()}\nContext: ${context}\nTime: ${new Date()}\nUser: ${Session.getActiveUser().getEmail()}`
            });
          } else {
            console.error('MailApp not available. Could not send admin notification.');
          }
        }
      }
    } catch (e) {
      console.error('Failed to notify administrators:', e);
    }
  }
}

// Wrap all major functions with error handling
function safeExecute(func, context = '') {
  try {
    return func();
  } catch (error) {
    if (error.name === 'ValidationError') { // Assuming ValidationError is a custom error type
      return ErrorHandler.handleUserError(error, context);
    } else {
      return ErrorHandler.handleSystemError(error, context);
    }
  }
}
