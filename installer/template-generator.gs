/**
 * One-Click Installer for Student Behavior Management System
 * Generates pre-configured Google Spreadsheet template with all components
 */

class SystemInstaller {
  static INSTALLATION_STEPS = [
    'CREATE_SPREADSHEET',
    'INSTALL_SCRIPTS',
    'CREATE_SHEETS',
    'CONFIGURE_SYSTEM',
    'RUN_SETUP_WIZARD',
    'DEPLOY_WEBAPP',
    'VERIFY_INSTALLATION',
    'COMPLETE_SETUP'
  ];

  /**
   * Main installation orchestrator
   */
  static installCompleteSystem(installationConfig) {
    const progress = new InstallationProgress();

    try {
      progress.start(this.INSTALLATION_STEPS.length);

      // Step 1: Create new spreadsheet
      progress.updateStep('CREATE_SPREADSHEET', 'Creating system spreadsheet...');
      const spreadsheet = this.createSystemSpreadsheet(installationConfig);

      // Step 2: Install all scripts
      progress.updateStep('INSTALL_SCRIPTS', 'Installing system scripts...');
      this.installSystemScripts(spreadsheet);

      // Step 3: Create sheet structure
      progress.updateStep('CREATE_SHEETS', 'Creating data sheets...');
      this.createSheetStructure(spreadsheet);

      // Step 4: Configure system
      progress.updateStep('CONFIGURE_SYSTEM', 'Configuring system settings...');
      this.configureSystem(spreadsheet, installationConfig);

      // Step 5: Run setup wizard
      progress.updateStep('RUN_SETUP_WIZARD', 'Running configuration wizard...');
      this.runAutomatedSetup(spreadsheet, installationConfig);

      // Step 6: Deploy web app
      progress.updateStep('DEPLOY_WEBAPP', 'Deploying web application...');
      const webAppUrl = this.deployWebApplication(spreadsheet);

      // Step 7: Verify installation
      progress.updateStep('VERIFY_INSTALLATION', 'Verifying installation...');
      const verificationResults = this.verifyInstallation(spreadsheet);

      // Step 8: Complete setup
      progress.updateStep('COMPLETE_SETUP', 'Finalizing installation...');
      const completionResults = this.completeInstallation(spreadsheet, webAppUrl);

      progress.complete();

      return {
        success: true,
        spreadsheetId: spreadsheet.getId(),
        spreadsheetUrl: spreadsheet.getUrl(),
        webAppUrl: webAppUrl,
        verificationResults: verificationResults,
        completionResults: completionResults,
        installationLog: progress.getLog()
      };

    } catch (error) {
      progress.fail(error);

      // Attempt rollback
      this.rollbackInstallation(installationConfig, progress);

      return {
        success: false,
        error: error.message,
        installationLog: progress.getLog(),
        rollbackPerformed: true
      };
    }
  }

  /**
   * Create system spreadsheet with proper naming and structure
   */
  static createSystemSpreadsheet(config) {
    const schoolName = config.schoolName || 'School';
    const timestamp = new Date().toISOString().split('T')[0];

    const spreadsheetName = `${schoolName} - Student Behavior System - ${timestamp}`;

    const spreadsheet = SpreadsheetApp.create(spreadsheetName);

    // Set up basic properties
    spreadsheet.addEditor(Session.getActiveUser().getEmail());

    // Create folder structure if specified
    if (config.folderId) {
      const folder = DriveApp.getFolderById(config.folderId);
      const file = DriveApp.getFileById(spreadsheet.getId());
      folder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);
    }

    return spreadsheet;
  }

  /**
   * Install all system scripts into the spreadsheet
   */
  static installSystemScripts(spreadsheet) {
    // Get script project associated with spreadsheet
    const scriptProject = ScriptApp.newScript()
      .setTitle(`${spreadsheet.getName()} - Scripts`)
      .saveAs(`${spreadsheet.getName()} - Scripts`);

    // Install core system files
    const systemFiles = this.getSystemFiles();

    systemFiles.forEach(file => {
      scriptProject.createFile(file.name, file.content);
    });

    // Set up triggers
    this.setupSystemTriggers(scriptProject);

    return scriptProject;
  }

  /**
   * Get all system files for installation
   */
  static getSystemFiles() {
    return [
      {
        name: 'config.gs',
        content: this.loadFileContent('config.gs')
      },
      {
        name: 'setupWizard.gs',
        content: this.loadFileContent('setupWizard.gs')
      },
      {
        name: 'webApp.gs',
        content: this.loadFileContent('webApp.gs')
      },
      {
        name: 'emailSystem.gs',
        content: this.loadFileContent('emailSystem.gs')
      },
      {
        name: 'utilities.gs',
        content: this.loadFileContent('utilities.gs')
      },
      // Add all other system files
    ];
  }

  /**
   * Create comprehensive installation verification
   */
  static verifyInstallation(spreadsheet) {
    const verificationResults = {
      spreadsheetStructure: this.verifySpreadsheetStructure(spreadsheet),
      scriptInstallation: this.verifyScriptInstallation(spreadsheet),
      systemConfiguration: this.verifySystemConfiguration(spreadsheet),
      webAppDeployment: this.verifyWebAppDeployment(spreadsheet),
      emailSystem: this.verifyEmailSystem(spreadsheet),
      dataValidation: this.verifyDataValidation(spreadsheet)
    };

    const overallSuccess = Object.values(verificationResults)
      .every(result => result.success);

    return {
      success: overallSuccess,
      details: verificationResults,
      recommendations: this.generateRecommendations(verificationResults)
    };
  }
}

/**
 * Installation progress tracking
 */
class InstallationProgress {
  constructor() {
    this.log = [];
    this.currentStep = 0;
    this.totalSteps = 0;
    this.startTime = new Date();
  }

  start(totalSteps) {
    this.totalSteps = totalSteps;
    this.log.push({
      timestamp: new Date().toISOString(),
      type: 'START',
      message: `Installation started with ${totalSteps} steps`
    });
  }

  updateStep(stepName, message) {
    this.currentStep++;
    this.log.push({
      timestamp: new Date().toISOString(),
      type: 'STEP',
      step: this.currentStep,
      stepName: stepName,
      message: message,
      progress: Math.round((this.currentStep / this.totalSteps) * 100)
    });

    console.log(`[${this.currentStep}/${this.totalSteps}] ${stepName}: ${message}`);
  }

  complete() {
    const duration = new Date() - this.startTime;
    this.log.push({
      timestamp: new Date().toISOString(),
      type: 'COMPLETE',
      duration: duration,
      message: `Installation completed successfully in ${Math.round(duration/1000)} seconds`
    });
  }

  fail(error) {
    this.log.push({
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      error: error.message,
      stack: error.stack
    });
  }

  getLog() {
    return this.log;
  }
}
