# 🚀 Deployment Guide

This guide will walk you through deploying your landing page to Vercel with Vercel Analytics enabled.

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] Vercel Analytics installed and added to layout (✅ Already done!)
- [ ] All environment variables configured
- [ ] GitHub repository set up
- [ ] Vercel account created
- [ ] Build passes locally (`pnpm build`)

---

## 📋 Step 1: Prepare Your Code

### 1.1 Test the Build Locally

First, make sure your project builds successfully:

```bash
pnpm build
```

If there are any errors, fix them before proceeding.

### 1.2 Commit Your Changes

Make sure all your changes are committed to git:

```bash
git add .
git commit -m "Add Vercel Analytics and prepare for deployment"
git push
```

---

## 📦 Step 2: Set Up Vercel Account

### 2.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account (recommended for easy integration)
3. Complete the onboarding process

### 2.2 Install Vercel CLI (Optional but Recommended)

```bash
npm i -g vercel
```

Or using pnpm:
```bash
pnpm add -g vercel
```

---

## 🔗 Step 3: Connect Your Repository

### Option A: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..."** → **"Project"**

2. **Import Your Repository**
   - Select your GitHub account
   - Find and select your `landing-page-auto` repository
   - Click **"Import"**

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `pnpm build` (or leave default)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `pnpm install`

4. **Environment Variables** (IMPORTANT!)
   - Click **"Environment Variables"** section
   - Add all required variables (see Step 4 below)
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click **"Deploy"**
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

3. **Set Environment Variables**
   ```bash
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   # ... add all other variables
   ```

---

## 🔐 Step 4: Configure Environment Variables

### 4.1 Required Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

#### NextAuth Configuration
```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<your-generated-secret>
```

**Generate NEXTAUTH_SECRET** (PowerShell):
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

#### GitHub OAuth (for Admin Dashboard)
```
GITHUB_ID=<your-github-oauth-app-client-id>
GITHUB_SECRET=<your-github-oauth-app-client-secret>
GITHUB_TOKEN=<your-github-personal-access-token>
ADMIN_GITHUB_LOGINS=<comma-separated-github-usernames>
OWNER_GITHUB_USERNAME=<your-github-username>
```

**How to get GitHub OAuth credentials:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set **Authorization callback URL** to: `https://your-project.vercel.app/api/auth/callback/github`
4. Copy Client ID and Client Secret

**How to get GitHub Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token

#### Supabase Configuration
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Important Notes:**
- Use port **6543** (connection pooling) for DATABASE_URL
- Include `?pgbouncer=true` at the end of DATABASE_URL
- URL-encode special characters in password (`!` → `%21`, `@` → `%40`, etc.)

### 4.2 Set Variables for All Environments

In Vercel, make sure to set each variable for:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

Click the dropdown next to each variable to select environments.

### 4.3 Update NEXTAUTH_URL

**Important:** After your first deployment, update `NEXTAUTH_URL` to your actual Vercel URL:
```
NEXTAUTH_URL=https://your-project.vercel.app
```

Also update your GitHub OAuth App callback URL to match.

---

## 🎯 Step 5: Deploy and Verify

### 5.1 Trigger Deployment

- If using Dashboard: Click **"Deploy"** or push to your main branch
- If using CLI: Run `vercel --prod`

### 5.2 Monitor Build

Watch the build logs in Vercel Dashboard. Common issues:
- Missing environment variables → Add them in Settings
- Build errors → Check logs and fix code
- Database connection issues → Verify DATABASE_URL format

### 5.3 Verify Analytics

1. **Visit your deployed site**: `https://your-project.vercel.app`
2. **Navigate between pages** to generate page views
3. **Wait 30 seconds** for data to appear
4. **Check Vercel Analytics**:
   - Go to Vercel Dashboard → Your Project → **Analytics** tab
   - You should see visitor and page view data

**Note:** If you don't see data:
- Check browser console for errors
- Disable content blockers (uBlock Origin, Privacy Badger, etc.)
- Navigate between multiple pages
- Wait a few minutes for data to sync

---

## 🔄 Step 6: Set Up Automatic Deployments

### 6.1 Connect GitHub Repository

If you haven't already:
1. Vercel Dashboard → Your Project → Settings → Git
2. Connect your GitHub repository
3. Enable automatic deployments

### 6.2 Configure Branch Deployments

- **Production**: Deploys from `main` or `master` branch
- **Preview**: Deploys from all other branches and pull requests

### 6.3 Custom Domain (Optional)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

---

## 🛠️ Step 7: Post-Deployment Tasks

### 7.1 Update GitHub OAuth Callback URL

After deployment, update your GitHub OAuth App:
1. GitHub → Settings → Developer settings → OAuth Apps
2. Edit your OAuth App
3. Update **Authorization callback URL** to:
   ```
   https://your-project.vercel.app/api/auth/callback/github
   ```

### 7.2 Test Admin Dashboard

1. Visit `https://your-project.vercel.app/dashboard`
2. Sign in with GitHub
3. Verify you can access the dashboard

### 7.3 Test Form Submission

1. Visit `https://your-project.vercel.app/submit`
2. Fill out the form
3. Verify submission works correctly

---

## 📊 Step 8: Monitor Your Deployment

### 8.1 Vercel Dashboard

Monitor:
- **Deployments**: View all deployments and their status
- **Analytics**: Track visitors and page views
- **Logs**: View server logs and errors
- **Functions**: Monitor API route performance

### 8.2 Common Monitoring Tasks

- Check build logs for errors
- Monitor Analytics for traffic
- Review function logs for API issues
- Check deployment status after each push

---

## 🐛 Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Add all required variables in Vercel Dashboard → Settings → Environment Variables

**Error: Database connection failed**
- Solution: Verify DATABASE_URL format (port 6543, `?pgbouncer=true`)
- Check password is URL-encoded if it has special characters

**Error: Module not found**
- Solution: Run `pnpm install` locally and commit `pnpm-lock.yaml`

### Analytics Not Working

**No data appearing after 30 seconds**
- Check browser console for errors
- Disable content blockers
- Navigate between multiple pages
- Verify Analytics component is in layout (✅ Already done!)

**Analytics shows 0 visitors**
- Make sure you're visiting the production URL (not preview)
- Wait a few minutes for data to sync
- Check Vercel Analytics is enabled in your plan

### Authentication Issues

**GitHub OAuth not working**
- Verify callback URL matches your Vercel URL
- Check GITHUB_ID and GITHUB_SECRET are correct
- Ensure ADMIN_GITHUB_LOGINS includes your username

**NEXTAUTH_SECRET error**
- Generate a new secret and update in Vercel
- Redeploy after updating environment variables

---

## 🎉 Success!

Your landing page is now deployed with Vercel Analytics!

### Quick Links

- **Your Site**: `https://your-project.vercel.app`
- **Analytics**: Vercel Dashboard → Analytics tab
- **Deployments**: Vercel Dashboard → Deployments tab
- **Settings**: Vercel Dashboard → Settings tab

### Next Steps

- Share your landing page URL
- Monitor analytics to see visitor data
- Set up custom domain (optional)
- Configure additional Vercel features as needed

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Need Help?** Check the main [README.md](./README.md) or [DOCUMENTATION.md](./DOCUMENTATION.md) for more information.

