# Complete Supabase Setup Guide

This guide will walk you through setting up Supabase from scratch, including database, storage, and all necessary configurations.

---

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and pnpm installed
- Your project already has Prisma schema configured

---

## Step 1: Create a Supabase Project

### 1.1 Sign In to Supabase
1. Go to https://supabase.com
2. Sign in (or create an account)
3. Click "New Project"

### 1.2 Create Project
1. **Organization**: Select your organization (or create one)
2. **Name**: Enter a project name (e.g., "landing-page-auto")
3. **Database Password**:
   - **IMPORTANT**: Choose a strong password
   - **SAVE THIS PASSWORD** - you'll need it for the connection string
   - Example: `Millionaire2030!!` (but use your own)
4. **Region**: Select the region closest to you
5. **Pricing Plan**: Select "Free" (or your preferred plan)
6. Click "Create new project"

### 1.3 Wait for Project to Initialize
- Wait 2-3 minutes for the project to be created
- You'll see a progress indicator
- Once done, you'll be redirected to the project dashboard

---

## Step 2: Get Your Supabase Credentials

### 2.1 Get Project URL and API Keys
1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...` (long JWT token)
   - **service_role key**: `eyJhbGci...` (long JWT token - **KEEP SECRET!**)

### 2.2 Get Database Connection String
1. Go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. You'll see multiple options:
   - **URI** (direct connection - port 5432) - ❌ DON'T USE THIS
   - **Connection Pooling** (port 6543) - ✅ USE THIS ONE

4. Click on **Connection Pooling** tab
5. Select **Transaction** mode
6. Copy the connection string - it will look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   **OR** it might be:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
   ```

### 2.3 Important Notes About Connection String
- ✅ **MUST use port 6543** (connection pooling)
- ✅ **MUST include `?pgbouncer=true`** at the end
- ⚠️ **If your password has special characters** (like `!`, `@`, `#`, etc.):
  - You need to **URL-encode** them
  - `!` → `%21`
  - `@` → `%40`
  - `#` → `%23`
  - Example: `Millionaire2030!!` → `Millionaire2030%21%21`

---

## Step 3: Set Up Environment Variables

### 3.1 Create `.env.local` File
1. In your project root, create/update `.env.local`
2. Add these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service_role key)

# Database Connection (Connection Pooling - port 6543)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (if using)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3.2 Replace Placeholders
- Replace `xxxxxxxxxxxxx` with your actual project reference
- Replace `[YOUR-PASSWORD]` with your database password (URL-encoded if needed)
- Replace `eyJhbGci...` with your actual API keys

### 3.3 Example `.env.local`
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your anon key - full JWT token)

# Supabase Service Role Key (SECRET - never expose this!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service_role key - full JWT token)

# Database Connection (Connection Pooling - port 6543)
# Replace [YOUR-PASSWORD] with your actual password (URL-encoded if needed)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

**Note:** Replace all placeholders with your actual values:
- `xxxxxxxxxxxxx` → Your Supabase project reference
- `eyJhbGci...` → Your full JWT token keys from Supabase dashboard
- `[YOUR-PASSWORD]` → Your database password (URL-encode special characters like `!` → `%21`)

---

## Step 4: Run Database Migrations

### 4.1 Generate Prisma Client
```bash
pnpm exec prisma generate
```

### 4.2 Run Migrations
```bash
pnpm exec prisma migrate dev
```

This will:
- Create the `submission` table
- Create the `submission_asset` table
- Set up all the necessary columns and relationships

### 4.3 Verify Tables Were Created
1. Go to Supabase Dashboard → **Table Editor**
2. You should see:
   - `submission` table
   - `submission_asset` table

---

## Step 5: Set Up Storage Bucket

### 5.1 Create Storage Bucket
1. Go to Supabase Dashboard → **Storage**
2. Click **New Bucket**
3. Fill in:
   - **Name**: `submissions`
   - **Public bucket**: ✅ **CHECK THIS** (important!)
   - **File size limit**: Leave default or set your limit
   - **Allowed MIME types**: Leave empty (allows all) or specify: `image/jpeg,image/png,image/webp`
4. Click **Create bucket**

### 5.2 Verify Bucket Was Created
1. You should see the `submissions` bucket in the list
2. Make sure it shows as **Public** (not Private)

---

## Step 6: Set Up Storage Policies

### 6.1 Open SQL Editor
1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**

### 6.2 Create INSERT Policy (Allow Uploads)
Copy and paste this SQL:

```sql
-- Allow public uploads to submissions bucket
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'submissions');
```

Click **Run** (or press Ctrl+Enter)

### 6.3 Create SELECT Policy (Allow Reads)
Copy and paste this SQL:

```sql
-- Allow public reads from submissions bucket
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'submissions');
```

Click **Run** (or press Ctrl+Enter)

### 6.4 Verify Policies Were Created
1. Go to Supabase Dashboard → **Storage** → **Policies**
2. Click on the `submissions` bucket
3. You should see:
   - ✅ **Allow public uploads** (INSERT policy)
   - ✅ **Allow public reads** (SELECT policy)

