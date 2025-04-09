// Levenshtein Distance Function (needed for lookupStudent)
/**
 * Calculates the Levenshtein distance between two strings.
 * @param {string} a The first string.
 * @param {string} b The second string.
 * @returns {number} The Levenshtein distance.
 */
function calculateLevenshteinDistance(a, b) {
  // Ensure inputs are strings
  a = String(a);
  b = String(b);
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;

  var matrix = [];
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                Math.min(matrix[i][j - 1] + 1, // insertion
                                         matrix[i - 1][j] + 1)); // deletion
      }
    }
  }
  return matrix[b.length][a.length];
};


/**
 * Creates a web app that allows teachers to submit behavior forms
 * and send emails directly from their accounts.
 */
function doGet(e) {
  // Log parameters if needed: Logger.log(JSON.stringify(e));
  const htmlOutput = HtmlService.createHtmlOutput(createImprovedBehaviorForm()) // Use the new function
    .setTitle('Student Behavior Form - Pillars of Character')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    // Allow embedding if necessary, otherwise remove setXFrameOptionsMode
    // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  return htmlOutput;
}

/**
 * Returns an improved student behavior form with Pillar integration.
 */
function createImprovedBehaviorForm() {
  // Pass Pillar data to the client-side JavaScript
  const pillarsJson = JSON.stringify(PILLARS_DATA);

  return `
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <title>Student Behavior Form - Pillars of Character</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* --- Basic Styles --- */
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; color: #333; }
    .container { max-width: 900px; margin: 20px auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
    h1 { color: #0056b3; margin-bottom: 10px; text-align: center; font-size: 24px; }
    h2 { margin-top: 0; font-size: 18px; color: #343a40; border-bottom: 2px solid #e9ecef; padding-bottom: 8px; margin-bottom: 20px; }
    label { font-weight: 600; display: block; margin-bottom: 6px; color: #495057; font-size: 14px; }
    input[type="text"], input[type="email"], select, textarea {
      width: 100%; padding: 10px 12px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px; box-sizing: border-box; transition: border-color 0.2s;
    }
    input[type="text"]:focus, input[type="email"]:focus, textarea:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); }
    textarea { resize: vertical; min-height: 80px; }
    button { transition: background-color 0.2s ease-in-out; }

    /* --- Layout & Sections --- */
    .form-section { border: 1px solid #e0e0e0; border-radius: 8px; padding: 25px; margin-bottom: 30px; background: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .form-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; align-items: flex-end; }
    .form-group { flex: 1 1 30%; min-width: 200px; }
    .form-group-full { flex: 1 1 100%; margin-bottom: 20px; /* Add margin for spacing */ }

    /* --- Buttons --- */
    .primary-button {
      background-color: #007bff; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: 600; white-space: nowrap;
    }
    .primary-button:hover { background-color: #0056b3; }
    .primary-button:disabled { background-color: #adb5bd; cursor: not-allowed; }
    .lookup-button { margin-left: 10px; height: 40px; align-self: flex-end; margin-bottom: 1px; }

    /* --- General Toggle Buttons (like Good News/StopThink & Location) --- */
    .toggle-button-group { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
    .toggle-button {
      padding: 10px 16px; border: 1px solid #ccc; border-radius: 6px; background-color: #f8f9fa; cursor: pointer; font-weight: 500; transition: all 0.2s; text-align: center; flex-grow: 1;
      color: #495057; /* Default text color */
    }
    .toggle-button.active { background-color: #007bff; color: #fff; border-color: #007bff; font-weight: 600; }

    /* --- Pillar Buttons --- */
    /* Container: Force single row, allow scroll if needed */
    #pillarButtonsContainer {
      display: flex;          /* Use flexbox for layout */
      flex-direction: row;    /* Align items horizontally */
      flex-wrap: nowrap;      /* Prevent wrapping to next line */
      gap: 10px;              /* Space between buttons */
      margin-top: 10px;
      padding-bottom: 10px;   /* Space for scrollbar if needed */
      overflow-x: auto;       /* Enable horizontal scroll on overflow */
      -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
      width: 100%;            /* Take full container width */
      box-sizing: border-box; /* Include padding in width calculation */
    }
    .pillar-button {
      flex: 1 1 0;           /* Equal width, with ability to grow/shrink */
      padding: 8px 15px;     /* Vertical and horizontal padding */
      border-radius: 6px;    /* Rounded corners */
      cursor: pointer;       /* Hand cursor on hover */
      font-weight: 600;      /* Bold text */
      transition: all 0.2s ease-in-out; /* Smooth transition for hover/active */
      text-align: center;    /* Center text */
      font-size: 14px;       /* Text size */
      border: 2px solid;     /* Border width */
      background-color: #fff;/* Default background: white */
      white-space: nowrap;   /* Keep text on one line */
      min-width: 0;          /* Allow button to shrink below content size if needed */
      box-sizing: border-box; /* Include padding in width calculation */
    }

    /* --- Explicit INACTIVE States (Outline + Text Color) --- */
    .pillar-trustworthiness:not(.active) { border-color: #155998; color: #155998; background-color: #fff; }
    .pillar-respect:not(.active)         { border-color: #f6ba2c; color: #f6ba2c; background-color: #fff; }
    .pillar-responsibility:not(.active)  { border-color: #248554; color: #248554; background-color: #fff; }
    .pillar-fairness:not(.active)        { border-color: #ef8834; color: #ef8834; background-color: #fff; }
    .pillar-caring:not(.active)          { border-color: #dd2c3e; color: #dd2c3e; background-color: #fff; }
    .pillar-citizenship:not(.active)     { border-color: #542f90; color: #542f90; background-color: #fff; }

    /* --- Explicit ACTIVE States (Background Fill + Text Color) --- */
    .pillar-trustworthiness.active { background-color: #155998; border-color: #155998; color: #ffffff; }
    .pillar-respect.active         { background-color: #f6ba2c; border-color: #f6ba2c; color: #333333; }
    .pillar-responsibility.active  { background-color: #248554; border-color: #248554; color: #ffffff; }
    .pillar-fairness.active        { background-color: #ef8834; border-color: #ef8834; color: #ffffff; }
    .pillar-caring.active          { background-color: #dd2c3e; border-color: #dd2c3e; color: #ffffff; }
    .pillar-citizenship.active     { background-color: #542f90; border-color: #542f90; color: #ffffff; }


    /* --- Behavior Buttons --- */
    #behaviorButtonsContainer { margin-top: 15px; }
    .behavior-button-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }    
    /* Default Behavior Button Style */
    .behavior-button {
      padding: 8px 12px; 
      border-radius: 4px; 
      cursor: pointer; 
      font-weight: 500;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s;
      text-align: left; 
      font-size: 14px;
      border: 1px solid; 
      background-color: #f8f9fa;
    }

    /* --- Behavior Columns --- */
    .behavior-columns-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        width: 100%;
    }
    .behavior-column {
        flex: 1 1 200px;
        display: flex;
        flex-direction: column;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .behavior-column-header {
        padding: 8px 12px;
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid #e0e0e0;
    }
    .behavior-column .behavior-button-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        max-height: 300px;
        overflow-y: auto;
    }

    /* --- Other UI Elements --- */
    .other-input { display: none; margin-top: 10px; }
    #loadingOverlay { /* Keep existing styles */ display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); z-index: 1000; justify-content: center; align-items: center; }
    .loading-spinner { /* Keep existing styles */ border: 6px solid #f3f3f3; border-top: 6px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1.5s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .alert { padding: 15px; margin-bottom: 20px; border-radius: 5px; font-weight: 500; border: 1px solid transparent; }
    .alert-success { background-color: #d4edda; color: #155724; border-color: #c3e6cb; }
    .alert-danger { background-color: #f8d7da; color: #721c24; border-color: #f5c6cb; }
    .alert-warning { background-color: #fff3cd; color: #856404; border-color: #ffeeba; }
    .suggestion-link { color: #0056b3; text-decoration: underline; cursor: pointer; font-weight: bold; }
    .note-box { background-color: #e8f4fd; border-left: 4px solid #1a73e8; padding: 10px 15px; margin: 15px 0; font-size: 13px; border-radius: 4px; color: #004085;}
    .checkbox-group { margin-top: 10px; }
    .checkbox-label { display: inline-flex; align-items: center; margin-right: 20px; font-weight: normal; cursor: pointer; }
    .checkbox-label input { margin-right: 6px; cursor: pointer; }
    .admin-cc-options { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 15px; border: 1px solid #dee2e6; }

    /* --- Comment Suggestions --- */
    .suggestions-container {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .suggestions-label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #495057;
    }
    .suggestion-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      max-height: 150px;
      overflow-y: auto;
      padding-right: 5px;
    }
    .suggestion-chip {
      background-color: #f1f9ff;
      border: 1px solid #b8daff;
      color: #0056b3;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: normal;
      text-align: left;
      max-width: 100%;
    }
    .suggestion-chip:hover {
      background-color: #d7ecff;
      border-color: #80bdff;
    }
    .suggestion-chip.combined {
      background-color: #e7f5eb;
      border-color: #b7dfbf;
      color: #28a745;
    }
    .suggestion-chip.combined:hover {
      background-color: #d4edda;
      border-color: #9ad0a6;
    }
    .suggestions-placeholder {
      color: #6c757d;
      font-style: italic;
      padding: 6px 0;
    }

    @media (max-width: 768px) {
        .behavior-columns-container {
            flex-direction: column;
        }
        .behavior-column {
            max-width: 100%;
        }
    }
    @media (max-width: 480px) {
       h1 { font-size: 20px; }
       h2 { font-size: 16px; }
       /* Pillar buttons will scroll horizontally */
       .behavior-button-group { grid-template-columns: 1fr; } /* Single column */
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Student Behavior Form</h1>
    <div id="statusMessage"></div>

    <form id="behaviorForm">

      <!-- Step 1: Behavior Type -->
      <div class="form-section">
        <h2>Step 1: Select Behavior Context</h2>
        <div class="toggle-button-group">
          <div class="toggle-button active" data-type="goodnews">✅ Good News / Positive Behavior</div>
          <div class="toggle-button" data-type="stopthink">⚠️ Stop & Think / Needs Improvement</div>
        </div>
        <input type="hidden" id="behaviorType" name="behaviorType" value="goodnews">
        <div class="note-box">Select whether you are documenting positive behavior (Good News) or behavior that needs improvement (Stop & Think). This determines which behaviors are shown later.</div>
      </div>

      <!-- Step 2: Student Info -->
      <div class="form-section">
        <h2>Step 2: Student Information</h2>
        <div class="form-row">
          <div class="form-group">
            <label for="studentFirst">First Name*</label>
            <input type="text" id="studentFirst" name="studentFirst" required>
          </div>
          <div class="form-group">
            <label for="studentLast">Last Name*</label>
            <input type="text" id="studentLast" name="studentLast" required>
          </div>
          <button type="button" class="primary-button lookup-button" id="lookupButton">🔍 Look Up</button>
        </div>
         <div class="form-row">
           <div class="form-group">
            <label for="studentEmail">Student Email (auto-filled)</label>
            <input type="email" id="studentEmail" name="studentEmail" readonly>
          </div>
          <div class="form-group">
            <label for="teacherName">Your Name*</label>
            <input type="text" id="teacherName" name="teacherName" required>
          </div>
         </div>
      </div>

      <!-- Step 3: Parent Info -->
      <div class="form-section">
        <h2>Step 3: Parent Information (auto-filled)</h2>
        <div class="form-row">
          <div class="form-group"><label for="parent1First">Parent 1 First</label><input type="text" id="parent1First" name="parent1First" readonly></div>
          <div class="form-group"><label for="parent1Last">Parent 1 Last</label><input type="text" id="parent1Last" name="parent1Last" readonly></div>
          <div class="form-group"><label for="parent1Email">Parent 1 Email</label><input type="email" id="parent1Email" name="parent1Email" readonly></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label for="parent2First">Parent 2 First</label><input type="text" id="parent2First" name="parent2First" readonly></div>
          <div class="form-group"><label for="parent2Last">Parent 2 Last</label><input type="text" id="parent2Last" name="parent2Last" readonly></div>
          <div class="form-group"><label for="parent2Email">Parent 2 Email</label><input type="email" id="parent2Email" name="parent2Email" readonly></div>
        </div>
      </div>

      <!-- Step 4: Select Pillars -->
      <div class="form-section">
        <h2>Step 4: Select Character Pillar(s)*</h2>
        <div id="pillarButtonsContainer" class="pillar-button-container">
            <!-- Pillar buttons will be generated here by JavaScript -->
        </div>
        <div class="note-box">Select one or more character pillars related to the observed behavior.</div>
      </div>

       <!-- Step 5: Select Behaviors -->
      <div class="form-section">
         <h2>Step 5: Select Specific Behavior(s)*</h2>
         <div id="behaviorButtonsContainer">
             <p style="color: #6c757d;"><i>Select a pillar above to see relevant behaviors.</i></p>
            <!-- Behavior buttons will be generated here by JavaScript -->
         </div>
         <!-- "Other" behavior input (optional, can be added if needed) -->
         <!--
         <div class="other-input" id="behaviorOtherInput">
            <label for="behaviorOtherText">Specify "Other" Behavior:</label>
            <input type="text" placeholder="Please specify behavior" id="behaviorOtherText">
         </div>
         -->
      </div>

       <!-- Step 6: Location & Comments -->
      <div class="form-section">
        <h2>Step 6: Location & Comments</h2>
         <div class="form-group form-group-full">
           <label>Location*</label>
           <input type="hidden" id="location" name="location" required> <!-- Hidden input holds final value -->
           <div class="toggle-button-group location-buttons" data-target="location">
             <div class="toggle-button location-btn" data-value="Classroom">Classroom</div>
             <div class="toggle-button location-btn" data-value="Cafeteria">Cafeteria</div>
             <div class="toggle-button location-btn" data-value="Hallway">Hallway</div>
             <div class="toggle-button location-btn" data-value="Restroom">Restroom</div>
             <div class="toggle-button location-btn" data-value="Other" id="locationOtherBtn">Other</div>
           </div>
           <div class="other-input" id="locationOtherInput">
             <input type="text" placeholder="Please specify other location" id="locationOtherText">
           </div>
         </div>
        <div class="form-group form-group-full">
          <label for="comments">Additional Comments (Optional)</label>
          <textarea id="comments" name="comments" rows="4" placeholder="Provide specific details about what you observed. These comments will be included in the email."></textarea>
          
          <!-- Suggestions container -->
          <div class="suggestions-container">
              <div class="suggestions-label">Suggested Comments (Click to Insert):</div>
              <div id="commentSuggestions" class="suggestion-chips">
                <div class="suggestions-placeholder">Select pillars and behaviors to see personalized suggestions.</div>
              </div>
          </div>
          
          <div class="note-box">Keep comments objective and descriptive. Example: "During group work, Sarah actively listened to her peers' ideas and offered encouragement." or "John shouted out answers several times without raising his hand during the math lesson."</div>
        </div>
      </div>

      <!-- Step 7: Admin CC -->
       <div class="form-section">
        <h2>Step 7: Notify Administrators (Optional)</h2>
        <div class="form-group admin-cc-options">
          <label>CC Administrators on Parent Email:</label>
          <div class="checkbox-group">
            <label class="checkbox-label"><input type="checkbox" id="ccPrincipal" name="ccPrincipal" checked> Principal</label>
            <label class="checkbox-label"><input type="checkbox" id="ccAssociatePrincipal" name="ccAssociatePrincipal" checked> Associate Principal</label>
          </div>
           <div class="note-box">Uncheck boxes if you do NOT want specific administrators copied on the email.</div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="form-row" style="justify-content: center; margin-top: 30px;">
        <button type="submit" id="submitBtn" class="primary-button" style="padding: 12px 30px; font-size: 16px;">✅ Submit & Send Email</button>
      </div>

    </form>
  </div>

  <div id="loadingOverlay"><div class="loading-spinner"></div></div>

<script>
  // --- Make Pillar Data available to client-side JS ---
  const ALL_PILLARS_DATA = ${pillarsJson}; // Passed from server-side

  // --- Client-Side Global Variables ---
  let currentBehaviorType = 'goodnews'; // 'goodnews' or 'stopthink'
  const PILLAR_COLORS = { // Store colors for easy access in JS
    "Trustworthiness": { bg: "#155998", text: "#ffffff" }, // Changed to new blue
    "Respect":         { bg: "#f6ba2c", text: "#333333" }, // Dark text
    "Responsibility":  { bg: "#248554", text: "#ffffff" },
    "Fairness":        { bg: "#ef8834", text: "#ffffff" },
    "Caring":          { bg: "#dd2c3e", text: "#ffffff" },
    "Citizenship":     { bg: "#542f90", text: "#ffffff" },
    "default":         { bg: "#007bff", text: "#ffffff" } // Fallback blue
  };
  const DEFAULT_BEHAVIOR_BUTTON_STYLE = { // Store default styles
      background: '#f1f1f1', // Matches CSS .behavior-button default
      color: '#333',         // Matches CSS .behavior-button default
      borderColor: '#ccc'     // Matches CSS .behavior-button default
  };

  // --- Helper Functions ---
  function showStatus(message, type) {
     const statusDiv = document.getElementById('statusMessage');
     // Clear previous messages before showing a new one
     statusDiv.innerHTML = '';
     const alertDiv = document.createElement('div');
     alertDiv.className = 'alert alert-' + type;
     // Use innerHTML to allow for <br> tags in messages
     alertDiv.innerHTML = message;
     statusDiv.appendChild(alertDiv);
     // Scroll to top to make sure message is visible
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showLoading(show) {
     const loadingOverlay = document.getElementById('loadingOverlay');
     if (loadingOverlay) {
         loadingOverlay.style.display = show ? 'flex' : 'none';
     }
  }

  function clearStudentParentFields() {
    const idsToClear = ['studentEmail', 'parent1First', 'parent1Last', 'parent1Email', 'parent2First', 'parent2Last', 'parent2Email'];
    idsToClear.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    // Note: Don't reset CC checkboxes here, let the main reset handle it
  }

  // --- Pillar & Behavior Button Generation/Handling ---
  function generatePillarButtons() {
      const container = document.getElementById('pillarButtonsContainer');
      if (!container) { console.error("Pillar container not found!"); return; }
      container.innerHTML = ''; // Clear existing
      
      ALL_PILLARS_DATA.forEach(pillar => {
          const btn = document.createElement('div');
          const pillarNameLower = pillar.name.toLowerCase().replace(/\s+/g, '-');
          btn.classList.add('pillar-button', 'pillar-' + pillarNameLower);
          btn.textContent = pillar.name;
          btn.dataset.pillarName = pillar.name;
          
          // Explicitly add inline styles to ensure they render correctly
          const pillarColor = PILLAR_COLORS[pillar.name] || PILLAR_COLORS.default;
          btn.style.borderColor = pillarColor.bg;
          btn.style.color = pillarColor.bg;
          
          btn.addEventListener('click', handlePillarClick);
          container.appendChild(btn);
      });
  }

  /**
   * Handles pillar button clicks
   * Modified to preserve behavior selections when adding pillars
   */
  function handlePillarClick(event) {
      const btn = event.target;
      const pillarName = btn.dataset.pillarName;
      const pillarColor = PILLAR_COLORS[pillarName] || PILLAR_COLORS.default;
      
      // Determine if we're activating or deactivating this pillar
      const wasActive = btn.classList.contains('active');
      btn.classList.toggle('active');
      
      // Update styles based on new state
      if (!wasActive) { // Now active
          btn.style.backgroundColor = pillarColor.bg;
          btn.style.color = pillarColor.text;
          btn.style.borderColor = pillarColor.bg;
      } else { // Now inactive
          btn.style.backgroundColor = '';
          btn.style.color = pillarColor.bg;
          btn.style.borderColor = pillarColor.bg;
      }
      
      updateBehaviorButtons(); // Regenerate behavior buttons
      
      // Only clear behavior selections if we're deactivating a pillar
      if (wasActive) {
          // We need to handle removal of behaviors associated with this pillar
          // Remove selections for behaviors that are no longer available
          document.querySelectorAll('#behaviorButtonsContainer .behavior-button.active').forEach(btn => {
              const behaviorValue = btn.dataset.value;
              const behaviorPillar = btn.dataset.pillarName;
              
              // If this behavior belongs to the deactivated pillar, deselect it
              if (behaviorPillar === pillarName) {
                  btn.classList.remove('active');
                  const pStyle = PILLAR_COLORS[behaviorPillar] || PILLAR_COLORS.default;
                  btn.style.backgroundColor = '#f8f9fa';
                  btn.style.color = pStyle.bg;
                  btn.style.borderColor = pStyle.bg;
              }
          });
      }
      
      updateCommentSuggestions(); // Update comment suggestions based on new selections
  }

  /**
   * Updates behavior buttons based on selected pillars
   * Modified to organize behaviors in vertical columns by pillar
   * and preserve selections when adding pillars
   */
  function updateBehaviorButtons() {
      const behaviorContainer = document.getElementById('behaviorButtonsContainer');
      if (!behaviorContainer) { console.error("Behavior container not found!"); return; }
      const selectedPillarNames = getSelectedPillars();
      
      // Save currently selected behaviors before clearing
      const currentlySelectedBehaviors = getSelectedBehaviors();
      
      behaviorContainer.innerHTML = ''; // Clear previous buttons/messages

      if (selectedPillarNames.length === 0) {
          behaviorContainer.innerHTML = '<p style="color: #6c757d; font-style: italic;">Select a pillar above to see relevant behaviors.</p>';
          return;
      }

      // Create a container for all behavior columns
      const columnsContainer = document.createElement('div');
      columnsContainer.className = 'behavior-columns-container';
      behaviorContainer.appendChild(columnsContainer);

      // Create each pillar's column of behaviors
      selectedPillarNames.forEach(pillarName => {
          const pillarData = ALL_PILLARS_DATA.find(p => p.name === pillarName);
          if (!pillarData) return;
          
          // Get relevant behaviors for this pillar based on behavior type
          const relevantBehaviors = (currentBehaviorType === 'goodnews') ? 
              pillarData.positiveBehaviors : 
              pillarData.negativeBehaviors;
              
          if (!relevantBehaviors || relevantBehaviors.length === 0) return;
          
          // Sort behaviors alphabetically
          const sortedBehaviors = [...relevantBehaviors].sort();
          
          // Create column container for this pillar
          const columnDiv = document.createElement('div');
          columnDiv.className = 'behavior-column';
          columnDiv.dataset.pillarName = pillarName;
          
          // Add pillar header
          const pillarHeader = document.createElement('div');
          pillarHeader.className = 'behavior-column-header';
          pillarHeader.textContent = pillarName;
          
          // Apply pillar color to header
          const pillarStyle = PILLAR_COLORS[pillarName] || PILLAR_COLORS.default;
          pillarHeader.style.backgroundColor = pillarStyle.bg;
          pillarHeader.style.color = pillarStyle.text;
          
          columnDiv.appendChild(pillarHeader);
          
          // Create buttons group for this column
          const behaviorBtnGroup = document.createElement('div');
          behaviorBtnGroup.className = 'behavior-button-group';
          
          // Add behavior buttons to this column
          sortedBehaviors.forEach(behavior => {
              const btn = document.createElement('div');
              btn.classList.add('behavior-button');
              btn.textContent = behavior;
              btn.dataset.value = behavior;
              
              // Store associated pillar and colors
              btn.dataset.pillarName = pillarName;
              btn.dataset.activeBg = pillarStyle.bg;
              btn.dataset.activeText = pillarStyle.text;
              btn.dataset.activeBorder = pillarStyle.bg;

              // Apply pillar color to text and border when not selected
              btn.style.color = pillarStyle.bg;
              btn.style.borderColor = pillarStyle.bg;
              btn.style.backgroundColor = '#f8f9fa';
              
              // Check if this behavior was previously selected
              if (currentlySelectedBehaviors.includes(behavior)) {
                  btn.classList.add('active');
                  btn.style.backgroundColor = pillarStyle.bg;
                  btn.style.color = pillarStyle.text;
                  btn.style.borderColor = pillarStyle.bg;
              }
              
              btn.addEventListener('click', handleBehaviorClick);
              behaviorBtnGroup.appendChild(btn);
          });
          
          columnDiv.appendChild(behaviorBtnGroup);
          columnsContainer.appendChild(columnDiv);
      });
  }

  /**
   * Clears active state and resets styling for all behavior buttons
   * while preserving their pillar color associations
   */
  function clearBehaviorSelectionsStyle() {
      document.querySelectorAll('#behaviorButtonsContainer .behavior-button').forEach(btn => {
          const pillarName = btn.dataset.pillarName;
          if (!pillarName) return;
          
          const pillarStyle = PILLAR_COLORS[pillarName] || PILLAR_COLORS.default;
          
          btn.classList.remove('active');
          btn.style.backgroundColor = '#f8f9fa';
          btn.style.color = pillarStyle.bg; // Use pillar color for text
          btn.style.borderColor = pillarStyle.bg;
      });
  }

  function handleBehaviorClick(event) {
      const btn = event.target;
      const wasActive = btn.classList.contains('active');
      btn.classList.toggle('active');
      
      // Get stored colors from data attributes
      const pillarName = btn.dataset.pillarName;
      const pillarStyle = PILLAR_COLORS[pillarName] || PILLAR_COLORS.default;
      
      if (!wasActive) { // Now active
          // Apply active styles
          btn.style.backgroundColor = pillarStyle.bg;
          btn.style.color = pillarStyle.text;
          btn.style.borderColor = pillarStyle.bg;
      } else { // Now inactive
          // Reset to pillar color text
          btn.style.backgroundColor = '#f8f9fa';
          btn.style.color = pillarStyle.bg;
          btn.style.borderColor = pillarStyle.bg;
      }
      
      // Update comment suggestions based on new behavior selection
      updateCommentSuggestions();
  }

  function getSelectedPillars() {
      const activePillarBtns = document.querySelectorAll('#pillarButtonsContainer .pillar-button.active');
      return Array.from(activePillarBtns).map(btn => btn.dataset.pillarName);
  }

  function getSelectedBehaviors() {
      const activeBehaviorBtns = document.querySelectorAll('#behaviorButtonsContainer .behavior-button.active');
      return Array.from(activeBehaviorBtns).map(btn => btn.dataset.value);
  }

  function resetFormSelections() {
    // Clear pillar selections - update this part
    document.querySelectorAll('#pillarButtonsContainer .pillar-button').forEach(btn => {
        // Remove active class
        btn.classList.remove('active');
        
        // Reset inline styles based on pillar type
        const pillarName = btn.dataset.pillarName;
        if (pillarName) {
            const pillarColor = PILLAR_COLORS[pillarName] || PILLAR_COLORS.default;
            // Reset to inactive state
            btn.style.backgroundColor = '';  // Clear background color
            btn.style.color = pillarColor.bg; // Set text color to pillar color
            btn.style.borderColor = pillarColor.bg; // Set border color to pillar color
        }
    });
    
    // Clear behavior selections and container message - keep this part
    document.getElementById('behaviorButtonsContainer').innerHTML = '<p style="color: #6c757d; font-style: italic;">Select a pillar above to see relevant behaviors.</p>';
    
    // Clear comment suggestions
    document.getElementById('commentSuggestions').innerHTML = '<div class="suggestions-placeholder">Select pillars and behaviors to see personalized suggestions.</div>';
    
    // Keep the rest of your existing reset function unchanged
    // Clear location and comments
    document.getElementById('location').value = '';
    // Clear location button selection visually and reset 'Other'
    document.querySelectorAll('.location-buttons .location-btn.active').forEach(btn => btn.classList.remove('active'));
    const locOtherInput = document.getElementById('locationOtherInput');
    if(locOtherInput) locOtherInput.style.display = 'none';
    const locOtherText = document.getElementById('locationOtherText');
    if(locOtherText) locOtherText.value = '';

    document.getElementById('comments').value = '';
    // Reset behavior type toggle to good news
    document.querySelectorAll('.toggle-button[data-type]').forEach(b => b.classList.remove('active'));
    const goodNewsBtn = document.querySelector('.toggle-button[data-type="goodnews"]');
    if (goodNewsBtn) goodNewsBtn.classList.add('active');
    document.getElementById('behaviorType').value = 'goodnews';
    currentBehaviorType = 'goodnews';
    // Reset CC checkboxes to default (checked)
    document.getElementById('ccPrincipal').checked = true;
    document.getElementById('ccAssociatePrincipal').checked = true;
    // Clear student/parent fields
    clearStudentParentFields();
  }

  // --- Event Listeners and Initial Setup ---
  document.addEventListener('DOMContentLoaded', function() {

       // Generate pillar buttons on load
       generatePillarButtons();

       // Setup behavior type toggle buttons
       const behaviorToggleButtons = document.querySelectorAll('.toggle-button[data-type]');
       behaviorToggleButtons.forEach(button => {
           button.addEventListener('click', function() {
               // Only update if the clicked button wasn't already active
               if (!this.classList.contains('active')) {
                   behaviorToggleButtons.forEach(b => b.classList.remove('active'));
                   this.classList.add('active');
                   currentBehaviorType = this.dataset.type;
                   document.getElementById('behaviorType').value = currentBehaviorType;
                   // Regenerate behaviors for the new context
                   updateBehaviorButtons();
                   // Deselect and restyle any previously selected behaviors
                   clearBehaviorSelectionsStyle();
               }
           });
       });

       // Auto-fetch teacher name
       try {
           google.script.run.withSuccessHandler(function(userName) {
               if (userName && document.getElementById('teacherName')) {
                   document.getElementById('teacherName').value = userName;
               }
           }).getUserFullName();
       } catch (e) { console.log('Could not automatically get teacher name:', e); }

       // Student Lookup Click Handler
       document.getElementById('lookupButton').addEventListener('click', function() {
           const firstNameInput = document.getElementById('studentFirst');
           const lastNameInput = document.getElementById('studentLast');
           const firstName = firstNameInput.value.trim();
           const lastName = lastNameInput.value.trim();

           document.getElementById('statusMessage').innerHTML = ''; // Clear status
           clearStudentParentFields(); // Clear previous parent info before lookup

           // Basic validation
           let valid = true;
           if (!firstName) { firstNameInput.style.borderColor = 'red'; valid = false; } else { firstNameInput.style.borderColor = ''; }
           if (!lastName) { lastNameInput.style.borderColor = 'red'; valid = false; } else { lastNameInput.style.borderColor = ''; }
           if (!valid) { showStatus('Please enter both student first and last name.', 'warning'); return; }

           showLoading(true);
           google.script.run
               .withFailureHandler(function(error) {
                   console.error("Lookup Failure:", error);
                   showStatus('Error during student lookup: ' + (error.message || error), 'danger');
                   showLoading(false);
               })
               .withSuccessHandler(function(result) {
                  console.log("Lookup Result:", result);
                  showLoading(false);
                  const statusDiv = document.getElementById('statusMessage');
                  statusDiv.innerHTML = ''; // Clear status again before showing result

                  if (result && result.success) {
                      // Use database version of student name, replacing user input
                      document.getElementById('studentFirst').value = result.studentFirst || '';
                      document.getElementById('studentLast').value = result.studentLast || '';
                      document.getElementById('studentEmail').value = result.studentEmail || '';
                      document.getElementById('parent1First').value = result.parent1First || '';
                      document.getElementById('parent1Last').value = result.parent1Last || '';
                      document.getElementById('parent1Email').value = result.parent1Email || '';
                      document.getElementById('parent2First').value = result.parent2First || '';
                      document.getElementById('parent2Last').value = result.parent2Last || '';
                      document.getElementById('parent2Email').value = result.parent2Email || '';
                      showStatus('Student information loaded!', 'success');
                      // Add this line to update suggestions with the new student name
                      updateCommentSuggestions();
                  } else if (result && result.suggestions && Array.isArray(result.suggestions) && result.suggestions.length > 0) {
                       // --- Suggestion Handling ---
                       clearStudentParentFields(); // Ensure fields are clear if suggestions shown
                       const alertDiv = document.createElement('div');
                       alertDiv.className = 'alert alert-warning';
                       alertDiv.appendChild(document.createTextNode('Student not found. Did you mean: '));
                       result.suggestions.forEach((suggestion, index) => {
                           const link = document.createElement('a');
                           link.href = '#';
                           link.className = 'suggestion-link';
                           link.textContent = suggestion.firstName + ' ' + suggestion.lastName;
                           link.dataset.firstname = suggestion.firstName;
                           link.dataset.lastname = suggestion.lastName;
                           link.onclick = function(e) { // Add onclick directly for simplicity here
                               e.preventDefault();
                               document.getElementById('studentFirst').value = this.dataset.firstname;
                               document.getElementById('studentLast').value = this.dataset.lastname;
                               document.getElementById('statusMessage').innerHTML = ''; // Clear suggestion message
                               document.getElementById('lookupButton').click(); // Trigger lookup
                           };
                           alertDiv.appendChild(link);
                           if (index < result.suggestions.length - 1) alertDiv.appendChild(document.createTextNode(', '));
                       });
                       alertDiv.appendChild(document.createTextNode('?'));
                       statusDiv.appendChild(alertDiv);
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                       // --- End Suggestion Handling ---
                   } else {
                       clearStudentParentFields(); // Ensure fields are clear if not found
                       showStatus(result && result.message ? result.message : 'Student not found in directory.', 'danger');
                   }
               })
               .lookupStudent(firstName, lastName);
       });

       // Suggestion Link Click Handler (Removed - handled by onclick above now)
       // document.getElementById('statusMessage').addEventListener('click', function(e) { ... });

       // Location Button Handler
       document.querySelectorAll('.location-buttons').forEach(function(group) {
           const targetInputId = group.dataset.target;
           const targetInput = document.getElementById(targetInputId);
           const otherInputContainer = document.getElementById('locationOtherInput');
           const otherTextInput = document.getElementById('locationOtherText');
           const otherButton = document.getElementById('locationOtherBtn');

           group.querySelectorAll('.location-btn').forEach(function(btn) {
               btn.addEventListener('click', function() {
                   let isCurrentlyActive = this.classList.contains('active');
                   let makeActive = !isCurrentlyActive; // Toggle intention

                   // Deselect all first
                   group.querySelectorAll('.location-btn').forEach(b => b.classList.remove('active'));

                   // Activate the clicked one if intended
                   if (makeActive) {
                       this.classList.add('active');
                   }

                   let finalLocationValue = '';
                   // Update hidden input based on the final state
                   if (this.classList.contains('active')) {
                       finalLocationValue = this.dataset.value;
                       if (this.dataset.value === 'Other') {
                            if(otherInputContainer) otherInputContainer.style.display = 'block';
                            if(otherTextInput) {
                                otherTextInput.focus();
                                finalLocationValue = otherTextInput.value.trim(); // Use current text value
                                // Ensure listener updates hidden input if text changes while 'Other' is active
                                otherTextInput.oninput = () => {
                                    if (otherButton && otherButton.classList.contains('active') && targetInput) {
                                         targetInput.value = otherTextInput.value.trim();
                                    }
                                };
                            }
                       } else {
                            if(otherInputContainer) otherInputContainer.style.display = 'none';
                            if(otherTextInput) otherTextInput.value = ''; // Clear other text
                       }
                   } else {
                       // Button was deactivated (or 'Other' was deactivated)
                       if (this.dataset.value === 'Other') {
                            if(otherInputContainer) otherInputContainer.style.display = 'none';
                            if(otherTextInput) otherTextInput.value = '';
                       }
                       finalLocationValue = ''; // No location selected
                   }
                   // Update the hidden input field
                    if(targetInput) targetInput.value = finalLocationValue;
                    if(targetInput) targetInput.dispatchEvent(new Event('input')); // For potential validation listeners
               });
           });
       });


       // Form Submit Handler
       document.getElementById('behaviorForm').addEventListener('submit', function(e) {
           e.preventDefault();
           document.getElementById('statusMessage').innerHTML = ''; // Clear status
           const submitButton = document.getElementById('submitBtn');
           submitButton.disabled = true; // Prevent double-clicks

           // --- Gather Form Data ---
           const formData = {
               behaviorType: document.getElementById('behaviorType').value,
               studentFirst: document.getElementById('studentFirst').value.trim(),
               studentLast: document.getElementById('studentLast').value.trim(),
               studentEmail: document.getElementById('studentEmail').value.trim(),
               teacherName: document.getElementById('teacherName').value.trim(),
               parent1First: document.getElementById('parent1First').value.trim(),
               parent1Last: document.getElementById('parent1Last').value.trim(),
               parent1Email: document.getElementById('parent1Email').value.trim(),
               parent2First: document.getElementById('parent2First').value.trim(),
               parent2Last: document.getElementById('parent2Last').value.trim(),
               parent2Email: document.getElementById('parent2Email').value.trim(),
               selectedPillars: getSelectedPillars(),
               selectedBehaviors: getSelectedBehaviors(),
               location: document.getElementById('location').value.trim(), // Reads from hidden input updated by buttons
               comments: document.getElementById('comments').value.trim(),
               ccPrincipal: document.getElementById('ccPrincipal').checked,
               ccAssociatePrincipal: document.getElementById('ccAssociatePrincipal').checked
           };

           // --- Client-Side Validation ---
           let errors = [];
           if (!formData.studentFirst) errors.push("Student First Name is required.");
           if (!formData.studentLast) errors.push("Student Last Name is required.");
           if (!formData.teacherName) errors.push("Your Name is required.");
           if (!formData.parent1Email && !formData.parent2Email) errors.push("At least one Parent Email is required (use Look Up button).");
           if (formData.parent1Email && formData.parent1Email.indexOf('@') === -1 && formData.parent1Email !== '') errors.push("Parent 1 Email format appears invalid.");
           if (formData.parent2Email && formData.parent2Email.indexOf('@') === -1 && formData.parent2Email !== '') errors.push("Parent 2 Email format appears invalid.");
           if (formData.selectedPillars.length === 0) errors.push("Please select at least one Character Pillar.");
           if (formData.selectedBehaviors.length === 0) errors.push("Please select at least one Specific Behavior.");
           // Check location - hidden input should have value if button selected or 'Other' text entered
           if (!formData.location && document.querySelector('.location-buttons .location-btn.active')) {
               // This handles the case where 'Other' is active but text is empty
               if (document.getElementById('locationOtherBtn')?.classList.contains('active')) {
                    errors.push("Please specify the 'Other' location.");
               } else {
                   // Should not happen if button logic is correct, but good fallback
                   errors.push("Location selection is incomplete.");
               }
           } else if (!formData.location && !document.querySelector('.location-buttons .location-btn.active')) {
               // No button selected at all
               errors.push("Location is required.");
           }


           if (errors.length > 0) {
               showStatus('Please correct the following errors:<br>- ' + errors.join('<br>- '), 'danger');
               submitButton.disabled = false; // Re-enable button
               return;
           }

           // --- Submit Data ---
           showLoading(true);
           google.script.run
               .withFailureHandler(function(error) {
                   console.error("Submission Failure:", error);
                   showStatus('Error submitting form: ' + (error.message || error), 'danger');
                   showLoading(false);
                   submitButton.disabled = false; // Re-enable button
               })
               .withSuccessHandler(function(result) {
                   console.log("Submission Result:", result);
                   showLoading(false);
                   submitButton.disabled = false; // Re-enable button

                   if (result && result.success) {
                       showStatus(result.message || 'Form submitted and email sent successfully!', 'success');
                       document.getElementById('behaviorForm').reset(); // Reset standard inputs
                       resetFormSelections(); // Reset custom selections (pillars, behaviors etc.)
                        // Re-fetch teacher name after reset
                        try {
                          google.script.run.withSuccessHandler(function(userName) {
                              if (userName && document.getElementById('teacherName')) {
                                  document.getElementById('teacherName').value = userName;
                              }
                          }).getUserFullName();
                        } catch (e) { console.log('Could not reset teacher name after form submission:', e); }
                   } else {
                       showStatus(result && result.message ? result.message : 'An unknown error occurred during submission.', 'danger');
                   }
               })
               .processWebAppForm(formData); // Call the server-side function
       });

       // Listen for changes to student first name to update suggestions
       document.getElementById('studentFirst').addEventListener('input', function() {
           updateCommentSuggestions();
       });
  }); // End DOMContentLoaded

  /**
   * Generates comment suggestions based on selected pillars and behaviors
   * Called whenever selections change
   */
  function updateCommentSuggestions() {
      const suggestionsContainer = document.getElementById('commentSuggestions');
      if (!suggestionsContainer) return;
      
      // Clear existing suggestions
      suggestionsContainer.innerHTML = '';
      
      // Get student first name for personalization
      const studentFirst = document.getElementById('studentFirst').value.trim();
      if (!studentFirst) {
          suggestionsContainer.innerHTML = '<div class="suggestions-placeholder">Enter student name and select behaviors to see personalized suggestions.</div>';
          return;
      }
      
      // Get selected pillars and behaviors
      const selectedPillars = getSelectedPillars();
      const selectedBehaviors = getSelectedBehaviors();
      
      if (selectedPillars.length === 0 || selectedBehaviors.length === 0) {
          suggestionsContainer.innerHTML = '<div class="suggestions-placeholder">Select pillars and behaviors to see personalized suggestions.</div>';
          return;
      }
      
      // Track suggestions to avoid duplicates
      const suggestionTexts = new Set();
      const suggestions = [];
      
      // Generate individual behavior suggestions
      selectedPillars.forEach(pillarName => {
          const pillar = ALL_PILLARS_DATA.find(p => p.name === pillarName);
          if (!pillar) return;
          
          // Determine which suggestion array to use based on behavior type
          const suggestionArray = currentBehaviorType === 'goodnews' 
              ? pillar.positiveRecognitionExamples 
              : pillar.learningFocus;
              
          if (!suggestionArray || !Array.isArray(suggestionArray)) return;
          
          // For each selected behavior from this pillar, find a matching suggestion
          selectedBehaviors.forEach(behavior => {
              // Only process behaviors that belong to this pillar
              const behaviorArray = currentBehaviorType === 'goodnews' 
                  ? pillar.positiveBehaviors 
                  : pillar.negativeBehaviors;
                  
              if (!behaviorArray || !behaviorArray.includes(behavior)) return;
              
              // Find index of this behavior in the pillar's behavior array
              const behaviorIndex = behaviorArray.indexOf(behavior);
              
              // If we have a suggestion at the same index, use it
              // Otherwise use a random one from the array
              let suggestionText;
              if (behaviorIndex >= 0 && behaviorIndex < suggestionArray.length) {
                  suggestionText = suggestionArray[behaviorIndex];
              } else {
                  const randomIndex = Math.floor(Math.random() * suggestionArray.length);
                  suggestionText = suggestionArray[randomIndex];
              }
              
              // Format suggestion text based on behavior type
              if (currentBehaviorType === 'stopthink') {
                  // For Stop & Think: Extract the core learning focus
                  // No need to add "Student can work on" yet - that happens in the combined suggestion
                  // Just clean up the suggestion to work with our format
                  suggestionText = suggestionText.trim();
                  if (suggestionText.endsWith('.')) {
                      suggestionText = suggestionText.slice(0, -1);
                  }
              } else {
                  // For Good News, replace placeholder with student name
                  suggestionText = suggestionText.replace(/their|they/gi, studentFirst);
                  
                  // Ensure the student's name appears somewhere in the suggestion
                  if (!suggestionText.includes(studentFirst)) {
                      suggestionText = studentFirst + " " + suggestionText.charAt(0).toLowerCase() + suggestionText.slice(1);
                  }
              }
              
              // Only add if not duplicate
              if (!suggestionTexts.has(suggestionText)) {
                  suggestionTexts.add(suggestionText);
                  suggestions.push({
                      text: suggestionText,
                      pillar: pillar,
                      behavior: behavior
                  });
              }
          });
      });
      
      // If we have suggestions, add a combined option
      if (suggestions.length > 0) {
          // Generate individual suggestion chips
          suggestions.forEach(suggestion => {
              // For Stop & Think, format individual suggestions with "can work on" pattern
              if (currentBehaviorType === 'stopthink') {
                  const displayText = studentFirst + " can work on " + suggestion.text + ".";
                  const chip = createSuggestionChip(displayText, suggestion.pillar, false);
                  suggestionsContainer.appendChild(chip);
              } else {
                  // Good News - use as is
                  const chip = createSuggestionChip(suggestion.text, suggestion.pillar, false);
                  suggestionsContainer.appendChild(chip);
              }
          });
          
          // Generate and add combined suggestion if we have multiple
          if (suggestions.length > 1) {
              const combinedSuggestion = generateCombinedSuggestion(
                  suggestions, 
                  studentFirst, 
                  currentBehaviorType === 'stopthink'
              );
              
              if (combinedSuggestion && !suggestionTexts.has(combinedSuggestion)) {
                  const combinedChip = createSuggestionChip(combinedSuggestion, null, true);
                  suggestionsContainer.appendChild(combinedChip);
              }
          }
      } else {
          suggestionsContainer.innerHTML = '<div class="suggestions-placeholder">No specific suggestions available for the selected behaviors.</div>';
      }
      
      // Helper function to create suggestion chips
      function createSuggestionChip(text, pillar, isCombined) {
          const chip = document.createElement('div');
          chip.className = 'suggestion-chip';
          if (isCombined) chip.classList.add('combined');
          chip.textContent = text;
          
          // Apply pillar color if available and not combined
          if (pillar && !isCombined) {
              const pillarColor = PILLAR_COLORS[pillar.name] || PILLAR_COLORS.default;
              chip.style.borderColor = pillarColor.bg;
              chip.style.color = pillarColor.bg;
          }
          
          // Add click handler to insert the suggestion
          chip.addEventListener('click', function() {
              insertCommentSuggestion(text);
          });
          
          return chip;
      }
  }

  /**
   * Generates a combined suggestion from multiple individual suggestions
   * @param {Array} suggestions - Array of suggestion objects with text property
   * @param {string} studentName - Student's first name
   * @param {boolean} isStopThink - Whether this is for Stop & Think (vs Good News)
   * @returns {string} - Formatted combined suggestion text
   */
  function generateCombinedSuggestion(suggestions, studentName, isStopThink) {
      if (!suggestions || suggestions.length === 0) return null;
      
      // Handle differently based on behavior type
      if (isStopThink) {
          // For Stop & Think: Apply the requested formatting patterns
          return generateStopThinkCombinedSuggestion(suggestions, studentName);
      } else {
          // For Good News: Now using same pattern approach as Stop & Think
          return generateGoodNewsCombinedSuggestion(suggestions, studentName);
      }
  }

  /**
   * Formats Stop & Think suggestions according to requested patterns:
   * 1 behavior: "{Student} can work on {learningFocus}."
   * 2 behaviors: "{Student} can work on {focus1} and {focus2}."
   * 3+ behaviors: "{Student} can work on {focus1}, {focus2}, ... and {final}."
   */
  function generateStopThinkCombinedSuggestion(suggestions, studentName) {
      if (!suggestions || suggestions.length === 0) return null;
      
      // Extract clean suggestion texts (learning focus items)
      const focusItems = suggestions.map(function(s) {
          // Extract clean suggestion text without period at end
          let text = s.text.trim();
          if (text.endsWith('.')) {
              text = text.slice(0, -1);
          }
          
          // Ensure first letter is lowercase for consistent joining
          return text.charAt(0).toLowerCase() + text.slice(1);
      });
      
      // Create the standard prefix
      const prefix = studentName + " can work on ";
      
      // Format differently based on number of suggestions
      if (focusItems.length === 1) {
          // Single suggestion (shouldn't happen in combined, but just in case)
          return prefix + focusItems[0] + ".";
      } 
      else if (focusItems.length === 2) {
          // Two suggestions: "{Student} can work on {focus1} and {focus2}."
          return prefix + focusItems[0] + " and " + focusItems[1] + ".";
      } 
      else {
          // Three or more: "{Student} can work on {focus1}, {focus2}, ... and {focusN}."
          const lastItem = focusItems.pop();
          return prefix + focusItems.join(', ') + " and " + lastItem + ".";
      }
  }

  function generateGoodNewsCombinedSuggestion(suggestions, studentName) {
      // Guard against invalid input
      if (!suggestions || suggestions.length === 0 || !studentName) return null;
      
      // Simple approach: extract actions without student name and combine
      var actions = [];
      
      suggestions.forEach(function(suggestion) {
          if (!suggestion.text) return;
          
          // Get the text without ending period
          var text = suggestion.text.trim();
          if (text.endsWith('.')) {
              text = text.slice(0, -1);
          }
          
          // If text starts with the student name, remove it
          if (text.toLowerCase().indexOf(studentName.toLowerCase()) === 0) {
              text = text.substring(studentName.length).trim();
          }
          
          // Remove any other instances of the student name
          var nameRegex = new RegExp('\\b' + studentName.replace(/[.*+?^$()|[\]\\]/g, '\\$&') + '\\b', 'gi');
          text = text.replace(nameRegex, '').trim();
          
          // Clean up leading words/punctuation often left after name removal
          text = text.replace(/^(,|\.|and|or|&)\s+/i, '').trim();
          
          // If we have something meaningful left, add it to our actions
          if (text) {
              actions.push(text);
          }
      });
      
      // If no valid actions were found, return null
      if (actions.length === 0) return null;
      
      // Ensure actions start with lowercase for combining properly
      actions = actions.map(function(action) {
          // Make sure action starts with lowercase unless it's a proper noun
          if (/^[A-Z][a-z]/.test(action) && 
              !['I', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(action.split(' ')[0])) {
              return action.charAt(0).toLowerCase() + action.slice(1);
          }
          return action;
      });
      
      // Build a clean combined sentence with only one student name at the beginning
      var result;
      if (actions.length === 1) {
          // Capitalize the first letter of the only action
          var capitalizedAction = actions[0].charAt(0).toUpperCase() + actions[0].slice(1);
          result = studentName + " " + capitalizedAction + ".";
      } 
      else if (actions.length === 2) {
          // Capitalize the first letter of the first action
          var capitalizedFirstAction = actions[0].charAt(0).toUpperCase() + actions[0].slice(1);
          result = studentName + " " + capitalizedFirstAction + " and " + actions[1] + ".";
      }
      else {
          // For 3+ actions, capitalize the first and use proper Oxford comma formatting
          var capitalizedFirstAction = actions[0].charAt(0).toUpperCase() + actions[0].slice(1);
          var lastAction = actions.pop();
          actions[0] = capitalizedFirstAction;
          result = studentName + " " + actions.join(', ') + ", and " + lastAction + ".";
      }
      
      return result;
  }

  /**
   * Inserts a suggestion into the comments textarea
   */
  function insertCommentSuggestion(suggestionText) {
      const commentsTextarea = document.getElementById('comments');
      if (!commentsTextarea) return;
      
      const currentText = commentsTextarea.value;
      
      if (currentText.trim() === '') {
          // If empty, just insert the suggestion
          commentsTextarea.value = suggestionText;
      } else if (currentText.endsWith('.') || currentText.endsWith('!') || currentText.endsWith('?')) {
          // If ends with punctuation, add a space and the suggestion
          commentsTextarea.value = currentText + ' ' + suggestionText;
      } else {
          // Otherwise add period, space, and suggestion
          commentsTextarea.value = currentText + '. ' + suggestionText;
      }
      
      // Focus the textarea and position cursor at the end
      commentsTextarea.focus();
      commentsTextarea.selectionStart = commentsTextarea.value.length;
      commentsTextarea.selectionEnd = commentsTextarea.value.length;
  }
</script>
</body>
</html>
  `;
}

