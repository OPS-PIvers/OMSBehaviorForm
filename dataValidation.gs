/**
 * Comprehensive data validation and integrity system
 */

class DataValidator {
  static validateSpreadsheetStructure() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // SYSTEM_CONFIG is assumed to be defined elsewhere, e.g., in config.gs
    const requiredSheets = (typeof SYSTEM_CONFIG !== 'undefined' && SYSTEM_CONFIG.SHEETS) ? Object.values(SYSTEM_CONFIG.SHEETS) : [];
    const issues = [];

    if (requiredSheets.length === 0) {
        issues.push('SYSTEM_CONFIG.SHEETS is not defined. Cannot validate sheet structure.');
        return issues;
    }

    requiredSheets.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        issues.push(`Missing required sheet: ${sheetName}`);
      } else {
        // Add specific validation for this sheet's structure if needed
        const sheetValidationIssues = this.validateSheetStructure(sheet, sheetName);
        if (sheetValidationIssues.length > 0) {
            issues.push(...sheetValidationIssues);
        }
      }
    });

    return issues;
  }

  static validateSheetStructure(sheet, sheetName) {
    const issues = [];
    // This function can be expanded based on specific requirements for each sheet
    // For example, checking for specific headers, named ranges, protected ranges etc.

    // Example: Validate 'Directory' sheet headers as per the original request
    if (sheetName === ( (typeof SYSTEM_CONFIG !== 'undefined' && SYSTEM_CONFIG.SHEETS) ? SYSTEM_CONFIG.SHEETS.DIRECTORY : 'Directory') ) {
      issues.push(...this.validateDirectorySheet(sheet));
    }
    // Example: Validate 'Behavior Form' sheet (if it has a predefined structure to check)
    else if (sheetName === ( (typeof SYSTEM_CONFIG !== 'undefined' && SYSTEM_CONFIG.SHEETS) ? SYSTEM_CONFIG.SHEETS.BEHAVIOR_FORM_LOG : 'Behavior Form')) {
      issues.push(...this.validateBehaviorFormSheet(sheet));
    }
    // Add other sheet validations as cases here

    return issues;
  }

  static validateDirectorySheet(sheet) {
    const issues = [];
    const expectedHeaders = [
        'Student First', 'Student Last', 'Grade', 'Student Email',
        'Parent1 First', 'Parent1 Last', 'Parent1 Email',
        'Parent2 First', 'Parent2 Last', 'Parent2 Email'
        // Add any other critical headers for the Directory sheet
    ];

    if (sheet.getLastRow() === 0 && sheet.getLastColumn() === 0) { // Sheet is empty
        issues.push(`Directory sheet '${sheet.getName()}' is empty. Headers cannot be validated.`);
        return issues;
    }

    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    expectedHeaders.forEach((expectedHeader, index) => {
      if (index < headerRow.length) {
        if (headerRow[index] !== expectedHeader) {
          issues.push(`Directory sheet '${sheet.getName()}' header mismatch in column ${index + 1}: expected "${expectedHeader}", found "${headerRow[index]}"`);
        }
      } else {
        issues.push(`Directory sheet '${sheet.getName()}' missing expected header in column ${index + 1}: "${expectedHeader}"`);
      }
    });

    return issues;
  }

  static validateBehaviorFormSheet(sheet) {
    const issues = [];
    // Example: Define expected headers for the behavior log sheet
    const expectedHeaders = [
        'Timestamp', 'Behavior Type', 'Student First', 'Student Last',
        'Teacher Name', 'Pillars', 'Behaviors', 'Location', 'Comments',
        'Student Email', 'Parent1 Email', 'Parent2 Email'
        // Add any other critical headers for the Behavior Form Log sheet
    ];

    if (sheet.getLastRow() === 0 && sheet.getLastColumn() === 0) { // Sheet is empty
        issues.push(`Behavior Form Log sheet '${sheet.getName()}' is empty. Headers cannot be validated.`);
        return issues;
    }

    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    expectedHeaders.forEach((expectedHeader, index) => {
        if (index < headerRow.length) {
            if (headerRow[index] !== expectedHeader) {
                issues.push(`Behavior Form Log sheet '${sheet.getName()}' header mismatch in column ${index + 1}: expected "${expectedHeader}", found "${headerRow[index]}"`);
            }
        } else {
            issues.push(`Behavior Form Log sheet '${sheet.getName()}' missing expected header in column ${index + 1}: "${expectedHeader}"`);
        }
    });
    return issues;
  }

  static sanitizeInput(input, type = 'text') {
    if (input === null || input === undefined || typeof input === 'boolean') {
        // For boolean, allow them to pass through or handle as per requirement
        if (typeof input === 'boolean') return input;
        return ''; // Return empty string for null/undefined non-boolean inputs
    }

    let sanitized = String(input).trim();

    switch (type) {
      case 'email':
        // Basic email sanitization: toLowerCase and trim is already done.
        // Further validation is separate. This step is about 'cleaning'.
        sanitized = sanitized.toLowerCase();
        // Remove characters not typically allowed in emails, though regex validation is better for format checking.
        // This is a light sanitization, not a replacement for validation.
        // sanitized = sanitized.replace(/[^a-z0-9@._\-+]/g, ''); // Example of stricter sanitization
        break;
      case 'name':
        // Name sanitization - allow letters, spaces, hyphens, apostrophes, periods
        sanitized = sanitized.replace(/[^a-zA-Z\s\-'.]/g, '');
        break;
      case 'text':
        // General text sanitization - remove potential XSS by escaping HTML special characters.
        // A more robust approach might involve a library or more comprehensive replacement.
        sanitized = sanitized.replace(/&/g, '&amp;')
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;')
                             .replace(/"/g, '&quot;')
                             .replace(/'/g, '&#039;');
        break;
      case 'alphanumeric':
        sanitized = sanitized.replace(/[^a-zA-Z0-9\s]/g, '');
        break;
      case 'numeric':
        sanitized = sanitized.replace(/[^0-9.]/g, ''); // Allows numbers and decimal points
        break;
      // Add more types as needed
    }

    return sanitized;
  }

  static validateEmailFormat(email) {
    if (email === null || email === undefined || String(email).trim() === '') {
        return { valid: false, error: 'Email is required and cannot be empty.' };
    }

    const emailString = String(email).trim();
    // Regex from https://emailregex.com/ (RFC 5322 Official Standard)
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (!emailRegex.test(emailString)) {
      return { valid: false, error: `Invalid email format for "${emailString}".` };
    }

    // Optional: Check for disposable email addresses or domain validity (more advanced)

    return { valid: true, message: 'Email format is valid.' };
  }

  // Example of a more specific validation function
  static validateStudentName(name) {
    if (name === null || name === undefined || String(name).trim() === '') {
        return { valid: false, error: 'Student name is required and cannot be empty.' };
    }
    const nameString = String(name).trim();
    if (nameString.length < 2) {
        return { valid: false, error: 'Student name must be at least 2 characters long.' };
    }
    if (!/^[a-zA-Z\s\-'.]+$/.test(nameString)) {
        return { valid: false, error: 'Student name contains invalid characters. Only letters, spaces, hyphens, apostrophes, and periods are allowed.'};
    }
    return { valid: true, message: 'Student name is valid.' };
  }

  // Central validation function that can be called with data and a schema/ruleset
  /**
   * Validates an object against a set of rules.
   * rules = { fieldName: { type: 'email', required: true, minLength: 5, ... } }
   */
  static validateObject(data, rules) {
    const errors = {};
    const warnings = {}; // For optional fields or soft validation

    for (const field in rules) {
        const rule = rules[field];
        const value = data[field];

        // Required check
        if (rule.required && (value === undefined || value === null || String(value).trim() === '')) {
            errors[field] = rule.requiredMessage || `${field} is required.`;
            continue; // Skip other checks if required field is missing
        }

        // If field is not required and not present, skip further validation for this field
        if (!rule.required && (value === undefined || value === null || String(value).trim() === '')) {
            if (rule.warnIfMissing) {
                 warnings[field] = rule.warnIfMissingMessage || `${field} is recommended.`;
            }
            continue;
        }

        const sValue = String(value).trim(); // Use trimmed string value for most checks

        // Type specific validation
        if (rule.type) {
            switch (rule.type) {
                case 'email':
                    const emailValidation = this.validateEmailFormat(sValue);
                    if (!emailValidation.valid) errors[field] = emailValidation.error;
                    break;
                case 'name':
                    const nameValidation = this.validateStudentName(sValue);
                    if (!nameValidation.valid) errors[field] = nameValidation.error;
                    break;
                case 'string':
                    if (rule.minLength && sValue.length < rule.minLength) {
                        errors[field] = `${field} must be at least ${rule.minLength} characters long.`;
                    }
                    if (rule.maxLength && sValue.length > rule.maxLength) {
                        errors[field] = `${field} must be no more than ${rule.maxLength} characters long.`;
                    }
                    if (rule.pattern && !rule.pattern.test(sValue)) {
                        errors[field] = rule.patternMessage || `${field} has an invalid format.`;
                    }
                    break;
                case 'number':
                    if (isNaN(Number(sValue))) {
                        errors[field] = `${field} must be a number.`;
                    } else {
                        const numValue = Number(sValue);
                        if (rule.min !== undefined && numValue < rule.min) {
                            errors[field] = `${field} must be at least ${rule.min}.`;
                        }
                        if (rule.max !== undefined && numValue > rule.max) {
                           errors[field] = `${field} must be no more than ${rule.max}.`;
                        }
                    }
                    break;
                case 'array':
                    if (!Array.isArray(value)) {
                        errors[field] = `${field} must be an array.`;
                    } else {
                        if (rule.minItems && value.length < rule.minItems) {
                            errors[field] = `${field} must contain at least ${rule.minItems} items.`;
                        }
                        if (rule.maxItems && value.length > rule.maxItems) {
                            errors[field] = `${field} must contain no more than ${rule.maxItems} items.`;
                        }
                        // Could add validation for array item types if needed
                    }
                    break;
                // Add more types like 'date', 'boolean', 'url' etc.
            }
        }
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
        warnings: warnings,
        validatedData: data // Or potentially sanitized data if sanitization is part of this step
    };
  }
}
