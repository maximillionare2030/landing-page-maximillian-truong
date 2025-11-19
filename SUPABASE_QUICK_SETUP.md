# Supabase Quick Setup Checklist

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your Supabase Credentials (2 min)

1. **Go to Supabase Dashboard** → **Settings** → **API**
   - Copy **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy **anon/public key**: `eyJhbGci...`
   - Copy **service_role key**: `eyJhbGci...` (KEEP SECRET!)

2. **Go to Settings** → **Database** → **Connection string**
   - Click **Connection Pooling** tab
   - Select **Transaction** mode
   - Copy the connection string
   - **IMPORTANT**: Must use port **6543** (not 5432)
   - **IMPORTANT**: Must include `?pgbouncer=true` at the end

### Step 2: Update `.env.local` (1 min)

Create/update `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (your service_role key)

# Database (Connection Pooling - port 6543)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true
```

**Replace:**
- `xxxxxxxxxxxxx` → your project reference
- `[PASSWORD]` → your database password (URL-encode special chars: `!` → `%21`)

### Step 3: Run Migrations (1 min)

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev
```

### Step 4: Create Storage Bucket (1 min)

1. **Supabase Dashboard** → **Storage** → **New Bucket**
2. **Name**: `submissions`
3. **Public bucket**: ✅ CHECK THIS
4. Click **Create bucket**

### Step 5: Add Storage Policies (1 min)

1. **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Run this SQL:

```sql
-- Allow public uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'submissions');

-- Allow public reads
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'submissions');
```

3. Click **Run**

### Step 6: Test Everything (1 min)

```bash
npx tsx test-database-and-storage.ts
```

Should see: ✅ All tests passed!

---

## ✅ Verification Checklist

- [ ] `.env.local` has correct `DATABASE_URL` (port 6543, `?pgbouncer=true`)
- [ ] `.env.local` has all Supabase keys
- [ ] Prisma migrations ran successfully
- [ ] Tables exist: `submission`, `submission_asset`
- [ ] `submissions` bucket exists and is **Public**
- [ ] Storage policies are active
- [ ] Database connection test passes
- [ ] Storage test passes

---

## 🐛 Common Issues

### Database Connection Fails
- ❌ Using port 5432 → ✅ Use port 6543
- ❌ Missing `?pgbouncer=true` → ✅ Add it
- ❌ Password not URL-encoded → ✅ Encode special chars (`!` → `%21`)

### Storage Upload Fails
- ❌ Bucket not public → ✅ Set bucket to Public
- ❌ No INSERT policy → ✅ Add INSERT policy
- ❌ Policy bucket name mismatch → ✅ Check bucket name is `'submissions'`

### Storage Read Fails
- ❌ No SELECT policy → ✅ Add SELECT policy
- ❌ Policy bucket name mismatch → ✅ Check bucket name is `'submissions'`

---

## 📋 Full Guide

See `SUPABASE_COMPLETE_SETUP.md` for detailed instructions.

