/**
 * Parses all execution logs found in column A
 * This function will process every non-empty cell in column A
 */
function parseAllLogsInColumnA() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const columnA = sheet.getRange("A:A").getValues();
  
  let processedCount = 0;
  let errorCount = 0;
  
  // Process each cell in column A
  for (let row = 0; row < columnA.length; row++) {
    const cellValue = columnA[row][0];
    
    // Skip empty cells
    if (!cellValue || cellValue === "") {
      continue;
    }
    
    // Skip cells that don't contain log data
    if (typeof cellValue !== 'string' || !cellValue.includes("Appending row to sheet:")) {
      continue;
    }
    
    // Process the log data in this cell
    try {
      const success = parseExecutionLog(sheet, cellValue, row + 1);
      if (success) {
        processedCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      Logger.log(`Error processing row ${row + 1}: ${error.toString()}`);
      errorCount++;
    }
  }
  
  // Show summary message
  if (processedCount > 0) {
    showSuccess(`Successfully processed ${processedCount} log entries. Errors: ${errorCount}`);
  } else {
    showError("No valid log entries found in column A. Make sure the cells contain text with 'Appending row to sheet: [...]'");
  }
}

/**
 * Parses a single execution log entry and extracts the data array
 * 
 * @param {Sheet} sheet - The sheet to write data to
 * @param {string} logText - The execution log text
 * @param {number} row - The row number to write data to
 * @return {boolean} - True if successful, false otherwise
 */
function parseExecutionLog(sheet, logText, row) {
  // Extract the array part from the text
  const arrayMatch = logText.match(/Appending row to sheet: (\[.*\])/);
  
  if (!arrayMatch || arrayMatch.length < 2) {
    return false;
  }
  
  try {
    // Parse the array string to a JavaScript array
    const dataArray = JSON.parse(arrayMatch[1]);
    
    // Create a range to write all values at once
    const targetRange = sheet.getRange(row, 1, 1, dataArray.length);
    targetRange.setValues([dataArray]);
    
    // Optional: Mark processed cells
    sheet.getRange(row, 1).setBackground("#e6f4ea");
    
    return true;
  } catch (error) {
    Logger.log(`Failed to parse log data in row ${row}: ${error.toString()}`);
    // Optional: Mark failed cells
    sheet.getRange(row, 1).setBackground("#f4c7c3");
    return false;
  }
}

/**
 * Applies the predefined column headers to row 1
 */
function applyColumnHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Define column headers based on user's specification
  const headers = [
    "Timestamp", "Email Address", "Student First", "Student Last", 
    "Which type of behavior are you documenting?", "Location (Stop and Think)", 
    "Pillars", "Behaviors", "Teacher Comments", "Good News Behaviors", 
    "Additional comments about the selected \"Good News!\" behavior:", 
    "Student Email", "Parent1 First", "Parent1 Last", "Parent1 Email", 
    "Parent2 First", "Parent2 Last", "Parent2 Email", "ccAdmins"
  ];
  
  // Apply headers to row 1
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format the header row
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#f3f3f3");
  
  showSuccess("Column headers have been applied to row 1.");
}

/**
 * Shows a success message
 * 
 * @param {string} message - The message to display
 */
function showSuccess(message) {
  SpreadsheetApp.getUi().alert("Success", message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Shows an error message
 * 
 * @param {string} message - The message to display
 */
function showError(message) {
  SpreadsheetApp.getUi().alert("Error", message, SpreadsheetApp.getUi().ButtonSet.OK);
}