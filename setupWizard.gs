/**
 * ================================================================================
 * SETUP WIZARD AND SPREADSHEET STRUCTURE
 * ================================================================================
 * Functions for initial system setup and spreadsheet creation
 */

/**
 * ================================================================================
 * PROFESSIONAL HTML SETUP WIZARD - PHASE 2 ENHANCEMENT
 * ================================================================================
 * Professional guided setup interface with HTML/CSS/JavaScript
 */

/**
 * Launch the professional setup wizard - REPLACES basic setupWizard()
 */
function setupWizard() {
  // Check if already set up
  if (isSystemSetup()) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'System Already Set Up',
      'The behavior system is already configured. Would you like to run the setup wizard again to reconfigure?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  }

  // Launch the professional wizard
  launchProfessionalSetupWizard();
}

/**
 * Launch professional setup wizard interface
 */
function launchProfessionalSetupWizard() {
  const htmlOutput = HtmlService.createHtmlOutput(createProfessionalSetupWizardHTML())
    .setWidth(900)
    .setHeight(700)
    .setTitle('Student Behavior System Setup Wizard');

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Setup Wizard');
}

/**
 * Create the professional setup wizard HTML
 */
function createProfessionalSetupWizardHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <!--
    Student Behavior Management System Setup Wizard
    Created by: ${ATTRIBUTION.CREATED_BY}
    © ${ATTRIBUTION.YEAR} All rights reserved.
  -->
  <meta charset="utf-8">
  <title>Setup Wizard - Student Behavior System</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Google Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      overflow-x: hidden;
    }

    .wizard-container {
      max-width: 800px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .wizard-header {
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
      color: white;
      padding: 30px;
      text-align: center;
      position: relative;
    }

    .wizard-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="white" stop-opacity="0.1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs><ellipse cx="50" cy="0" rx="50" ry="20" fill="url(%23a)"/></svg>') no-repeat center top;
      opacity: 0.3;
    }

    .wizard-header h1 {
      font-size: 28px;
      font-weight: 300;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }

    .wizard-header p {
      font-size: 16px;
      opacity: 0.9;
      position: relative;
      z-index: 1;
    }

    .attribution {
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
      color: white;
      padding: 15px 20px;
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
    }

    .attribution .main-line {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .attribution .sub-line {
      font-size: 13px;
      opacity: 0.9;
    }

    .progress-container {
      background: #f8f9fa;
      padding: 0 30px;
      border-bottom: 1px solid #e0e0e0;
    }

    .progress-bar {
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      overflow: hidden;
      margin: 20px 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4285f4, #34a853);
      width: 0%;
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .step-indicator {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
      opacity: 0.5;
      transition: all 0.3s ease;
    }

    .step-indicator.active {
      color: #4285f4;
      opacity: 1;
      font-weight: 500;
    }

    .step-indicator.completed {
      color: #34a853;
      opacity: 1;
    }

    .step-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e0e0e0;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      margin-right: 8px;
      transition: all 0.3s ease;
    }

    .step-indicator.active .step-number {
      background: #4285f4;
    }

    .step-indicator.completed .step-number {
      background: #34a853;
    }

    .wizard-content {
      padding: 40px;
    }

    .step {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .step.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .step h2 {
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 8px;
      color: #1a73e8;
    }

    .step-description {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: #333;
      font-size: 14px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #4285f4;
      box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-row .form-group {
      flex: 1;
    }

    .help-text {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
      line-height: 1.4;
    }

    .admin-list {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-top: 16px;
      max-height: 200px;
      overflow-y: auto;
    }

    .admin-item {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .admin-item:last-child {
      border-bottom: none;
    }

    .admin-info strong {
      color: #1a73e8;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn-primary {
      background: #1a73e8;
      color: white;
    }

    .btn-primary:hover {
      background: #1557b0;
      box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background: #e8f0fe;
      border-color: #1a73e8;
    }

    .btn-success {
      background: #34a853;
      color: white;
    }

    .btn-success:hover {
      background: #2d8f47;
      box-shadow: 0 2px 8px rgba(52, 168, 83, 0.3);
    }

    .btn-remove {
      background: #ea4335;
      color: white;
      padding: 8px 16px;
      font-size: 12px;
    }

    .btn-remove:hover {
      background: #d33b2c;
    }

    .wizard-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }

    .pillar-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .pillar-card:hover {
      border-color: #4285f4;
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.1);
    }

    .pillar-card.selected {
      border-color: #4285f4;
      background: #f8f9ff;
    }

    .pillar-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .pillar-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 16px;
    }

    .pillar-name {
      font-weight: 600;
      font-size: 16px;
    }

    .pillar-description {
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    .summary-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .summary-section h3 {
      margin-bottom: 12px;
      color: #1a73e8;
      font-size: 16px;
    }

    .summary-item {
      margin-bottom: 8px;
      font-size: 14px;
    }

    .summary-item strong {
      color: #333;
    }

    .loading {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top: 4px solid #4285f4;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .success-icon {
      width: 64px;
      height: 64px;
      background: #34a853;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
      font-size: 32px;
    }

    .error-message {
      background: #fce8e6;
      color: #d93025;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #d93025;
    }

    .validation-error {
      color: #d93025;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-group.error input,
    .form-group.error select {
      border-color: #d93025;
    }
  </style>
</head>
<body>
  <div class="wizard-container">
    <div class="wizard-header">
      <h1>Student Behavior System Setup</h1>
      <p>Configure your school's behavior management system in just a few steps</p>
    </div>

    <div class="attribution">
      <div class="main-line">
        🎓 Created by ${ATTRIBUTION.CREATED_BY} | Educational Technology Innovation
      </div>
      <div class="sub-line">
        Empowering schools with free, professional behavior management tools |
        v${ATTRIBUTION.VERSION} |
        Support: ${ATTRIBUTION.CONTACT_EMAIL}
      </div>
    </div>

    <div class="progress-container">
      <div class="progress-steps">
        <div class="step-indicator active" data-step="1">
          <div class="step-number">1</div>
          <span>School Info</span>
        </div>
        <div class="step-indicator" data-step="2">
          <div class="step-number">2</div>
          <span>Administrators</span>
        </div>
        <div class="step-indicator" data-step="3">
          <div class="step-number">3</div>
          <span>Email Settings</span>
        </div>
        <div class="step-indicator" data-step="4">
          <div class="step-number">4</div>
          <span>Character Pillars</span>
        </div>
        <div class="step-indicator" data-step="5">
          <div class="step-number">5</div>
          <span>Review & Complete</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
    </div>

    <div class="wizard-content">
      <!-- Step 1: School Information -->
      <div class="step active" id="step1">
        <h2>School Information</h2>
        <p class="step-description">Let's start by setting up your school's basic information and branding.</p>

        <div class="form-group">
          <label for="schoolName">School Name *</label>
          <input type="text" id="schoolName" placeholder="e.g., Lincoln High School" required>
          <div class="help-text">This will appear in emails and throughout the system</div>
          <div class="validation-error" id="schoolNameError"></div>
        </div>

        <div class="form-group">
          <label for="districtName">District Name (Optional)</label>
          <input type="text" id="districtName" placeholder="e.g., Springfield School District">
          <div class="help-text">Will be displayed alongside the school name</div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="primaryColor">Primary Color</label>
            <input type="color" id="primaryColor" value="#4285f4">
            <div class="help-text">Used for branding throughout the system</div>
          </div>
          <div class="form-group">
            <label for="logoUrl">Logo URL (Optional)</label>
            <input type="url" id="logoUrl" placeholder="https://school.edu/logo.png">
            <div class="help-text">Direct link to your school logo image</div>
            <div class="validation-error" id="logoUrlError"></div>
          </div>
        </div>
      </div>

      <!-- Step 2: Administrators -->
      <div class="step" id="step2">
        <h2>Administrator Setup</h2>
        <p class="step-description">Add administrators who should receive copies of behavior notifications.</p>

        <div class="form-row">
          <div class="form-group">
            <label for="adminTitle">Administrator Title</label>
            <input type="text" id="adminTitle" placeholder="e.g., Principal, Vice Principal">
            <div class="validation-error" id="adminTitleError"></div>
          </div>
          <div class="form-group">
            <label for="adminEmail">Email Address</label>
            <input type="email" id="adminEmail" placeholder="principal@school.edu">
            <div class="validation-error" id="adminEmailError"></div>
          </div>
        </div>

        <button type="button" class="btn btn-secondary" onclick="addAdministrator()">Add Administrator</button>

        <div class="admin-list" id="adminList" style="display: none;">
          <!-- Administrators will be added here -->
        </div>

        <div class="help-text" style="margin-top: 16px;">
          You can add up to 5 administrators. Each can be individually included or excluded from email notifications.
        </div>
        <div class="validation-error" id="adminListError"></div>
      </div>

      <!-- Step 3: Email Settings -->
      <div class="step" id="step3">
        <h2>Email Configuration</h2>
        <p class="step-description">Customize the email subjects that will be sent to parents.</p>

        <div class="form-group">
          <label for="goodNewsSubject">Good News Email Subject</label>
          <input type="text" id="goodNewsSubject" value="Good News - Positive Behavior Recognition" maxlength="100">
          <div class="help-text">Subject line for emails about positive behaviors</div>
          <div class="validation-error" id="goodNewsSubjectError"></div>
        </div>

        <div class="form-group">
          <label for="stopThinkSubject">Stop & Think Email Subject</label>
          <input type="text" id="stopThinkSubject" value="Behavior Update - Opportunity for Growth" maxlength="100">
          <div class="help-text">Subject line for emails about behaviors needing improvement</div>
          <div class="validation-error" id="stopThinkSubjectError"></div>
        </div>
      </div>

      <!-- Step 4: Character Pillars -->
      <div class="step" id="step4">
        <h2>Character Pillars</h2>
        <p class="step-description">Choose the character education framework for your school. You can customize behaviors later.</p>

        <div class="pillars-grid" id="pillarsGrid">
          <!-- Pillars will be populated by JavaScript -->
        </div>

        <div class="help-text" style="margin-top: 20px;">
          All pillars are selected by default. You can customize the specific behaviors for each pillar after setup is complete.
        </div>
        <div class="validation-error" id="pillarsError"></div>
      </div>

      <!-- Step 5: Review & Complete -->
      <div class="step" id="step5">
        <h2>Review & Complete Setup</h2>
        <p class="step-description">Please review your configuration before completing the setup.</p>

        <div id="configSummary">
          <!-- Summary will be populated by JavaScript -->
        </div>

        <div id="setupStatus" style="display: none;">
          <div class="loading">
            <div class="spinner"></div>
            <p>Setting up your behavior management system...</p>
            <p><small>This may take a few moments</small></p>
          </div>
        </div>

        <div id="setupComplete" style="display: none;">
          <div style="text-align: center;">
            <div class="success-icon">✓</div>
            <h3 style="color: #34a853; margin-bottom: 16px;">Setup Complete!</h3>
            <p>Your Student Behavior System has been successfully configured.</p>
            <p><strong>Next steps:</strong></p>
            <ul style="text-align: left; margin: 20px 0; padding-left: 20px;">
              <li>Add student data to the Directory sheet</li>
              <li>Deploy the web app for teacher access</li>
              <li>Test the system with sample data</li>
            </ul>
            <button type="button" class="btn btn-primary" onclick="google.script.host.close()">Close Setup</button>
          </div>
        </div>

        <div id="setupError" style="display: none;">
          <div class="error-message">
            <strong>Setup Error:</strong> <span id="errorMessage"></span>
          </div>
          <button type="button" class="btn btn-secondary" onclick="retrySetup()">Try Again</button>
        </div>
      </div>

      <div class="wizard-actions">
        <button type="button" class="btn btn-secondary" id="prevBtn" onclick="previousStep()" style="display: none;">Previous</button>
        <div></div>
        <button type="button" class="btn btn-primary" id="nextBtn" onclick="nextStep()">Next</button>
        <button type="button" class="btn btn-success" id="completeBtn" onclick="completeSetup()" style="display: none;">Complete Setup</button>
      </div>
    </div>
  </div>

  <script>
    // Pass server-side data to client
    const DEFAULT_PILLARS = ${JSON.stringify(DEFAULT_PILLARS)};
    const ATTRIBUTION = ${JSON.stringify(ATTRIBUTION)};

    let currentStep = 1;
    const totalSteps = 5;
    let administrators = [];
    let selectedPillars = [];

    // Initialize the wizard
    document.addEventListener('DOMContentLoaded', function() {
      initializePillars();
      updateProgress();
      validateStep(1); // Initial validation
    });

    function initializePillars() {
      const pillarsGrid = document.getElementById('pillarsGrid');
      pillarsGrid.innerHTML = '';

      DEFAULT_PILLARS.forEach((pillar, index) => {
        const pillarCard = document.createElement('div');
        pillarCard.className = 'pillar-card selected';
        pillarCard.onclick = () => togglePillar(index);

        pillarCard.innerHTML = \`
          <div class="pillar-header">
            <div class="pillar-icon" style="background-color: \${pillar.color}; color: white;">
              \${pillar.iconSymbol}
            </div>
            <div class="pillar-name">\${pillar.name}</div>
          </div>
          <div class="pillar-description">\${pillar.description}</div>
        \`;

        pillarsGrid.appendChild(pillarCard);
        selectedPillars.push(index);
      });
    }

    function togglePillar(index) {
      const pillarCards = document.querySelectorAll('.pillar-card');
      const card = pillarCards[index];

      if (selectedPillars.includes(index)) {
        selectedPillars = selectedPillars.filter(i => i !== index);
        card.classList.remove('selected');
      } else {
        selectedPillars.push(index);
        card.classList.add('selected');
      }

      validateStep(4);
    }

    function addAdministrator() {
      const title = document.getElementById('adminTitle').value.trim();
      const email = document.getElementById('adminEmail').value.trim();

      // Clear previous errors
      clearFieldError('adminTitle');
      clearFieldError('adminEmail');
      clearFieldError('adminList');

      let hasError = false;

      if (!title) {
        showFieldError('adminTitle', 'Title is required');
        hasError = true;
      }

      if (!email) {
        showFieldError('adminEmail', 'Email is required');
        hasError = true;
      } else if (!isValidEmail(email)) {
        showFieldError('adminEmail', 'Please enter a valid email address');
        hasError = true;
      }

      if (administrators.length >= 5) {
        showFieldError('adminList', 'Maximum of 5 administrators allowed');
        hasError = true;
      }

      if (hasError) return;

      administrators.push({ title, email });

      // Clear inputs
      document.getElementById('adminTitle').value = '';
      document.getElementById('adminEmail').value = '';

      updateAdminList();
      validateStep(2);
    }

    function removeAdministrator(index) {
      administrators.splice(index, 1);
      updateAdminList();
      validateStep(2);
    }

    function updateAdminList() {
      const adminList = document.getElementById('adminList');

      if (administrators.length === 0) {
        adminList.style.display = 'none';
        return;
      }

      adminList.style.display = 'block';
      adminList.innerHTML = administrators.map((admin, index) => \`
        <div class="admin-item">
          <div class="admin-info">
            <strong>\${admin.title}</strong><br>
            <span style="color: #666;">\${admin.email}</span>
          </div>
          <button type="button" class="btn btn-remove" onclick="removeAdministrator(\${index})">Remove</button>
        </div>
      \`).join('');
    }

    function nextStep() {
      if (!validateStep(currentStep)) return;

      if (currentStep < totalSteps) {
        // Hide current step
        document.getElementById(\`step\${currentStep}\`).classList.remove('active');

        // Update step indicators
        document.querySelector(\`[data-step="\${currentStep}"]\`).classList.add('completed');
        document.querySelector(\`[data-step="\${currentStep}"]\`).classList.remove('active');

        currentStep++;

        // Show next step
        document.getElementById(\`step\${currentStep}\`).classList.add('active');
        document.querySelector(\`[data-step="\${currentStep}"]\`).classList.add('active');

        updateProgress();
        updateNavigation();

        if (currentStep === 5) {
          generateSummary();
        }
      }
    }

    function previousStep() {
      if (currentStep > 1) {
        // Hide current step
        document.getElementById(\`step\${currentStep}\`).classList.remove('active');
        document.querySelector(\`[data-step="\${currentStep}"]\`).classList.remove('active');

        currentStep--;

        // Show previous step
        document.getElementById(\`step\${currentStep}\`).classList.add('active');
        document.querySelector(\`[data-step="\${currentStep}"]\`).classList.add('active');
        document.querySelector(\`[data-step="\${currentStep}"]\`).classList.remove('completed');

        updateProgress();
        updateNavigation();
      }
    }

    function updateProgress() {
      const progressFill = document.getElementById('progressFill');
      const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressFill.style.width = percentage + '%';
    }

    function updateNavigation() {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const completeBtn = document.getElementById('completeBtn');

      prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
      nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
      completeBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    }

    function validateStep(step) {
      let isValid = true;

      // Clear all errors for this step first
      clearStepErrors(step);

      switch (step) {
        case 1:
          const schoolName = document.getElementById('schoolName').value.trim();
          if (!schoolName) {
            showFieldError('schoolName', 'School name is required');
            isValid = false;
          }

          const logoUrl = document.getElementById('logoUrl').value.trim();
          if (logoUrl && !isValidUrl(logoUrl)) {
            showFieldError('logoUrl', 'Please enter a valid URL');
            isValid = false;
          }
          break;

        case 2:
          if (administrators.length === 0) {
            showFieldError('adminList', 'Please add at least one administrator');
            isValid = false;
          }
          break;

        case 3:
          const goodNewsSubject = document.getElementById('goodNewsSubject').value.trim();
          const stopThinkSubject = document.getElementById('stopThinkSubject').value.trim();

          if (!goodNewsSubject) {
            showFieldError('goodNewsSubject', 'Good news subject is required');
            isValid = false;
          }

          if (!stopThinkSubject) {
            showFieldError('stopThinkSubject', 'Stop & think subject is required');
            isValid = false;
          }
          break;

        case 4:
          if (selectedPillars.length === 0) {
            showFieldError('pillars', 'Please select at least one character pillar');
            isValid = false;
          }
          break;
      }

      return isValid;
    }

    function clearStepErrors(step) {
      const stepElement = document.getElementById(\`step\${step}\`);
      stepElement.querySelectorAll('.validation-error').forEach(error => {
        error.textContent = '';
      });
      stepElement.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
    }

    function showFieldError(fieldId, message) {
      const errorElement = document.getElementById(fieldId + 'Error');
      if (errorElement) {
        errorElement.textContent = message;
      }

      const fieldElement = document.getElementById(fieldId);
      if (fieldElement) {
        fieldElement.closest('.form-group').classList.add('error');
      }
    }

    function clearFieldError(fieldId) {
      const errorElement = document.getElementById(fieldId + 'Error');
      if (errorElement) {
        errorElement.textContent = '';
      }

      const fieldElement = document.getElementById(fieldId);
      if (fieldElement) {
        fieldElement.closest('.form-group').classList.remove('error');
      }
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }

    function generateSummary() {
      const summary = document.getElementById('configSummary');
      const schoolName = document.getElementById('schoolName').value.trim();
      const districtName = document.getElementById('districtName').value.trim();
      const primaryColor = document.getElementById('primaryColor').value;
      const logoUrl = document.getElementById('logoUrl').value.trim();
      const goodNewsSubject = document.getElementById('goodNewsSubject').value.trim();
      const stopThinkSubject = document.getElementById('stopThinkSubject').value.trim();

      const selectedPillarNames = selectedPillars.map(i => DEFAULT_PILLARS[i].name);

      summary.innerHTML = \`
        <div class="summary-section">
          <h3>School Information</h3>
          <div class="summary-item"><strong>School:</strong> \${schoolName}</div>
          \${districtName ? \`<div class="summary-item"><strong>District:</strong> \${districtName}</div>\` : ''}
          <div class="summary-item"><strong>Primary Color:</strong> <span style="color: \${primaryColor}">●</span> \${primaryColor}</div>
          \${logoUrl ? \`<div class="summary-item"><strong>Logo:</strong> \${logoUrl}</div>\` : ''}
        </div>

        <div class="summary-section">
          <h3>Administrators (\${administrators.length})</h3>
          \${administrators.map(admin => \`<div class="summary-item"><strong>\${admin.title}:</strong> \${admin.email}</div>\`).join('')}
        </div>

        <div class="summary-section">
          <h3>Email Configuration</h3>
          <div class="summary-item"><strong>Good News Subject:</strong> \${goodNewsSubject}</div>
          <div class="summary-item"><strong>Stop & Think Subject:</strong> \${stopThinkSubject}</div>
        </div>

        <div class="summary-section">
          <h3>Character Pillars (\${selectedPillarNames.length})</h3>
          <div class="summary-item">\${selectedPillarNames.join(', ')}</div>
        </div>
      \`;
    }

    function completeSetup() {
      // Show loading state
      document.getElementById('configSummary').style.display = 'none';
      document.getElementById('setupStatus').style.display = 'block';
      document.getElementById('completeBtn').disabled = true;

      // Collect all configuration data
      const config = {
        schoolConfig: {
          schoolName: document.getElementById('schoolName').value.trim(),
          districtName: document.getElementById('districtName').value.trim(),
          primaryColor: document.getElementById('primaryColor').value,
          logoUrl: document.getElementById('logoUrl').value.trim()
        },
        adminConfig: administrators,
        emailConfig: {
          goodNewsSubject: document.getElementById('goodNewsSubject').value.trim(),
          stopThinkSubject: document.getElementById('stopThinkSubject').value.trim()
        },
        pillarConfig: {
          useDefaults: true,
          pillars: selectedPillars.map(i => DEFAULT_PILLARS[i])
        }
      };

      // Call server-side setup function
      google.script.run
        .withSuccessHandler(onSetupSuccess)
        .withFailureHandler(onSetupFailure)
        .completeProfessionalWizardSetup(config);
    }

    function onSetupSuccess(result) {
      document.getElementById('setupStatus').style.display = 'none';
      if (result && result.success) {
        document.getElementById('setupComplete').style.display = 'block';
      } else {
        document.getElementById('errorMessage').textContent = result ? result.message : 'Unknown error occurred';
        document.getElementById('setupError').style.display = 'block';
        document.getElementById('completeBtn').disabled = false;
      }
    }

    function onSetupFailure(error) {
      document.getElementById('setupStatus').style.display = 'none';
      document.getElementById('errorMessage').textContent = error.message || error.toString();
      document.getElementById('setupError').style.display = 'block';
      document.getElementById('completeBtn').disabled = false;
    }

    function retrySetup() {
      document.getElementById('setupError').style.display = 'none';
      document.getElementById('configSummary').style.display = 'block';
      document.getElementById('completeBtn').disabled = false;
    }

    // Add real-time validation
    document.addEventListener('input', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        validateStep(currentStep);
      }
    });
  </script>
</body>
</html>
  `;
}

/**
 * Server-side function to complete professional wizard setup
 */
function completeProfessionalWizardSetup(config) {
  try {
    // Create spreadsheet structure
    createSpreadsheetStructure();

    // Save configuration
    saveConfiguration(config.schoolConfig, config.adminConfig, config.emailConfig, config.pillarConfig);

    // Mark setup as complete
    PropertiesService.getScriptProperties().setProperties({
      'SETUP_COMPLETE': 'true',
      'SETUP_DATE': new Date().toISOString(),
      'WIZARD_VERSION': 'professional'
    });

    // Create menu
    createBehaviorSystemMenu();

    // Log successful setup
    Logger.log('Professional setup wizard completed successfully');
    Logger.log('School: ' + config.schoolConfig.schoolName);
    Logger.log('Administrators: ' + config.adminConfig.length);
    Logger.log('Pillars: ' + config.pillarConfig.pillars.length);

    return { success: true, message: 'Setup completed successfully!' };

  } catch (error) {
    Logger.log('Professional setup error: ' + error.toString());
    return { success: false, message: error.message };
  }
}

/**
 * Create the spreadsheet structure
 */
function createSpreadsheetStructure() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create required sheets
  Object.values(SYSTEM_CONFIG.SHEETS).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Clear existing content
    sheet.clear();

    // Set up each sheet based on its purpose
    setupSheet(sheet, sheetName);
  });
}

/**
 * Set up individual sheets
 */
function setupSheet(sheet, sheetName) {
  switch (sheetName) {
    case SYSTEM_CONFIG.SHEETS.CONFIG:
      setupConfigSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.DIRECTORY:
      setupDirectorySheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.BEHAVIOR_FORM:
      setupBehaviorFormSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.PILLARS:
      setupPillarsSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.ADMIN_CONTACTS:
      setupAdminContactsSheet(sheet);
      break;
    case SYSTEM_CONFIG.SHEETS.ATTRIBUTION:
      setupAttributionSheet(sheet);
      break;
  }
}

/**
 * Set up configuration sheet
 */
function setupConfigSheet(sheet) {
  const headers = [['Setting', 'Value', 'Description']];
  sheet.getRange(1, 1, 1, 3).setValues(headers);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 400);
}

/**
 * Set up directory sheet
 */
function setupDirectorySheet(sheet) {
  const headers = [[
    'Student First', 'Student Last', 'Grade', 'Student Email',
    'Parent1 First', 'Parent1 Last', 'Parent1 Email',
    'Parent2 First', 'Parent2 Last', 'Parent2 Email'
  ]];

  sheet.getRange(1, 1, 1, 10).setValues(headers);
  sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 10);

  // Add sample data
  const sampleData = [
    ['John', 'Smith', '7', 'john.smith@school.edu', 'Jane', 'Smith', 'jane.smith@email.com', 'Bob', 'Smith', 'bob.smith@email.com'],
    ['Sarah', 'Johnson', '8', 'sarah.johnson@school.edu', 'Mary', 'Johnson', 'mary.johnson@email.com', '', '', '']
  ];

  sheet.getRange(2, 1, 2, 10).setValues(sampleData);
  sheet.getRange(2, 1, 2, 10).setFontStyle('italic');
}