---

## Step 7: Test Database Connection

### 7.1 Run Database Connection Test
```bash
npx tsx test-db-connection.ts
```

### 7.2 Expected Output
You should see:
```
✅ Successfully connected to database!
✅ Query successful
✅ Found tables: submission, submission_asset
```

### 7.3 If It Fails
- Check that your `DATABASE_URL` uses port **6543**
- Check that `?pgbouncer=true` is at the end
- Check that your password is URL-encoded (if it has special characters)
- Verify your Supabase project is **active** (not paused)

---

## Step 8: Test Storage

### 8.1 Run Comprehensive Test
```bash
npx tsx test-database-and-storage.ts
```

### 8.2 Expected Output
You should see:
```
✅ Database Connection: PASS
✅ Database Query: PASS
✅ Database Insert: PASS
✅ Supabase Storage: PASS
✅ All tests passed!
```

### 8.3 If Storage Test Fails
- Verify the `submissions` bucket exists
- Verify the bucket is set to **Public**
- Verify the policies are active
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly

---

## Step 9: Verify Everything Works

### 9.1 Test the Save Functionality
1. Start your dev server:
   ```bash
   pnpm dev
   ```
2. Go to `http://localhost:3000/submit`
3. Fill out the form
4. Upload an image
5. Add alt text for the image
6. Click "Save to Database"

### 9.2 Check Database
1. Go to Supabase Dashboard → **Table Editor** → `submission`
2. You should see your submission with the config data

### 9.3 Check Storage
1. Go to Supabase Dashboard → **Storage** → `submissions`
2. You should see your uploaded images in folders organized by submission ID

---

## 🐛 Troubleshooting

### Issue: Database Connection Fails (P1001)
**Symptoms:**
- Error: `Can't reach database server`
- Error code: `P1001`

**Solutions:**
1. ✅ Verify `DATABASE_URL` uses port **6543** (not 5432)
2. ✅ Verify `?pgbouncer=true` is at the end of the URL
3. ✅ URL-encode special characters in password (`!` → `%21`)
4. ✅ Check your Supabase project is **active** (not paused)
5. ✅ Verify your database password is correct

### Issue: Storage Upload Fails
**Symptoms:**
- Error: `new row violates row-level security policy`
- Error: `permission denied`

**Solutions:**
1. ✅ Verify the `submissions` bucket exists
2. ✅ Verify the bucket is set to **Public**
3. ✅ Verify the INSERT policy is active
4. ✅ Check the policy matches the bucket name exactly (`'submissions'`)
5. ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly

### Issue: Storage Read Fails
**Symptoms:**
- Error: `permission denied`
- Error: `new row violates row-level security policy`

**Solutions:**
1. ✅ Verify the SELECT policy is active
2. ✅ Verify the policy matches the bucket name exactly (`'submissions'`)
3. ✅ Verify the bucket is set to **Public**

### Issue: Tables Don't Exist
**Symptoms:**
- Error: `relation "submission" does not exist`

**Solutions:**
1. ✅ Run migrations: `pnpm exec prisma migrate dev`
2. ✅ Check Supabase Dashboard → **Table Editor** for tables
3. ✅ Verify migrations ran successfully

### Issue: Environment Variables Not Loading
**Symptoms:**
- Error: `Missing required environment variable`
- Variables are undefined

**Solutions:**
1. ✅ Verify `.env.local` file exists in project root
2. ✅ Verify variable names are correct (no typos)
3. ✅ Restart your dev server after updating `.env.local`
4. ✅ Check that `.env.local` is not in `.gitignore` (it should be)

---

## ✅ Checklist

Use this checklist to verify your setup:

### Database
- [ ] Supabase project created
- [ ] Database password saved
- [ ] `DATABASE_URL` uses port 6543
- [ ] `DATABASE_URL` includes `?pgbouncer=true`
- [ ] Password is URL-encoded (if needed)
- [ ] Prisma migrations ran successfully
- [ ] Tables exist: `submission`, `submission_asset`
- [ ] Database connection test passes

### Storage
- [ ] `submissions` bucket created
- [ ] Bucket is set to **Public**
- [ ] INSERT policy created and active
- [ ] SELECT policy created and active
- [ ] Storage test passes

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `DATABASE_URL` set correctly
- [ ] All variables in `.env.local`

### Testing
- [ ] Database connection test passes
- [ ] Database query test passes
- [ ] Database insert test passes
- [ ] Storage upload test passes
- [ ] Storage read test passes
- [ ] Save functionality works in app

---

## 📞 Need Help?

If you're still having issues:
1. Run `npx tsx test-database-and-storage.ts` and check the error messages
2. Verify your Supabase project is **active** (not paused)
3. Check the Supabase Dashboard for any error messages
4. Verify all environment variables are set correctly
5. Restart your dev server after making changes

---

## 🎉 Success!

Once all tests pass:
- ✅ Your database is configured correctly
- ✅ Your storage is configured correctly
- ✅ Your policies are working
- ✅ You can save submissions with images
- ✅ Everything is ready to use!