/**
 * Processes form submission from the web app
 * Fixed to properly store parent names in cache
 */
function processWebAppForm(formData) {
  try {
    Logger.log("Received form data: " + JSON.stringify(formData));

    // Store form data in cache for email templates to access
    const cacheData = {
      behaviorType: formData.behaviorType,
      studentFirst: formData.studentFirst,
      studentLast: formData.studentLast,
      parent1First: formData.parent1First || "",
      parent1Last: formData.parent1Last || "",
      parent1Email: formData.parent1Email || "",
      parent2First: formData.parent2First || "",
      parent2Last: formData.parent2Last || "",
      parent2Email: formData.parent2Email || "",
      // --- NEW: Add selected pillars to cache ---
      selectedPillars: formData.selectedPillars || []
      // --- END NEW ---
    };
    SESSION_CACHE.put('currentFormData', JSON.stringify(cacheData), 600); // Cache for 10 minutes
    Logger.log("Stored in cache: " + JSON.stringify(cacheData));

    // --- Server-Side Validation ---
    if (!formData.studentFirst || !formData.studentLast) {
      return { success: false, message: "Student name is required" };
    }
    if (!formData.parent1Email && !formData.parent2Email) {
      return { success: false, message: "At least one parent email is required" };
    }
    // --- NEW: Validate pillars and behaviors ---
    if (!formData.selectedPillars || formData.selectedPillars.length === 0) {
      return { success: false, message: "At least one Character Pillar must be selected." };
    }
    if (!formData.selectedBehaviors || formData.selectedBehaviors.length === 0) {
      return { success: false, message: "At least one Behavior must be selected." };
    }
    // --- END NEW ---


    // Extract form values
    const behaviorType = formData.behaviorType; // "goodnews" or "stopthink"
    const studentFirst = formData.studentFirst;
    const studentLast = formData.studentLast;
    const teacherName = formData.teacherName;
    const parent1Email = formData.parent1Email || "";
    const parent2Email = formData.parent2Email || "";
    const parent1First = formData.parent1First || ""; // Get parent names for email body
    const parent2First = formData.parent2First || ""; // Get parent names for email body

    // --- NEW: Extract pillar and behavior data ---
    const selectedPillars = formData.selectedPillars || []; // Array of pillar names
    const selectedBehaviors = formData.selectedBehaviors || []; // Array of behavior strings
    const location = formData.location || ""; // Single location field now
    const comments = formData.comments || "";
    // --- END NEW ---

    // Extract CC options
    const ccPrincipal = formData.ccPrincipal === true || formData.ccPrincipal === "true";
    const ccAssociatePrincipal = formData.ccAssociatePrincipal === true || formData.ccAssociatePrincipal === "true";

    // Get teacher email information
    const teacherEmail = Session.getActiveUser().getEmail();

    // Build CC list
    const ccList = [];
    if (ccPrincipal && CONFIG.ADMIN_EMAILS.PRINCIPAL) ccList.push(CONFIG.ADMIN_EMAILS.PRINCIPAL);
    if (ccAssociatePrincipal && CONFIG.ADMIN_EMAILS.ASSOCIATE_PRINCIPAL) ccList.push(CONFIG.ADMIN_EMAILS.ASSOCIATE_PRINCIPAL);


    // --- Pass selectedPillars array to email functions ---
    if (behaviorType === "stopthink") {
      sendStopAndThinkEmail(
        studentFirst, studentLast, parent1Email, parent2Email,
        location, selectedBehaviors, comments, teacherEmail, teacherName,
        parent1First, parent2First, // Pass parent names
        ccList, // Pass CC list
        selectedPillars // Pass selected pillars
      );
    } else if (behaviorType === "goodnews") {
      sendGoodNewsEmail(
        studentFirst, studentLast, parent1Email, parent2Email,
        location, selectedBehaviors, comments, teacherEmail, teacherName,
        parent1First, parent2First, // Pass parent names
        ccList, // Pass CC list
        selectedPillars // Pass selected pillars
      );
    }
    // --- END Pass ---

     // --- NEW: Save updated data to spreadsheet ---
    saveFormToSpreadsheetV2(formData); // Use a revised save function
    // --- END NEW ---


    // Clear the cache after sending/saving
    SESSION_CACHE.remove('currentFormData');

    return {
      success: true,
      message: "Form submitted and email sent successfully for " + studentFirst + " " + studentLast + "."
    };

  } catch (error) {
    Logger.log("Error in processWebAppForm: " + error.toString());
    Logger.log("Stack trace: " + error.stack);
    SESSION_CACHE.remove('currentFormData'); // Clear cache on error too
    return {
      success: false,
      message: "An error occurred while processing your submission: " + error.message
    };
  }
}

