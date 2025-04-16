/**
 * Global configuration settings
 */
const CONFIG = {
  SCHOOL_NAME: "Orono Middle School", // Or your actual school name
  EMAIL_SUBJECT_GOOD_NEWS: "Good News Moment - Demonstrating Character!", // Updated Subject
  EMAIL_SUBJECT_STOP_THINK: "Stop & Think Moment - Opportunity for Growth", // Updated Subject
  SHEET_NAMES: {
    DIRECTORY: "Directory",        // Verify this sheet name
    BEHAVIOR_FORM: "Behavior Form" // Verify this sheet name
  },
  ADMIN_EMAILS: {
    PRINCIPAL: "kim.vaneyll", // Replace with actual principal email
    ASSOCIATE_PRINCIPAL: "sara.hunstiger@orono.k12.mn.us" // Replace with actual associate principal email
  },
  SEND_EMAILS: true, // Or false for testing
  SIMILARITY_THRESHOLD: 3,  // Max Levenshtein distance for suggestions
  MAX_SUGGESTIONS: 5        // Max number of suggestions to show
};

const SESSION_CACHE = CacheService.getScriptCache();

// --- NEW: Pillar Data ---
// Replace the existing PILLARS_DATA constant in EmailSystem.txt with this updated version
const PILLARS_DATA = [
  {
    name: "Trustworthiness",
    color: "#00008B", // Dark Blue
    iconSymbol: "✋",
    description: "Building honesty, reliability, and integrity.", // Added brief description
    positiveBehaviors: [
      "telling the truth, even when difficult",
      "completing work with academic honesty", // Slightly refined
      "returning found items to rightful owners",
      "following through on commitments and promises",
      "avoiding the spread of rumors or gossip",
      "being reliable and dependable in group settings",
      "using digital resources ethically (e.g., citing sources, submitting ones' own original work)" // Added digital aspect
    ],
    positiveRecognitionExamples: [
      "showed great integrity by being honest today.",
      "demonstrated academic honesty on their work.",
      "acted responsibly by returning a found item.",
      "followed through reliably on a commitment.",
      "chose not to participate in gossip.",
      "was a trustworthy and dependable group member.",
      "showed digital responsibility in their work."
    ],
    negativeBehaviors: [
      "being dishonest or misleading others",
      "copying work, cheating, or plagiarizing", // Refined
      "taking items that belong to others",
      "breaking promises or commitments",
      "participating in gossip or spreading rumors",
      "blaming others unfairly to avoid consequences",
      "misrepresenting online sources or plagiarizing digital work" // Added digital aspect
    ],
    learningFocus: [
      "developing honesty, even when it's challenging.",
      "understanding and practicing academic integrity.",
      "respecting others' property and belongings.",
      "learning the importance of keeping one's word.",
      "building skills to avoid participating in or spreading gossip.",
      "developing reliability and accountability.",
      "learning responsible digital research and citation skills."
    ]
  },
  {
    name: "Respect",
    color: "#FFBF00", // Amber/Yellow
    iconSymbol: "🤝",
    description: "Treating others, property, and oneself with consideration.",
    positiveBehaviors: [
      "using polite and appropriate language with peers and adults", // Refined
      "listening actively and waiting for one's turn to speak", // Refined
      "handling personal and school property carefully", // Refined
      "following rules and directions willingly",
      "expressing disagreements calmly and respectfully",
      "showing appreciation for diverse perspectives and backgrounds", // Refined
      "engaging in respectful online communication" // Added digital aspect
    ],
    positiveRecognitionExamples: [
      "communicated respectfully with others today.",
      "listened attentively during discussions.",
      "handled materials responsibly.",
      "followed directions cooperatively.",
      "expressed opinions respectfully.",
      "showed appreciation for different viewpoints.",
      "demonstrated respectful online behavior."
    ],
    negativeBehaviors: [
      "interrupting or talking over others frequently",
      "communicating with disrespectful, rude, or offensive language", // Refined
      "showing disrespect through tone, gestures, or expressions",
      "wrestling with other students or not keeping hands to self",
      "ignoring or defying reasonable instructions",
      "mocking, teasing, or putting others down",
      "engaging in disrespectful or inappropriate online interactions" // Added digital aspect
    ],
    learningFocus: [
      "practicing active listening and patience in conversations.",
      "developing constructive communication and appropriate language.",
      "learning to show respect through actions and body language.",
      "understanding the importance of caring for property.",
      "learning to follow directions and school expectations.",
      "building empathy and respectful ways to interact.",
      "developing positive digital communication habits."
    ]
  },
  {
    name: "Responsibility",
    color: "#228B22", // Forest Green
    iconSymbol: "⭐",
    description: "Taking ownership of actions, duties, and learning.",
    positiveBehaviors: [
      "submitting assignments on time and completed thoughtfully", // Refined
      "coming prepared for class with necessary materials",
      "cleaning up one's own workspace and shared areas", // Refined
      "acknowledging mistakes and learning from them",
      "taking good care of borrowed or shared items",
      "completing assigned tasks and chores reliably",
      "persisting through challenges and seeking help appropriately", // Refined
      "managing time effectively for assignments and projects" // Added
    ],
    positiveRecognitionExamples: [
      "submitted thoughtful work on time.",
      "came to class well-prepared today.",
      "helped keep our space tidy.",
      "took responsibility for a mistake and learned from it.",
      "cared for shared materials responsibly.",
      "completed assigned tasks reliably.",
      "showed perseverance on a challenging task.",
      "managed time effectively on the recent assignment."
    ],
    negativeBehaviors: [
      "frequently submitting late or incomplete work",
      "being off-task or distracting to others",
      "leaving personal or shared areas messy or disorganized",
      "making excuses or blaming others for mistakes",
      "losing or damaging items carelessly",
      "being unprepared for class activities or discussions",
      "giving up easily when tasks become challenging",
      "struggling to manage deadlines for assignments/projects" // Added
    ],
    learningFocus: [
      "developing organizational skills for assignments.",
      "building habits for preparedness and organization.",
      "learning to take responsibility for personal and shared spaces.",
      "developing accountability and a growth mindset.",
      "practicing care for personal and shared belongings.",
      "strengthening preparedness for learning.",
      "building resilience and problem-solving skills.",
      "improving time management and planning skills."
    ]
  },
  {
    name: "Fairness",
    color: "#FF8C00", // Dark Orange
    iconSymbol: "⚖️",
    description: "Playing by the rules, taking turns, and being open-minded.",
    positiveBehaviors: [
      "taking turns and sharing opportunities equitably", // Refined
      "playing games and participating according to rules",
      "listening openly to different viewpoints before judging", // Refined
      "actively including others in activities and groups",
      "sharing resources appropriately and considering others' needs",
      "treating everyone impartially and justly" // Refined
    ],
    positiveRecognitionExamples: [
      "shared materials/opportunities fairly with others.",
      "played fairly and followed the rules.",
      "listened open-mindedly to different ideas.",
      "made an effort to include others today.",
      "shared resources thoughtfully.",
      "treated peers in a fair and just manner."
    ],
    negativeBehaviors: [
      "cutting ahead, skipping turns, or dominating activities",
      "cheating or disregarding rules in games/activities",
      "ignoring different perspectives or being closed-minded",
      "deliberately excluding peers from activities or groups",
      "using more resources than necessary or permitted",
      "blaming others unjustly or showing favoritism" // Refined
    ],
    learningFocus: [
      "practicing sharing and taking turns.",
      "understanding the importance of rules and fair play.",
      "developing open-mindedness and considering diverse views.",
      "building inclusive behaviors and empathy.",
      "learning to share resources equitably.",
      "developing impartiality and avoiding bias."
    ]
  },
  {
    name: "Caring",
    color: "#DC143C", // Crimson Red
    iconSymbol: "❤️",
    description: "Showing kindness, compassion, and empathy towards others.",
    positiveBehaviors: [
      "offering help or support to peers in need",
      "comforting or showing empathy towards others experiencing difficulty",
      "communicating with kind words and giving genuine compliments",
      "welcoming new students or including peers who seem left out", // Refined
      "expressing gratitude and appreciation towards others",
      "sharing items willingly and thoughtfully",
      "standing up for peers respectfully when witnessing unkindness" // Refined
    ],
    positiveRecognitionExamples: [
      "showed kindness by helping a peer.",
      "was compassionate and supportive to someone today.",
      "communicated with kind words that made a positive impact.",
      "made an effort to welcome or include someone.",
      "expressed gratitude thoughtfully.",
      "shared generously with others.",
      "acted as a supportive friend/classmate."
    ],
    negativeBehaviors: [
      "being unkind, teasing, or making fun of others",
      "ignoring peers who clearly need assistance or support",
      "engaging in mean-spirited gossip or spreading rumors",
      "laughing at the mistakes or struggles of others",
      "acting selfishly or disregarding the feelings/needs of others",
      "excluding others purposefully from groups or activities",
      "being insensitive to the feelings of others" // Added
    ],
    learningFocus: [
      "cultivating empathy and kindness in interactions.",
      "developing awareness of others' needs and offering support.",
      "practicing positive communication and avoiding gossip.",
      "building sensitivity to how words/actions affect others.",
      "learning to consider others' perspectives and needs.",
      "developing inclusive social skills.",
      "increasing awareness and sensitivity to others' feelings."
    ]
  },
  {
    name: "Citizenship",
    color: "#4B0082", // Indigo/Purple
    iconSymbol: "🏠",
    description: "Contributing positively to the school and community.",
    positiveBehaviors: [
      "following school and classroom rules consistently",
      "working cooperatively and respectfully with peers in groups",
      "helping keep school spaces clean, orderly, and safe", // Refined
      "showing respect for school staff, volunteers, and visitors", // Refined
      "participating positively in school events and activities",
      "contributing to a safe and welcoming school environment",
      "reporting safety concerns or rule violations responsibly",
      "demonstrating appropriate and ethical use of school technology" // Added digital citizenship
    ],
    positiveRecognitionExamples: [
      "followed classroom/school rules reliably.",
      "collaborated effectively and respectfully in a group.",
      "helped maintain a positive school environment.",
      "showed respect for adults in the school community.",
      "participated positively in a school activity.",
      "contributed to a welcoming atmosphere.",
      "acted responsibly regarding a safety/rule concern.",
      "demonstrated appropriate and ethical use of school technology."
    ],
    negativeBehaviors: [
      "breaking or consistently ignoring established rules",
      "littering or failing to clean up after oneself",
      "damaging school property intentionally or carelessly",
      "refusing to cooperate or being disruptive in groups",
      "disrupting the learning environment for others",
      "ignoring or violating safety procedures",
      "avoiding participation or contributing negatively to activities",
      "misusing school technology or accessing inappropriate content" // Added digital citizenship
    ],
    learningFocus: [
      "understanding and respecting community rules.",
      "developing responsibility for shared spaces.",
      "learning to respect property and resources.",
      "building collaboration and teamwork skills.",
      "understanding one's impact on the learning environment.",
      "developing awareness of safety procedures.",
      "learning the value of positive participation.",
      "practicing responsible and ethical technology use."
    ]
  }
];