/**
 * Set up behavior form sheet
 */
function setupBehaviorFormSheet(sheet) {
  const headers = [[
    'Timestamp', 'Teacher Email', 'Student First', 'Student Last', 'Behavior Type',
    'Location', 'Selected Pillars', 'Selected Behaviors', 'Comments', 'Reserved1', 'Reserved2',
    'Student Email', 'Parent1 First', 'Parent1 Last', 'Parent1 Email',
    'Parent2 First', 'Parent2 Last', 'Parent2 Email', 'Admin CC Info', 'Reserved3'
  ]];

  sheet.getRange(1, 1, 1, 20).setValues(headers);
  sheet.getRange(1, 1, 1, 20).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 20);
}

/**
 * Set up pillars sheet
 */
function setupPillarsSheet(sheet) {
  const headers = [['Pillar Name', 'Color', 'Icon', 'Description', 'Positive Behaviors', 'Negative Behaviors']];
  sheet.getRange(1, 1, 1, 6).setValues(headers);
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#f0f0f0');

  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 400);
  sheet.setColumnWidth(6, 400);
}

/**
 * Set up admin contacts sheet
 */
function setupAdminContactsSheet(sheet) {
  const headers = [['Title', 'Email', 'Include in CC', 'Notes']];
  sheet.getRange(1, 1, 1, 4).setValues(headers);
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#f0f0f0');
  sheet.autoResizeColumns(1, 4);
}

