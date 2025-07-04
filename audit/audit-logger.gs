/**
 * Comprehensive audit trail system for compliance and security
 */

class AuditLogger {
  static ACTION_TYPES = {
    USER_LOGIN: 'user_login',
    FORM_SUBMIT: 'form_submit',
    DATA_ACCESS: 'data_access',
    DATA_MODIFY: 'data_modify',
    DATA_DELETE: 'data_delete',
    CONFIG_CHANGE: 'config_change',
    USER_PERMISSION_CHANGE: 'permission_change',
    SYSTEM_ERROR: 'system_error',
    SECURITY_INCIDENT: 'security_incident'
  };

  static SEVERITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  };

  /**
   * Log user action with comprehensive details
   */
  static logAction(actionType, details, severity = this.SEVERITY_LEVELS.LOW) {
    const logEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      actionType: actionType,
      severity: severity,
      user: {
        email: Session.getActiveUser().getEmail(),
        role: AuthenticationManager.getUserRole(Session.getActiveUser().getEmail()),
        sessionId: this.getCurrentSessionId(),
        ipAddress: this.getUserIPAddress()
      },
      details: details,
      systemInfo: {
        scriptVersion: this.getScriptVersion(),
        executionTime: new Date().getTime()
      }
    };

    // Store in multiple locations for redundancy
    this.storeAuditLog(logEntry);

    // Alert on high-severity events
    if (severity === this.SEVERITY_LEVELS.HIGH || severity === this.SEVERITY_LEVELS.CRITICAL) {
      this.alertAdministrators(logEntry);
    }

    return logEntry.id;
  }

  /**
   * Log behavior form submission
   */
  static logFormSubmission(formData, submissionResult) {
    const details = {
      studentName: `${formData.studentFirst} ${formData.studentLast}`,
      behaviorType: formData.behaviorType,
      pillars: formData.selectedPillars,
      behaviors: formData.selectedBehaviors?.length || 0,
      location: formData.location,
      parentEmails: [formData.parent1Email, formData.parent2Email].filter(e => e),
      submissionSuccess: submissionResult.success,
      emailSent: submissionResult.emailResult?.success || false
    };

    return this.logAction(
      this.ACTION_TYPES.FORM_SUBMIT,
      details,
      this.SEVERITY_LEVELS.LOW
    );
  }

  /**
   * Log data access for FERPA compliance
   */
  static logDataAccess(dataType, studentIdentifier, accessPurpose, accessResult) {
    const details = {
      dataType: dataType,
      studentIdentifier: studentIdentifier,
      accessPurpose: accessPurpose,
      accessGranted: accessResult,
      dataVolume: this.calculateDataVolume(dataType, studentIdentifier)
    };

    return this.logAction(
      this.ACTION_TYPES.DATA_ACCESS,
      details,
      this.SEVERITY_LEVELS.MEDIUM
    );
  }

  /**
   * Log security incidents
   */
  static logSecurityIncident(incidentType, incidentDetails, affectedData) {
    const details = {
      incidentType: incidentType,
      incidentDetails: incidentDetails,
      affectedData: affectedData,
      detectionTime: new Date().toISOString(),
      responseActions: []
    };

    return this.logAction(
      this.ACTION_TYPES.SECURITY_INCIDENT,
      details,
      this.SEVERITY_LEVELS.CRITICAL
    );
  }

  /**
   * Generate audit reports for compliance
   */
  static generateAuditReport(startDate, endDate, filterCriteria = {}) {
    const logs = this.retrieveAuditLogs(startDate, endDate, filterCriteria);

    const report = {
      reportId: this.generateReportId(),
      generatedDate: new Date().toISOString(),
      reportPeriod: { startDate, endDate },
      filterCriteria: filterCriteria,
      summary: this.generateAuditSummary(logs),
      logs: logs,
      compliance: {
        ferpaCompliant: this.assessFERPACompliance(logs),
        securityIncidents: this.countSecurityIncidents(logs),
        dataAccessPatterns: this.analyzeAccessPatterns(logs)
      }
    };

    // Store report for future reference
    this.storeAuditReport(report);

    return report;
  }

  /**
   * Store audit log securely
   */
  static storeAuditLog(logEntry) {
    try {
      // Primary storage: Properties Service (encrypted)
      const encryptedLog = this.encryptLogEntry(logEntry);
      const existingLogs = this.getStoredLogs();
      existingLogs.push(encryptedLog);

      // Maintain maximum log count (FIFO)
      if (existingLogs.length > 10000) {
        existingLogs.shift();
      }

      PropertiesService.getScriptProperties().setProperty(
        'AUDIT_LOGS',
        JSON.stringify(existingLogs)
      );

      // Secondary storage: Spreadsheet (for reporting)
      this.storeLogInSpreadsheet(logEntry);

    } catch (error) {
      console.error('Failed to store audit log:', error);
      // Fallback to console logging
      console.log('AUDIT_LOG:', JSON.stringify(logEntry));
    }
  }
}