/**
 * Properly capitalizes a name with standard capitalization rules
 * @param {string} name - The name to capitalize
 * @return {string} - The properly capitalized name
 */
function capitalizeProperName(name) {
  if (!name) return '';
  
  // Handle empty input
  name = name.trim();
  if (name === '') return '';
  
  // Split by spaces, hyphens, and apostrophes while preserving the separators
  const parts = name.split(/( |-|')/g);
  
  // Capitalize each part (except separators)
  return parts.map(part => {
    // Skip separators
    if (part === ' ' || part === '-' || part === "'") return part;
    
    // Handle Mc and Mac prefixes specially
    if (/^mc/i.test(part)) {
      return 'Mc' + part.charAt(2).toUpperCase() + part.slice(3).toLowerCase();
    }
    if (/^mac/i.test(part) && part.length > 3) {
      return 'Mac' + part.charAt(3).toUpperCase() + part.slice(4).toLowerCase();
    }
    
    // Standard case: capitalize first letter, lowercase rest
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join('');
}

/**
 * Determines which pillars are associated with given behaviors
 * @param {string} behaviorType - "Good News" or "Stop & Think"
 * @param {string|string[]} behaviors - Behaviors text or array
 * @return {string[]} - Array of pillar names
 */
function determinePillarsFromBehaviors(behaviorType, behaviors) {
  if (!behaviors) return [];
  
  // Convert to array if it's a string
  const behaviorsList = Array.isArray(behaviors) ? 
    behaviors : 
    behaviors.split(',').map(b => b.trim());
  
  const isPositive = behaviorType.includes("Good News");
  const matchedPillars = new Set();
  
  // Check each behavior against each pillar's behavior lists
  behaviorsList.forEach(behavior => {
    PILLARS_DATA.forEach(pillar => {
      const behaviorList = isPositive ? pillar.positiveBehaviors : pillar.negativeBehaviors;
      
      // Check if this behavior is in the pillar's list
      const behaviorLower = behavior.toLowerCase();
      const found = behaviorList.some(pillarBehavior => 
        behaviorLower.includes(pillarBehavior.toLowerCase()) || 
        pillarBehavior.toLowerCase().includes(behaviorLower)
      );
      
      if (found) {
        matchedPillars.add(pillar.name);
      }
    });
  });
  
  // If no pillars matched, return "Responsibility" as default
  if (matchedPillars.size === 0) {
    return ["Responsibility"];
  }
  
  return Array.from(matchedPillars);
}

// Ensure getUserFullName, lookupStudent, calculateLevenshteinDistance etc. are in this file or accessible
// Ensure the Email Sending functions (sendGoodNewsEmail, sendStopAndThinkEmail, create...Body, sendEmailToParents) are here
/**
 * Creates a trigger to run when a form is submitted
 */
function createFormSubmitTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
  Logger.log('Form submit trigger created successfully');
}

/**
 * Debug function to log form structure
 */
function logFormStructure(e) {
  Logger.log("Form submission data structure:");
  for (let key in e.namedValues) {
    Logger.log(`Field: "${key}" = ${JSON.stringify(e.namedValues[key])}`);
  }
}

/**
 * Safely get a form value with error checking
 */
function getFormValue(formValues, fieldName, defaultValue = "") {
  if (!formValues || !formValues[fieldName] || !formValues[fieldName][0]) {
    Logger.log(`Warning: Field "${fieldName}" is missing or empty`);
    return defaultValue;
  }
  return formValues[fieldName][0];
}

/**
 * Main function that runs when a form is submitted
 * 
 * @param {Object} e The event object from the form submission
 */
function onFormSubmit(e) {
  try {
    // Log the full structure for debugging
    logFormStructure(e);
    
    // Extract form response values
    const formValues = e.namedValues;
    
    // Get the type of behavior documented with error checking
    const behaviorType = getFormValue(formValues, "Which type of behavior are you documenting?");
    
    // Get student information with proper capitalization
    const studentFirst = capitalizeProperName(getFormValue(formValues, "Student First"));
    const studentLast = capitalizeProperName(getFormValue(formValues, "Student Last"));
    const studentEmail = getFormValue(formValues, "Student Email");
    
    // Get parent information with proper capitalization
    const parent1First = capitalizeProperName(getFormValue(formValues, "Parent1 First"));
    const parent1Last = capitalizeProperName(getFormValue(formValues, "Parent1 Last"));
    const parent1Email = getFormValue(formValues, "Parent1 Email");
    
    const parent2First = capitalizeProperName(getFormValue(formValues, "Parent2 First"));
    const parent2Last = capitalizeProperName(getFormValue(formValues, "Parent2 Last"));
    const parent2Email = getFormValue(formValues, "Parent2 Email");
    
    // Get teacher information
    const teacherEmail = getFormValue(formValues, "Email Address");
    const teacherName = getTeacherName(teacherEmail);
    
    // Log the extracted values for debugging
    Logger.log(`Student: ${studentFirst} ${studentLast}`);
    Logger.log(`Behavior Type: ${behaviorType}`);
    Logger.log(`Teacher: ${teacherName} (${teacherEmail})`);
    
    // Determine behavior type and create appropriate email
    if (behaviorType && behaviorType.includes("Stop & Think")) {
      // Handle Stop and Think behavior
      const location = getFormValue(formValues, "Location (Stop and Think)");
      const behaviors = getFormValue(formValues, "Stop and Think Behaviors");
      const comments = getFormValue(formValues, "Additional comments about the selected \"Stop and Think\" behavior:");
      
      // Determine relevant pillars based on behaviors
      const selectedPillars = determinePillarsFromBehaviors(behaviorType, behaviors);
      
      // Send Stop and Think email with parent names and pillars
      sendStopAndThinkEmail(
        studentFirst, 
        studentLast, 
        parent1Email, 
        parent2Email, 
        location, 
        behaviors, 
        comments,
        teacherEmail,
        teacherName,
        parent1First,
        parent2First,
        null, // ccList - default is empty
        selectedPillars // Pass the identified pillars
      );
      
    } else if (behaviorType && behaviorType.includes("Good News")) {
      // Handle Good News behavior
      const location = getFormValue(formValues, "Location (Good News)");
      const behaviors = getFormValue(formValues, "Good News Behaviors");
      const comments = getFormValue(formValues, "Additional comments about the selected \"Good News\" behavior:");
      
      // Determine relevant pillars based on behaviors
      const selectedPillars = determinePillarsFromBehaviors(behaviorType, behaviors);
      
      // Send Good News email with parent names and pillars
      sendGoodNewsEmail(
        studentFirst, 
        studentLast, 
        parent1Email, 
        parent2Email, 
        location, 
        behaviors, 
        comments,
        teacherEmail,
        teacherName,
        parent1First,
        parent2First,
        null, // ccList - default is empty
        selectedPillars // Pass the identified pillars
      );
    } else {
      Logger.log(`Unrecognized behavior type: "${behaviorType}"`);
    }
    
    // Log successful processing
    Logger.log(`Successfully processed form submission for ${studentFirst} ${studentLast}`);
    
  } catch (error) {
    // Log any errors
    Logger.log(`Error processing form submission: ${error.toString()}`);
    Logger.log(`Error stack: ${error.stack}`);
    MailApp.sendEmail(
      Session.getEffectiveUser().getEmail(),
      "Error in Behavior Form Email System",
      `There was an error processing a behavior form: ${error.toString()}\n\nStack trace: ${error.stack}`
    );
  }
}

/**
 * Helper function to get teacher name from email
 */
function getTeacherName(email) {
  // Default name if we can't find a better one
  let teacherName = "Your Teacher";
  
  try {
    // Try to extract a name from the email
    const emailName = email.split('@')[0];
    // Convert from format like "john.doe" to "John Doe"
    if (emailName.includes('.')) {
      teacherName = emailName.split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
  } catch (e) {
    Logger.log(`Error getting teacher name: ${e.toString()}`);
  }
  
  return teacherName;
}

/**
 * Sends a Stop and Think email to parents with optional CC to administrators
 * Updated to include parent names, CC list, and selected pillars.
 */
function sendStopAndThinkEmail(studentFirst, studentLast, parent1Email, parent2Email, location, behaviors, comments, teacherEmail, teacherName, parent1First, parent2First, ccList, selectedPillars) {
  const subject = CONFIG.EMAIL_SUBJECT_STOP_THINK;

  // Create the email body - passing pillars and parent names
  let body = createStopThinkEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars);

  // Send email to parents with optional CC to admins
  sendEmailToParents(subject, body, parent1Email, parent2Email, teacherEmail, teacherName, ccList);
}

/**
 * Sends a Good News email to parents with optional CC to administrators
 * Updated to include parent names, CC list, and selected pillars.
 */
function sendGoodNewsEmail(studentFirst, studentLast, parent1Email, parent2Email, location, behaviors, comments, teacherEmail, teacherName, parent1First, parent2First, ccList, selectedPillars) {
  const subject = CONFIG.EMAIL_SUBJECT_GOOD_NEWS;

  // Create the email body - passing pillars and parent names
  let body = createGoodNewsEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars);

  // Send email to parents with optional CC to admins
  sendEmailToParents(subject, body, parent1Email, parent2Email, teacherEmail, teacherName, ccList);
}

/**
 * Creates HTML content safely without syntax errors
 * Add this to your WebAppBehaviorForm.txt file
 */
function buildSafeHTML(parts) {
  // Takes an array of HTML parts and joins them safely
  return parts.join("");
}

function createSimplifiedEmailBody(type, studentFirst, studentLast, parent1First, parent2First,
                                location, behaviors, comments, teacherName, selectedPillars = []) {
  // Sanitize inputs
  const safeStudentFirst = studentFirst ? studentFirst.replace(/[<>]/g, '') : '';
  const safeLocation = location ? location.replace(/[<>]/g, '') : '';
  const safeComments = comments ? comments.replace(/[<>]/g, '') : ''; // Basic sanitize
  const safeTeacherName = teacherName ? teacherName.replace(/[<>]/g, '') : '';
  const safeParent1First = parent1First ? parent1First.replace(/[<>]/g, '') : '';
  const safeParent2First = parent2First ? parent2First.replace(/[<>]/g, '') : '';

  // Format parent greeting
  let parentGreeting = "Dear";
  if (safeParent1First && safeParent1First.trim() !== '') {
    parentGreeting += ` ${safeParent1First}`;
    if (safeParent2First && safeParent2First.trim() !== '') {
      parentGreeting += ` & ${safeParent2First}`;
    }
  } else {
    parentGreeting += " Parent";
  }

  // Location with article
  const locationWithArticle = safeLocation.toLowerCase().startsWith('the ') || safeLocation.toLowerCase().startsWith('a ') || safeLocation.toLowerCase().startsWith('an ') ?
    safeLocation : `the ${safeLocation}`;

  // --- NEW: Pillar Integration ---
  let pillarColor = "#dddddd"; // Default header/border color
  let pillarListHtml = "";
  if (selectedPillars && selectedPillars.length > 0) {
    const firstPillarName = selectedPillars[0];
    const firstPillarData = PILLARS_DATA.find(p => p.name === firstPillarName);
    if (firstPillarData) {
      pillarColor = firstPillarData.color;
    }

    pillarListHtml = `<p style="margin-top: 10px;"><strong>Character Pillar${selectedPillars.length > 1 ? 's' : ''} Involved:</strong> ${selectedPillars.map(pName => {
        const pData = PILLARS_DATA.find(p => p.name === pName);
        // Style the pillar name with its color
        return pData ? `<span style="color:${pData.color}; font-weight:bold;">${pData.name}</span>` : pName;
      }).join(', ')}</p>`;
  }
  // --- END NEW ---


  // Format behaviors (expecting an array now)
  let cleanedBehaviors = "";
  if (Array.isArray(behaviors) && behaviors.length > 0) {
     // Simple list for now
     cleanedBehaviors = "<ul>" + behaviors.map(b => `<li>${b.replace(/[<>]/g, '')}</li>`).join('') + "</ul>";
  } else if (typeof behaviors === 'string' && behaviors) {
     // Fallback for string, basic display
     cleanedBehaviors = `<p>${behaviors.replace(/[<>]/g, '')}</p>`;
  }


  // Build email parts
  const htmlParts = [];

  // Head and style
  htmlParts.push("<!DOCTYPE html><html><head><style>");
  htmlParts.push("body{font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#333;max-width:600px;margin:0 auto;padding:20px;}");
  htmlParts.push(".email-container{border:1px solid #ddd;border-radius:8px;overflow:hidden;}");
  // --- NEW: Use pillar color for header border ---
  htmlParts.push(`.header{padding:15px 20px; border-top: 5px solid ${pillarColor}; border-bottom:1px solid #ddd;}`);
  // --- END NEW ---

  // Header text styling based on type
  if (type === 'goodnews') {
    htmlParts.push(".header h2{margin:0;color:#2e7d32;font-size:20px;}"); // Greenish for good news title
  } else {
    htmlParts.push(".header h2{margin:0;color:#b71c1c;font-size:20px;}"); // Reddish for stop/think title
  }

  htmlParts.push(".date{font-size:14px;margin-top:5px; color: #555;}");
  htmlParts.push(".content{padding:20px;background-color:#fff;}");
  htmlParts.push(".comments-box{background-color:#f5f5f5;padding:15px;margin:15px 0;border-radius:4px;border-left: 4px solid #ccc;}");
  htmlParts.push(".comments-box strong { color: #333; }"); // Style comment header
  htmlParts.push(".footer{background-color:#f9f9f9;padding:12px 20px;font-size:12px;color:#777;border-top:1px solid #ddd;}");
  htmlParts.push("</style></head><body>");

  // Email content
  htmlParts.push("<div class=\"email-container\">");

  // Header
  const headerTitle = type === 'goodnews' ? `Good News about ${safeStudentFirst}!` : `Behavior Update for ${safeStudentFirst}`;
  htmlParts.push(`<div class="header"><h2>${headerTitle}</h2>`);
  htmlParts.push(`<div class="date">Date: ${new Date().toLocaleDateString()}</div></div>`);

  // Content Area
  htmlParts.push("<div class=\"content\">");

  // Greeting
  htmlParts.push(`<p>${parentGreeting},</p>`);

  // Main message
  if (type === 'goodnews') {
    htmlParts.push(`<p>We wanted to share some positive news! Today, ${safeStudentFirst} demonstrated positive character traits in ${locationWithArticle}. Specifically, we observed:</p>`);
  } else {
    htmlParts.push(`<p>${safeStudentFirst} had a "Stop and Think" moment today in ${locationWithArticle}. This involved the following behavior${behaviors.length > 1 ? 's' : ''}:</p>`);
  }

  // Behaviors List
  htmlParts.push(cleanedBehaviors);

  // --- NEW: Insert Pillar List ---
  htmlParts.push(pillarListHtml);
  // --- END NEW ---

  // Add comments if available
  if (safeComments && safeComments.trim() !== "") {
    // Use nl2br for comments to preserve line breaks
    const commentsWithBreaks = safeComments.replace(/\n/g, '<br>');
    htmlParts.push(`<div class="comments-box"><p><strong>Teacher's Comments:</strong><br>${commentsWithBreaks}</p></div>`);
  }

  // Closing message based on type
  if (type === 'goodnews') {
    htmlParts.push(`<p>We recognized ${safeStudentFirst} for these positive actions contributing to our school community. Please join us in celebrating this achievement!</p>`);
  } else {
    htmlParts.push(`<p>These moments provide opportunities for growth and learning about making positive choices. We encourage you to discuss this with ${safeStudentFirst} at home to reinforce expectations for behavior at school.</p>`);
    htmlParts.push(`<p>If you have any questions, please don't hesitate to reach out.</p>`);
  }

  // Signature
  htmlParts.push(`<p>Sincerely,</p><p>${safeTeacherName}</p>`);

  // Footer
  htmlParts.push("</div>"); // End of content div
  htmlParts.push(`<div class="footer"><p>This message was sent from the ${CONFIG.SCHOOL_NAME} Behavior System.</p></div>`);
  htmlParts.push("</div></body></html>");

  // Join parts safely
  return buildSafeHTML(htmlParts); // Assumes buildSafeHTML exists and simply joins the array
}

/**
 * Creates the email body for Good News behaviors
 * Passes parent names and pillars to the simplified body creator.
 */
function createGoodNewsEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars) {
  // Use the simplified body function, passing all necessary arguments including pillars
  return createSimplifiedEmailBody(
    'goodnews',
    studentFirst, studentLast,
    parent1First, parent2First,
    location, behaviors, comments, teacherName,
    selectedPillars // Pass pillars
  );
}

/**
 * Creates the email body for Stop and Think behaviors
 * Passes parent names and pillars to the simplified body creator.
 */
function createStopThinkEmailBody(studentFirst, studentLast, location, behaviors, comments, teacherName, parent1First, parent2First, selectedPillars) {
  // Use the simplified body function, passing all necessary arguments including pillars
  return createSimplifiedEmailBody(
    'stopthink',
    studentFirst, studentLast,
    parent1First, parent2First,
    location, behaviors, comments, teacherName,
    selectedPillars // Pass pillars
  );
}

/**
 * Sends an email to parents, handling multiple recipients and CC list.
 *
 * @param {string} subject The email subject.
 * @param {string} body The HTML email body.
 * @param {string} parent1Email First parent's email address.
 * @param {string} parent2Email Second parent's email address.
 * @param {string} teacherEmail Teacher's email address (for 'from' and 'replyTo').
 * @param {string} teacherName Teacher's name (for display).
 * @param {string[]} [ccList=[]] An array of email addresses to CC.
 */
function sendEmailToParents(subject, body, parent1Email, parent2Email, teacherEmail, teacherName, ccList = []) {
  const recipients = [];
  if (parent1Email && parent1Email.trim() !== "" && parent1Email.includes('@')) {
    recipients.push(parent1Email.trim());
  }
  if (parent2Email && parent2Email.trim() !== "" && parent2Email.includes('@') && !recipients.includes(parent2Email.trim())) {
    // Avoid adding duplicate email if parents share one
    recipients.push(parent2Email.trim());
  }

  // Filter and join valid CC emails
  const validCcList = ccList.filter(email => email && email.trim() !== "" && email.includes('@'));
  const ccEmails = validCcList.join(',');

  if (recipients.length > 0) {
    const emailTo = recipients.join(',');
    const mailOptions = {
      htmlBody: body,
      name: teacherName, // Display name for the sender
      replyTo: teacherEmail,
      cc: ccEmails // Add CC recipients if any
    };

    if (CONFIG.SEND_EMAILS) {
      try {
         // Prefer GmailApp to send "from" the teacher if permissions allow
        mailOptions.from = teacherEmail; // Set the "from" address for GmailApp
        GmailApp.sendEmail(emailTo, subject, "", mailOptions); // Plain text body is ignored when htmlBody is present
        Logger.log(`Email sent via GmailApp from ${teacherEmail} to: ${emailTo}${ccEmails ? ', CC: ' + ccEmails : ''}`);
      } catch (e) {
         // Fallback to MailApp if GmailApp fails (permissions, etc.)
        Logger.log(`GmailApp failed (likely permissions): ${e.toString()}. Falling back to MailApp.`);
        // Remove 'from' if using MailApp, as it sends from the script owner or a generic address
        delete mailOptions.from;
        mailOptions.name = `${teacherName} (via ${CONFIG.SCHOOL_NAME} System)`; // Modify sender name for MailApp
        mailOptions.to = emailTo;
        mailOptions.subject = subject;
        MailApp.sendEmail(mailOptions);
        Logger.log(`Email sent via MailApp (system sender) to: ${emailTo}${ccEmails ? ', CC: ' + ccEmails : ''}`);
      }
    } else {
      Logger.log(`--- TEST MODE ---`);
      Logger.log(`Would send email from: ${teacherEmail}`);
      Logger.log(`To: ${emailTo}`);
      if (ccEmails) Logger.log(`CC: ${ccEmails}`);
      Logger.log(`Subject: ${subject}`);
      Logger.log(`HTML Body Length: ${body.length}`);
      // Logger.log(`Body: ${body}`); // Optional: log full body, can be long
    }
  } else {
    Logger.log("No valid parent email addresses found. Email not sent.");
  }
}

/**
 * Creates a menu item in the Google Sheet to run functions manually
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Behavior System')
    .addItem('Create Form Submit Trigger', 'createFormSubmitTrigger')
    .addSeparator()
    .addItem('Test Good News Email', 'testGoodNewsEmail')
    .addItem('Test Stop and Think Email', 'testStopThinkEmail')
    .addSeparator()
    .addItem('Process All Form Responses', 'processAllFormResponses')
    .addItem('Log Form Field Names', 'logFormFieldNames')
    .addSeparator()
    .addSubMenu(ui.createMenu('Admin Daily Summary')
      .addItem('Setup Daily Summary Trigger (3PM)', 'checkAndCreateDailySummaryTrigger')
      .addItem('Remove Daily Summary Trigger', 'removeDailySummaryTrigger')
      .addItem('Send Test Summary Email Now', 'sendTestDailySummaryEmail')
    )
    .addToUi();
}

/**
 * Useful function to debug form field names
 */
function logFormFieldNames() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
  
  // Get header row
  const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Log all column headers
  Logger.log("Form field names:");
  headerRow.forEach((header, index) => {
    Logger.log(`Column ${index + 1}: "${header}"`);
  });
  
  // Show a notification
  SpreadsheetApp.getActiveSpreadsheet().toast(
    "Column headers logged. Check View > Logs to see field names.",
    "Field Names Logged"
  );
}