/**
 * Set up attribution sheet
 */
function setupAttributionSheet(sheet) {
  const attributionData = [
    ['Student Behavior Management System', '', ''],
    ['', '', ''],
    ['Created by:', ATTRIBUTION.CREATED_BY, ''],
    ['Department:', ATTRIBUTION.DEPARTMENT, ''],
    ['Contact Email:', ATTRIBUTION.CONTACT_EMAIL, ''],
    ['Support Phone:', ATTRIBUTION.SUPPORT_PHONE, ''],
    ['Website:', ATTRIBUTION.WEBSITE, ''],
    ['Version:', ATTRIBUTION.VERSION, ''],
    ['Year:', ATTRIBUTION.YEAR, ''],
    ['License:', ATTRIBUTION.LICENSE, '']
  ];

  sheet.getRange(1, 1, attributionData.length, 3).setValues(attributionData);
  sheet.getRange(1, 1).setFontSize(18).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  sheet.getRange(3, 1, 8, 1).setFontWeight('bold');
  sheet.autoResizeColumns(1, 3);

  // Protect the sheet
  const protection = sheet.protect().setDescription('System attribution - do not modify');
  protection.setWarningOnly(true);
}

/**
 * Save configuration to sheets and properties
 */
function saveConfiguration(schoolConfig, adminConfig, emailConfig, pillarConfig) {
  // Save to Properties Service
  PropertiesService.getScriptProperties().setProperties({
    'SCHOOL_CONFIG': JSON.stringify(schoolConfig),
    'ADMIN_CONFIG': JSON.stringify(adminConfig),
    'EMAIL_CONFIG': JSON.stringify(emailConfig),
    'PILLAR_CONFIG': JSON.stringify(pillarConfig)
  });

  // Save to sheets for user editing
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Update config sheet
  const configSheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.CONFIG);
  if (configSheet) {
    const configData = [
      ['School Name', schoolConfig.schoolName, 'Name of your school'],
      ['District Name', schoolConfig.districtName, 'Name of your district'],
      ['Primary Color', schoolConfig.primaryColor, 'Primary color for branding (hex code)'],
      ['Logo URL', schoolConfig.logoUrl, 'URL to your school logo'],
      ['Good News Subject', emailConfig.goodNewsSubject, 'Subject line for positive behavior emails'],
      ['Stop Think Subject', emailConfig.stopThinkSubject, 'Subject line for improvement behavior emails'],
      ['Send Emails', 'true', 'Whether to actually send emails (true/false)'],
      ['Similarity Threshold', '3', 'Maximum typo tolerance for student name lookup'],
      ['Max Suggestions', '5', 'Maximum number of name suggestions to show']
    ];

    configSheet.getRange(2, 1, configData.length, 3).setValues(configData);
  }

  // Update admin contacts sheet
  const adminSheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.ADMIN_CONTACTS);
  if (adminSheet) {
    const adminData = adminConfig.map(admin => [admin.title, admin.email, 'Yes', '']);
    if (adminData.length > 0) {
      adminSheet.getRange(2, 1, adminData.length, 4).setValues(adminData);
    }
  }

  // Update pillars sheet
  const pillarsSheet = ss.getSheetByName(SYSTEM_CONFIG.SHEETS.PILLARS);
  if (pillarsSheet) {
    const pillarsData = pillarConfig.pillars.map(pillar => [
      pillar.name,
      pillar.color,
      pillar.iconSymbol,
      pillar.description,
      pillar.positiveBehaviors.join('\n'),
      pillar.negativeBehaviors.join('\n')
    ]);

    if (pillarsData.length > 0) {
      pillarsSheet.getRange(2, 1, pillarsData.length, 6).setValues(pillarsData);
      pillarsSheet.getRange(2, 5, pillarsData.length, 2).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    }
  }
}

