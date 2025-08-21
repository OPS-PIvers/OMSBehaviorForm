/**
 * Automatically populates student and parent information in the "Behavior Form" sheet
 * when a student's first and last name are entered.
 * 
 * @param {Object} e The event object from the edit trigger
 */
function onEdit(e) {
  loadConstants();
  // Get the active sheet and the edited range
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Check if the edit occurred in the "Behavior Form" sheet
  if (sheet.getName() !== CONFIG.SHEET_NAMES.BEHAVIOR_FORM) return;
  
  // Check if the edit was in columns C or D (Student First or Last)
  const col = range.getColumn();
  if (col !== 3 && col !== 4) return;
  
  // Get the row number
  const row = range.getRow();
  
  // Ignore header row
  if (row <= 1) return;
  
  // Get the values for Student First and Last
  const studentFirst = sheet.getRange(row, 3).getValue();
  const studentLast = sheet.getRange(row, 4).getValue();
  
  // Only proceed if both first and last name have values
  if (!studentFirst || !studentLast) return;
  
  // Look up student in Directory and update Behavior Form
  lookupAndUpdateStudentInfo(sheet, row, studentFirst, studentLast);
}

/**
 * Looks up student information in the Directory sheet and updates the Behavior Form.
 * 
 * @param {Object} sheet The Behavior Form sheet
 * @param {number} row The row number to update
 * @param {string} firstName Student's first name
 * @param {string} lastName Student's last name
 */
function lookupAndUpdateStudentInfo(sheet, row, firstName, lastName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const directorySheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DIRECTORY);
  
  // Get all data from Directory sheet
  const directoryData = directorySheet.getDataRange().getValues();
  
  // Skip header row and search for matching student
  let studentData = null;
  for (let i = 1; i < directoryData.length; i++) {
    const currFirstName = directoryData[i][0]; // Column A: Student First
    const currLastName = directoryData[i][1];  // Column B: Student Last
    
    // Case-insensitive comparison of first and last names
    if (currFirstName.toLowerCase() === firstName.toLowerCase() && 
        currLastName.toLowerCase() === lastName.toLowerCase()) {
      studentData = directoryData[i];
      break;
    }
  }
  
  // If student found, update the Behavior Form with the data
  if (studentData) {
    // Create an array of values to update
    const updateValues = [
      studentData[3],  // Student Email (Directory column D)
      studentData[4],  // Parent1 First (Directory column E)
      studentData[5],  // Parent1 Last (Directory column F)
      studentData[6],  // Parent1 Email (Directory column G)
      studentData[7],  // Parent2 First (Directory column H)
      studentData[8],  // Parent2 Last (Directory column I)
      studentData[9]   // Parent2 Email (Directory column J)
    ];
    
    // Update columns L through R (12-18) with the student and parent information
    sheet.getRange(row, 12, 1, 7).setValues([updateValues]);
    
    // Optionally, you can add highlighting to indicate successful lookup
    sheet.getRange(row, 12, 1, 7).setBackground("#e6ffe6"); // Light green background
    
    // Log the update for tracking
    Logger.log(`Updated information for student: ${firstName} ${lastName}`);
  } else {
    // If student not found, optionally clear any existing data in these cells
    sheet.getRange(row, 12, 1, 7).clearContent();
    
    // Add visual indicator that lookup failed
    sheet.getRange(row, 12, 1, 7).setBackground("#ffe6e6"); // Light red background
    
    // Log the failed lookup for tracking
    Logger.log(`Student not found: ${firstName} ${lastName}`);
  }
}

/**
 * Manual function to update all rows in the Behavior Form sheet.
 * This can be run to ensure all existing rows are populated correctly.
 */
function updateAllBehaviorFormRows() {
  loadConstants();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const behaviorSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
  
  // Get all data from Behavior Form
  const behaviorData = behaviorSheet.getDataRange().getValues();
  
  // Skip header row
  for (let i = 1; i < behaviorData.length; i++) {
    const studentFirst = behaviorData[i][2]; // Column C: Student First
    const studentLast = behaviorData[i][3];  // Column D: Student Last
    
    // Only process rows with both first and last name
    if (studentFirst && studentLast) {
      lookupAndUpdateStudentInfo(behaviorSheet, i + 1, studentFirst, studentLast);
    }
  }
  
  // Show a notification that the update is complete
  SpreadsheetApp.getActiveSpreadsheet().toast("All rows have been updated!", "Update Complete");
}

/**
 * Gets the full name of the active user.
 * This function helps populate the Teacher Name field automatically.
 * 
 * @return {string} The user's full name or email if name is not available
 */
function getUserFullName() {
  try {
    const email = Session.getActiveUser().getEmail();
    
    // First try to get a more human-readable name using getTeacherName function
    // which already exists in the EmailSystem.txt file
    if (typeof getTeacherName === 'function') {
      const teacherName = getTeacherName(email);
      if (teacherName && teacherName !== "Your Teacher") {
        return teacherName;
      }
    }
    
    // If that didn't work, try a simpler approach
    if (email) {
      // Extract name part from email (before @)
      const namePart = email.split('@')[0];
      // Convert from format like "john.doe" to "John Doe"
      if (namePart.includes('.')) {
        return namePart.split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
      // Simple capitalization if no dot
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    
    return "";
  } catch (error) {
    Logger.log("Error getting user name: " + error.toString());
    return "";
  }
}