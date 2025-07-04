# Templates & Examples: Student Behavior Management System

This document provides sample templates and examples to help administrators set up and customize the Student Behavior Management System effectively.

**Target Audience:** Administrators

## Table of Contents
1.  [Sample Student Directory Data](#1-sample-student-directory-data)
    *   [CSV Template Structure](#csv-template-structure)
    *   [Example Data (Anonymized)](#example-data-anonymized)
    *   [Data Validation Considerations](#data-validation-considerations)
    *   [Import Instructions (General)](#import-instructions-general)
2.  [Email Template Examples](#2-email-template-examples)
    *   [Effective Parent Communication Samples](#effective-parent-communication-samples)
    *   [Tone and Language Guidelines](#tone-and-language-guidelines)
    *   [Customization Placeholders](#customization-placeholders)
3.  [Character Pillar Customization Examples](#3-character-pillar-customization-examples)
    *   [Alternative Pillar Frameworks (Ideas)](#alternative-pillar-frameworks-ideas)
    *   [Age-Appropriate Behavior Examples](#age-appropriate-behavior-examples)
    *   [Cultural Adaptation Guidelines](#cultural-adaptation-guidelines)

---

## 1. Sample Student Directory Data

The `StudentDirectory` sheet is crucial for the system's student lookup functionality and parent email notifications.

### CSV Template Structure
Below is a common structure for a CSV file if you plan to import student data. The exact column names must match what your Apps Script code expects (check your `StudentDirectory` sheet headers or the script itself).

```csv
StudentID,LastName,FirstName,GradeLevel,ParentEmail1,ParentEmail2,HomeroomTeacher,IsActive
```

**Column Descriptions:**
*   `StudentID`: Unique identifier for each student (e.g., "S1001", "S1002"). **Required, Must be Unique.**
*   `LastName`: Student's last name. **Required.**
*   `FirstName`: Student's first name. **Required.**
*   `GradeLevel`: Student's grade (e.g., "K", "1", "5", "9"). **Required.**
*   `ParentEmail1`: Primary parent/guardian email address. **Required for email notifications.**
*   `ParentEmail2`: Secondary parent/guardian email address (optional).
*   `HomeroomTeacher`: Homeroom teacher's name or email (optional, for informational purposes).
*   `IsActive`: `TRUE` or `FALSE`. Use `TRUE` for currently enrolled students who should appear in lookups. (Optional, but recommended for managing student turnover without deleting records). If not used, all students in the sheet are considered active.

### Example Data (Anonymized)

```csv
StudentID,LastName,FirstName,GradeLevel,ParentEmail1,ParentEmail2,HomeroomTeacher,IsActive
S1001,Doe,John,5,parent.john.doe@example.com,,Ms. Smith,TRUE
S1002,Smith,Jane,3,jane.smith.parent@example.com,other.parent.jane@example.com,Mr. Jones,TRUE
S1003,Garcia,Carlos,5,carlos.garcia.guardian@example.com,,Ms. Smith,TRUE
S1004,Lee,Priya,K,priya.lee.parent@example.com,,Mrs. Davis,TRUE
S1005,Bizimana,Aisha,2,a.bizimana.contact@example.com,,Ms. Chen,FALSE
```
*(Placeholder: This CSV data could also be presented as a table in the Markdown)*

### Data Validation Considerations
*   **Unique StudentIDs:** Crucial. Duplicates will cause lookup issues.
*   **Valid Email Formats:** Ensure `ParentEmail1` and `ParentEmail2` are valid email addresses.
*   **Consistent Grade Levels:** Use a consistent format for grades (e.g., "K", "1", "01" - choose one and stick to it).
*   **Required Fields:** Make sure all required fields (StudentID, LastName, FirstName, GradeLevel, ParentEmail1) are filled for active students.
*   **Character Encoding:** If using special characters in names, ensure your CSV is saved with UTF-8 encoding.

### Import Instructions (General)
How you "import" this data into the `StudentDirectory` Google Sheet:

1.  **Prepare your CSV:** Create your student data in a spreadsheet program (Excel, Google Sheets, Numbers) and save/export it as a CSV file.
2.  **Open the System's Google Spreadsheet:** Navigate to the Google Sheet that backs your Student Behavior Management System.
3.  **Select the `StudentDirectory` Sheet:** Click on the `StudentDirectory` tab.
4.  **Clear Existing Data (Optional but Recommended for Full Overwrite):**
    *   If you are replacing all student data, select all existing data rows (below the header row) and delete them. **Be careful not to delete the header row.**
5.  **Import CSV Data:**
    *   In Google Sheets, click **File > Import**.
    *   Go to the **Upload** tab and select your CSV file.
    *   For "Import location," choose **Replace data at selected cell** (if you've clicked cell A2, for example) or **Replace current sheet** (if you want to replace everything including headers, then you'd need to ensure your CSV has headers). **Append to current sheet** can also be used if adding new students without deleting old ones, but be wary of creating duplicates.
    *   For "Separator type," usually **Detect automatically** or **Comma** works.
    *   Click **Import data**.
6.  **Verify:** Check that the data has been imported correctly, columns align, and there are no obvious errors.

**Note:** If your Apps Script has a custom import function, follow its specific instructions. The above are general Google Sheets CSV import steps.

---

## 2. Email Template Examples

Email templates are often managed in an `EmailTemplates` sheet or directly in the Apps Script code. These examples provide a starting point. Remember to use placeholders that your script recognizes (e.g., `{{StudentName}}`, `{{Pillar}}`, `{{Behavior}}`, `{{Comments}}`, `{{Date}}`, `{{TeacherName}}`).

### Effective Parent Communication Samples

**A. Good News Email to Parent**

*   **Subject Options:**
    *   `Good News about {{StudentName}} from [School Name]!`
    *   `Celebrating {{StudentName}}'s Success in {{Pillar}}!`
    *   `A Positive Update on {{StudentName}}'s Day`

*   **Body Example:**

    ```
    Dear Parent/Guardian of {{StudentName}},

    We are delighted to share some good news regarding {{StudentName}}'s behavior today, {{Date}}.

    Character Pillar: {{Pillar}}
    Specific Behavior: {{Behavior}}

    Teacher Comments:
    {{Comments}}

    This demonstration of {{Pillar}} is a wonderful contribution to our school community. We encourage you to discuss this positive report with {{StudentName}} and celebrate their efforts!

    Thank you for your partnership in fostering a positive learning environment.

    Sincerely,

    {{TeacherName}} (Reporting Staff)
    [School Name]
    [School Phone/Website - Optional, can be hardcoded]
    ```

**B. Stop & Think Email to Parent**

*   **Subject Options:**
    *   `Important: Behavior Update for {{StudentName}} from [School Name]`
    *   `Following Up: {{StudentName}}'s Behavior on {{Date}}`
    *   `Information regarding {{StudentName}} - {{Pillar}}`

*   **Body Example:**

    ```
    Dear Parent/Guardian of {{StudentName}},

    This email is to inform you about a behavior incident involving {{StudentName}} that occurred on {{Date}}. We believe open communication is key to helping our students learn and grow.

    Character Pillar: {{Pillar}}
    Specific Behavior Observed: {{Behavior}}

    Teacher Comments:
    {{Comments}}

    Our goal is to work together to support {{StudentName}} in making positive choices and understanding school expectations. We encourage you to discuss this incident with {{StudentName}} to reflect on the behavior and consider better choices for the future.

    Please feel free to contact {{TeacherName}} at [Teacher Contact Info - if policy allows] or the school office if you would like to discuss this further.

    Sincerely,

    {{TeacherName}} (Reporting Staff)
    [School Name]
    [School Phone/Website - Optional]
    ```

### Tone and Language Guidelines
*   **Positive & Supportive:** Even for "Stop & Think" reports, maintain a supportive tone focused on growth and partnership.
*   **Objective & Clear:** Use factual, straightforward language. Avoid jargon or overly emotional terms.
*   **Respectful:** Address parents/guardians respectfully.
*   **School Branding:** Ensure the school name is prominent.
*   **Actionable (Implicitly):** Emails should encourage dialogue between parent and child.

### Customization Placeholders
Common placeholders your script might use (verify with your specific script):
*   `{{StudentName}}`: Full name of the student.
*   `{{StudentFirstName}}`: Student's first name.
*   `{{StudentLastName}}`: Student's last name.
*   `{{Date}}`: Date of the incident.
*   `{{Time}}`: Time of the incident.
*   `{{Pillar}}`: The character pillar selected.
*   `{{Behavior}}`: The specific behavior selected.
*   `{{Comments}}`: The comments entered by the teacher.
*   `{{TeacherName}}`: Name of the teacher submitting the report (if captured).
*   `{{AdminEmail}}`: Administrator's email.
*   `{{SchoolName}}`: School's name.

Locate where these are defined/used in your `EmailTemplates` sheet or `.gs` script files to customize.

---

## 3. Character Pillar Customization Examples

The default pillars and behaviors can be adapted to fit your school's unique culture and values. This is typically done in the `CharacterPillars` sheet.

### Alternative Pillar Frameworks (Ideas)
If your school doesn't have an established framework, or wants to refresh, consider these concepts:

*   **PBIS-Aligned (Positive Behavioral Interventions and Supports):**
    *   Be Safe
    *   Be Respectful
    *   Be Responsible
*   **The "7 Habits" (Adapted for Students):**
    *   Be Proactive
    *   Begin with the End in Mind
    *   Put First Things First
    *   Think Win-Win
    *   Seek First to Understand, Then to Be Understood
    *   Synergize
    *   Sharpen the Saw (Self-Care/Balance)
*   **SEL Competencies (Social Emotional Learning):**
    *   Self-Awareness
    *   Self-Management
    *   Social Awareness
    *   Relationship Skills
    *   Responsible Decision-Making
*   **School-Specific Values:** Your school might have its own unique set of 3-5 core values (e.g., "Integrity," "Curiosity," "Community," "Excellence").

### Age-Appropriate Behavior Examples

The specific behaviors listed under each pillar should be understandable and relevant to the age groups using the system.

**Example Pillar: Responsibility**

*   **For Younger Students (K-2):**
    *   Cleaned up own materials.
    *   Followed classroom rules.
    *   Tried their best on an activity.
    *   Kept hands to self.
*   **For Older Students (3-5 or Middle School):**
    *   Came to class prepared with materials.
    *   Completed homework on time.
    *   Managed time effectively during group work.
    *   Took ownership of a mistake and offered a solution.
    *   Used technology appropriately.

When defining behaviors in your `CharacterPillars` sheet, consider if you need different sets for different grade bands or if generic phrasing can apply broadly.

### Cultural Adaptation Guidelines
*   **Language:** Ensure pillar names and behavior descriptions are in clear, accessible language for your school community. If serving a multilingual community, consider if translations or bilingual phrasing are needed (this adds complexity to the form and data).
*   **Values Alignment:** Review pillars and behaviors to ensure they align with the cultural values and norms of your diverse student population. What constitutes "respect" or "responsibility" can have cultural nuances.
*   **Inclusivity:** Avoid behaviors that might unintentionally penalize students from different cultural backgrounds or those with specific learning needs, unless they are clear violations of established school-wide expectations.
*   **Community Input:** If undertaking a major revision of character pillars, consider involving a diverse group of staff, parents, and even students (age-appropriately) in the discussion to ensure the framework is meaningful and inclusive.
*   **Positive Framing:** Emphasize what students *should* do, rather than just listing prohibitions, especially for "Good News" behaviors.

---

*These templates and examples are starting points. Always adapt them to your school's specific needs, policies, and the technical implementation of your Student Behavior Management System.*