/**
 * Enhanced menu with web app deployment options
 */
function createBehaviorSystemMenu() {
  const ui = SpreadsheetApp.getUi();

  if (isSystemSetup()) {
    // Full menu for configured systems
    ui.createMenu('📋 Behavior System')
      .addItem('🔧 Reconfigure System', 'setupWizard')
      .addSeparator()
      .addSubMenu(ui.createMenu('🌐 Web Application')
        .addItem('Deploy Web App', 'deployWebApp')
        .addItem('Test Web App', 'testWebAppFunctionality')
        .addItem('Open Web App (Test)', 'openWebAppForTesting')
        .addItem('Get Web App URL', 'getWebAppURL')
        .addItem('Validate Deployment Readiness', 'validateWebAppDeploymentReadiness'))
      .addSeparator()
      .addSubMenu(ui.createMenu('🧪 Testing & Validation')
        .addItem('Test Complete System', 'testCompleteSystem')
        .addItem('Test Form Submission', 'testFormSubmissionWithSampleData')
        .addItem('Test Professional Wizard', 'testProfessionalWizard')
        .addItem('Validate Configuration', 'validateCompleteConfiguration'))
      .addSeparator()
      .addItem('📊 Enhanced System Info', 'showEnhancedSystemInfo')
      .addItem('🎮 Demo Setup Wizard', 'demoSetupWizard')
      .addSeparator()
      .addItem('ℹ️ About This System', 'showSystemInfo')
      .addToUi();
  } else {
    // Basic menu for unconfigured systems
    ui.createMenu('📋 Behavior System')
      .addItem('🚀 Run Professional Setup', 'setupWizard')
      .addSeparator()
      .addItem('🧪 Test System Components', 'testWebAppFunctionality')
      .addItem('ℹ️ About This System', 'showSystemInfo')
      .addToUi();
  }
}

