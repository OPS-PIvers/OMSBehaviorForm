/**
 * Global configuration settings
 */
const CONFIG = {
  SCHOOL_NAME: "Orono Middle School", // Or your actual school name
  EMAIL_SUBJECT_GOOD_NEWS: "Good News about your child - Demonstrating Character!", // Updated Subject
  EMAIL_SUBJECT_STOP_THINK: "Behavior Update - Opportunity for Growth", // Updated Subject
  SHEET_NAMES: {
    DIRECTORY: "Directory",        // Verify this sheet name
    BEHAVIOR_FORM: "Behavior Form" // Verify this sheet name
  },
  ADMIN_EMAILS: {
    PRINCIPAL: "paul.ivers@orono.k12.mn.us", // Replace with actual principal email
    ASSOCIATE_PRINCIPAL: "paul.ivers@orono.k12.mn.us" // Replace with actual associate principal email
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
      "Telling the truth, even when difficult",
      "Completing work with academic honesty", // Slightly refined
      "Returning found items to rightful owners",
      "Following through on commitments and promises",
      "Avoiding the spread of rumors or gossip",
      "Being reliable and dependable in group settings",
      "Using digital resources ethically (e.g., citing sources, submitting ones' own original work)" // Added digital aspect
    ],
    positiveRecognitionExamples: [
      "Showed great integrity by being honest today.",
      "Demonstrated academic honesty on their work.",
      "Acted responsibly by returning a found item.",
      "Followed through reliably on a commitment.",
      "Chose not to participate in gossip.",
      "Was a trustworthy and dependable group member.",
      "Showed digital responsibility in their work."
    ],
    negativeBehaviors: [
      "Being dishonest or misleading others",
      "Copying work, cheating, or plagiarizing", // Refined
      "Taking items that belong to others",
      "Breaking promises or commitments",
      "Participating in gossip or spreading rumors",
      "Blaming others unfairly to avoid consequences",
      "Misrepresenting online sources or plagiarizing digital work" // Added digital aspect
    ],
    learningFocus: [
      "Developing honesty, even when it's challenging.",
      "Understanding and practicing academic integrity.",
      "Respecting others' property and belongings.",
      "Learning the importance of keeping one's word.",
      "Building skills to avoid participating in or spreading gossip.",
      "Developing reliability and accountability.",
      "Learning responsible digital research and citation skills."
    ]
  },
  {
    name: "Respect",
    color: "#FFBF00", // Amber/Yellow
    iconSymbol: "🤝",
    description: "Treating others, property, and oneself with consideration.",
    positiveBehaviors: [
      "Using polite and appropriate language with peers and adults", // Refined
      "Listening actively and waiting for one's turn to speak", // Refined
      "Handling personal and school property carefully", // Refined
      "Following rules and directions willingly",
      "Expressing disagreements calmly and respectfully",
      "Showing appreciation for diverse perspectives and backgrounds", // Refined
      "Engaging in respectful online communication" // Added digital aspect
    ],
    positiveRecognitionExamples: [
      "Communicated respectfully with others today.",
      "Listened attentively during discussions.",
      "Handled materials responsibly.",
      "Followed directions cooperatively.",
      "Expressed opinions respectfully.",
      "Showed appreciation for different viewpoints.",
      "Demonstrated respectful online behavior."
    ],
    negativeBehaviors: [
      "Interrupting or talking over others frequently",
      "Using disrespectful, rude, or offensive language", // Refined
      "Showing disrespect through tone, gestures, or expressions",
      "Damaging or misusing property (personal or school)",
      "Ignoring or defying reasonable instructions",
      "Mocking, teasing, or putting others down",
      "Engaging in disrespectful or inappropriate online interactions" // Added digital aspect
    ],
    learningFocus: [
      "Practicing active listening and patience in conversations.",
      "Developing constructive communication and appropriate language.",
      "Learning to show respect through actions and body language.",
      "Understanding the importance of caring for property.",
      "Learning to follow directions and school expectations.",
      "Building empathy and respectful ways to interact.",
      "Developing positive digital communication habits."
    ]
  },
  {
    name: "Responsibility",
    color: "#228B22", // Forest Green
    iconSymbol: "⭐",
    description: "Taking ownership of actions, duties, and learning.",
    positiveBehaviors: [
      "Submitting assignments on time and completed thoughtfully", // Refined
      "Coming prepared for class with necessary materials",
      "Cleaning up one's own workspace and shared areas", // Refined
      "Acknowledging mistakes and learning from them",
      "Taking good care of borrowed or shared items",
      "Completing assigned tasks and chores reliably",
      "Persisting through challenges and seeking help appropriately", // Refined
      "Managing time effectively for assignments and projects" // Added
    ],
    positiveRecognitionExamples: [
      "Submitted thoughtful work on time.",
      "Came to class well-prepared today.",
      "Helped keep our space tidy.",
      "Took responsibility for a mistake and learned from it.",
      "Cared for shared materials responsibly.",
      "Completed assigned tasks reliably.",
      "Showed perseverance on a challenging task.",
      "Managed time effectively on the recent assignment."
    ],
    negativeBehaviors: [
      "Frequently submitting late or incomplete work",
      "Often forgetting necessary assignments or materials",
      "Leaving personal or shared areas messy or disorganized",
      "Making excuses or blaming others for mistakes",
      "Losing or damaging items carelessly",
      "Being unprepared for class activities or discussions",
      "Giving up easily when tasks become challenging",
      "Struggling to manage deadlines for assignments/projects" // Added
    ],
    learningFocus: [
      "Developing organizational skills for assignments.",
      "Building habits for preparedness and organization.",
      "Learning to take responsibility for personal and shared spaces.",
      "Developing accountability and a growth mindset.",
      "Practicing care for personal and shared belongings.",
      "Strengthening preparedness for learning.",
      "Building resilience and problem-solving skills.",
      "Improving time management and planning skills."
    ]
  },
  {
    name: "Fairness",
    color: "#FF8C00", // Dark Orange
    iconSymbol: "⚖️",
    description: "Playing by the rules, taking turns, and being open-minded.",
    positiveBehaviors: [
      "Taking turns and sharing opportunities equitably", // Refined
      "Playing games and participating according to rules",
      "Listening openly to different viewpoints before judging", // Refined
      "Actively including others in activities and groups",
      "Sharing resources appropriately and considering others' needs",
      "Treating everyone impartially and justly" // Refined
    ],
    positiveRecognitionExamples: [
      "Shared materials/opportunities fairly with others.",
      "Played fairly and followed the rules.",
      "Listened open-mindedly to different ideas.",
      "Made an effort to include others today.",
      "Shared resources thoughtfully.",
      "Treated peers in a fair and just manner."
    ],
    negativeBehaviors: [
      "Cutting ahead, skipping turns, or dominating activities",
      "Cheating or disregarding rules in games/activities",
      "Ignoring different perspectives or being closed-minded",
      "Deliberately excluding peers from activities or groups",
      "Using more resources than necessary or permitted",
      "Blaming others unjustly or showing favoritism" // Refined
    ],
    learningFocus: [
      "Practicing sharing and taking turns.",
      "Understanding the importance of rules and fair play.",
      "Developing open-mindedness and considering diverse views.",
      "Building inclusive behaviors and empathy.",
      "Learning to share resources equitably.",
      "Developing impartiality and avoiding bias."
    ]
  },
  {
    name: "Caring",
    color: "#DC143C", // Crimson Red
    iconSymbol: "❤️",
    description: "Showing kindness, compassion, and empathy towards others.",
    positiveBehaviors: [
      "Offering help or support to peers in need",
      "Comforting or showing empathy towards others experiencing difficulty",
      "Using kind words and giving genuine compliments",
      "Welcoming new students or including peers who seem left out", // Refined
      "Expressing gratitude and appreciation towards others",
      "Sharing items willingly and thoughtfully",
      "Standing up for peers respectfully when witnessing unkindness" // Refined
    ],
    positiveRecognitionExamples: [
      "Showed kindness by helping a peer.",
      "Was compassionate and supportive to someone today.",
      "Used kind words that made a positive impact.",
      "Made an effort to welcome or include someone.",
      "Expressed gratitude thoughtfully.",
      "Shared generously with others.",
      "Acted as a supportive friend/classmate."
    ],
    negativeBehaviors: [
      "Being unkind, teasing, or making fun of others",
      "Ignoring peers who clearly need assistance or support",
      "Engaging in mean-spirited gossip or spreading rumors",
      "Laughing at the mistakes or struggles of others",
      "Acting selfishly or disregarding the feelings/needs of others",
      "Excluding others purposefully from groups or activities",
      "Being insensitive to the feelings of others" // Added
    ],
    learningFocus: [
      "Cultivating empathy and kindness in interactions.",
      "Developing awareness of others' needs and offering support.",
      "Practicing positive communication and avoiding gossip.",
      "Building sensitivity to how words/actions affect others.",
      "Learning to consider others' perspectives and needs.",
      "Developing inclusive social skills.",
      "Increasing awareness and sensitivity to others' feelings."
    ]
  },
  {
    name: "Citizenship",
    color: "#4B0082", // Indigo/Purple
    iconSymbol: "🏠",
    description: "Contributing positively to the school and community.",
    positiveBehaviors: [
      "Following school and classroom rules consistently",
      "Working cooperatively and respectfully with peers in groups",
      "Helping keep school spaces clean, orderly, and safe", // Refined
      "Showing respect for school staff, volunteers, and visitors", // Refined
      "Participating positively in school events and activities",
      "Contributing to a safe and welcoming school environment",
      "Reporting safety concerns or rule violations responsibly",
      "Using school technology appropriately and ethically" // Added digital citizenship
    ],
    positiveRecognitionExamples: [
      "Followed classroom/school rules reliably.",
      "Collaborated effectively and respectfully in a group.",
      "Helped maintain a positive school environment.",
      "Showed respect for adults in the school community.",
      "Participated positively in a school activity.",
      "Contributed to a welcoming atmosphere.",
      "Acted responsibly regarding a safety/rule concern.",
      "Used school technology responsibly today."
    ],
    negativeBehaviors: [
      "Breaking or consistently ignoring established rules",
      "Littering or failing to clean up after oneself",
      "Damaging school property intentionally or carelessly",
      "Refusing to cooperate or being disruptive in groups",
      "Disrupting the learning environment for others",
      "Ignoring or violating safety procedures",
      "Avoiding participation or contributing negatively to activities",
      "Misusing school technology or accessing inappropriate content" // Added digital citizenship
    ],
    learningFocus: [
      "Understanding and respecting community rules.",
      "Developing responsibility for shared spaces.",
      "Learning to respect property and resources.",
      "Building collaboration and teamwork skills.",
      "Understanding one's impact on the learning environment.",
      "Developing awareness of safety procedures.",
      "Learning the value of positive participation.",
      "Practicing responsible and ethical technology use."
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