/**
 * Saves the form submission to the spreadsheet with pillar integration.
 * Assumes a specific column order. Adjust `columnMap` if your sheet differs.
 *
 * @param {Object} formData - The form data submitted from the web app.
 */
function saveFormToSpreadsheetV2(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);

  if (!sheet) {
    Logger.log(`Spreadsheet Error: Sheet named "${CONFIG.SHEET_NAMES.BEHAVIOR_FORM}" not found.`);
    // Consider throwing an error or returning a status if critical
    return; // Exit if sheet not found
  }

  // --- Define Column Mapping (UPDATE THIS TO MATCH YOUR SHEET) ---
  // Key: formData property name, Value: Column Letter
  const columnMap = {
      timestamp: 'A',
      teacherEmail: 'B', // Assuming teacher email is captured or use Session.getActiveUser().getEmail()
      studentFirst: 'C',
      studentLast: 'D',
      behaviorTypeLabel: 'E', // e.g., "Good News" or "Stop & Think"
      location: 'F', // Consolidated location column
      selectedPillars: 'G', // Store comma-separated pillar names
      selectedBehaviors: 'H', // Store comma-separated behaviors
      comments: 'I', // Consolidated comments column
      // Remove old separate location/behavior/comment columns if they existed (J, K, L, M, N...)
      studentEmail: 'L', // Adjust if columns shifted
      parent1First: 'M',
      parent1Last: 'N',
      parent1Email: 'O',
      parent2First: 'P',
      parent2Last: 'Q',
      parent2Email: 'R',
      ccPrincipal: 'S',
      ccAssociatePrincipal: 'T'
      // Add more columns if needed
  };
  // --- END Column Mapping ---


  // Get the header row to find column indices dynamically
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const headerMap = {};
  headers.forEach((header, index) => {
      if (header) { // Only map non-empty headers
          headerMap[header.trim()] = index; // 0-based index
      }
  });

  // Find the actual column header names based on the values in columnMap
  // This is more robust than assuming column letters directly
  const targetHeaders = {};
  for (const key in columnMap) {
      const columnLetter = columnMap[key];
      // Find the header name corresponding to the column letter (simple approach)
      // A more complex sheet might require a different way to map letters to headers if headers change
      const colIndex = columnLetter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      if (colIndex >= 0 && colIndex < headers.length) {
          targetHeaders[key] = headers[colIndex];
      } else {
          Logger.log(`Warning: Column letter ${columnLetter} for key ${key} is out of bounds or invalid.`);
      }
  }


  // Prepare row data based on headerMap
  const rowData = new Array(sheet.getLastColumn()).fill(""); // Initialize empty row

  // Populate rowData using the headerMap (index)
  function setData(key, value) {
      const headerName = targetHeaders[key];
      if (headerName !== undefined && headerMap[headerName] !== undefined) {
          rowData[headerMap[headerName]] = value;
      } else {
          Logger.log(`Warning: Could not map form data key "${key}" to a sheet column header.`);
      }
  }

  setData('timestamp', new Date());
  setData('teacherEmail', Session.getActiveUser().getEmail()); // Get submitting user's email
  setData('studentFirst', formData.studentFirst || "");
  setData('studentLast', formData.studentLast || "");
  setData('behaviorTypeLabel', formData.behaviorType === 'goodnews' ? 'Good News' : 'Stop & Think');
  setData('location', formData.location || "");
  setData('selectedPillars', Array.isArray(formData.selectedPillars) ? formData.selectedPillars.join(', ') : "");
  setData('selectedBehaviors', Array.isArray(formData.selectedBehaviors) ? formData.selectedBehaviors.join(', ') : "");
  setData('comments', formData.comments || "");
  setData('studentEmail', formData.studentEmail || "");
  setData('parent1First', formData.parent1First || "");
  setData('parent1Last', formData.parent1Last || "");
  setData('parent1Email', formData.parent1Email || "");
  setData('parent2First', formData.parent2First || "");
  setData('parent2Last', formData.parent2Last || "");
  setData('parent2Email', formData.parent2Email || "");
  setData('ccPrincipal', formData.ccPrincipal === true || formData.ccPrincipal === "true" ? "Yes" : "No");
  setData('ccAssociatePrincipal', formData.ccAssociatePrincipal === true || formData.ccAssociatePrincipal === "true" ? "Yes" : "No");

  Logger.log("Appending row to sheet: " + JSON.stringify(rowData));
  try {
      sheet.appendRow(rowData);
      Logger.log("Row appended successfully.");
  } catch (e) {
      Logger.log("Error appending row: " + e.toString());
      // Decide if this error should be reported back to the user
  }
}

