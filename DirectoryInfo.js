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
    
    // Update column T (20) with the grade level from Directory column C
    const gradeLevel = studentData[2]; // Directory column C: Grade Level
    if (gradeLevel !== null && gradeLevel !== undefined && gradeLevel !== "") {
      sheet.getRange(row, 20).setValue(gradeLevel); // Column T is position 20
      Logger.log(`Updated grade level ${gradeLevel} for student: ${firstName} ${lastName}`);
    }
    
    // Optionally, you can add highlighting to indicate successful lookup
    sheet.getRange(row, 12, 1, 7).setBackground("#e6ffe6"); // Light green background
    
    // Log the update for tracking
    Logger.log(`Updated information for student: ${firstName} ${lastName}`);
  } else {
    // If student not found, optionally clear any existing data in these cells
    sheet.getRange(row, 12, 1, 7).clearContent();
    // Also clear the grade level column
    sheet.getRange(row, 20).clearContent(); // Column T
    
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
  let processedCount = 0;
  
  // Skip header row
  for (let i = 1; i < behaviorData.length; i++) {
    const studentFirst = behaviorData[i][2]; // Column C: Student First
    const studentLast = behaviorData[i][3];  // Column D: Student Last
    const gradeLevel = behaviorData[i][19];  // Column T: Grade Level (0-indexed position 19)
    
    // Only process rows with both first and last name AND missing grade level
    if (studentFirst && studentLast && (!gradeLevel || gradeLevel === "")) {
      lookupAndUpdateStudentInfo(behaviorSheet, i + 1, studentFirst, studentLast);
      processedCount++;
    }
  }
  
  // Show a notification with the count of processed rows
  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Processed ${processedCount} rows that needed grade level updates!`, 
    "Update Complete"
  );
}

/**
 * Test function to verify grade level lookup functionality.
 * This function creates a sample form submission to test the grade level lookup.
 */
function testGradeLevelLookup() {
  // This is a test function - you can run it from the Apps Script editor to verify the functionality
  loadConstants();
  
  // Create a mock form data object (replace with actual student names from your Directory)
  const mockFormData = {
    studentFirst: "John", // Replace with a real student first name from your Directory
    studentLast: "Doe",   // Replace with a real student last name from your Directory
    behaviorType: "goodnews",
    location: "Classroom",
    comments: "Test submission for grade level lookup",
    selectedPillars: ["Respect"],
    selectedBehaviors: ["Helping Others"]
  };
  
  Logger.log("Testing grade level lookup with mock data:");
  Logger.log(JSON.stringify(mockFormData));
  
  try {
    // Test the grade level lookup by calling saveFormToSpreadsheetV2
    saveFormToSpreadsheetV2(mockFormData);
    Logger.log("Test completed successfully. Check the Behavior Form sheet for the new row with grade level.");
    SpreadsheetApp.getActiveSpreadsheet().toast("Grade level lookup test completed. Check logs for details.", "Test Complete");
  } catch (error) {
    Logger.log("Test failed: " + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast("Grade level lookup test failed. Check logs for details.", "Test Failed");
  }
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

/**
 * Helper function to ensure grade-level sheets exist and have proper headers.
 * Creates sheets "6", "7", and "8" if they don't exist.
 */
function ensureGradeLevelSheetsExist() {
  loadConstants();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gradeSheets = ["6", "7", "8"];
  
  gradeSheets.forEach(grade => {
    let gradeSheet = ss.getSheetByName(grade);
    
    if (!gradeSheet) {
      Logger.log(`Creating grade level sheet: ${grade}`);
      gradeSheet = ss.insertSheet(grade);
    }
    
    // Check if headers exist, if not add them
    if (gradeSheet.getLastRow() === 0) {
      // Get headers from the main Behavior Form sheet
      const behaviorSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
      if (behaviorSheet && behaviorSheet.getLastRow() > 0) {
        const headers = behaviorSheet.getRange(1, 1, 1, behaviorSheet.getLastColumn()).getValues()[0];
        gradeSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Format the header row
        gradeSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
        gradeSheet.freezeRows(1);
        
        Logger.log(`Added headers to grade level sheet: ${grade}`);
      }
    }
  });
}

/**
 * Sorts behavior form submissions to grade-level specific sheets based on column T.
 * This function can be run manually or set up with a timed trigger.
 */
function sortSubmissionsByGradeLevel() {
  loadConstants();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const behaviorSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
  
  if (!behaviorSheet) {
    Logger.log("Behavior Form sheet not found");
    return;
  }
  
  // Ensure grade level sheets exist
  ensureGradeLevelSheetsExist();
  
  // Get all data from Behavior Form
  const behaviorData = behaviorSheet.getDataRange().getValues();
  let sortedCount = 0;
  
  // Skip header row
  for (let i = 1; i < behaviorData.length; i++) {
    const gradeLevel = behaviorData[i][19]; // Column T: Grade Level (0-indexed position 19)
    
    // Check if this row has a grade level of 6, 7, or 8
    if (gradeLevel && (gradeLevel.toString() === "6" || gradeLevel.toString() === "7" || gradeLevel.toString() === "8")) {
      const gradeLevelSheet = ss.getSheetByName(gradeLevel.toString());
      
      if (gradeLevelSheet) {
        // Check if this row already exists in the grade level sheet
        if (!isRowAlreadyCopied(gradeLevelSheet, behaviorData[i])) {
          // Copy the entire row to the grade level sheet
          const nextRow = gradeLevelSheet.getLastRow() + 1;
          gradeLevelSheet.getRange(nextRow, 1, 1, behaviorData[i].length).setValues([behaviorData[i]]);
          
          Logger.log(`Copied row ${i + 1} to grade ${gradeLevel} sheet`);
          sortedCount++;
        }
      } else {
        Logger.log(`Grade level sheet "${gradeLevel}" not found`);
      }
    }
  }
  
  // Show completion message
  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Sorted ${sortedCount} new submissions to grade level sheets!`, 
    "Grade Level Sort Complete"
  );
  
  Logger.log(`Grade level sorting complete. Processed ${sortedCount} new submissions.`);
}

