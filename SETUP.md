# GitHub Actions + clasp Setup Guide

This guide will help you set up automatic deployment to Google Apps Script using GitHub Actions and clasp.

## Prerequisites

- Google account with Apps Script access
- GitHub repository
- Node.js installed locally (for initial setup)

## Step 1: Create Google Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Copy the Script ID from the URL (e.g., `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`)

## Step 2: Enable Google Apps Script API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Library
3. Search for "Google Apps Script API"
4. Enable the API

## Step 3: Local clasp Setup

1. Install clasp globally:
   ```bash
   npm install -g @google/clasp
   ```

2. Login to clasp:
   ```bash
   clasp login
   ```
   This creates `~/.clasprc.json` with your credentials.

3. Update `.clasp.json` with your Script ID:
   ```json
   {
     "scriptId": "YOUR_SCRIPT_ID_HERE",
     "rootDir": "."
   }
   ```

## Step 4: Prepare Credentials for GitHub

1. **Base64 encode your credentials**:
   ```bash
   base64 ~/.clasprc.json
   ```
   Copy the output.

   **Alternative using GPG encryption**:
   ```bash
   gpg -o .clasprc.json.gpg --symmetric --cipher-algo AES256 ~/.clasprc.json
   base64 .clasprc.json.gpg
   ```

## Step 5: Configure GitHub Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add:

### Required Secrets:
- **`CLASPRC_JSON`**: Base64 encoded content of `~/.clasprc.json`
- **`SCRIPT_ID`**: Your Google Apps Script project ID (optional, can be in .clasp.json)

### Optional Secrets (if using GPG):
- **`CLASP_SECRET`**: Password used for GPG encryption

## Step 6: Test the Setup

1. Push your code to the `main` or `BehaviorFormTemplate` branch
2. Check GitHub Actions tab for workflow execution
3. Verify deployment in Google Apps Script console

## Step 7: Get Your Web App URL

After successful deployment:
1. In Google Apps Script, go to Deploy > Manage deployments
2. Copy the Web app URL
3. Test the deployed application

## Troubleshooting

### Authentication Issues
- Ensure Google Apps Script API is enabled
- Check that `.clasprc.json` is not expired
- Verify base64 encoding is correct

### Deployment Failures
- Check that Script ID in `.clasp.json` is correct
- Ensure branch names match workflow triggers
- Verify all GitHub secrets are set correctly

### Script Not Found
- Confirm the Script ID exists and is accessible
- Check Google Apps Script project permissions

## Workflow Triggers

The GitHub Action runs on:
- Push to `main` branch
- Push to `BehaviorFormTemplate` branch  
- Manual dispatch from GitHub Actions tab

## Files Created

- `.clasp.json` - clasp project configuration
- `appsscript.json` - Apps Script manifest
- `package.json` - Node.js project file
- `.gitignore` - Git ignore patterns
- `.github/workflows/deploy.yml` - GitHub Actions workflow

## Security Notes

- Never commit `.clasprc.json` to your repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate your Google Apps Script credentials
- Consider using service accounts for production deployments
- Ensure base64 credentials are entered as a single line without spaces

## Local Development Commands

```bash
# Push code to Apps Script
npm run push

# Pull code from Apps Script  
npm run pull

# Deploy to Apps Script
npm run deploy

# Open Apps Script project
npm run open
```