function lookupStudent(firstName, lastName) {
  try {
    firstName = firstName.trim();
    lastName = lastName.trim();
    Logger.log(`Looking up student: "${firstName}" "${lastName}"`);

    if (!firstName || !lastName) {
        Logger.log("Lookup failed: First or Last name was empty.");
        return { success: false, message: "First and Last name are required for lookup." };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const directorySheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DIRECTORY);

    if (!directorySheet) {
      Logger.log("Directory sheet not found: " + CONFIG.SHEET_NAMES.DIRECTORY);
      return { success: false, message: "System Error: Directory sheet not found." };
    }

    const directoryData = directorySheet.getDataRange().getValues();
    const enteredFullNameLower = (firstName + " " + lastName).toLowerCase();
    Logger.log(`Searching for lowercase name: "${enteredFullNameLower}"`);

    // --- Pass 1: Exact Match ---
    Logger.log("--- Starting Pass 1: Exact Match Search ---");
    for (let i = 1; i < directoryData.length; i++) {
      const row = directoryData[i];
      const currFirstName = row[0] ? String(row[0]).trim() : "";
      const currLastName = row[1] ? String(row[1]).trim() : "";

      if (currFirstName.toLowerCase() === firstName.toLowerCase() &&
          currLastName.toLowerCase() === lastName.toLowerCase()) {
        Logger.log(`Exact match found at row ${i+1} for: "${firstName} ${lastName}"`);
        // Use the database version of the names (correctly formatted) rather than user input
        return {
          success: true,
          // Use the actual names from the database (properly formatted)
          studentFirst: currFirstName,
          studentLast: currLastName,
          studentEmail: row[3] || '', 
          parent1First: row[4] || '', 
          parent1Last: row[5] || '',
          parent1Email: row[6] || '', 
          parent2First: row[7] || '', 
          parent2Last: row[8] || '',
          parent2Email: row[9] || ''
        };
      }
    }
    Logger.log("--- Finished Pass 1: No exact match found ---");

    // --- Pass 2: Find Suggestions ---
    Logger.log("--- Starting Pass 2: Suggestion Search ---");
    let suggestions = [];
    Logger.log(`Using SIMILARITY_THRESHOLD: ${CONFIG.SIMILARITY_THRESHOLD}, MAX_SUGGESTIONS: ${CONFIG.MAX_SUGGESTIONS}`);

    for (let i = 1; i < directoryData.length; i++) {
        const row = directoryData[i];
        const currFirstName = row[0] ? String(row[0]).trim() : "";
        const currLastName = row[1] ? String(row[1]).trim() : "";

        if (!currFirstName || !currLastName) {
             continue; // Skip rows with missing names
        }

        const directoryFullName = currFirstName + " " + currLastName;
        const directoryFullNameLower = directoryFullName.toLowerCase();
        const distance = calculateLevenshteinDistance(enteredFullNameLower, directoryFullNameLower);

        if (distance <= CONFIG.SIMILARITY_THRESHOLD) {
            Logger.log(`  -> Potential Suggestion FOUND: "${directoryFullName}" (Distance: ${distance})`);
            suggestions.push({
                firstName: currFirstName, // Use database version (properly formatted)
                lastName: currLastName,   // Use database version (properly formatted)
                distance: distance
             });
        }
    }
    Logger.log("--- Finished Pass 2: Suggestion Search Loop ---");
    Logger.log(`Raw suggestions collected: ${JSON.stringify(suggestions)}`);

    if (suggestions.length > 0) {
        suggestions.sort((a, b) => {
            if (a.distance !== b.distance) { return a.distance - b.distance; }
            return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
        });

        const limitedSuggestions = suggestions.slice(0, CONFIG.MAX_SUGGESTIONS);
        Logger.log(`Suggestions sorted and limited: ${JSON.stringify(limitedSuggestions)}`);
        Logger.log(`FINAL RESULT: Returning suggestions objects.`);
        return { success: false, suggestions: limitedSuggestions };
    } else {
        Logger.log(`No suggestions met the threshold.`);
        Logger.log(`FINAL RESULT: No close matches found for "${firstName} ${lastName}". Returning 'not found' message.`);
        return { success: false, message: `Student "${firstName} ${lastName}" not found in directory. Please check the spelling.` };
    }

  } catch (error) {
    Logger.log(`CRITICAL ERROR during student lookup: ${error.toString()}`);
    Logger.log(`Lookup Error Stack: ${error.stack}`);
    return { success: false, message: `An unexpected server error occurred during lookup: ${error.message}` };
  }
}

