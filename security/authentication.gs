/**
 * Authentication and authorization system
 */

class AuthenticationManager {
  static USER_ROLES = {
    TEACHER: 'teacher',
    ADMINISTRATOR: 'administrator',
    PARENT: 'parent',
    SYSTEM: 'system'
  };

  /**
   * Authenticate user and determine permissions
   */
  static authenticateUser() {
    try {
      const user = Session.getActiveUser();
      const email = user.getEmail();

      if (!email) {
        throw new Error('User not authenticated');
      }

      // Validate user against authorized users list
      const userRole = this.getUserRole(email);
      if (!userRole) {
        throw new Error('User not authorized for this system');
      }

      // Create session
      const session = this.createUserSession(email, userRole);

      return {
        authenticated: true,
        email: email,
        role: userRole,
        sessionId: session.id,
        permissions: this.getUserPermissions(userRole)
      };

    } catch (error) {
      return {
        authenticated: false,
        error: error.message
      };
    }
  }

  /**
   * Determine user role based on email and configuration
   */
  static getUserRole(email) {
    const config = generateWorkingConfig();

    // Check if user is an administrator
    if (config && config.ADMIN_EMAILS) {
      const adminEmails = Object.values(config.ADMIN_EMAILS);
      if (adminEmails.includes(email)) {
        return this.USER_ROLES.ADMINISTRATOR;
      }
    }

    // Check if user is a teacher (in authorized domain)
    if (this.isAuthorizedTeacher(email)) {
      return this.USER_ROLES.TEACHER;
    }

    // Check if user is a parent
    if (this.isAuthorizedParent(email)) {
      return this.USER_ROLES.PARENT;
    }

    return null;
  }

  /**
   * Check if user is authorized teacher
   */
  static isAuthorizedTeacher(email) {
    const config = generateWorkingConfig();

    // Check domain restriction
    if (config && config.AUTHORIZED_DOMAINS) {
      const domain = email.split('@')[1];
      return config.AUTHORIZED_DOMAINS.includes(domain);
    }

    // Fallback: check if email appears in any behavior reports (as teacher)
    // This is a simple heuristic - could be enhanced with explicit teacher list
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const behaviorSheet = ss.getSheetByName('Behavior Form');

    if (behaviorSheet) {
      const data = behaviorSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] === email) { // Teacher email column
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get user permissions based on role
   */
  static getUserPermissions(role) {
    const permissions = {
      [this.USER_ROLES.ADMINISTRATOR]: [
        'view_all_reports',
        'manage_system_config',
        'view_audit_logs',
        'manage_users',
        'export_data',
        'delete_data'
      ],
      [this.USER_ROLES.TEACHER]: [
        'submit_behavior_reports',
        'view_own_reports',
        'lookup_students'
      ],
      [this.USER_ROLES.PARENT]: [
        'view_child_reports',
        'request_data_deletion'
      ]
    };

    return permissions[role] || [];
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(userEmail, requiredPermission) {
    const userRole = this.getUserRole(userEmail);
    const permissions = this.getUserPermissions(userRole);

    return permissions.includes(requiredPermission);
  }
}
