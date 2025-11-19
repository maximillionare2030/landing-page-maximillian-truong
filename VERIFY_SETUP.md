# Verify Your Database and Storage Setup

## ⚠️ Current Issue

Your `.env.local` file is **still using port 5432** (direct connection). This won't work with Supabase in a serverless environment.

## ✅ Required Fix

**You MUST update your `.env.local` file before tests can pass.**

### Current (WRONG):
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### Correct (FIXED):
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD-URL-ENCODED]@db.xxxxxxxxxxxxx.supabase.co:6543/postgres?pgbouncer=true
```

**Note:** Replace placeholders:
- `xxxxxxxxxxxxx` → Your Supabase project reference
- `[YOUR-PASSWORD]` → Your actual database password
- `[YOUR-PASSWORD-URL-ENCODED]` → Your password with special characters URL-encoded (e.g., `!` → `%21`)

## 🧪 Testing Steps

### Step 1: Update Your `.env.local` File

1. Open `.env.local` in your editor
2. Find the `DATABASE_URL` line
3. Change port: `5432` → `6543`
4. Change password: URL-encode special characters (e.g., `!` → `%21`, `@` → `%40`)
5. Add: `?pgbouncer=true` at the end
6. Save the file

### Step 2: Run Comprehensive Test

After updating, run:
```bash
npx tsx test-database-and-storage.ts
```

This will test:
- ✅ Database connection
- ✅ Database queries
- ✅ Database inserts
- ✅ Supabase Storage uploads
- ✅ Supabase Storage reads

### Step 3: Verify Storage Policies

Your storage policies look good:
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

**Make sure:**
1. ✅ The "submissions" bucket exists in Supabase
2. ✅ The bucket is set to **Public**
3. ✅ The policies are active in Supabase dashboard

## 📋 Complete Test Checklist

After updating `.env.local`, the test script will verify:

### Database Tests
- [ ] ✅ Database connection (port 6543 with pgbouncer)
- [ ] ✅ Database query (SELECT)
- [ ] ✅ Tables exist (submission, submission_asset)
- [ ] ✅ Database insert (CREATE)
- [ ] ✅ Database delete (DELETE)

### Storage Tests
- [ ] ✅ Bucket exists ("submissions")
- [ ] ✅ Bucket is public
- [ ] ✅ File upload works (INSERT policy)
- [ ] ✅ File read works (SELECT policy)
- [ ] ✅ Public URL generation works
- [ ] ✅ File deletion works

## 🚀 After Tests Pass

Once all tests pass:
1. ✅ Your database is configured correctly
2. ✅ Your storage is configured correctly
3. ✅ Your policies are working
4. ✅ You can save submissions with images

## 🐛 Troubleshooting

### Issue: Database connection fails
**Solution:**
- Update `DATABASE_URL` to use port 6543
- Add `?pgbouncer=true` to the URL
- URL-encode special characters in password

### Issue: Storage upload fails
**Solution:**
- Verify the "submissions" bucket exists
- Check the bucket is set to Public
- Verify the INSERT policy is active
- Check the policy matches the bucket name exactly

### Issue: Storage read fails
**Solution:**
- Verify the SELECT policy is active
- Check the policy matches the bucket name exactly
- Verify the file was uploaded successfully

## 📞 Need Help?

If tests fail:
1. Check the error message in the test output
2. Verify your `.env.local` file has the correct values
3. Check your Supabase dashboard for bucket and policy settings
4. Restart your dev server after updating `.env.local`