// Make sure the calculateLevenshteinDistance function is also present in this script file or accessible.
// Make sure the CONFIG constant is defined globally once in your project (e.g., in EmailSystem.txt)
// and includes SHEET_NAMES.DIRECTORY, SIMILARITY_THRESHOLD, and MAX_SUGGESTIONS.


// --- Other functions (deployWebApp, updateBehaviorSystemMenu, test emails, onOpen) remain largely the same ---
// --- Make sure necessary functions from EmailSystem.txt (like getTeacherName, send emails) are available here ---

/**
 * Helper function to get teacher name from email (Example - ensure this is available)
 */
function getTeacherName(email) {
  if (!email) return "Teacher";
  try {
    const emailName = email.split('@')[0];
    if (emailName.includes('.')) {
      return emailName.split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
    // Simple capitalization if no dot
     return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  } catch (e) {
    Logger.log(`Error parsing teacher name from email ${email}: ${e}`);
    return "Teacher"; // Fallback
  }
}

/**
 * Deploys the web app for the first time.
 */
function deployWebApp() {
  // Deployment instructions remain the same
  Logger.log("To deploy/update this web app:");
  Logger.log("1. Click 'Deploy' > 'Manage deployments'.");
  Logger.log("2. Select your existing Web app deployment.");
  Logger.log("3. Click the pencil icon (Edit).");
  Logger.log("4. Select 'New version' from the Version dropdown.");
  Logger.log("5. Optionally add a description.");
  Logger.log("6. Click 'Deploy'.");
  Logger.log("7. Ensure 'Execute as' is 'User accessing the web app'.");
  Logger.log("8. Ensure 'Who has access' is appropriate (e.g., Anyone within your domain).");
   SpreadsheetApp.getActiveSpreadsheet().toast("See execution log for deployment instructions", "Web App Deployment", 5);
}

/**
 * Updates the menu items for the Behavior System
 */
function updateBehaviorSystemMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Behavior System (Web App)') // Renamed slightly for clarity
    .addItem('Deploy/Update Web App', 'deployWebApp')
    // Add other relevant menu items if needed (e.g., tests)
    .addToUi();
}