/**
 * Test Functions
 */
function testGoodNewsEmail() {
  sendGoodNewsEmail(
    "Sarah", 
    "Johnson", 
    "parent1@example.com", 
    "parent2@example.com", 
    "Classroom", 
    "helping others, showing kindness", 
    "Sarah helped a classmate who was struggling with their work.",
    Session.getEffectiveUser().getEmail(),
    "Test Teacher"
  );
}

function testStopThinkEmail() {
  sendStopAndThinkEmail(
    "John", 
    "Smith", 
    "parent1@example.com", 
    "parent2@example.com", 
    "Classroom", 
    "calling out, needing frequent reminders", 
    "John had difficulty focusing during math today.",
    Session.getEffectiveUser().getEmail(),
    "Test Teacher"
  );
}

/**
 * Processes all form responses and sends emails for each
 * Use this to catch up if the trigger wasn't working
 */
function processAllFormResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.BEHAVIOR_FORM);
  
  // Get all data
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Create a map of column indices to field names
  const fieldMap = {};
  headers.forEach((header, index) => {
    fieldMap[header] = index;
  });
  
  // Log the field map for debugging
  Logger.log("Field map:");
  Logger.log(JSON.stringify(fieldMap));
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Build namedValues object dynamically based on headers
    const namedValues = {};
    headers.forEach((header, index) => {
      namedValues[header] = [row[index]];
    });
    
    // Process this response
    const formResponse = { namedValues: namedValues };
    
    try {
      onFormSubmit(formResponse);
      
      // Add a small delay to avoid hitting quotas
      Utilities.sleep(1000);
    } catch (error) {
      Logger.log(`Error processing row ${i+1}: ${error.toString()}`);
    }
  }
  
  // Show a notification that processing is complete
  SpreadsheetApp.getActiveSpreadsheet().toast("All form responses have been processed!", "Process Complete");
}
