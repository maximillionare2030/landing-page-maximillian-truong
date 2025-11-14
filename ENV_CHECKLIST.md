# Environment Variables Checklist

## Required Supabase Credentials

You need **4 values** from your Supabase dashboard. Here's where to find them:

### 📍 Where to Find These in Supabase Dashboard:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `ohavdvgesgxdndvocyio`
3. Go to **Settings** → **API**

### ✅ Checklist - What You Need:

#### 1. **NEXT_PUBLIC_SUPABASE_URL** ✅ (You have this)
   - Location: Settings → API → Project URL
   - Format: `https://ohavdvgesgxdndvocyio.supabase.co`
   - ⚠️ Make sure it starts with `https://` (NOT just the JWT token)

#### 2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** ✅ (You have this - it's the JWT token)
   - Location: Settings → API → anon public key
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ This is the **anon/public** key (safe to expose in browser)

#### 3. **SUPABASE_SERVICE_ROLE_KEY** ❌ (You need this)
   - Location: Settings → API → service_role key
   - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different from anon key)
   - ⚠️ **KEEP THIS SECRET!** Never expose to client - only for server-side use
   - ⚠️ This is a **different** key from the anon key

#### 4. **DATABASE_URL** ⚠️ (Needs to be fixed)
   - Location: Settings → Database → Connection string → URI
   - Choose: **Connection pooling** (NOT direct connection)
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true`
   - ⚠️ **Important**:
     - Port must be **6543** (not 5432)
     - Must include `?pgbouncer=true` at the end
     - Replace `[YOUR-PASSWORD]` with your actual database password

---

## 📝 Complete `.env.local` Template

Open your `.env.local` file and make sure it has ALL of these:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ohavdvgesgxdndvocyio.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYXZkdmdlc2d4ZG5kdm9jeWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjQyNTUsImV4cCI6MjA3ODY0MDI1NX0.W0QM5MuDdJG0zIVWVZ7EKA57r41-p-CYYDgSWhKePkU

# ⚠️ GET THIS FROM SUPABASE DASHBOARD:
# Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ⚠️ GET THIS FROM SUPABASE DASHBOARD:
# Settings → Database → Connection string → URI → Connection pooling
# Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true
```

---

## 🔍 How to Get Missing Values:

### Get SUPABASE_SERVICE_ROLE_KEY:

1. Go to Supabase Dashboard → Your Project
2. Click **Settings** (gear icon) → **API**
3. Scroll to **Project API keys**
4. Find **`service_role`** key (it's the secret one)
5. Click **Copy** or **Reveal** to see it
6. ⚠️ **Warning**: This key has full access - keep it secret!

### Get DATABASE_URL:

1. Go to Supabase Dashboard → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection string** section
4. Click on **URI** tab
5. **Important**: Select **Connection pooling** (NOT "Direct connection")
6. Copy the connection string - it should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true
   ```
7. Replace `[YOUR-PASSWORD]` with your actual database password
8. ⚠️ Make sure:
   - Port is **6543** (not 5432)
   - Has `?pgbouncer=true` at the end

### Get Database Password:

- If you forgot it, you can reset it in Supabase:
  - Settings → Database → Database password → **Reset database password**
  - ⚠️ Save the new password immediately!

---

## ✅ After Updating `.env.local`:

1. **Save the file**
2. **Restart your dev server** (stop with Ctrl+C, then `pnpm dev`)
3. **Test the connection**:
   ```bash
   npx tsx test-db-connection.ts
   ```
   Should see: `✅ Successfully connected to database!`
4. **Try saving again** in your app

---

## 🚨 Quick Checklist:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Project URL (https://...)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - anon/public key ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - service_role key (SECRET) ❌
- [ ] `DATABASE_URL` - PostgreSQL connection with port 6543 and ?pgbouncer=true ⚠️