/**
 * Event handler for when the spreadsheet is opened
 */
function onOpen() {
  updateBehaviorSystemMenu();
  // Removed the call to updateBehaviorSystemMenu from EmailSystem.txt if it existed there
  // to avoid duplicate menus. Only call it once.
}

// NOTE: The onEdit and updateAllBehaviorFormRows functions from DirectoryInfo.txt are separate.
// They handle edits *directly* in the sheet, while this file handles the web app interaction.
// You might keep both if you want both methods of interaction.

/**
 * This function fixes the syntax error in your webapp
 * Place this function in the WebAppBehaviorForm.txt file
 */
function fixSyntaxError() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  // Try to read the current code
  try {
    const behaviorType = sheet.getRange("A1").getValue();
    Logger.log("Successfully ran test function: " + behaviorType);
    SpreadsheetApp.getUi().alert("Syntax error has been fixed!");
  } catch (e) {
    Logger.log("Error: " + e.toString());
  }
}

/**
 * Diagnoses web app HTML rendering issues
 * Add this to your WebAppBehaviorForm.txt file
 */
function diagnoseWebAppIssue() {
  try {
    // Test HTML generation with problematic terms
    const testHTML = createSafeTestHTML();
    
    // Log the generated HTML for inspection
    Logger.log("Test HTML generated successfully");
    
    // Store the HTML in Properties for inspection
    PropertiesService.getScriptProperties().setProperty(
      "lastGeneratedHTML", 
      testHTML.substring(0, 9000) // Store first portion to avoid size limits
    );
    
    return "Diagnosis complete. Check logs for details.";
  } catch (e) {
    Logger.log("Error in diagnosis: " + e.toString());
    return "Error: " + e.toString();
  }
}