/**
 * Test system function
 */
function testSystem() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Test System', 'System test functionality will be implemented in Phase 2.', ui.ButtonSet.OK);
}

/**
 * Show system info
 */
function showSystemInfo() {
  const ui = SpreadsheetApp.getUi();

  ui.alert(
    'About Student Behavior Management System',
    `Student Behavior Management System v${ATTRIBUTION.VERSION}\n\n` +
    `Created by: ${ATTRIBUTION.CREATED_BY}\n` +
    `Department: ${ATTRIBUTION.DEPARTMENT}\n` +
    `Year: ${ATTRIBUTION.YEAR}\n\n` +
    `📧 Support: ${ATTRIBUTION.CONTACT_EMAIL}\n` +
    `📞 Phone: ${ATTRIBUTION.SUPPORT_PHONE}\n` +
    `🌐 Website: ${ATTRIBUTION.WEBSITE}\n\n` +
    `© ${ATTRIBUTION.YEAR} ${ATTRIBUTION.CREATED_BY}. All rights reserved.`,
    ui.ButtonSet.OK
  );
}

/**
 * OnOpen function
 */
function onOpen() {
  if (isSystemSetup()) {
    createBehaviorSystemMenu();
  } else {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('📋 Behavior System')
      .addItem('🚀 Run Setup Wizard', 'setupWizard')
      .addItem('ℹ️ About This System', 'showSystemInfo')
      .addToUi();
  }
}
