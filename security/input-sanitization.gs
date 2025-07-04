/**
 * Comprehensive input sanitization for security hardening
 */

class InputSanitizer {
  static XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi
  ];

  static SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|#|\/\*|\*\/)/g,
    /('|(\\x27)|(\\x2D\\x2D))/gi
  ];

  /**
   * Sanitize text input to prevent XSS attacks
   */
  static sanitizeText(input, allowHTML = false) {
    if (input === null || input === undefined) return '';

    let sanitized = String(input).trim();

    if (!allowHTML) {
      // Remove all HTML tags
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    }

    // Remove dangerous XSS patterns
    this.XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Encode special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  /**
   * Sanitize email addresses
   */
  static sanitizeEmail(email) {
    if (!email) return '';

    let sanitized = String(email).trim().toLowerCase();

    // Remove dangerous patterns
    this.XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format detected');
    }

    return sanitized;
  }

  /**
   * Sanitize form data comprehensively
   */
  static sanitizeFormData(formData) {
    const sanitized = {};

    Object.keys(formData).forEach(key => {
      const value = formData[key];

      switch (key) {
        case 'studentFirst':
        case 'studentLast':
        case 'teacherName':
        case 'parent1First':
        case 'parent1Last':
        case 'parent2First':
        case 'parent2Last':
          sanitized[key] = this.sanitizeName(value);
          break;

        case 'parent1Email':
        case 'parent2Email':
        case 'studentEmail':
          sanitized[key] = this.sanitizeEmail(value);
          break;

        case 'comments':
          sanitized[key] = this.sanitizeText(value, false);
          break;

        case 'location':
          sanitized[key] = this.sanitizeLocation(value);
          break;

        case 'selectedPillars':
        case 'selectedBehaviors':
          sanitized[key] = this.sanitizeArray(value);
          break;

        default:
          sanitized[key] = this.sanitizeText(value);
      }
    });

    return sanitized;
  }

  /**
   * Sanitize name fields with specific rules
   */
  static sanitizeName(name) {
    if (!name) return '';

    let sanitized = String(name).trim();

    // Allow only letters, spaces, hyphens, and apostrophes
    sanitized = sanitized.replace(/[^a-zA-Z\s\-']/g, '');

    // Limit length
    if (sanitized.length > 50) {
      sanitized = sanitized.substring(0, 50);
    }

    // Capitalize properly
    return this.capitalizeProperName(sanitized);
  }

  /**
   * Validate and sanitize array inputs
   */
  static sanitizeArray(arrayInput) {
    if (!Array.isArray(arrayInput)) {
      return [];
    }

    return arrayInput
      .map(item => this.sanitizeText(item))
      .filter(item => item.length > 0)
      .slice(0, 20); // Limit array size
  }
}