/**
 * Creates test HTML with potentially problematic text
 */
function createSafeTestHTML() {
  let html = "<html><body>";
  html += "<h1>Test HTML Generation</h1>";
  html += "<p>Testing behavior types:</p>";
  html += "<ul>";
  // Use explicit string concatenation for problematic terms
  html += "<li>Type 1: " + "Good" + " " + "News</li>";
  html += "<li>Type 2: " + "Stop" + " " + "and" + " " + "Think</li>";
  html += "</ul>";
  html += "</body></html>";
  return html;
}

/**
 * Tests HTML generation without actually sending emails
 * Add this to your WebAppBehaviorForm.txt file
 */
function testHTMLGeneration() {
  try {
    // Test Stop and Think email
    const stopThinkHTML = createStopThinkEmailBody(
      "John", "Smith", "Classroom", "calling out, interrupting", 
      "John had difficulty focusing today.", "Test Teacher"
    );
    
    // Test Good News email
    const goodNewsHTML = createGoodNewsEmailBody(
      "Sarah", "Johnson", "Library", "helping others, showing kindness", 
      "Sarah helped a classmate with their project.", "Test Teacher"
    );
    
    // Log success and store samples in Properties
    Logger.log("HTML generation successful!");
    PropertiesService.getScriptProperties().setProperty("testStopThinkHTML", stopThinkHTML.substring(0, 500));
    PropertiesService.getScriptProperties().setProperty("testGoodNewsHTML", goodNewsHTML.substring(0, 500));
    
    return "HTML test generation successful";
  } catch (e) {
    Logger.log("Error testing HTML: " + e.toString());
    return "Error: " + e.toString();
  }
}

