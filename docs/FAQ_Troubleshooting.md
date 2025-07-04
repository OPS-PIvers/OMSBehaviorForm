# FAQ & Troubleshooting Guide: Student Behavior Management System

This guide provides answers to frequently asked questions and solutions for common issues encountered by all users of the Student Behavior Management System.

**Target Audience:** All Users (Administrators, Teachers, Staff)

## Table of Contents
1.  [General Questions](#1-general-questions)
    *   [What are the main capabilities of this system?](#what-are-the-main-capabilities-of-this-system)
    *   [What are its limitations?](#what-are-its-limitations)
    *   [How is student data kept private and secure?](#how-is-student-data-kept-private-and-secure)
    *   [Is there a cost or licensing associated with this system?](#is-there-a-cost-or-licensing-associated-with-this-system)
2.  [Setup & Configuration Issues (Primarily for Administrators)](#2-setup--configuration-issues-primarily-for-administrators)
    *   [The setup wizard/initial script run failed. What should I do?](#the-setup-wizardinitial-script-run-failed-what-should-i-do)
    *   [I'm getting "Authorization Required" errors repeatedly.](#im-getting-authorization-required-errors-repeatedly)
    *   [Emails are not being sent or received.](#emails-are-not-being-sent-or-received)
    *   [Character pillars or behaviors are not showing up correctly in the form.](#character-pillars-or-behaviors-are-not-showing-up-correctly-in-the-form)
3.  [User Experience Problems (Primarily for Teachers/Staff)](#3-user-experience-problems-primarily-for-teachersstaff)
    *   [I can't access the behavior reporting form URL ("You need permission").](#i-cant-access-the-behavior-reporting-form-url-you-need-permission)
    *   [The form is loading very slowly.](#the-form-is-loading-very-slowly)
    *   [I can't find a student when I search for them in the form.](#i-cant-find-a-student-when-i-search-for-them-in-the-form)
    *   [I submitted a report, but the data isn't appearing in the spreadsheet (for admins) or I didn't get a confirmation (for teachers).](#i-submitted-a-report-but-the-data-isnt-appearing-in-the-spreadsheet-for-admins-or-i-didnt-get-a-confirmation-for-teachers)
    *   [The form looks strange or doesn't work on my mobile device/browser.](#the-form-looks-strange-or-doesnt-work-on-my-mobile-devicebrowser)
4.  [Data Management (Primarily for Administrators)](#4-data-management-primarily-for-administrators)
    *   [How do I back up the system's data?](#how-do-i-back-up-the-systems-data)
    *   [Can I export data to Excel or another format?](#can-i-export-data-to-excel-or-another-format)
    *   [How should we archive old records (e.g., at the end of a school year)?](#how-should-we-archive-old-records-eg-at-the-end-of-a-school-year)
5.  [Contact Information](#5-contact-information)
    *   [Where can I get additional help if my issue isn't listed here?](#where-can-i-get-additional-help-if-my-issue-isnt-listed-here)
    *   [Are there community resources or forums for users?](#are-there-community-resources-or-forums-for-users)
    *   [What about professional support options?](#what-about-professional-support-options)

---

## 1. General Questions

### What are the main capabilities of this system?
This system allows teachers and staff to:
*   Submit "Good News" (positive) and "Stop & Think" (needs improvement) behavior reports via a web form.
*   Look up students from a directory.
*   Categorize behaviors using predefined character pillars and specific actions.
*   Add detailed comments.

Administrators can:
*   View all submitted behavior data in a central Google Spreadsheet.
*   Configure system settings, character pillars, and email templates.
*   Receive email notifications of submitted reports.
*   (Potentially) have parent email notifications automatically sent.

### What are its limitations?
*   **Based on Google Workspace:** Relies on Google Sheets and Apps Script, so it's subject to their features and limitations (e.g., quotas).
*   **Not a Full SIS:** It's a dedicated behavior tracking tool, not a comprehensive Student Information System. It doesn't typically manage grades, attendance, etc.
*   **Reporting & Analytics:** While data is centralized, advanced analytics or custom report generation might require manual spreadsheet work or further development.
*   **Real-time Sync:** Data submission is usually quick, but it's not instantaneous like some dedicated commercial software.
*   **Scalability:** For extremely large districts (many thousands of students and very high submission volumes), performance might degrade, and Google Apps Script quotas could become a concern.

### How is student data kept private and secure?
*   **Google Workspace Security:** Leverages the security of your Google Workspace environment.
*   **Spreadsheet Permissions:** Access to the raw data (Google Sheet) is controlled by standard Google Drive sharing permissions. Administrators must restrict access to authorized personnel only.
*   **Web App Access:** The reporting form's accessibility is controlled by the deployment settings (e.g., "Only myself," "Anyone in [Your Domain]," "Anyone with Google account").
*   **Data Handling:** Administrators are responsible for following school/district policies and FERPA guidelines for data management, access, and retention. See the [Administrator Guide](./Administrator_Guide.md#6-security--privacy).
*   **No External Hosting (Typically):** The data and script reside within your school's Google Workspace environment.

### Is there a cost or licensing associated with this system?
*   **Google Workspace Subscription:** The primary cost is your existing Google Workspace subscription.
*   **Apps Script:** Google Apps Script is a free service within Google Workspace.
*   **System Itself:** If this system was developed internally or provided as an open-source solution, there might be no direct software cost. If it was custom-developed by a third party, there would have been development costs.
*   **No Ongoing Licensing (Typically):** Unlike commercial software, there usually isn't an ongoing per-user or annual license fee for the script itself, unless specified by the developer/provider.

---

## 2. Setup & Configuration Issues (Primarily for Administrators)

Refer to the [Installation Guide](./Installation_Guide.md) and [Administrator Guide](./Administrator_Guide.md) for detailed setup steps.

### The setup wizard/initial script run failed. What should I do?
1.  **Check Execution Logs:** In the Apps Script editor, go to **View > Executions**. Look for the failed execution, click on it, and examine the error message. This often provides clues.
2.  **Permissions:** Ensure the user running the script has the necessary permissions (e.g., to create sheets, modify the spreadsheet).
3.  **Typos in Code (If Modified):** If you've modified the script, check for syntax errors.
4.  **Spreadsheet Issues:** Ensure the spreadsheet is not corrupted or in an unexpected state.
5.  **Try Again:** Sometimes, a temporary Google service issue might cause a failure. Try running the setup function again.
6.  **Consult Documentation:** Review the setup steps in the [Installation Guide](./Installation_Guide.md).

### I'm getting "Authorization Required" errors repeatedly.
1.  **Complete Authorization Flow:** Make sure you complete the entire authorization process, including clicking "Advanced" and "Go to (unsafe)" if prompted that Google hasn't verified the app.
2.  **Correct Account:** Ensure you are authorizing with the Google account that owns the script and spreadsheet.
3.  **Third-Party Cookies (Less Common):** In rare cases, browser settings blocking third-party cookies can interfere with Apps Script authorization. Try allowing them temporarily for `google.com`.
4.  **Multiple Google Accounts:** If logged into multiple Google accounts in your browser, try using an Incognito window or a browser profile where only the relevant Google account is active.
5.  **Re-deploy Web App:** If the issue is with web app access, create a new deployment (Deploy > Manage Deployments > Edit the current one > Select "New version"). This sometimes forces a re-evaluation of permissions for the web app execution.
6.  **Review Scopes:** The script requests certain permissions (scopes). If your domain administrator has restricted some scopes, this could be an issue.

### Emails are not being sent or received.
1.  **Check Apps Script Quotas:** Google limits the number of emails an Apps Script can send per day. Use `MailApp.getRemainingDailyQuota()` in a test function to check your remaining quota.
    *   *(See [Installation Guide](./Installation_Guide.md#apps-script-quota-limitations))*
2.  **Verify Email Addresses:**
    *   Ensure `AdminEmail` in the `Configuration` sheet is correct.
    *   Ensure parent email addresses in the `StudentDirectory` are correct and valid for test students.
3.  **Check Spam/Junk Folders:** Emails might be filtered into spam by recipient email systems. Ask recipients to check these folders and mark emails from your system as "not spam."
4.  **Execution Logs:** Check Apps Script execution logs for errors related to `MailApp.sendEmail()`.
5.  **Correct `SendParentEmails` Settings:** In the `Configuration` sheet, verify that `SendParentEmailsGoodNews` and `SendParentEmailsStopAndThink` are set to `TRUE` if you expect parent emails.
6.  **Script Authorization:** Ensure the script is authorized to send emails (this is usually granted during the initial setup).

### Character pillars or behaviors are not showing up correctly in the form.
1.  **Check `CharacterPillars` Sheet:**
    *   Ensure the sheet name is correct as referenced in the script.
    *   Verify that pillars and behaviors are listed correctly, with no typos.
    *   Check for an `IsActive` column; if present, ensure desired items are set to `TRUE`.
2.  **Script Logic:** The Apps Script code that populates these dropdowns might have an error or might be looking for specific column headers. If you've changed headers in the `CharacterPillars` sheet, the script might break.
3.  **Data Range:** The script might be reading a specific range (e.g., "A2:C50"). If you add more items than this, they won't appear. The script should ideally read the whole columns dynamically.
4.  **Caching:** The web app might cache some data. Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clearing browser cache for the form page.
5.  **Test with New Deployment:** If you made code changes related to how pillars/behaviors are fetched, ensure you've created a new web app deployment.

---

## 3. User Experience Problems (Primarily for Teachers/Staff)

Refer to the [Teacher User Manual](./Teacher_User_Manual.md) for guidance on using the form.

### I can't access the behavior reporting form URL ("You need permission").
1.  **Correct Google Account:** Ensure you are logged into the correct Google account (usually your school-provided Google Workspace account). The form might be restricted to users within your school's domain.
2.  **Contact Administrator:** The administrator needs to check the web app deployment settings:
    *   In Apps Script editor: **Deploy > Manage deployments**. Select the active deployment, click **Edit** (pencil icon).
    *   Verify the **"Who has access"** setting. It might be too restrictive (e.g., "Only myself"). Change it to "Anyone within [Your Domain]" or as appropriate.
    *   *(See [Installation Guide](./Installation_Guide.md#step-24-configuring-the-web-app-deployment))*

### The form is loading very slowly.
1.  **Internet Connection:** Check your local internet connection speed.
2.  **Number of Students (Student Lookup):** If the student lookup feature loads all students into the form at once (less efficient design), a very large student directory can slow down initial load. This is a design aspect the administrator might need to address in the script (e.g., by implementing server-side search).
3.  **Browser Issues:** Try a different browser or an incognito window to rule out browser extension conflicts.
4.  **Google Services Outage:** Rarely, Google services themselves might experience slowdowns. Check the Google Workspace Status Dashboard.

### I can't find a student when I search for them in the form.
1.  **Check Spelling:** Double-check the spelling of the student's name or ID. Try searching by just the last name or first name.
2.  **Student Not in Directory:** The student may not be in the system's `StudentDirectory` sheet, or their information might be entered incorrectly there.
    *   **Action:** Notify your system administrator. They will need to check the `StudentDirectory` sheet in the main Google Spreadsheet and add/correct the student's information.
3.  **`IsActive` Flag:** If the system uses an `IsActive` flag for students, the student might be marked as inactive. Administrator needs to check.

### I submitted a report, but the data isn't appearing in the spreadsheet (for admins) or I didn't get a confirmation (for teachers).
1.  **Teacher:**
    *   **Confirmation Message:** Did you see a "Report submitted successfully" message on the form? If not, the submission likely failed. Try again.
    *   **Error Message:** If there was an error message, note it down and provide it to your administrator.
2.  **Administrator:**
    *   **Check `BehaviorLog` Sheet:** Open the Google Spreadsheet and navigate to the `BehaviorLog` (or similarly named) sheet. Check if the new row of data is present. Sort by timestamp if necessary.
    *   **Execution Logs:** In Apps Script editor, check **Executions**. Look for the `doPost` (or form handler) function execution around the time of submission. Check for errors.
    *   **Script Errors:** There might be an error in the script that processes form submissions (e.g., writing to the sheet, sending emails).
    *   **Sheet Protections:** Ensure the `BehaviorLog` sheet or relevant cells are not protected in a way that prevents the script from writing to them.
    *   **Filtering:** Make sure no filters are applied to the `BehaviorLog` sheet that might be hiding the new data.

### The form looks strange or doesn't work on my mobile device/browser.
1.  **Supported Browsers:** Ensure you are using a modern, supported browser (Chrome, Safari, Firefox, Edge).
2.  **Updates:** Make sure your browser and device operating system are up to date.
3.  **Responsive Design:** While the form is generally designed to be responsive, complex layouts or specific CSS might not render perfectly on all screen sizes.
4.  **Report to Administrator:** If the form is unusable or significantly broken on a common device/browser, report this to the administrator. They may need to adjust the HTML/CSS in the Apps Script project.
    *   Provide details: Device model, OS version, Browser version, and a screenshot if possible.

---

## 4. Data Management (Primarily for Administrators)

### How do I back up the system's data?
*   **Google Sheet Version History:** Google Sheets automatically saves versions. Go to **File > Version history > See version history**. You can restore previous versions from here.
*   **Manual Copy:** Regularly create a full copy of the Google Spreadsheet: **File > Make a copy**. Store this backup in a secure Google Drive folder.
*   **Download:** You can also download the entire spreadsheet as an Excel file (**File > Download > Microsoft Excel (.xlsx)**) or individual sheets as CSV files.
*   *(See [Administrator Guide](./Administrator_Guide.md#regular-backup-procedures))*

### Can I export data to Excel or another format?
Yes. From the Google Spreadsheet:
*   **Entire Spreadsheet:** Go to **File > Download > Microsoft Excel (.xlsx)**.
*   **Specific Sheet (e.g., BehaviorLog):** Open the sheet, then go to **File > Download > Comma-separated values (.csv)** or **Microsoft Excel (.xlsx)** (if you want just that sheet in Excel format, you might need to copy it to a new spreadsheet first or delete other sheets after downloading).

### How should we archive old records (e.g., at the end of a school year)?
1.  **Make a Full Copy:** Before the new school year, create a complete copy of the live Google Spreadsheet (**File > Make a copy**). Name it for the archived year (e.g., "Student Behavior Data 2023-2024 - ARCHIVED").
2.  **Clear Live Data:** In the *live* spreadsheet for the new year:
    *   Delete all data rows (not headers) from the `BehaviorLog` sheet.
    *   Update the `StudentDirectory`: Remove students who have left, update grades/teachers for returning students. Or, if using an `IsActive` flag, update it.
    *   Update any `SchoolYear` setting in your `Configuration` sheet.
*   This keeps the live system performant and historical data safe in the archive.
*   *(See [Administrator Guide](./Administrator_Guide.md#data-cleanup-and-archival))*

---

## 5. Contact Information

### Where can I get additional help if my issue isn't listed here?
1.  **School/District IT Support:** Your first point of contact should be your local school or district IT support personnel or the designated administrator for this system.
2.  **System Administrator:** The person who set up and manages this system (likely someone within your school/district).

### Are there community resources or forums for users?
*   **Google Apps Script Community:** While not specific to this system, the general Google Apps Script community (e.g., on Stack Overflow, Google Groups) can be a resource for Apps Script-related questions if your administrator is troubleshooting code.
*   **Internal School/District Resources:** Your school or district might have its own internal forums or support channels.

### What about professional support options?
*   **System Developer (if applicable):** If this system was developed by a third-party contractor or company, they might offer support contracts.
*   **Google Workspace Support:** For issues related to core Google Workspace services (Sheets, Drive, general Apps Script platform issues), your Google Workspace administrator can contact Google Support. However, Google Support will not debug or fix custom code in your script.
*   **Independent Google Workspace Consultants:** Many consultants specialize in Google Workspace and Apps Script development and could be hired for custom modifications or advanced troubleshooting.

---

*Always refer to your school's specific guidelines and contact your designated system administrator for issues related to this Student Behavior Management System.*
