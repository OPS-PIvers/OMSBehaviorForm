# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Google Apps Script project bound to a Google Sheet. Teachers use a web app to send "Good News" (positive) or "Stop & Think" (corrective) character-pillar emails to parents. Each submission is also logged to the sheet, and admins get a daily summary email.

## Build, deploy, test

- There is no build step, package.json, linter, or automated test suite. The `.js` files are pushed to Apps Script as-is (V8 runtime).
- **Pushing to `main` deploys to production.** `.github/workflows/deploy.yml` runs `clasp push --force` and then updates the pinned deployment (`DEPLOYMENT_ID`), so the teacher-facing `/exec` URL stays the same. Anything merged to `main` reaches teachers right away.
- To push by hand: `clasp push` (clasp 3.x, `scriptId` in `.clasp.json`). To pull edits made in the online editor: `clasp pull`.
- Testing is manual. Run functions from the Apps Script editor or from the sheet's `Behavior System` menu: `testGoodNewsEmail`, `testStopThinkEmail`, `sendTestDailySummaryEmail`, `verifySystemSetup`, `testGradeLevelLookup`, `troubleshootEmailSystem`. If the Constants sheet has `SEND_EMAILS` set to `false`, `sendEmailToParents` only logs what it would send.

## Architecture

### One global namespace
Apps Script loads every `.js` file into one shared global scope. There are no imports or modules. Any function can call any other function across files. A name defined twice is silently overwritten by whichever file loads last. `getTeacherName` already exists in both `EmailSystem.js` and `WebAppBehaviorForm.js`, so check for an existing name before adding a function.

### Config and pillar data live in the spreadsheet, not the code
- `Constants.js`: `loadConstants()` reads the **Constants** sheet (keys like `SHEET_NAMES.DIRECTORY`) into the global `CONFIG`. `DEFAULT_CONSTANTS` only seeds that sheet on first setup. Real values (school name, admin emails, `SEND_EMAILS`) come from the sheet.
- `Pillars.js`: `loadPillarsData()` builds the global `PILLARS_DATA` from five sheets: Pillars, PositiveBehaviors, PositiveRecognitionExamples, NegativeBehaviors, and LearningFocus. `getDefaultPillarsData()` only holds seed data. `setupPillarsSheets()` **clears and overwrites** those sheets with the seeds.
- Globals don't carry over between Apps Script executions. Every entry point (`doGet`, `processWebAppForm`, triggers, menu actions) must call `loadConstants()` / `loadPillarsData()` before reading `CONFIG` or `PILLARS_DATA`.

### Web app (`WebAppBehaviorForm.js`)
- `appsscript.json` sets the web app to `executeAs: USER_ACCESSING` with `access: DOMAIN`. It runs as the teacher who opens it. `Session.getActiveUser()` is that teacher, and `sendEmailToParents` sends through `GmailApp` from the teacher's account. If `GmailApp` fails, it falls back to `MailApp`.
- `doGet` → `createImprovedBehaviorForm()` returns one large server-side template literal containing all the HTML, CSS, and client JS. `PILLARS_DATA` is injected through `${pillarsJson}`. **Client-side code inside that literal must not use backticks or `${`**, because the server would interpolate them. The existing client code uses string concatenation for this reason.
- Client → server calls go through `google.script.run`: `lookupStudent`, `getUserFullName`, and `processWebAppForm`. `processWebAppForm` sends the email, then calls `saveFormToSpreadsheetV2` to append the row.
- `lookupStudent` looks for an exact match in the Directory sheet first. If there isn't one, it suggests close names using Levenshtein distance (`SIMILARITY_THRESHOLD`, `MAX_SUGGESTIONS`).
- The client script hardcodes `PILLAR_COLORS` (by pillar name) and `QUICK_ACTIONS_MAPPING`. Each quick action's `pillar` must match a pillar name in the sheet. Its `behavior` string must match, exactly or as a substring, a behavior in the live Positive/NegativeBehaviors sheet. If it doesn't, the chip silently selects nothing. When you add a quick action, the matching behavior row must also be added to the live sheet.

### Hardcoded sheet column layouts (keep them in sync)
Several files assume fixed column positions instead of looking up headers:
- **Behavior Form** sheet: A timestamp, B teacher email, C/D student first/last, E behavior type, F location, G pillars, H behaviors, I comments, L student email, M–O parent 1, P–R parent 2, S ccAdmins, T grade level. These positions are used by `saveFormToSpreadsheetV2` (`columnMap`), `DirectoryInfo.js` (`onEdit` watches C/D and writes L–R and T), `DailySummaryEmail.js` (`getTodaysSubmissions` indices), and `logParser.js` headers.
- **Directory** sheet: A student first, B last, C grade, D student email, E–G parent 1 first/last/email, H–J parent 2. Read by `lookupStudent`, `saveFormToSpreadsheetV2`, and `lookupAndUpdateStudentInfo`.

Changing either layout means updating every one of those places.

### Other entry points
- `EmailSystem.js`: `onOpen` builds the `Behavior System` menu, and every admin/setup/test action is wired from it. It also has the email body builders (`createSimplifiedEmailBody` and the Good News / Stop & Think wrappers). `onFormSubmit` is the older Google Forms path, keyed on form question titles in `e.namedValues`. The web app is the current submission path.
- `DailySummaryEmail.js`: a time-based trigger at 3 PM, created from the menu (`checkAndCreateDailySummaryTrigger`), emails `CONFIG.ADMIN_EMAILS`.
- `DirectoryInfo.js`: `onEdit` auto-fills parent info when a student name is typed straight into the Behavior Form sheet. It can also be installed as a trigger through `createOnEditTrigger`. It also sorts submissions into per-grade-level sheets.
- `logParser.js`: a recovery tool. It rebuilds rows from pasted `"Appending row to sheet: [...]"` execution-log lines.