/**
 * Troubleshooting function to diagnose email system issues
 * Add this to WebAppBehaviorForm.txt
 */
function troubleshootEmailSystem() {
  try {
    const results = {
      config: {},
      functions: {},
      cache: {},
      test: {}
    };
    
    // Check CONFIG values
    try {
      results.config.SCHOOL_NAME = CONFIG.SCHOOL_NAME || "Not defined";
      results.config.EMAIL_SUBJECTS = {
        GOOD_NEWS: CONFIG.EMAIL_SUBJECT_GOOD_NEWS || "Not defined",
        STOP_THINK: CONFIG.EMAIL_SUBJECT_STOP_THINK || "Not defined"
      };
      results.config.ADMIN_EMAILS = CONFIG.ADMIN_EMAILS || "Not defined";
      results.config.SEND_EMAILS = CONFIG.SEND_EMAILS;
    } catch (e) {
      results.config.error = e.toString();
    }
    
    // Check if required functions exist
    results.functions.createSimplifiedEmailBody = typeof createSimplifiedEmailBody === "function";
    results.functions.createGoodNewsEmailBody = typeof createGoodNewsEmailBody === "function";
    results.functions.createStopThinkEmailBody = typeof createStopThinkEmailBody === "function";
    results.functions.sendEmailToParents = typeof sendEmailToParents === "function";
    results.functions.buildSafeHTML = typeof buildSafeHTML === "function";
    
    // Test cache service
    try {
      SESSION_CACHE.put("test", "Working", 30);
      const testValue = SESSION_CACHE.get("test");
      results.cache.working = testValue === "Working";
    } catch (e) {
      results.cache.error = e.toString();
    }
    
    // Test email generation
    try {
      const testEmail = createSimplifiedEmailBody(
        'goodnews',
        'Test',
        'Student',
        'Parent1',
        'Parent2',
        'Classroom',
        'being helpful',
        'Test comment',
        'Test Teacher'
      );
      results.test.emailGenerated = testEmail !== undefined && testEmail.length > 0;
      results.test.emailLength = testEmail ? testEmail.length : 0;
    } catch (e) {
      results.test.error = e.toString();
    }
    
    Logger.log("Email System Diagnostics: " + JSON.stringify(results, null, 2));
    return results;
  } catch (e) {
    Logger.log("Diagnostics failed: " + e.toString());
    return { error: e.toString() };
  }
}
