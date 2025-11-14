# Supabase Database Setup Guide

This guide will help you set up **Supabase** (cloud PostgreSQL + Storage) for storing landing page submissions and images.

## Prerequisites

- Supabase account (free at [supabase.com](https://supabase.com))
- Node.js 18+ and pnpm installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `landing-page-foundry` (or your choice)
   - **Database Password**: **SAVE THIS PASSWORD!** You'll need it for the connection string
   - **Region**: Choose the region closest to you
4. Wait for project to be created (~2 minutes)

## Step 2: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following credentials:
   - **Project URL**: `https://xxxxx.supabase.co` (starts with `https://`)
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (starts with `eyJ`)
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (starts with `eyJ`) - **Keep this secret!**

3. Go to **Settings** → **Database** → **Connection string** → **URI**
4. Copy the **Connection string** (looks like `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
5. Replace `[YOUR-PASSWORD]` with your actual database password

## Step 3: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Configure the bucket:
   - **Name**: `submissions`
   - **Public bucket**: **Enable** ✅ (for public image access)
   - **File size limit**: Leave default or set your limit
4. Click **"Create bucket"**

5. **Set up bucket policies** (for public access):
   - Go to **Storage** → **Policies** tab (click on `submissions` bucket)
   - Click **"New Policy"** → **"For full customization"**
   - Add this SQL policy for **INSERT** (uploads):
     ```sql
     CREATE POLICY "Allow public uploads"
     ON storage.objects FOR INSERT
     WITH CHECK (bucket_id = 'submissions');
     ```
   - Add this SQL policy for **SELECT** (reads):
     ```sql
     CREATE POLICY "Allow public reads"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'submissions');
     ```

   **Or use the simple UI**:
   - Click **"New Policy"** → Choose template
   - **Policy name**: "Public Access"
   - **Allowed operation**: SELECT and INSERT
   - **Target roles**: `public`
   - Save the policy

## Step 4: Install Supabase Client

```bash
pnpm add @supabase/supabase-js
```

## Step 5: Configure Environment Variables

1. **Open `.env.local`** in your project root (create it if it doesn't exist)

2. **Add all Supabase credentials**:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Supabase PostgreSQL Connection String
   DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
   ```

   **Important Security Notes**:
   - `NEXT_PUBLIC_*` variables are exposed to the browser (safe for anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` should **NEVER** be exposed to client - only use in API routes
   - `DATABASE_URL` contains your password - keep `.env.local` secure

## Step 6: Generate Prisma Client

```bash
pnpm exec prisma generate
```

## Step 7: Run Database Migrations

This will create the `submissions` and `submission_assets` tables in Supabase:

```bash
pnpm exec prisma migrate dev --name init
```

You should see:
```
✅ Migration applied successfully
```

**Note**: For Supabase, you may also want to run:
```bash
pnpm exec prisma migrate deploy
```
This ensures migrations are applied to your production Supabase database.

## Step 8: Verify Setup

1. **Start your development server**:
   ```bash
   pnpm dev
   ```

2. **Test the system**:
   - Go to `/submit` and fill out the form
   - Click **"Save to Database"** on the review step
   - You should see: "Saved Successfully" with a submission ID

3. **Check in Supabase dashboard**:
   - Go to **Table Editor** → `submissions` table (should see your submission)
   - Go to **Storage** → `submissions` bucket (should see uploaded images)

---

## Local PostgreSQL Setup (Alternative)

If you prefer to use local PostgreSQL instead of Supabase, see the "Local PostgreSQL Setup" section below.

## Troubleshooting

### "Missing required environment variable: DATABASE_URL"

Make sure `.env.local` exists in the project root and contains `DATABASE_URL`.

### "Connection refused" or "password authentication failed"

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   # Check Services (services.msc) for "postgresql" service

   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql
   ```

2. Check your connection string format:
   - Use `postgresql://` not `postgres://`
   - Escape special characters in password with URL encoding
   - Example: If password is `my@pass`, use `my%40pass`

### "Database does not exist"

Make sure you created the database:
```sql
CREATE DATABASE landing_page_db;
```

### Migration errors

If migrations fail, you can reset the database:

```bash
# Reset database (WARNING: This will delete all data)
pnpm exec prisma migrate reset
```

Then run migrations again:
```bash
pnpm exec prisma migrate dev --name init
```

1. **Install PostgreSQL locally** (see original instructions below)

2. **Create local database**:
   ```sql
   CREATE DATABASE landing_page_db;
   ```

3. **Use local connection string in `.env.local`**:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/landing_page_db"
   ```

4. **For images**, you can still use Supabase Storage or keep them local in `public/uploads/`

---

## Local PostgreSQL Installation (Optional)

If you want to use local PostgreSQL instead of Supabase:

### Windows PostgreSQL Installation

1. Download PostgreSQL from [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL should start automatically after installation

### macOS PostgreSQL Installation

```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian) PostgreSQL Installation

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Local Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE landing_page_db;

# Exit
\q
```

### Benefits of Supabase Storage

- **Cloud-based**: Files stored in the cloud, accessible from anywhere
- **CDN**: Fast global content delivery
- **Scalable**: Handles large files and high traffic
- **Free tier**: 1GB storage included
- **Public URLs**: Direct access to images without API calls
- **Integrated**: Works seamlessly with Supabase PostgreSQL

### File Organization

Files are organized by submission ID:
```
submissions/
  └── {submission-id}/
      ├── about-1234567890.jpg
      └── project-0-1234567890.png
```

This makes it easy to:
- Delete all files for a submission
- Manage storage quotas
- Track file usage per submission

### Troubleshooting

**"Missing NEXT_PUBLIC_SUPABASE_URL"**
- Make sure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` set
- Restart your dev server after adding environment variables

**"Bucket not found"**
- Make sure you created the `submissions` bucket in Supabase dashboard
- Check the bucket name matches exactly

**"new row violates row-level security policy"**
- Make sure you set up bucket policies correctly
- Or use `supabaseAdmin` (service role) which bypasses RLS

**Upload fails**
- Check file size limits (Supabase free tier: 50MB per file)
- Verify bucket is public if you need public access
- Check browser console for CORS errors

