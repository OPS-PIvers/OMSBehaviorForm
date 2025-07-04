# Installation Guide: Student Behavior Management System

This guide provides detailed instructions for IT staff and technically-minded administrators to install and deploy the Student Behavior Management System using Google Workspace and Google Apps Script.

**Target Audience:** IT Staff, Technical Administrators
**Estimated Time:** 1-2 hours (depending on familiarity with Google Workspace)

## 1. Prerequisites

Before you begin the installation, ensure you meet the following requirements:

### Google Workspace Requirements:
*   **Google Workspace Edition:** Any Google Workspace edition (e.g., Business Starter, Standard, Plus; Enterprise; Education Fundamentals, Standard, Plus, Endpoint Education Upgrade) that allows Google Sheets and Google Apps Script.
*   **User Account:** A Google Workspace user account that will own the Google Spreadsheet and the Apps Script project. This account will be the default administrator and the executor of the script.
*   **Drive Access:** Permission to create and share Google Sheets.
*   **Apps Script Access:** Permission to create and manage Google Apps Script projects and deploy them as web apps.

### Required Permissions and Access Levels:
*   **Spreadsheet Owner:** The installing user must be the owner of the Google Sheet that will store the system's data.
*   **Apps Script Project Creator:** The installing user must be able to create and edit Apps Script projects.
*   **Authorization Scopes:** During the first run (setup wizard) and deployment, the script will request authorization for several Google services. The installing user must be able to grant these permissions. Common scopes include:
    *   Accessing and managing Google Sheets.
    *   Sending emails on behalf of the user.
    *   Displaying web apps.
    *   Connecting to external services (if applicable to your version).
    *   *(Placeholder: List specific OAuth scopes if known - this can be found by running the script once and checking the authorization prompt)*

### Supported Browsers and Devices:
*   **Administrator Access:** Latest versions of Chrome, Firefox, Safari, or Edge on a desktop or laptop computer for setup and configuration.
*   **Teacher/User Access (Web Form):** Latest versions of Chrome, Firefox, Safari, or Edge on desktops, laptops, tablets, and smartphones. The web form is designed to be responsive.

## 2. Step-by-Step Installation

Follow these steps carefully to install the system.

### Step 2.1: Creating the Google Spreadsheet

This spreadsheet will be the database for your system.

1.  **Sign in to Google Drive:** Use the designated Google Workspace account.
2.  **Create a New Spreadsheet:**
    *   Click **+ New** > **Google Sheets** > **Blank spreadsheet**.
    *   Rename the spreadsheet to something descriptive, e.g., `Student Behavior System - Main Data`.
    *   *(Placeholder: `images/setup_screenshots/01_create_spreadsheet.png` - Re-use from Quick Start if applicable or create specific one)*
3.  **Note the Spreadsheet ID (Optional but useful):**
    *   The Spreadsheet ID is part of its URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
    *   You might need this ID for manual configuration in some advanced scenarios, though the setup wizard usually handles this.

### Step 2.2: Installing the Apps Script Code

1.  **Open Apps Script Editor:**
    *   With the newly created spreadsheet open, click **Extensions** > **Apps Script**.
    *   If prompted, you might need to create a new project.
    *   *(Placeholder: `images/setup_screenshots/02_apps_script_editor.png` - Re-use or create specific)*
2.  **Clear Existing Code:**
    *   If there's a default `Code.gs` file with `myFunction`, delete its content.
3.  **Add Project Files:**
    *   Obtain the system's Apps Script source code files (usually multiple `.gs` files for logic and `.html` files for the user interface).
    *   For each `.gs` file:
        *   Click the **+** icon next to "Files" in the left sidebar.
        *   Select **Script**.
        *   Name the file exactly as provided in the source (e.g., `Code.gs`, `Config.gs`, `EmailService.gs`).
        *   Copy the content of the corresponding source file and paste it into the editor.
    *   For each `.html` file:
        *   Click the **+** icon next to "Files".
        *   Select **HTML**.
        *   Name the file exactly as provided (e.g., `Index.html`, `Success.html`). Include the `.html` extension if the editor doesn't add it automatically (it usually does).
        *   Copy the content of the corresponding source file and paste it into the editor.
    *   *(Placeholder: Screenshot showing how to add new .gs and .html files and pasting code - `images/setup_screenshots/07_add_script_files.png`)*
4.  **Save the Project:**
    *   Click the **Save project** icon (diskette icon).
    *   Give your Apps Script project a name (e.g., "Student Behavior System Script").

### Step 2.3: Running the Setup Wizard

The setup wizard configures initial settings and prepares the spreadsheet.

