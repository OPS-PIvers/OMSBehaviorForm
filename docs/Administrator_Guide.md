# Administrator Guide: Student Behavior Management System

This comprehensive guide provides administrators with the information needed to implement, configure, manage, and maintain the Student Behavior Management System.

**Target Audience:** IT Administrators, Principals, System Managers
**Estimated Reading Time:** 1-2 hours for full review; specific sections can be referenced as needed.

## Table of Contents
1.  [Introduction & System Overview](#1-introduction--system-overview)
    *   [What the System Does and Its Benefits](#what-the-system-does-and-its-benefits)
    *   [System Requirements and Compatibility](#system-requirements-and-compatibility)
    *   [Overview of User Roles and Permissions](#overview-of-user-roles-and-permissions)
2.  [Initial Setup & Configuration](#2-initial-setup--configuration)
    *   [Step-by-Step Setup Wizard Walkthrough](#step-by-step-setup-wizard-walkthrough)
    *   [School Information Configuration](#school-information-configuration)
    *   [Administrator Contact Setup](#administrator-contact-setup)
    *   [Email Configuration and Testing](#email-configuration-and-testing)
    *   [Character Pillar Customization](#character-pillar-customization)
3.  [User Management](#3-user-management)
    *   [Adding/Removing Teachers](#addingremoving-teachers)
    *   [Managing Parent Contact Information](#managing-parent-contact-information)
    *   [Directory Management Best Practices](#directory-management-best-practices)
4.  [System Maintenance](#4-system-maintenance)
    *   [Regular Backup Procedures](#regular-backup-procedures)
    *   [Data Cleanup and Archival](#data-cleanup-and-archival)
    *   [Performance Monitoring](#performance-monitoring)
    *   [Troubleshooting Common Issues](#troubleshooting-common-issues)
5.  [Customization Options](#5-customization-options)
    *   [Branding and Color Scheme Changes](#branding-and-color-scheme-changes)
    *   [Custom Character Pillars and Behaviors](#custom-character-pillars-and-behaviors)
    *   [Email Template Customization](#email-template-customization)
6.  [Security & Privacy](#6-security--privacy)
    *   [Data Protection Guidelines](#data-protection-guidelines)
    *   [FERPA Compliance Checklist](#ferpa-compliance-checklist)
    *   [User Access Controls](#user-access-controls)

---

## 1. Introduction & System Overview

### What the System Does and Its Benefits
The Student Behavior Management System is a Google Workspace-based tool designed to help schools efficiently track, manage, and communicate student behaviors. It provides a centralized platform for teachers to submit behavior reports (both positive "Good News" and areas for improvement "Stop & Think") and for administrators to monitor trends, manage data, and facilitate communication with parents.

**Key Benefits:**
*   **Streamlined Reporting:** Easy-to-use web form for teachers to quickly submit behavior incidents.
*   **Centralized Data:** All behavior data is stored in a Google Spreadsheet, making it accessible and manageable.
*   **Improved Communication:** Automated email notifications to parents and administrators.
*   **Data-Driven Insights:** Enables tracking of behavior trends to inform interventions and school policies.
*   **Customizable:** Adaptable to your school's specific character pillars, behaviors, and communication style.
*   **Cost-Effective:** Leverages existing Google Workspace infrastructure.

### System Requirements and Compatibility
*   **Google Workspace:** Requires an active Google Workspace subscription (any edition).
*   **Core Services:** Utilizes Google Sheets, Google Apps Script.
*   **User Accounts:** Google accounts for administrators and teachers.
*   **Browsers:** Modern web browsers (Chrome, Firefox, Safari, Edge) for accessing the reporting form and administrative functions.
*   For detailed installation prerequisites, see the [Installation Guide](./Installation_Guide.md#1-prerequisites).

### Overview of User Roles and Permissions

*   **System Administrator (You):**
    *   Responsibilities: Installation, initial setup, configuration, user management, system maintenance, customization, troubleshooting.
    *   Permissions: Full access to the Google Spreadsheet data, Apps Script project, and all configuration settings. Receives copies of all behavior report emails.
*   **Teacher/Staff User:**
    *   Responsibilities: Submitting behavior reports via the web form.
    *   Permissions: Access to the web form URL. No direct access to the underlying spreadsheet or Apps Script project is required for form submission.
*   **Parent/Guardian:**
    *   Responsibilities: Receiving email notifications about their child's behavior reports (if configured).
    *   Permissions: No direct system access. Communication is via email.

---

## 2. Initial Setup & Configuration

For a successful deployment, initial setup and configuration must be performed correctly. Refer to the [Installation Guide](./Installation_Guide.md) for the technical steps of installing the script and deploying the web app. This section focuses on the configuration data.

### Step-by-Step Setup Wizard Walkthrough
The first time the `setup` function is run from the Apps Script editor (as detailed in the [Installation Guide](./Installation_Guide.md#step-23-running-the-setup-wizard)), it typically initializes the system. This may involve:
1.  **Authorization:** Granting necessary permissions for the script to operate.
    *   *(Placeholder: Link to or reuse screenshots from Installation Guide for authorization flow, e.g., `images/setup_screenshots/09_authorization_required.png`)*
2.  **Spreadsheet Initialization:** Automatically creating necessary sheets (e.g., `BehaviorLog`, `StudentDirectory`, `Configuration`, `EmailTemplates`, `CharacterPillars`).
3.  **Initial Prompts:** The wizard may prompt for essential information:
    *   **School Name:** Used in email communications and potentially on the form.
    *   **Primary Administrator Email:** The email address for the main system administrator who will receive system notifications and copies of behavior reports.
    *   **Timezone:** To ensure accurate timestamps for logged behaviors.
    *   *(Placeholder: Screenshot of a setup wizard prompt - `images/setup_screenshots/04_setup_wizard_step.png`)*

If your system version does not have an interactive setup wizard, these settings will need to be manually configured in the `Configuration` sheet.

### School Information Configuration
This information is typically stored in the `Configuration` sheet of your Google Spreadsheet.

*   **Accessing Configuration:** Open the Google Spreadsheet linked to the system. Navigate to the sheet named `Configuration` (or `Settings`, `Config`, etc.).
*   **Key Settings:**
    *   `SchoolName`: Your school's full name.
        *   Example: `Springfield Elementary School`
    *   `SchoolYear`: Current academic year (e.g., `2023-2024`). This might be used for archival purposes.
        *   Example: `2024-2025`
    *   `Timezone`: Important for accurate timestamping. Use a standard timezone identifier (e.g., "America/New_York", "Europe/London").
        *   Example: `America/Denver`
        *   *(Placeholder: Screenshot of Configuration sheet with these settings highlighted - `images/admin_screenshots/03_config_school_info.png`)*

### Administrator Contact Setup
Ensure at least one administrator email is correctly configured to receive system notifications.

*   **Setting:** `AdminEmail` or `AdministratorEmails` in the `Configuration` sheet.
*   **Format:**
    *   If a single admin: `admin@example.com`
    *   If multiple admins (system dependent, check your script's logic): `admin1@example.com,admin2@example.com` (comma-separated)
*   **Verification:** After setup, submit a test report to confirm the administrator(s) receive email notifications.
    *   *(Placeholder: Screenshot of AdminEmail setting in Configuration sheet - `images/admin_screenshots/04_config_admin_email.png`)*

### Email Configuration and Testing

The system relies on Google's `MailApp` service to send emails.

*   **Default Sender:** Emails are sent from the Google account that owns the Apps Script project (the account used for installation and deployment).
*   **Email Settings (in `Configuration` sheet):**
    *   `SendParentEmailsGoodNews`: Set to `TRUE` or `FALSE` to control if parents receive "Good News" reports.
    *   `SendParentEmailsStopAndThink`: Set to `TRUE` or `FALSE` to control if parents receive "Stop & Think" reports.
    *   `CCAdminOnParentEmails`: Set to `TRUE` if admins should be CC'd on emails sent to parents, or `FALSE` if admins only get direct notifications.
    *   *(Placeholder: Screenshot of email settings in Configuration sheet - `images/admin_screenshots/05_config_email_settings.png`)*
*   **Testing Email Delivery:**
    1.  Ensure `AdminEmail` is correctly set.
    2.  Add a sample student to the `StudentDirectory` with your own (or a test) email address in the parent email field.
    3.  Submit a "Good News" report for this student.
    4.  Submit a "Stop & Think" report for this student.
    5.  Verify:
        *   Administrator receives notifications for both.
        *   Parent test email receives notifications (if enabled for that report type).
        *   Email content is correct (see [Email Template Customization](#email-template-customization)).
    *   **Troubleshooting:** If emails are not received, check:
        *   Apps Script quotas (see [Installation Guide](./Installation_Guide.md#apps-script-quota-limitations)).
        *   Spam/junk folders.
        *   Correctness of email addresses in `Configuration` and `StudentDirectory`.
        *   Execution logs in Apps Script editor for errors.

### Character Pillar Customization
Most schools will want to customize the character pillars and associated behaviors to match their specific program (e.g., PBIS, Character Counts).

*   **Location:** Typically managed in a dedicated sheet named `CharacterPillars` or `PillarsAndBehaviors`.
*   **Structure:** This sheet usually has columns like:
    *   `PillarName`: The main character trait (e.g., "Respect", "Responsibility").
    *   `BehaviorDescription`: Specific observable behaviors related to the pillar (e.g., "Listened attentively", "Followed directions").
    *   `BehaviorType`: Indicates if the behavior is typically "Positive" (for Good News) or "Negative" (for Stop & Think), or "Neutral" if applicable to both. Some systems might have separate lists or infer this.
    *   `IsActive`: `TRUE` or `FALSE` to enable/disable a pillar or behavior from appearing in the form.
*   **Customization Steps:**
    1.  Open the `CharacterPillars` sheet.
    2.  **Review Defaults:** Examine any pre-populated pillars and behaviors.
    3.  **Modify/Add:**
        *   To change a pillar name, edit the `PillarName` cell.
        *   To add a new pillar, add a new row and fill in the details.
        *   To add a behavior under an existing pillar, add a new row, repeat the `PillarName`, and add the new `BehaviorDescription`.
    4.  **Deactivate:** Change `IsActive` to `FALSE` for any pillars/behaviors you don't want to use. Do not delete rows unless you are sure they haven't been used in past reports, as this could affect historical data analysis.
    *   *(Placeholder: Screenshot of CharacterPillars sheet - `images/admin_screenshots/06_config_character_pillars.png`)*
*   **Impact:** Changes made here will dynamically update the choices available in the behavior reporting form. Test the form after making changes.

---

## 3. User Management

### Adding/Removing Teachers
Teachers do not typically have individual accounts *within the system itself*. They access the system via the shared web app URL. Management involves ensuring they:
1.  **Have the Form URL:** The primary method is distributing the web app URL.
2.  **Are Authorized (if domain restriction is used):** If the web app is configured to "Anyone within [Your Domain]," ensure teachers are using their school Google accounts.

No specific "adding/removing teachers" interface is usually present in the spreadsheet backend unless your system has advanced features for per-teacher customization, which is uncommon for this type of Apps Script project.

### Managing Parent Contact Information
Parent contact information is crucial for email notifications. This data is managed in the `StudentDirectory` sheet.

*   **Location:** `StudentDirectory` sheet in the Google Spreadsheet.
*   **Key Columns:**
    *   `StudentID` (Unique identifier)
    *   `StudentFirstName`
    *   `StudentLastName`
    *   `GradeLevel`
    *   `ParentEmail1` (Primary parent email)
    *   `ParentEmail2` (Optional secondary parent email)
    *   Other fields like `HomeroomTeacher`, etc., as per your school's needs.
*   **Adding New Students/Parents:**
    *   Add a new row for each student.
    *   Fill in all relevant details, especially `ParentEmail1`.
*   **Updating Information:**
    *   Directly edit the cells in the `StudentDirectory` sheet.
    *   Ensure email addresses are accurate.
*   **Removing Students (Archiving):**
    *   Instead of deleting rows (which can impact historical data integrity), consider adding an `IsActive` column to `StudentDirectory`. Set to `FALSE` for students who have left. The reporting form script would then need to be modified to only lookup active students.
    *   Alternatively, at the end of a school year, you might archive the entire sheet (see [Data Cleanup and Archival](#data-cleanup-and-archival)).
    *   *(Placeholder: Screenshot of StudentDirectory sheet with parent email columns highlighted - `images/admin_screenshots/07_user_student_directory.png`)*

### Directory Management Best Practices
*   **Data Accuracy:** Regularly verify and update student and parent contact information. Incorrect parent emails are a common reason for failed notifications.
*   **Unique Student IDs:** Ensure each student has a unique `StudentID`. This is vital for accurate data logging and lookup.
*   **Consistency:** Use consistent formatting for names, grade levels, etc.
*   **Regular Audits:** Periodically review the directory for completeness and accuracy, perhaps at the start of each semester.
*   **Bulk Import/Sync (Advanced):** For larger schools, manually managing the `StudentDirectory` can be cumbersome. Consider:
    *   **CSV Import:** Periodically, you could clear and paste data from a CSV export from your main Student Information System (SIS). This requires care to match column headers.
    *   **SIS Integration (Complex):** A more advanced (and complex to develop) solution would involve using Apps Script to fetch data from your SIS via an API, if available. This is beyond the scope of typical basic systems.
    *   *(If your system supports CSV import for student directory, reference that functionality here or in `Templates_Examples.md`)*

---

## 4. System Maintenance

Regular maintenance ensures the system runs smoothly and data remains secure.

### Regular Backup Procedures
Google Sheets has built-in version history, which acts as a form of backup. However, explicit backups are recommended.

*   **Google Sheet Version History:**
    *   Access via **File > Version history > See version history**.
    *   You can view, name, and restore previous versions of the spreadsheet. This is useful for undoing accidental mass deletions or errors.
    *   *(Placeholder: Screenshot of accessing version history - `images/admin_screenshots/08_maintenance_version_history.png`)*
*   **Manual Backups (Recommended):**
    1.  **Make a Copy:** Regularly (e.g., weekly or monthly), create a copy of the entire Google Spreadsheet: **File > Make a copy**. Name it descriptively (e.g., "Student Behavior System - Backup YYYY-MM-DD"). Store these copies in a separate folder in Google Drive.
    2.  **Download as Excel/CSV:** For offline backups or if migrating away from Google Sheets, you can download sheets: **File > Download > Microsoft Excel (.xlsx)** or **Comma-separated values (.csv)** for individual sheets.
*   **Backup Frequency:** Depends on usage volume. For high-volume schools, weekly backups are advisable. For lower volume, monthly might suffice.

### Data Cleanup and Archival
Over time, the `BehaviorLog` sheet can become very large.

*   **End-of-Year Archival:**
    1.  **Duplicate the Spreadsheet:** Before the start of a new school year, make a full copy of the live spreadsheet (File > Make a copy). Name the copy for the completed year (e.g., "Student Behavior Data 2023-2024 - ARCHIVED"). This becomes your historical archive.
    2.  **Clear Active Spreadsheet:** In the *live* spreadsheet:
        *   **Clear `BehaviorLog`:** Delete all rows of data from the `BehaviorLog` sheet, leaving the header row.
        *   **Update `StudentDirectory`:** Remove or mark as inactive students who are no longer enrolled. Update grades for returning students.
        *   **Update `SchoolYear`:** Change the `SchoolYear` setting in the `Configuration` sheet.
    *   This ensures the live system starts fresh for the new year, maintaining performance.
*   **Archiving Old Student Records:**
    *   If not clearing the whole `StudentDirectory`, implement an `IsActive` flag as mentioned in [Managing Parent Contact Information](#managing-parent-contact-information).
    *   Periodically, you could move inactive student rows from the live `StudentDirectory` to an archive sheet or the archived spreadsheet.

### Performance Monitoring
*   **Spreadsheet Performance:**
    *   Large datasets (tens of thousands of rows in `BehaviorLog`) can slow down spreadsheet loading and script execution. Regular archival helps.
    *   Avoid overly complex formulas directly within the data sheets if they are not essential for the Apps Script logic.
*   **Apps Script Dashboard:**
    *   Access from the Apps Script editor: **Executions**.
    *   Monitor for:
        *   **Failed executions:** Investigate any errors.
        *   **Long execution times:** Identify potential bottlenecks in your script.
        *   **Quota usage:** Keep an eye on email quotas, script runtime, etc., especially during peak usage.
    *   *(Placeholder: Screenshot of Apps Script Executions dashboard - `images/admin_screenshots/09_maintenance_apps_script_dashboard.png`)*

### Troubleshooting Common Issues
*   Refer to the [FAQ & Troubleshooting Guide](./FAQ_Troubleshooting.md) for a detailed list of common problems and solutions.
*   **Common areas:**
    *   Email delivery failures.
    *   Form access problems ("You need permission").
    *   Data not appearing in the spreadsheet.
    *   Incorrect data in dropdowns (often related to `CharacterPillars` or `StudentDirectory` issues).
*   **Basic Checks:**
    *   Verify all settings in the `Configuration` sheet.
    *   Ensure the correct Google account is being used.
    *   Check for typos in email addresses or student IDs.
    *   Review Apps Script execution logs for error messages.

---

## 5. Customization Options

Tailor the system to your school's specific needs.

### Branding and Color Scheme Changes
*   **Web Form (HTML):**
    *   If you have HTML/CSS knowledge, you can modify the `.html` files in the Apps Script project (e.g., `Index.html` or a separate `Stylesheet.html`).
    *   Change CSS styles for colors, fonts, and layout.
    *   Add your school logo: Upload the logo to a web-accessible location (e.g., school website, Google Sites) and reference it in the HTML `<img>` tag. Ensure the image URL is publicly accessible.
    *   *(Placeholder: Screenshot of HTML file showing CSS section or logo img tag - `images/admin_screenshots/10_custom_html_css.png`)*
*   **Email Templates:**
    *   Branding in emails is typically limited to text and simple HTML. You can add your school name prominently. Complex HTML/CSS in emails is often stripped by email clients.

### Custom Character Pillars and Behaviors
*   This is a core customization. See [Character Pillar Customization](#character-pillar-customization) under Section 2 for detailed instructions on modifying the `CharacterPillars` sheet.

### Email Template Customization
Email templates are usually stored in the `EmailTemplates` sheet or directly within the Apps Script code (`.gs` files).

*   **Accessing Templates:**
    *   If in `EmailTemplates` sheet: Columns might include `TemplateName` (e.g., "ParentGoodNews", "AdminStopAndThink"), `EmailSubject`, `EmailBody`.
    *   If in code: Look for functions that construct email subjects and bodies.
*   **Placeholders:** Templates often use placeholders (e.g., `{{StudentName}}`, `{{BehaviorPillar}}`, `{{Comments}}`) that the script replaces with actual data. Do not change the placeholder markers (e.g., `{{ }}`) themselves, only the surrounding text.
*   **Customizing Content:**
    *   Edit the subject lines and body text to match your school's tone and communication policies.
    *   Add or remove information as needed.
    *   Ensure all necessary placeholders are present to convey the required information.
    *   *(Placeholder: Screenshot of EmailTemplates sheet or code section - `images/admin_screenshots/11_custom_email_templates.png`)*
*   **Testing:** After customizing email templates, send test emails (see [Email Configuration and Testing](#email-configuration-and-testing)) to ensure they appear as expected and all placeholders are correctly populated.

---

## 6. Security & Privacy

Protecting student data is paramount.

### Data Protection Guidelines
*   **Access Control (Spreadsheet):**
    *   Share the Google Spreadsheet (containing all data) **only** with essential personnel (e.g., System Administrators, designated data managers). Do **not** share it with "Anyone with the link" or make it public. Use specific Google accounts for sharing.
    *   Review sharing permissions regularly.
*   **Access Control (Web App):**
    *   Configure the web app deployment "Who has access" setting appropriately (see [Installation Guide](./Installation_Guide.md#step-24-configuring-the-web-app-deployment)). "Anyone within [Your Domain]" is often a good balance for internal school use.
*   **Google Workspace Security:** Leverage Google Workspace security features (e.g., 2-Step Verification for admin accounts).
*   **Data Minimization:** Only collect data that is necessary for the system's purpose.
*   **Regularly Review Apps Script Permissions:** Be aware of what Google services the script has access to.

### FERPA Compliance Checklist
The Family Educational Rights and Privacy Act (FERPA) is a U.S. federal law that protects the privacy of student education records. While this system can be a tool, compliance is procedural and organizational.

*   [ ] **Parental Consent for Data Collection (if applicable):** Understand if your data collection practices require specific consent beyond general school enrollment agreements, especially if data is shared with third parties (not typical for this self-contained system).
*   [ ] **Access Rights:** Parents have the right to inspect and review their child's education records. Ensure you have a process for providing data from this system if requested.
*   [ ] **Amendment Rights:** Parents have the right to request amendments to records they believe are inaccurate. Have a process for this.
*   [ ] **Disclosure Controls:** Understand rules around disclosing student data. This system primarily facilitates internal communication and direct parent communication. Be cautious if exporting or sharing data more broadly.
*   [ ] **Data Security:** Implement the data protection guidelines above.
*   [ ] **Staff Training:** Train staff (especially those submitting reports and administrators) on FERPA basics and responsible data handling.
*   [ ] **Record Retention & Disposal:** Follow school/district policies for how long student behavior data should be kept and how it should be disposed of (see [Data Cleanup and Archival](#data-cleanup-and-archival)).

**Disclaimer:** This checklist is for informational purposes. Consult with your school district's legal counsel for specific FERPA compliance guidance.

### User Access Controls
*   **Spreadsheet Sharing:**
    *   Limit "Edit" access to the spreadsheet to only the System Administrator(s).
    *   If others need to view data (e.g., counselors), grant them "View only" access if appropriate, or create summary reports separately.
*   **Web App Deployment:**
    *   As mentioned, the "Who has access" setting for the web app is the primary control for who can submit forms.
*   **No Granular In-App Roles (Typically):** Standard Apps Script web apps of this nature usually don't have complex internal role management. Access is controlled by who has the form URL and the deployment settings.

---

*This Administrator Guide provides a comprehensive overview. For specific step-by-step installation, refer to the [Installation Guide](./Installation_Guide.md). For teacher-specific instructions, see the [Teacher User Manual](./Teacher_User_Manual.md).*
