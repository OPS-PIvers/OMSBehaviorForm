/**
 * Pillar Data Management System
 * 
 * This script manages the pillar data by storing it across multiple sheets for easier editing.
 * It handles the creation, population, and reading of this data.
 */

// Global variable to hold the reconstructed pillar data.
var PILLARS_DATA = [];

// Sheet names are now loaded from CONFIG via loadConstants()

/**
 * Loads all pillar data from the respective sheets and reconstructs the PILLARS_DATA object.
 * This function should be called at the start of any process that relies on this data.
 * 
 * @returns {boolean} True if the data was loaded successfully, false otherwise.
 */
function loadPillarsData() {
    loadConstants(); // Load constants first
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Read data from all pillar-related sheets
    const pillarsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.PILLARS);
    const posBehaviorsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.POSITIVE_BEHAVIORS);
    const posRecognitionSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.POSITIVE_RECOGNITION);
    const negBehaviorsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.NEGATIVE_BEHAVIORS);
    const learningFocusSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LEARNING_FOCUS);

    if (!pillarsSheet || !posBehaviorsSheet || !posRecognitionSheet || !negBehaviorsSheet || !learningFocusSheet) {
        Logger.log("One or more pillar sheets are missing. Please run the setup function.");
        setupPillarsSheets(); // Attempt to set them up
        // Re-attempt to load after setup
        return loadPillarsData();
    }

    // Get all data from sheets
    const pillarsData = pillarsSheet.getDataRange().getValues();
    const posBehaviorsData = posBehaviorsSheet.getDataRange().getValues();
    const posRecognitionData = posRecognitionSheet.getDataRange().getValues();
    const negBehaviorsData = negBehaviorsSheet.getDataRange().getValues();
    const learningFocusData = learningFocusSheet.getDataRange().getValues();

    // Reconstruct the PILLARS_DATA object
    PILLARS_DATA = reconstructPillars(pillarsData, posBehaviorsData, posRecognitionData, negBehaviorsData, learningFocusData);
    
    Logger.log(`Successfully loaded data for ${PILLARS_DATA.length} pillars.`);
    return PILLARS_DATA.length > 0;
}

/**
 * Reconstructs the PILLARS_DATA array from the raw sheet data.
 * @param {Array<Array<string>>} pillars - Data from the "Pillars" sheet.
 * @param {Array<Array<string>>} posBehaviors - Data from the "PositiveBehaviors" sheet.
 * @param {Array<Array<string>>} posRecognition - Data from the "PositiveRecognitionExamples" sheet.
 * @param {Array<Array<string>>} negBehaviors - Data from the "NegativeBehaviors" sheet.
 * @param {Array<Array<string>>} learningFocus - Data from the "LearningFocus" sheet.
 * @returns {Array<Object>} The reconstructed PILLARS_DATA array.
 */
function reconstructPillars(pillars, posBehaviors, posRecognition, negBehaviors, learningFocus) {
    const pillarsMap = new Map();

    // Helper to group items by pillar name from a given sheet's data
    const groupItemsByPillar = (data) => {
        const map = new Map();
        for (let i = 1; i < data.length; i++) { // Skip header
            const pillarName = data[i][0];
            const item = data[i][1];
            if (pillarName && item) {
                if (!map.has(pillarName)) {
                    map.set(pillarName, []);
                }
                map.get(pillarName).push(item);
            }
        }
        return map;
    };

    const posBehaviorsMap = groupItemsByPillar(posBehaviors);
    const posRecognitionMap = groupItemsByPillar(posRecognition);
    const negBehaviorsMap = groupItemsByPillar(negBehaviors);
    const learningFocusMap = groupItemsByPillar(learningFocus);

    // Process the main "Pillars" sheet to build the base objects
    for (let i = 1; i < pillars.length; i++) { // Skip header
        const row = pillars[i];
        const name = row[0];
        if (name) {
            pillarsMap.set(name, {
                name: name,
                color: row[1] || "#000000",
                iconSymbol: row[2] || "",
                description: row[3] || "",
                positiveBehaviors: posBehaviorsMap.get(name) || [],
                positiveRecognitionExamples: posRecognitionMap.get(name) || [],
                negativeBehaviors: negBehaviorsMap.get(name) || [],
                learningFocus: learningFocusMap.get(name) || []
            });
        }
    }

    return Array.from(pillarsMap.values());
}

/**
 * Sets up all the necessary sheets for pillar data management.
 * Creates sheets if they don't exist and populates them with default data.
 */