1.  **Select the Setup Function:**
    *   In the Apps Script editor's toolbar, find the function dropdown (usually says "Select function").
    *   Choose the `setup` or `initialSetup` function (the exact name might vary).
    *   *(Placeholder: Screenshot of selecting the setup function - `images/setup_screenshots/08_select_setup_function.png`)*
2.  **Run the Function:**
    *   Click the **Run** button (play icon).
3.  **Authorization:**
    *   The first time you run a function that requires access to your data or other Google services, an "Authorization required" dialog will appear.
    *   Click **Review Permissions**.
    *   Choose the Google account you are using for the installation.
    *   You'll see a warning "Google hasn’t verified this app." Click **Advanced**, then **Go to [Your Script Name] (unsafe)**. This is normal for unpublished Apps Script projects.
    *   Review the permissions the script is requesting. Click **Allow**.
    *   *(Placeholder: Series of screenshots for authorization flow - `images/setup_screenshots/09_authorization_required.png`, `images/setup_screenshots/10_advanced_unsafe.png`, `images/setup_screenshots/11_allow_permissions.png`)*
4.  **Follow Wizard Prompts:**
    *   The script will now execute the setup function. This may involve:
        *   Creating necessary sheets in your Google Spreadsheet (e.g., `BehaviorLog`, `StudentDirectory`, `Configuration`, `EmailTemplates`).
        *   Asking for initial configuration data via prompts (e.g., School Name, Administrator Email, Timezone).
        *   *(Placeholder: Screenshot of a setup prompt - `images/setup_screenshots/04_setup_wizard_step.png` - Re-use or specific)*
    *   Enter the requested information accurately.
5.  **Check for Completion:**
    *   The Apps Script execution log (View > Logs) will show progress and any errors.
    *   Once complete, check your Google Spreadsheet. You should see new sheets created and populated with default data or headers.

### Step 2.4: Configuring the Web App Deployment

This makes the behavior reporting form accessible via a URL.

1.  **Open Deployment Dialog:**
    *   In the Apps Script editor, click **Deploy** > **New deployment**.
    *   *(Placeholder: Screenshot of "New deployment" button - `images/setup_screenshots/12_new_deployment_button.png`)*
2.  **Select Deployment Type:**
    *   Click the gear icon next to "Select type" and choose **Web app**.
    *   *(Placeholder: Screenshot of selecting Web app type - `images/setup_screenshots/13_select_web_app_type.png`)*
3.  **Configure Web App Settings:**
    *   **Description:** Enter a description (e.g., "Student Behavior Reporting System - v1.0"). This is for your reference.
    *   **Execute as:** Select **Me ([your email address])**. This ensures the script runs with your permissions.
    *   **Who has access:** This is critical.
        *   **Only myself:** Only you can access the web app (for initial testing).
        *   **Anyone within [Your Domain]:** Recommended for most school deployments. Only users in your Google Workspace domain can access it.
        *   **Anyone with Google account:** Any signed-in Google user can access it.
        *   **Anyone:** Publicly accessible, even to users not signed into a Google account (generally not recommended for this type of system).
        *   Start with a restrictive setting (e.g., "Anyone within [Your Domain]") and adjust if necessary.
    *   *(Placeholder: `images/setup_screenshots/05_deploy_web_app.png` - Re-use or specific)*
4.  **Deploy:**
    *   Click **Deploy**.
    *   If you are creating a new deployment or updating an existing one where you've changed settings that require re-authorization for the web app, you might go through a brief authorization flow again.
5.  **Copy Web App URL:**
    *   Once deployment is complete, a dialog will show the **Web app URL**. Copy this URL. This is the link you will share with teachers and staff to access the behavior reporting form.
    *   **Important:** Each time you make code changes that affect the user interface or web app behavior and want them to be live, you must create a **new deployment** or **manage deployments** to edit the existing one and select a new version. Simply saving the code does not update the live web app.
    *   *(Placeholder: `images/setup_screenshots/06_deployed_url.png` - Re-use or specific)*

## 3. Verification & Testing

After installation, verify that the system is working correctly.

### System Health Checks:
1.  **Spreadsheet Structure:**
    *   Open the Google Spreadsheet.
    *   Verify that all required sheets (`BehaviorLog`, `StudentDirectory`, `Configuration`, `EmailTemplates`, etc.) have been created.
    *   Check if header rows in these sheets are present as expected.
2.  **Configuration Settings:**
    *   Open the `Configuration` (or similarly named) sheet.
    *   Verify that the settings entered during the setup wizard (School Name, Admin Email, Timezone) are correctly saved.
    *   Ensure default character pillars and behaviors are populated if the system includes them.

