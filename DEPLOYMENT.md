# Deployment Guide

This guide will help you deploy your React application to GitHub Pages using GitHub Actions.

## Prerequisites

1. A GitHub repository with your code
2. GitHub Actions enabled on your repository
3. GitHub Pages enabled on your repository

## Setup Steps

### 1. Update Repository Settings

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### 2. Update Homepage URL

In your `package.json`, replace `YOUR_USERNAME` with your actual GitHub username:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/problem-solving-guide"
}
```

### 3. Push Your Code

The GitHub Actions workflow will automatically trigger when you push to the `main` or `master` branch:

```bash
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### 4. Monitor Deployment

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. You should see the "Deploy React App" workflow running
4. Wait for it to complete successfully

### 5. Access Your Deployed App

Once deployment is complete, your app will be available at:
`https://YOUR_USERNAME.github.io/problem-solving-guide`

## Workflow Details

The GitHub Actions workflow (`/.github/workflows/deploy.yml`) will:

1. **Checkout** your code
2. **Setup Node.js 20** environment
3. **Install dependencies** using `npm ci`
4. **Build** your React application
5. **Deploy** to GitHub Pages (only on main/master branch)

## Troubleshooting

### Build Failures

- Check the Actions tab for error details
- Ensure all dependencies are properly installed
- Verify your build script works locally

### Deployment Issues

- Ensure GitHub Pages is enabled in repository settings
- Check that the `gh-pages` branch is created
- Verify the homepage URL in package.json is correct

### Common Issues

- **404 errors**: Check if the homepage URL is correct
- **Build errors**: Ensure Node.js version compatibility
- **Permission errors**: Verify GitHub Actions has proper permissions

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy scripts to package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify repository settings
3. Ensure all files are committed and pushed
