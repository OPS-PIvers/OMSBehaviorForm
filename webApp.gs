/**
 * ================================================================================
 * WEB APPLICATION INTERFACE - PHASE 3
 * ================================================================================
 * Professional web form for teacher behavior report submission
 */

/**
 * Handle GET requests to serve the web app
 */
function doGet(e) {
  // Wrap the main logic of doGet with safeExecute for robust error handling
  // safeExecute is defined in errorHandling.gs
  const result = safeExecute(function() {
    // Check if system is set up
    if (!isSystemSetup()) {
      return HtmlService.createHtmlOutput(createSetupRequiredPage())
        .setTitle('System Setup Required')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    // Get system configuration
    const config = generateWorkingConfig(); // Assumed to exist
    const pillars = getSystemPillars(); // Assumed to exist

    if (!config || !pillars) {
      // This specific error might be better handled by returning a custom error page directly
      // rather than relying on ErrorHandler.handleSystemError's generic message,
      // but for demonstration, we'll let safeExecute catch it if generateWorkingConfig or getSystemPillars throws.
      // Alternatively, throw a custom error here:
      // throw new Error('CONFIG_MISSING: System configuration or pillars data is missing.');
      return HtmlService.createHtmlOutput(createErrorPage('Configuration Error: Essential system data (config or pillars) could not be loaded.'))
        .setTitle('Configuration Error')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    // Create and return the main web app
    const htmlOutput = HtmlService.createHtmlOutput(createBehaviorFormHTML(config, pillars))
      .setTitle(`${config.SCHOOL_NAME} - Student Behavior Form`)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    return htmlOutput;

  }, 'doGet Web App Initialization'); // Context for error logging

  // If safeExecute caught an error and returned an error object from ErrorHandler
  if (result && result.success === false && result.showToUser === true) {
    Logger.log('Error handled by safeExecute in doGet: ' + result.message);
    // Return a standardized error page. createErrorPage is from webApp.gs itself.
    return HtmlService.createHtmlOutput(createErrorPage('System Error: ' + result.message))
      .setTitle('System Error')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  // If everything went well, 'result' is the htmlOutput
  return result;
}

/**
 * Create the main behavior form HTML
 */
function createBehaviorFormHTML(config, pillars) {
  const pillarsJson = JSON.stringify(pillars);

  return `
<!DOCTYPE html>
<html>
<head>
  <!--
    Student Behavior Management System - Web Application
    Created by: ${ATTRIBUTION.CREATED_BY}
    Version: ${ATTRIBUTION.VERSION}
    © ${ATTRIBUTION.YEAR} ${ATTRIBUTION.CREATED_BY}
    Contact: ${ATTRIBUTION.CONTACT_EMAIL}
  -->
  <base target="_top">
  <meta charset="utf-8">
  <title>${config.SCHOOL_NAME} - Student Behavior Form</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="generator" content="Student Behavior System by ${ATTRIBUTION.CREATED_BY}">

  <style>
    :root {
      --primary-color: ${config.PRIMARY_COLOR};
      --primary-dark: color-mix(in srgb, ${config.PRIMARY_COLOR} 80%, black);
      --primary-light: color-mix(in srgb, ${config.PRIMARY_COLOR} 20%, white);
      --success-color: #34a853;
      --warning-color: #fbbc04;
      --error-color: #ea4335;
      --text-primary: #202124;
      --text-secondary: #5f6368;
      --border-color: #dadce0;
      --surface-color: #ffffff;
      --background-color: #f8f9fa;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Google Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: var(--background-color);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 16px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--surface-color);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
      position: relative;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="white" stop-opacity="0.1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs><ellipse cx="50" cy="0" rx="50" ry="20" fill="url(%23a)"/></svg>') no-repeat center top;
      opacity: 0.3;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .logo {
      max-width: 120px;
      max-height: 60px;
      margin-bottom: 16px;
      border-radius: 8px;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 400;
      margin-bottom: 8px;
    }

    .header .school-info {
      font-size: 16px;
      opacity: 0.9;
    }

    .form-container {
      padding: 32px 24px;
    }

    .form-section {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      transition: all 0.2s ease;
    }

    .form-section:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      cursor: pointer;
      user-select: none;
    }

    .section-title {
      font-size: 20px;
      font-weight: 500;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-icon {
      font-size: 24px;
    }

    .collapse-indicator {
      font-size: 18px;
      color: var(--text-secondary);
      transition: transform 0.3s ease;
    }

    .form-section.collapsed .collapse-indicator {
      transform: rotate(-90deg);
    }

    .section-content {
      transition: all 0.3s ease;
    }

    .form-section.collapsed .section-content {
      display: none;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .form-group {
      flex: 1;
      min-width: 200px;
    }

    .form-group-full {
      width: 100%;
    }

    label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text-primary);
      font-size: 14px;
    }

    input[type="text"],
    input[type="email"],
    textarea,
    select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      font-family: inherit;
      background: var(--surface-color);
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 15%, transparent);
    }

    input:read-only {
      background-color: #f8f9fa;
      color: var(--text-secondary);
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    .lookup-container {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .lookup-button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      height: 44px;
    }

    .lookup-button:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px color-mix(in srgb, var(--primary-color) 30%, transparent);
    }

    .lookup-button:disabled {
      background: #dadce0;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .toggle-group {
      display: flex;
      gap: 12px;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    .toggle-button {
      padding: 12px 20px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      background: var(--surface-color);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      text-align: center;
      flex: 1;
      min-width: 150px;
      color: var(--text-secondary);
    }

    .toggle-button:hover {
      border-color: var(--primary-color);
      background: var(--primary-light);
    }

    .toggle-button.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-color) 25%, transparent);
    }

    .pillars-container {
      display: flex;
      flex-wrap: nowrap;
      gap: 12px;
      overflow-x: auto;
      padding: 8px 0 16px 0;
      margin: 16px 0;
    }

    .pillar-button {
      flex: 0 0 auto;
      min-width: 140px;
      padding: 16px 12px;
      border: 2px solid;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      text-align: center;
      font-size: 14px;
      background: var(--surface-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .pillar-icon {
      font-size: 20px;
    }

    .pillar-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .pillar-button.active {
      color: white !important;
      box-shadow: 0 4px 16px color-mix(in srgb, currentColor 30%, transparent);
      transform: translateY(-2px);
    }

    .behaviors-container {
      margin-top: 20px;
    }

    .behavior-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .behavior-column {
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      background: var(--surface-color);
    }

    .behavior-column-header {
      padding: 16px;
      font-weight: 600;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
      color: white;
    }

    .behavior-list {
      padding: 16px;
      max-height: 300px;
      overflow-y: auto;
    }

    .behavior-item {
      padding: 12px 16px;
      margin-bottom: 8px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      line-height: 1.4;
      background: var(--surface-color);
    }

    .behavior-item:hover {
      border-color: var(--primary-color);
      background: var(--primary-light);
    }

    .behavior-item.selected {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: white;
      font-weight: 500;
    }

    .location-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 12px;
    }

    .location-button {
      padding: 10px 16px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      background: var(--surface-color);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      flex: 1;
      min-width: 100px;
      text-align: center;
    }

    .location-button:hover {
      border-color: var(--primary-color);
      background: var(--primary-light);
    }

    .location-button.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .other-location {
      margin-top: 12px;
      display: none;
    }

    .submit-container {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }

    .submit-button {
      background: var(--success-color);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 200px;
    }

    .submit-button:hover {
      background: color-mix(in srgb, var(--success-color) 85%, black);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px color-mix(in srgb, var(--success-color) 30%, transparent);
    }

    .submit-button:disabled {
      background: #dadce0;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .status-message {
      margin-bottom: 24px;
      padding: 16px;
      border-radius: 8px;
      font-weight: 500;
      display: none;
    }

    .status-success {
      background: color-mix(in srgb, var(--success-color) 10%, white);
      border: 1px solid var(--success-color);
      color: color-mix(in srgb, var(--success-color) 80%, black);
    }

    .status-error {
      background: color-mix(in srgb, var(--error-color) 10%, white);
      border: 1px solid var(--error-color);
      color: color-mix(in srgb, var(--error-color) 80%, black);
    }

    .status-warning {
      background: color-mix(in srgb, var(--warning-color) 10%, white);
      border: 1px solid var(--warning-color);
      color: color-mix(in srgb, var(--warning-color) 80%, black);
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .attribution {
      background: var(--background-color);
      border-top: 1px solid var(--border-color);
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .attribution a {
      color: var(--primary-color);
      text-decoration: none;
    }

    .attribution a:hover {
      text-decoration: underline;
    }

    .help-text {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
      line-height: 1.4;
    }

    .note-box {
      background: color-mix(in srgb, var(--primary-color) 8%, white);
      border-left: 4px solid var(--primary-color);
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
    }

    .suggestions {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-top: 8px;
      max-height: 200px;
      overflow-y: auto;
      display: none;
    }

    .suggestion-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid var(--border-color);
      transition: background 0.2s ease;
    }

    .suggestion-item:hover {
      background: var(--primary-light);
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      body {
        padding: 8px;
      }

      .container {
        border-radius: 8px;
      }

      .header {
        padding: 24px 16px;
      }

      .header h1 {
        font-size: 24px;
      }

      .form-container {
        padding: 20px 16px;
      }

      .form-section {
        padding: 16px;
      }

      .form-row {
        flex-direction: column;
        gap: 12px;
      }

      .form-group {
        min-width: auto;
      }

      .lookup-container {
        flex-direction: column;
        align-items: stretch;
      }

      .pillars-container {
        flex-direction: column;
        overflow-x: visible;
      }

      .pillar-button {
        min-width: auto;
        flex: 1;
      }

      .behavior-columns {
        grid-template-columns: 1fr;
      }

      .toggle-group,
      .location-buttons {
        flex-direction: column;
      }

      .toggle-button,
      .location-button {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .header h1 {
        font-size: 20px;
      }

      .section-title {
        font-size: 18px;
      }

      .submit-button {
        width: 100%;
        min-width: auto;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        ${config.LOGO_URL ? `<img src="${config.LOGO_URL}" alt="School Logo" class="logo">` : ''}
        <h1>Student Behavior Form</h1>
        <div class="school-info">
          ${config.SCHOOL_NAME}${config.DISTRICT_NAME ? ' • ' + config.DISTRICT_NAME : ''}
        </div>
      </div>
    </div>

    <div class="form-container">
      <!-- Status Messages -->
      <div id="statusMessage" class="status-message"></div>

      <form id="behaviorForm">
        <!-- Behavior Type Selection -->
        <div class="form-section" id="section-type">
          <div class="section-header" onclick="toggleSection('section-type')">
            <div class="section-title">
              <span class="section-icon">📋</span>
              Behavior Type
            </div>
            <div class="collapse-indicator">▼</div>
          </div>
          <div class="section-content">
            <div class="toggle-group">
              <div class="toggle-button active" data-type="goodnews">
                ✅ Good News / Positive Behavior
              </div>
              <div class="toggle-button" data-type="stopthink">
                ⚠️ Stop & Think / Needs Improvement
              </div>
            </div>
            <input type="hidden" id="behaviorType" value="goodnews">
          </div>
        </div>

        <!-- Student Information -->
        <div class="form-section" id="section-student">
          <div class="section-header" onclick="toggleSection('section-student')">
            <div class="section-title">
              <span class="section-icon">👤</span>
              Student Information
            </div>
            <div class="collapse-indicator">▼</div>
          </div>
          <div class="section-content">
            <div class="form-row">
              <div class="form-group">
                <label for="studentFirst">Student First Name *</label>
                <input type="text" id="studentFirst" required>
              </div>
              <div class="form-group">
                <label for="studentLast">Student Last Name *</label>
                <input type="text" id="studentLast" required>
              </div>
              <div style="flex: 0 0 auto;">
                <label>&nbsp;</label>
                <button type="button" class="lookup-button" id="lookupButton">
                  🔍 Look Up Student
                </button>
              </div>
            </div>

            <div id="suggestions" class="suggestions"></div>

            <div class="form-row">
              <div class="form-group">
                <label for="teacherName">Your Name *</label>
                <input type="text" id="teacherName" required>
              </div>
              <div class="form-group">
                <label for="studentEmail">Student Email</label>
                <input type="email" id="studentEmail" readonly>
              </div>
            </div>
          </div>
        </div>

        <!-- Parent Information -->
        <div class="form-section collapsed" id="section-parent">
          <div class="section-header" onclick="toggleSection('section-parent')">
            <div class="section-title">
              <span class="section-icon">👨‍👩‍👧‍👦</span>
              Parent Information
            </div>
            <div class="collapse-indicator">▼</div>
          </div>
          <div class="section-content">
            <div class="form-row">
              <div class="form-group">
                <label for="parent1First">Parent 1 First Name</label>
                <input type="text" id="parent1First" readonly>
              </div>
              <div class="form-group">
                <label for="parent1Last">Parent 1 Last Name</label>
                <input type="text" id="parent1Last" readonly>
              </div>
              <div class="form-group">
                <label for="parent1Email">Parent 1 Email *</label>
                <input type="email" id="parent1Email" readonly>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="parent2First">Parent 2 First Name</label>
                <input type="text" id="parent2First" readonly>
              </div>
              <div class="form-group">
                <label for="parent2Last">Parent 2 Last Name</label>
                <input type="text" id="parent2Last" readonly>
              </div>
              <div class="form-group">
                <label for="parent2Email">Parent 2 Email</label>
                <input type="email" id="parent2Email" readonly>
              </div>
            </div>
          </div>
        </div>

        <!-- Character Pillars -->
        <div class="form-section" id="section-pillars">
          <div class="section-header" onclick="toggleSection('section-pillars')">
            <div class="section-title">
              <span class="section-icon">🏛️</span>
              Character Pillars *
            </div>
            <div class="collapse-indicator">▼</div>
          </div>
          <div class="section-content">
            <div class="pillars-container" id="pillarsContainer">
              <!-- Pillars will be populated by JavaScript -->
            </div>
            <div class="note-box">
              Select the character traits that relate to the observed behavior. You can select multiple pillars.
            </div>
          </div>
        </div>

        <!-- Behaviors -->
        <div class="form-section" id="section-behaviors">
          <div class="section-header" onclick="toggleSection('section-behaviors')">
            <div class="section-title">
              <span class="section-icon">📝</span>
              Specific Behaviors *
            </div>
            <div class="collapse-indicator">▼</div>
          </div>
          <div class="section-content">
            <div class="behaviors-container" id="behaviorsContainer">
              <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
                Select character pillars above to see relevant behaviors
              </p>
            </div>
          </div>
        </div>

        <!-- Location & Comments -->
        <div class="form-section" id="section-details">
          <div class="section-header" onclick="toggleSection('section-details')">
            <div class="section-title">
              <span class="section-icon">📍</span>
              Location & Comments
            </div>
            <div class="collapse-indicator">▼</div>
          </div>
          <div class="section-content">
            <div class="form-group-full">
              <label>Location *</label>
              <div class="location-buttons">
                <div class="location-button" data-location="Classroom">Classroom</div>
                <div class="location-button" data-location="Cafeteria">Cafeteria</div>
                <div class="location-button" data-location="Hallway">Hallway</div>
                <div class="location-button" data-location="Library">Library</div>
                <div class="location-button" data-location="Gym">Gym</div>
                <div class="location-button" data-location="Other">Other</div>
              </div>
              <div class="other-location" id="otherLocation">
                <input type="text" id="otherLocationText" placeholder="Please specify location">
              </div>
              <input type="hidden" id="location" required>
            </div>

            <div class="form-group-full">
              <label for="comments">Additional Comments (Optional)</label>
              <textarea id="comments" placeholder="Provide specific details about what you observed. These comments will be included in the parent email."></textarea>
              <div class="help-text">
                Keep comments objective and descriptive. Example: "During group work, Sarah actively listened to her peers' ideas" or "John called out answers several times without raising his hand."
              </div>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="submit-container">
          <button type="submit" class="submit-button" id="submitButton">
            📧 Submit & Send Email to Parents
          </button>
        </div>
      </form>
    </div>

    <!-- Attribution -->
    <div class="attribution">
      <div>
        <strong>Powered by Student Behavior Management System</strong> |
        Created by <a href="${ATTRIBUTION.WEBSITE}" target="_blank">${ATTRIBUTION.CREATED_BY}</a> |
        Version ${ATTRIBUTION.VERSION}
      </div>
      <div style="margin-top: 4px;">
        ${ATTRIBUTION.LICENSE} |
        Support: <a href="mailto:${ATTRIBUTION.CONTACT_EMAIL}">${ATTRIBUTION.CONTACT_EMAIL}</a>
      </div>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div class="loading-overlay" id="loadingOverlay">
    <div class="loading-spinner"></div>
  </div>

  <script>
    // System configuration and data
    const SYSTEM_CONFIG = ${JSON.stringify(config)};
    const PILLARS_DATA = ${pillarsJson};
    const ATTRIBUTION = ${JSON.stringify(ATTRIBUTION)};

    // Application state
    let currentBehaviorType = 'goodnews';
    let selectedPillars = new Set();
    let selectedBehaviors = new Set();
    let selectedLocation = '';

    // Initialize application
    document.addEventListener('DOMContentLoaded', function() {
      initializeApp();
    });

    function initializeApp() {
      console.log('%c Student Behavior Management System ', 'background: var(--primary-color); color: white; padding: 4px 8px; border-radius: 3px;');
      console.log('Created by: ' + ATTRIBUTION.CREATED_BY);
      console.log('Version: ' + ATTRIBUTION.VERSION);

      // Initialize components
      setupEventListeners();
      loadPillars();
      loadTeacherName();
      updateBehaviorType();
    }

    function setupEventListeners() {
      // Behavior type selection
      document.querySelectorAll('.toggle-button[data-type]').forEach(button => {
        button.addEventListener('click', function() {
          if (!this.classList.contains('active')) {
            document.querySelectorAll('.toggle-button[data-type]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentBehaviorType = this.dataset.type;
            document.getElementById('behaviorType').value = currentBehaviorType;
            updateBehaviorType();
          }
        });
      });

      // Student lookup
      document.getElementById('lookupButton').addEventListener('click', performStudentLookup);

      // Location selection
      document.querySelectorAll('.location-button').forEach(button => {
        button.addEventListener('click', function() {
          selectLocation(this.dataset.location);
        });
      });

      // Other location input
      document.getElementById('otherLocationText').addEventListener('input', function() {
        if (selectedLocation === 'Other') {
          document.getElementById('location').value = this.value;
        }
      });

      // Form submission
      document.getElementById('behaviorForm').addEventListener('submit', handleFormSubmit);

      // Real-time validation
      document.getElementById('studentFirst').addEventListener('input', clearSuggestions);
      document.getElementById('studentLast').addEventListener('input', clearSuggestions);
    }

    function loadPillars() {
      const container = document.getElementById('pillarsContainer');
      container.innerHTML = '';

      PILLARS_DATA.forEach((pillar, index) => {
        const pillarElement = document.createElement('div');
        pillarElement.className = 'pillar-button';
        pillarElement.style.borderColor = pillar.color;
        pillarElement.style.color = pillar.color;
        pillarElement.dataset.index = index;

        pillarElement.innerHTML = \`
          <div class="pillar-icon">\${pillar.iconSymbol}</div>
          <div>\${pillar.name}</div>
        \`;

        pillarElement.addEventListener('click', function() {
          togglePillar(index);
        });

        container.appendChild(pillarElement);
      });
    }

    function togglePillar(index) {
      const pillarElement = document.querySelector(\`[data-index="\${index}"]\`);
      const pillar = PILLARS_DATA[index];

      if (selectedPillars.has(index)) {
        selectedPillars.delete(index);
        pillarElement.classList.remove('active');
        pillarElement.style.backgroundColor = 'var(--surface-color)';
        pillarElement.style.color = pillar.color;
      } else {
        selectedPillars.add(index);
        pillarElement.classList.add('active');
        pillarElement.style.backgroundColor = pillar.color;
        pillarElement.style.color = 'white';
      }

      updateBehaviors();
    }

    function updateBehaviorType() {
      selectedBehaviors.clear();
      updateBehaviors();
    }

    function updateBehaviors() {
      const container = document.getElementById('behaviorsContainer');

      if (selectedPillars.size === 0) {
        container.innerHTML = \`
          <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
            Select character pillars above to see relevant behaviors
          </p>
        \`;
        return;
      }

      container.innerHTML = '';

      const columnsContainer = document.createElement('div');
      columnsContainer.className = 'behavior-columns';

      selectedPillars.forEach(pillarIndex => {
        const pillar = PILLARS_DATA[pillarIndex];
        const behaviors = currentBehaviorType === 'goodnews' ?
          pillar.positiveBehaviors :
          pillar.negativeBehaviors;

        const column = document.createElement('div');
        column.className = 'behavior-column';

        const header = document.createElement('div');
        header.className = 'behavior-column-header';
        header.textContent = pillar.name;
        header.style.backgroundColor = pillar.color;

        const list = document.createElement('div');
        list.className = 'behavior-list';

        behaviors.forEach(behavior => {
          const item = document.createElement('div');
          item.className = 'behavior-item';
          item.textContent = behavior;
          item.dataset.behavior = behavior;
          item.dataset.pillar = pillar.name;

          item.addEventListener('click', function() {
            toggleBehavior(behavior, item);
          });

          // Restore selection if previously selected
          if (selectedBehaviors.has(behavior)) {
            item.classList.add('selected');
          }

          list.appendChild(item);
        });

        column.appendChild(header);
        column.appendChild(list);
        columnsContainer.appendChild(column);
      });

      container.appendChild(columnsContainer);
    }

    function toggleBehavior(behavior, element) {
      if (selectedBehaviors.has(behavior)) {
        selectedBehaviors.delete(behavior);
        element.classList.remove('selected');
      } else {
        selectedBehaviors.add(behavior);
        element.classList.add('selected');
      }
    }

    function selectLocation(location) {
      // Clear previous selection
      document.querySelectorAll('.location-button').forEach(btn => btn.classList.remove('active'));

      // Select new location
      document.querySelector(\`[data-location="\${location}"]\`).classList.add('active');
      selectedLocation = location;

      if (location === 'Other') {
        document.getElementById('otherLocation').style.display = 'block';
        document.getElementById('otherLocationText').focus();
        document.getElementById('location').value = document.getElementById('otherLocationText').value;
      } else {
        document.getElementById('otherLocation').style.display = 'none';
        document.getElementById('otherLocationText').value = '';
        document.getElementById('location').value = location;
      }
    }

    function performStudentLookup() {
      const firstName = document.getElementById('studentFirst').value.trim();
      const lastName = document.getElementById('studentLast').value.trim();

      if (!firstName || !lastName) {
        showStatus('Please enter both first and last name', 'warning');
        return;
      }

      showLoading(true);
      clearParentInfo();

      google.script.run
        .withSuccessHandler(handleLookupSuccess)
        .withFailureHandler(handleLookupFailure)
        .lookupStudent(firstName, lastName);
    }

    function handleLookupSuccess(result) {
      showLoading(false);

      if (result && result.success) {
        // Fill in student and parent information
        document.getElementById('studentFirst').value = result.studentFirst || '';
        document.getElementById('studentLast').value = result.studentLast || '';
        document.getElementById('studentEmail').value = result.studentEmail || '';
        document.getElementById('parent1First').value = result.parent1First || '';
        document.getElementById('parent1Last').value = result.parent1Last || '';
        document.getElementById('parent1Email').value = result.parent1Email || '';
        document.getElementById('parent2First').value = result.parent2First || '';
        document.getElementById('parent2Last').value = result.parent2Last || '';
        document.getElementById('parent2Email').value = result.parent2Email || '';

        showStatus('Student information loaded successfully!', 'success');

        // Collapse student section and expand parent section
        document.getElementById('section-student').classList.add('collapsed');
        document.getElementById('section-parent').classList.remove('collapsed');

      } else if (result && result.suggestions) {
        showSuggestions(result.suggestions);
      } else {
        showStatus(result.message || 'Student not found in directory', 'error');
      }
    }

    function handleLookupFailure(error) {
      showLoading(false);
      showStatus('Error during student lookup: ' + error.message, 'error');
    }

    function showSuggestions(suggestions) {
      const container = document.getElementById('suggestions');
      container.innerHTML = '';

      suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = \`\${suggestion.firstName} \${suggestion.lastName}\`;
        item.onclick = function() {
          document.getElementById('studentFirst').value = suggestion.firstName;
          document.getElementById('studentLast').value = suggestion.lastName;
          clearSuggestions();
          performStudentLookup();
        };
        container.appendChild(item);
      });

      container.style.display = 'block';
      showStatus('Student not found. Did you mean one of these?', 'warning');
    }

    function clearSuggestions() {
      document.getElementById('suggestions').style.display = 'none';
      clearParentInfo();
    }

    function clearParentInfo() {
      const fields = ['studentEmail', 'parent1First', 'parent1Last', 'parent1Email', 'parent2First', 'parent2Last', 'parent2Email'];
      fields.forEach(field => {
        document.getElementById(field).value = '';
      });
    }

    function loadTeacherName() {
      google.script.run
        .withSuccessHandler(function(name) {
          if (name) {
            document.getElementById('teacherName').value = name;
          }
        })
        .withFailureHandler(function(error) {
          console.log('Could not load teacher name:', error);
        })
        .getUserFullName();
    }

    function handleFormSubmit(event) {
      event.preventDefault();

      const formData = collectFormData();
      const validationErrors = validateFormData(formData);

      if (validationErrors.length > 0) {
        showStatus('Please correct the following: ' + validationErrors.join(', '), 'error');
        return;
      }

      showLoading(true);

      google.script.run
        .withSuccessHandler(handleSubmitSuccess)
        .withFailureHandler(handleSubmitFailure)
        .processWebAppFormSubmission(formData);
    }

    function collectFormData() {
      return {
        behaviorType: currentBehaviorType,
        studentFirst: document.getElementById('studentFirst').value.trim(),
        studentLast: document.getElementById('studentLast').value.trim(),
        teacherName: document.getElementById('teacherName').value.trim(),
        studentEmail: document.getElementById('studentEmail').value.trim(),
        parent1First: document.getElementById('parent1First').value.trim(),
        parent1Last: document.getElementById('parent1Last').value.trim(),
        parent1Email: document.getElementById('parent1Email').value.trim(),
        parent2First: document.getElementById('parent2First').value.trim(),
        parent2Last: document.getElementById('parent2Last').value.trim(),
        parent2Email: document.getElementById('parent2Email').value.trim(),
        selectedPillars: Array.from(selectedPillars).map(i => PILLARS_DATA[i].name),
        selectedBehaviors: Array.from(selectedBehaviors),
        location: document.getElementById('location').value.trim(),
        comments: document.getElementById('comments').value.trim()
      };
    }

    function validateFormData(data) {
      const errors = [];

      if (!data.studentFirst) errors.push('Student first name');
      if (!data.studentLast) errors.push('Student last name');
      if (!data.teacherName) errors.push('Your name');
      if (!data.parent1Email && !data.parent2Email) errors.push('At least one parent email');
      if (data.selectedPillars.length === 0) errors.push('At least one character pillar');
      if (data.selectedBehaviors.length === 0) errors.push('At least one behavior');
      if (!data.location) errors.push('Location');

      return errors;
    }

    function handleSubmitSuccess(result) {
      showLoading(false);

      if (result && result.success) {
        showStatus('Form submitted successfully! Email sent to parents.', 'success');
        resetForm();
      } else {
        showStatus(result.message || 'An error occurred during submission', 'error');
      }
    }

    function handleSubmitFailure(error) {
      showLoading(false);
      showStatus('Error submitting form: ' + error.message, 'error');
    }

    function resetForm() {
      document.getElementById('behaviorForm').reset();
      selectedPillars.clear();
      selectedBehaviors.clear();
      selectedLocation = '';

      // Reset UI elements
      document.querySelectorAll('.toggle-button[data-type]').forEach(btn => btn.classList.remove('active'));
      document.querySelector('[data-type="goodnews"]').classList.add('active');
      document.querySelectorAll('.pillar-button').forEach(btn => {
        btn.classList.remove('active');
        const pillar = PILLARS_DATA[btn.dataset.index];
        btn.style.backgroundColor = 'var(--surface-color)';
        btn.style.color = pillar.color;
      });
      document.querySelectorAll('.location-button').forEach(btn => btn.classList.remove('active'));
      document.getElementById('otherLocation').style.display = 'none';

      currentBehaviorType = 'goodnews';
      updateBehaviors();
      clearSuggestions();

      // Re-load teacher name
      loadTeacherName();
    }

    function toggleSection(sectionId) {
      const section = document.getElementById(sectionId);
      section.classList.toggle('collapsed');
    }

    function showStatus(message, type) {
      const statusElement = document.getElementById('statusMessage');
      statusElement.textContent = message;
      statusElement.className = \`status-message status-\${type}\`;
      statusElement.style.display = 'block';

      // Auto-hide success messages after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          statusElement.style.display = 'none';
        }, 5000);
      }

      // Scroll to top to ensure message is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showLoading(show) {
      document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }
  </script>
</body>
</html>
  `;
}

/**
 * Processes form submissions from the web app.
 * This function is called via google.script.run from client-side JavaScript.
 * @param {object} formData The raw data collected from the form.
 * @return {object} A result object {success: boolean, message: string, errors?: object, warnings?: object}
 */
function processWebAppFormSubmission(formData) {
  return safeExecute(function() {
    Logger.log('Received form data: ' + JSON.stringify(formData));

    // Define validation rules for the incoming formData
    // These rules should align with the structure of `formData` collected by `collectFormData()` client-side
    const validationRules = {
      behaviorType: { type: 'string', required: true, pattern: /^(goodnews|stopthink)$/, message: 'Invalid behavior type.' },
      studentFirst: { type: 'name', required: true, minLength: 2, message: 'Student first name is required and must be at least 2 characters.' },
      studentLast: { type: 'name', required: true, minLength: 2, message: 'Student last name is required and must be at least 2 characters.' },
      teacherName: { type: 'name', required: true, minLength: 2, message: 'Teacher name is required.' },
      studentEmail: { type: 'email', required: false }, // Optional, but if provided, must be valid email
      parent1Email: { type: 'email', required: function(data) { return !data.parent2Email; }, message: 'At least one parent email is required.'},
      parent2Email: { type: 'email', required: function(data) { return !data.parent1Email; }, message: 'At least one parent email is required if Parent 1 email is not provided.'},
      selectedPillars: { type: 'array', required: true, minItems: 1, message: 'At least one character pillar must be selected.' },
      selectedBehaviors: { type: 'array', required: true, minItems: 1, message: 'At least one specific behavior must be selected.' },
      location: { type: 'string', required: true, minLength: 1, message: 'Location is required.' },
      comments: { type: 'string', required: false, maxLength: 2000, warnIfMissing: true, warnIfMissingMessage: "Consider adding comments for better context." }
      // Note: parent names are not directly submitted but fetched/validated during lookup if that's the flow
    };

    // Perform validation using DataValidator
    // Ensure DataValidator.gs is part of the project and its methods are accessible.
    const validationResult = DataValidator.validateObject(formData, validationRules);

    if (!validationResult.isValid) {
      Logger.log('Form data validation failed: ' + JSON.stringify(validationResult.errors));
      // Return validation errors to the client for display
      // The client-side `handleSubmitSuccess` expects a specific structure.
      return {
        success: false,
        message: 'Validation failed. Please check the highlighted fields.',
        errors: validationResult.errors, // Send back specific field errors
        warnings: validationResult.warnings
      };
    }

    Logger.log('Form data validated successfully. Warnings: ' + JSON.stringify(validationResult.warnings));
    const validatedData = formData; // Or validationResult.validatedData if sanitization happens in validateObject

    // --- Placeholder for further processing ---
    // 1. Sanitize validatedData inputs further if necessary (e.g. DataValidator.sanitizeInput for specific fields)
    //    Example: validatedData.comments = DataValidator.sanitizeInput(validatedData.comments, 'text');
    // 2. Look up student information if not already complete and verified (e.g., using lookupStudent function)
    // 3. Record the behavior incident to the spreadsheet (e.g., using a function like `recordBehaviorToSheet(validatedData)`)
    // 4. Send email notifications (e.g., using `EmailSystem.sendBehaviorEmail(validatedData)`)

    // Simulate behavior recording and email sending for now
    // recordBehavior(validatedData); // This function would write to a sheet
    // sendNotificationEmails(validatedData); // This function would use MailApp

    // Example successful response
    return {
      success: true,
      message: `Behavior for ${validatedData.studentFirst} ${validatedData.studentLast} recorded successfully.`,
      warnings: validationResult.warnings
    };

  }, 'processWebAppFormSubmission'); // Context for error logging
}


/**
 * Enhanced form validation with detailed error messages
 */

function validateFormDataEnhanced(formData) {
  const errors = [];
  const warnings = [];

  // Student name validation
  if (!formData.studentFirst || formData.studentFirst.trim().length < 2) {
    errors.push({
      field: 'studentFirst',
      message: 'Student first name must be at least 2 characters long'
    });
  }

  if (!formData.studentLast || formData.studentLast.trim().length < 2) {
    errors.push({
      field: 'studentLast',
      message: 'Student last name must be at least 2 characters long'
    });
  }

  // Email validation with detailed feedback
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.parent1Email && !emailRegex.test(formData.parent1Email)) {
    errors.push({
      field: 'parent1Email',
      message: 'Parent 1 email format is invalid. Please check for typos.'
    });
  }

  // Pillar and behavior validation
  if (!formData.selectedPillars || formData.selectedPillars.length === 0) {
    errors.push({
      field: 'pillars',
      message: 'Please select at least one character pillar that relates to the behavior'
    });
  }

  if (!formData.selectedBehaviors || formData.selectedBehaviors.length === 0) {
    errors.push({
      field: 'behaviors',
      message: 'Please select at least one specific behavior from the available options'
    });
  }

  // Warning for missing optional data
  if (!formData.comments || formData.comments.trim().length < 10) {
    warnings.push({
      field: 'comments',
      message: 'Consider adding detailed comments to help parents understand the situation'
    });
  }

  return { errors, warnings };
}

/**
 * Create setup required page
 */
function createSetupRequiredPage() {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Setup Required</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
    .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    h1 { color: #ea4335; margin-bottom: 20px; }
    p { color: #666; margin-bottom: 20px; line-height: 1.6; }
    .attribution { font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚙️ System Setup Required</h1>
    <p>The Student Behavior Management System needs to be configured before it can be used.</p>
    <p>Please open the Google Spreadsheet and run the setup wizard from the "Behavior System" menu.</p>

    <div class="attribution">
      Powered by Student Behavior Management System<br>
      Created by <a href="${ATTRIBUTION.WEBSITE}">${ATTRIBUTION.CREATED_BY}</a> |
      Support: <a href="mailto:${ATTRIBUTION.CONTACT_EMAIL}">${ATTRIBUTION.CONTACT_EMAIL}</a>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Create error page
 */
function createErrorPage(errorMessage) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>System Error</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
    .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    h1 { color: #ea4335; margin-bottom: 20px; }
    .error { background: #fce8e6; color: #d93025; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .attribution { font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ System Error</h1>
    <div class="error">${errorMessage}</div>
    <p>Please contact your system administrator or try refreshing the page.</p>

    <div class="attribution">
      Powered by Student Behavior Management System<br>
      Created by <a href="${ATTRIBUTION.WEBSITE}">${ATTRIBUTION.CREATED_BY}</a> |
      Support: <a href="mailto:${ATTRIBUTION.CONTACT_EMAIL}">${ATTRIBUTION.CONTACT_EMAIL}</a>
    </div>
  </div>
</body>
</html>
  `;
}