/**
 * Helper function to check if a row has already been copied to a grade level sheet.
 * Compares timestamp (column A) and student names (columns C & D) to avoid duplicates.
 */
function isRowAlreadyCopied(gradeSheet, rowData) {
  if (gradeSheet.getLastRow() <= 1) {
    return false; // No data rows exist yet
  }
  
  const timestamp = rowData[0]; // Column A: Timestamp
  const studentFirst = rowData[2]; // Column C: Student First Name
  const studentLast = rowData[3]; // Column D: Student Last Name
  
  // Get all data from the grade sheet
  const existingData = gradeSheet.getDataRange().getValues();
  
  // Check each row (skip header)
  for (let i = 1; i < existingData.length; i++) {
    const existingTimestamp = existingData[i][0];
    const existingFirst = existingData[i][2];
    const existingLast = existingData[i][3];
    
    // Compare timestamp and student names
    if (existingTimestamp && timestamp && 
        existingTimestamp.toString() === timestamp.toString() &&
        existingFirst === studentFirst &&
        existingLast === studentLast) {
      return true; // Row already exists
    }
  }
  
  return false; // Row not found, safe to copy
}

/**
 * Main function that can be used for timed triggers.
 * Combines the optimization of grade level population and sorting.
 */
function sortBehaviorFormsByGradeLevel() {
  Logger.log("Starting automated behavior form processing...");
  
  try {
    // First, ensure any missing grade levels are populated
    updateAllBehaviorFormRows();
    
    // Then sort submissions to grade-level sheets
    sortSubmissionsByGradeLevel();
    
    Logger.log("Automated behavior form processing completed successfully");
  } catch (error) {
    Logger.log("Error in automated behavior form processing: " + error.toString());
  }
}

/**
 * Test function to validate the grade-level sorting functionality.
 * This function can be run manually to test the sorting system.
 */
function testGradeLevelSorting() {
  loadConstants();
  
  Logger.log("Testing grade-level sorting functionality...");
  
  try {
    // Test the helper function first
    ensureGradeLevelSheetsExist();
    Logger.log("✓ Grade-level sheets created/verified successfully");
    
    // Test the sorting function
    sortSubmissionsByGradeLevel();
    Logger.log("✓ Grade-level sorting completed successfully");
    
    // Test the optimized update function
    updateAllBehaviorFormRows();
    Logger.log("✓ Optimized update function completed successfully");
    
    // Test the main combined function
    sortBehaviorFormsByGradeLevel();
    Logger.log("✓ Combined processing function completed successfully");
    
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "All grade-level sorting functions tested successfully! Check logs for details.", 
      "Test Complete"
    );
    
  } catch (error) {
    Logger.log("Test failed: " + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Grade-level sorting test failed. Check logs for details.", 
      "Test Failed"
    );
  }
}