function setupPillarsSheets() {
    loadConstants(); // Load constants first
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const defaultPillars = getDefaultPillarsData(); // Get the hardcoded default data

    // --- 1. Setup "Pillars" Sheet ---
    let pillarsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.PILLARS);
    if (!pillarsSheet) {
        pillarsSheet = ss.insertSheet(CONFIG.SHEET_NAMES.PILLARS);
    }
    pillarsSheet.clear();
    pillarsSheet.getRange("A1:D1").setValues([["Pillar Name", "Color", "Icon Symbol", "Description"]]).setFontWeight("bold");
    const pillarCoreData = defaultPillars.map(p => [p.name, p.color, p.iconSymbol, p.description]);
    if (pillarCoreData.length > 0) {
        pillarsSheet.getRange(2, 1, pillarCoreData.length, 4).setValues(pillarCoreData);
    }
    pillarsSheet.autoResizeColumns(1, 4);

    // --- 2. Setup Related Data Sheets ---
    const setupRelatedSheet = (sheetName, dataKey, header) => {
        let sheet = ss.getSheetByName(sheetName);
        if (!sheet) {
            sheet = ss.insertSheet(sheetName);
        }
        sheet.clear();
        sheet.getRange("A1:B1").setValues([["Pillar Name", header]]).setFontWeight("bold");
        const relatedData = [];
        defaultPillars.forEach(pillar => {
            if (pillar[dataKey] && pillar[dataKey].length > 0) {
                pillar[dataKey].forEach(item => {
                    relatedData.push([pillar.name, item]);
                });
            }
        });
        if (relatedData.length > 0) {
            sheet.getRange(2, 1, relatedData.length, 2).setValues(relatedData);
        }
        sheet.autoResizeColumns(1, 2);
    };

    setupRelatedSheet(CONFIG.SHEET_NAMES.POSITIVE_BEHAVIORS, 'positiveBehaviors', 'Positive Behavior');
    setupRelatedSheet(CONFIG.SHEET_NAMES.POSITIVE_RECOGNITION, 'positiveRecognitionExamples', 'Recognition Example');
    setupRelatedSheet(CONFIG.SHEET_NAMES.NEGATIVE_BEHAVIORS, 'negativeBehaviors', 'Negative Behavior');
    setupRelatedSheet(CONFIG.SHEET_NAMES.LEARNING_FOCUS, 'learningFocus', 'Learning Focus');

    SpreadsheetApp.getActiveSpreadsheet().toast('Pillar sheets have been set up successfully.');
}

/**
 * Adds a menu item to the Google Sheet UI to run the pillar setup function.
 */
function addPillarsMenu() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Admin')
        .addItem('Setup Pillars Sheets', 'setupPillarsSheets')
        .addToUi();
}

/**
 * Returns the default hardcoded PILLARS_DATA object.
 * This is used to initially populate the sheets.
 * @returns {Array<Object>} The default pillar data.
 */
function getDefaultPillarsData() {
    // This is the original hardcoded data from EmailSystem.js
    return [
      {
        name: "Trustworthiness",
        color: "#00008B",
        iconSymbol: "✋",
        description: "Building honesty, reliability, and integrity.",
        positiveBehaviors: [
          "telling the truth, even when difficult",
          "completing work with academic honesty",
          "returning found items to rightful owners",
          "following through on commitments and promises",
          "avoiding the spread of rumors or gossip",
          "being reliable and dependable in group settings",
          "using digital resources ethically (e.g., citing sources, submitting ones' own original work)"
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
          "copying work, cheating, or plagiarizing",
          "taking items that belong to others",
          "breaking promises or commitments",
          "participating in gossip or spreading rumors",
          "blaming others unfairly to avoid consequences",
          "misrepresenting online sources or plagiarizing digital work"
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
        color: "#FFBF00",
        iconSymbol: "🤝",
        description: "Treating others, property, and oneself with consideration.",
        positiveBehaviors: [
          "using polite and appropriate language with peers and adults",
          "listening actively and waiting for one's turn to speak",
          "handling personal and school property carefully",
          "following rules and directions willingly",
          "expressing disagreements calmly and respectfully",
          "showing appreciation for diverse perspectives and backgrounds",
          "engaging in respectful online communication"
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
          "communicating with disrespectful, rude, or offensive language",
          "showing disrespect through tone, gestures, or expressions",
          "wrestling with other students or not keeping hands to self",
          "ignoring or defying reasonable instructions",
          "mocking, teasing, or putting others down",
          "engaging in disrespectful or inappropriate online interactions"
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
        color: "#228B22",
        iconSymbol: "⭐",
        description: "Taking ownership of actions, duties, and learning.",
        positiveBehaviors: [
          "submitting assignments on time and completed thoughtfully",
          "coming prepared for class with necessary materials",
          "cleaning up one's own workspace and shared areas",
          "acknowledging mistakes and learning from them",
          "taking good care of borrowed or shared items",
          "completing assigned tasks and chores reliably",
          "persisting through challenges and seeking help appropriately",
          "managing time effectively for assignments and projects"
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
          "struggling to manage deadlines for assignments/projects"
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
        color: "#FF8C00",
        iconSymbol: "⚖️",
        description: "Playing by the rules, taking turns, and being open-minded.",
        positiveBehaviors: [
          "taking turns and sharing opportunities equitably",
          "playing games and participating according to rules",
          "listening openly to different viewpoints before judging",
          "actively including others in activities and groups",
          "sharing resources appropriately and considering others' needs",
          "treating everyone impartially and justly"
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
          "blaming others unjustly or showing favoritism"
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
        color: "#DC143C",
        iconSymbol: "❤️",
        description: "Showing kindness, compassion, and empathy towards others.",
        positiveBehaviors: [
          "offering help or support to peers in need",
          "comforting or showing empathy towards others experiencing difficulty",
          "communicating with kind words and giving genuine compliments",
          "welcoming new students or including peers who seem left out",
          "expressing gratitude and appreciation towards others",
          "sharing items willingly and thoughtfully",
          "standing up for peers respectfully when witnessing unkindness"
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
          "being insensitive to the feelings of others"
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
        color: "#4B0082",
        iconSymbol: "🏠",
        description: "Contributing positively to the school and community.",
        positiveBehaviors: [
          "following school and classroom rules consistently",
          "working cooperatively and respectfully with peers in groups",
          "helping keep school spaces clean, orderly, and safe",
          "showing respect for school staff, volunteers, and visitors",
          "participating positively in school events and activities",
          "contributing to a safe and welcoming school environment",
          "reporting safety concerns or rule violations responsibly",
          "demonstrating appropriate and ethical use of school technology"
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
          "misusing school technology or accessing inappropriate content"
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
}
