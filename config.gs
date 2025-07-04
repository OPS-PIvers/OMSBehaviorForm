/**
 * ================================================================================
 * CONFIGURATION AND CONSTANTS
 * ================================================================================
 * Student Behavior Management System - Core Configuration
 * This file contains all system constants and configuration management
 */

// =============================================================================
// ATTRIBUTION CONSTANTS - MODIFY THESE FOR YOUR DISTRICT
// =============================================================================
const ATTRIBUTION = {
  CREATED_BY: "Your District Name",
  CONTACT_EMAIL: "behavior-system@your-district.edu",
  WEBSITE: "https://your-district.edu",
  VERSION: "1.0.0",
  YEAR: "2025",
  SUPPORT_PHONE: "(555) 123-4567",
  DEPARTMENT: "Educational Technology Department",
  LICENSE: "Educational Use License - Free for Schools"
};

// =============================================================================
// SYSTEM CONFIGURATION
// =============================================================================
const SYSTEM_CONFIG = {
  SHEETS: {
    CONFIG: "System Configuration",
    DIRECTORY: "Directory",
    BEHAVIOR_FORM: "Behavior Form",
    PILLARS: "Character Pillars",
    ADMIN_CONTACTS: "Admin Contacts",
    ATTRIBUTION: "📄 System Info"
  },
  DEFAULTS: {
    SIMILARITY_THRESHOLD: 3,
    MAX_SUGGESTIONS: 5,
    SEND_EMAILS: true,
    PRIMARY_COLOR: "#4285f4"
  }
};

// =============================================================================
// DEFAULT CHARACTER PILLARS
// =============================================================================
const DEFAULT_PILLARS = [
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
      "using digital resources ethically"
    ],
    negativeBehaviors: [
      "being dishonest or misleading others",
      "copying work, cheating, or plagiarizing",
      "taking items that belong to others",
      "breaking promises or commitments",
      "participating in gossip or spreading rumors",
      "blaming others unfairly to avoid consequences",
      "misrepresenting online sources or plagiarizing digital work"
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
    negativeBehaviors: [
      "interrupting or talking over others frequently",
      "communicating with disrespectful, rude, or offensive language",
      "showing disrespect through tone, gestures, or expressions",
      "wrestling with other students or not keeping hands to self",
      "ignoring or defying reasonable instructions",
      "mocking, teasing, or putting others down",
      "engaging in disrespectful or inappropriate online interactions"
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
    negativeBehaviors: [
      "frequently submitting late or incomplete work",
      "being off-task or distracting to others",
      "leaving personal or shared areas messy or disorganized",
      "making excuses or blaming others for mistakes",
      "losing or damaging items carelessly",
      "being unprepared for class activities or discussions",
      "giving up easily when tasks become challenging",
      "struggling to manage deadlines for assignments/projects"
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
    negativeBehaviors: [
      "cutting ahead, skipping turns, or dominating activities",
      "cheating or disregarding rules in games/activities",
      "ignoring different perspectives or being closed-minded",
      "deliberately excluding peers from activities or groups",
      "using more resources than necessary or permitted",
      "blaming others unjustly or showing favoritism"
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
    negativeBehaviors: [
      "being unkind, teasing, or making fun of others",
      "ignoring peers who clearly need assistance or support",
      "engaging in mean-spirited gossip or spreading rumors",
      "laughing at the mistakes or struggles of others",
      "acting selfishly or disregarding the feelings/needs of others",
      "excluding others purposefully from groups or activities",
      "being insensitive to the feelings of others"
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
    negativeBehaviors: [
      "breaking or consistently ignoring established rules",
      "littering or failing to clean up after oneself",
      "damaging school property intentionally or carelessly",
      "refusing to cooperate or being disruptive in groups",
      "disrupting the learning environment for others",
      "ignoring or violating safety procedures",
      "avoiding participation or contributing negatively to activities",
      "misusing school technology or accessing inappropriate content"
    ]
  }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if system is set up
 */
function isSystemSetup() {
  return PropertiesService.getScriptProperties().getProperty('SETUP_COMPLETE') === 'true';
}

/**
 * Get stored configuration
 */
function getStoredConfiguration() {
  try {
    const schoolConfig = JSON.parse(PropertiesService.getScriptProperties().getProperty('SCHOOL_CONFIG') || '{}');
    const adminConfig = JSON.parse(PropertiesService.getScriptProperties().getProperty('ADMIN_CONFIG') || '[]');
    const emailConfig = JSON.parse(PropertiesService.getScriptProperties().getProperty('EMAIL_CONFIG') || '{}');
    const pillarConfig = JSON.parse(PropertiesService.getScriptProperties().getProperty('PILLAR_CONFIG') || '{}');

    return { schoolConfig, adminConfig, emailConfig, pillarConfig };
  } catch (error) {
    Logger.log('Error getting stored configuration: ' + error.toString());
    return null;
  }
}

/**
 * Generate working configuration from stored data
 */
function generateWorkingConfig() {
  const stored = getStoredConfiguration();
  if (!stored) return null;

  const { schoolConfig, adminConfig, emailConfig } = stored;

  // Build admin emails object
  const adminEmails = {};
  adminConfig.forEach((admin, index) => {
    const key = admin.title.toUpperCase().replace(/\s+/g, '_');
    adminEmails[key] = admin.email;
  });

  return {
    SCHOOL_NAME: schoolConfig.schoolName || 'School',
    DISTRICT_NAME: schoolConfig.districtName || '',
    PRIMARY_COLOR: schoolConfig.primaryColor || SYSTEM_CONFIG.DEFAULTS.PRIMARY_COLOR,
    LOGO_URL: schoolConfig.logoUrl || '',
    EMAIL_SUBJECT_GOOD_NEWS: emailConfig.goodNewsSubject || 'Good News - Positive Behavior Recognition',
    EMAIL_SUBJECT_STOP_THINK: emailConfig.stopThinkSubject || 'Behavior Update - Opportunity for Growth',
    SHEET_NAMES: SYSTEM_CONFIG.SHEETS,
    ADMIN_EMAILS: adminEmails,
    SEND_EMAILS: SYSTEM_CONFIG.DEFAULTS.SEND_EMAILS,
    SIMILARITY_THRESHOLD: SYSTEM_CONFIG.DEFAULTS.SIMILARITY_THRESHOLD,
    MAX_SUGGESTIONS: SYSTEM_CONFIG.DEFAULTS.MAX_SUGGESTIONS
  };
}

/**
 * Get system pillars data
 */
function getSystemPillars() {
  const stored = getStoredConfiguration();
  if (stored && stored.pillarConfig && stored.pillarConfig.pillars) {
    return stored.pillarConfig.pillars;
  }
  return DEFAULT_PILLARS;
}
