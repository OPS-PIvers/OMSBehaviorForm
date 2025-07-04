# Quick Start Guide: Student Behavior Management System

This guide provides the essential steps to get the Student Behavior Management System up and running in approximately 30 minutes. It's designed for administrators who want to quickly test the system's core functionality.

**Target Audience:** Administrators
**Estimated Time:** 30 Minutes

## 1. 30-Minute Setup

This section outlines the absolute minimum configuration needed to start using the system.

### Prerequisites:
*   You have a Google Workspace account with necessary permissions to create Spreadsheets and deploy Apps Script web apps.
*   You have downloaded or have access to the Apps Script code for the system.

### Essential Configuration Steps:

1.  **Create the Google Spreadsheet:**
    *   Open Google Drive.
    *   Click "New" -> "Google Sheets" -> "Blank spreadsheet".
    *   Name the spreadsheet descriptively (e.g., "Student Behavior System Data"). This spreadsheet will store all system data.
    *   *(Placeholder: Add screenshot of creating a new spreadsheet - `images/setup_screenshots/01_create_spreadsheet.png`)*

2.  **Install the Apps Script Code:**
    *   Open your newly created spreadsheet.
    *   Click "Extensions" -> "Apps Script". This will open the Apps Script editor.
    *   Delete any boilerplate code (e.g., `Code.gs`).
    *   Create new script files (`.gs`) and HTML files (`.html`) by copying and pasting the provided system code. Ensure file names match those in the project.
    *   *(Placeholder: Add screenshot of Apps Script editor - `images/setup_screenshots/02_apps_script_editor.png`)*

3.  **Run the Setup Wizard:**
    *   In the Apps Script editor, select the `setup` function from the function dropdown.
    *   Click "Run".
    *   You will be prompted for authorizations. Grant the necessary permissions.
    *   The setup wizard will guide you through initial configuration (e.g., school name, initial admin user). Follow the on-screen prompts.
    *   *(Placeholder: Add screenshot of setup wizard prompt - `images/setup_screenshots/03_run_setup_wizard.png`)*
    *   *(Placeholder: Add screenshot of a setup wizard step - `images/setup_screenshots/04_setup_wizard_step.png`)*

4.  **Deploy the Web App:**
    *   In the Apps Script editor, click "Deploy" -> "New deployment".
    *   Select "Web app" as the deployment type.
    *   Configure the web app settings:
        *   **Description:** (e.g., "Student Behavior Reporting Form")
        *   **Execute as:** "Me (your Google account)"
        *   **Who has access:** "Anyone with Google account" (for initial testing) or a more restrictive setting as appropriate.
    *   Click "Deploy". Copy the Web app URL provided. This URL is how users will access the form.
    *   *(Placeholder: Add screenshot of web app deployment settings - `images/setup_screenshots/05_deploy_web_app.png`)*
    *   *(Placeholder: Add screenshot of deployed URL - `images/setup_screenshots/06_deployed_url.png`)*

### Basic Verification Checklist:
*   [ ] Setup wizard completed without errors.
*   [ ] Web app URL is accessible.
*   [ ] You can open the behavior reporting form using the URL.

## 2. Essential First Steps

After the initial setup, perform these steps to ensure the system is ready for basic testing.

1.  **Add 5-10 Sample Students to Directory:**
    *   Access the "Student Directory" sheet in your Google Spreadsheet.
    *   Manually add a few fictional student entries. Include:
        *   Student ID
        *   First Name
        *   Last Name
        *   Grade Level
        *   Parent/Guardian Email (use test email addresses you can access)
    *   *(Placeholder: Add screenshot of sample student data in sheet - `images/admin_screenshots/01_sample_student_directory.png`)*

2.  **Configure At Least One Administrator:**
    *   Ensure your email address was added as an administrator during the setup wizard.
    *   Verify this in the "Configuration" or "Settings" sheet (the exact name may vary based on your system version). Look for an "Admin Users" or "AdministratorEmails" setting.

3.  **Test Email Delivery:**
    *   Open the behavior reporting form using the Web app URL.
    *   Submit a "Good News" report for one of your sample students.
    *   Use a parent email address that you can check.
    *   Verify that the parent email and the administrator email (your email) receive the notification.
    *   *(Placeholder: Add screenshot of submitting a test form - `images/form_screenshots/01_test_form_submission.png`)*
    *   *(Placeholder: Add screenshot of a sample email notification - `images/admin_screenshots/02_sample_email_notification.png`)*

4.  **Share Form URL with One Teacher for Testing:**
    *   Provide the Web app URL to a trusted teacher (or use a test teacher account).
    *   Ask them to submit a test behavior report.
    *   Confirm the data appears in the "BehaviorLog" sheet and notifications are sent.

## 3. What to Do After Quick Start

Congratulations! You've completed the quick start and have a basic, functional version of the Student Behavior Management System.

For a full deployment and to utilize all features, please refer to the comprehensive documentation:

*   **Full Setup & Configuration:** [Link to Administrator Guide](./Administrator_Guide.md)
*   **Detailed Installation Steps:** [Link to Installation Guide](./Installation_Guide.md)
*   **Teacher Training:** [Link to Teacher User Manual](./Teacher_User_Manual.md)
*   **Common Questions & Troubleshooting:** [Link to FAQ & Troubleshooting Guide](./FAQ_Troubleshooting.md)

### Recommended Next Steps for Full Deployment:
1.  Complete all sections in the **Administrator Guide**, especially:
    *   School information configuration.
    *   Character pillar customization.
    *   Full user management (adding all teachers, parent contacts).
2.  Review **Security & Privacy** guidelines.
3.  Develop a plan for **training teachers** using the Teacher User Manual.
4.  Establish **system maintenance** procedures (backups, data cleanup).

### When to Seek Additional Help:
*   If you encounter errors not covered in the FAQ & Troubleshooting Guide.
*   If you need assistance with advanced customization.
*   If you have questions about scaling the system for a large district.

---

*This Quick Start Guide is intended for rapid initial setup and testing. For detailed information and best practices, please consult the full documentation suite.*