### Test Form Submissions:
1.  **Access the Form:** Open the Web app URL you copied during deployment in a browser.
2.  **Add Sample Students:** Manually add 2-3 sample students to the `StudentDirectory` sheet, including valid email addresses for testing parent notifications.
3.  **Submit a "Good News" Report:**
    *   Fill out the form with details for a sample student.
    *   Use a parent email address you can access for testing.
    *   Submit the form.
    *   *(Placeholder: `images/form_screenshots/01_test_form_submission.png` - Re-use or specific)*
4.  **Verify Data Logging:**
    *   Check the `BehaviorLog` sheet. A new row with the submitted data should appear.
    *   Confirm all fields are logged correctly.
5.  **Submit a "Stop & Think" Report:** Repeat steps 3-4 for a "Stop & Think" type report.

### Email Delivery Verification:
1.  **Check Administrator Email:** The email address configured as the administrator should receive a notification for each submitted report.
2.  **Check Parent Email:** The parent email address associated with the student in the report should receive a notification (if configured for that report type).
3.  **Check Email Content:**
    *   Verify that the email subject and body are correct.
    *   Ensure student name, behavior details, and comments are included.
    *   Check for any formatting issues.
    *   *(Placeholder: `images/admin_screenshots/02_sample_email_notification.png` - Re-use or specific)*

## 4. Deployment

Once testing is successful, you can proceed with wider deployment.

### Sharing Access with Teachers:
1.  **Distribute Web App URL:** Share the copied Web app URL with teachers and staff who will be submitting behavior reports.
2.  **Communication:** Provide clear instructions on how to use the form. Refer them to the [Teacher User Manual](./Teacher_User_Manual.md).
3.  **Permissions Reminder:** Ensure the "Who has access" setting for the web app deployment (Step 2.4) is set appropriately for your intended audience (e.g., "Anyone within [Your Domain]").

### Setting Up Monitoring (Recommended):
*   **Apps Script Dashboard:** Regularly check the Apps Script dashboard (Apps Script editor > Executions) for any failed executions or errors.
*   **Spreadsheet Change History:** Google Sheets keeps a revision history. This can be useful for tracking changes or restoring data if needed (File > Version history > See version history).
*   **Administrator Notifications:** Ensure the administrator email is actively monitored for system notifications and error reports (if the script is configured to send them).

### Go-Live Checklist:
*   [ ] All prerequisites met.
*   [ ] Spreadsheet created and Apps Script code installed.
*   [ ] Setup wizard completed successfully.
*   [ ] Web app deployed with correct access settings.
*   [ ] System health checks passed.
*   [ ] Test form submissions (Good News & Stop & Think) logged correctly.
*   [ ] Email notifications (Admin & Parent) verified.
*   [ ] Initial student data populated or import plan ready. (See [Administrator Guide](./Administrator_Guide.md) for bulk import if available).
*   [ ] Teacher User Manual and Web app URL ready for distribution.
*   [ ] Plan for ongoing monitoring in place.

## 5. Common Installation Issues

Refer to the [FAQ & Troubleshooting Guide](./FAQ_Troubleshooting.md) for a more comprehensive list.

### Permission Problems and Solutions:
*   **Issue:** "Authorization required" loop or errors related to permissions.
    *   **Solution:** Ensure the user running the setup and deploying the web app has sufficient permissions in Google Workspace. Try running the `setup` function again. Ensure you are allowing all requested scopes. Sometimes, re-doing the deployment (Deploy > Manage Deployments > Edit > New Version) can fix authorization issues for the web app.
*   **Issue:** Users cannot access the web app URL ("You need permission").
    *   **Solution:** Check the "Who has access" setting in your web app deployment configuration. It might be too restrictive.

### Apps Script Quota Limitations:
*   **Issue:** Errors like "Service invoked too many times" or "Email quota exceeded."
    *   **Solution:** Google Apps Script has daily quotas (e.g., email recipients per day, script runtime). For very large schools or high usage, you might approach these limits.
        *   Review Google's quota documentation.
        *   Optimize script performance.
        *   Consider strategies like batching email notifications if possible.
        *   For Education Plus or Enterprise Workspace editions, quotas are generally higher.
    *   *(Link to Google Apps Script Quotas page: https://developers.google.com/apps-script/guides/services/quotas)*

### Email Delivery Troubleshooting:
*   **Issue:** Emails are not being sent or received.
    *   **Solution:**
        *   Check the `MailApp.getRemainingDailyQuota()` in a test function to see if you've hit email quotas.
        *   Verify email addresses in `Configuration` and `StudentDirectory` are correct.
        *   Check spam/junk folders in recipient inboxes.
        *   Ensure the Apps Script project is authorized to send email (`MailApp.sendEmail` scope).
        *   Review the Apps Script execution logs for any errors during email sending.

---

*For further assistance, consult the [Administrator Guide](./Administrator_Guide.md) for configuration details and the [FAQ & Troubleshooting Guide](./FAQ_Troubleshooting.md) for more solutions.*
