# Update Your .env.local File

## ⚠️ Important: Password Contains Special Characters

Your password `Millionaire2030!!` contains `!` which needs URL encoding.

## 📝 Complete `.env.local` Configuration

Open your `.env.local` file and update it with these values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ohavdvgesgxdndvocyio.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYXZkdmdlc2d4ZG5kdm9jeWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjQyNTUsImV4cCI6MjA3ODY0MDI1NX0.W0QM5MuDdJG0zIVWVZ7EKA57r41-p-CYYDgSWhKePkU

# Supabase Service Role Key (SECRET - never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYXZkdmdlc2d4ZG5kdm9jeWlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA2NDI1NSwiZXhwIjoyMDc4NjQwMjU1fQ.0gRlz3sNEi1mdhDKUob1uuenrNj-fJsL5dFmezwju6Q

# Database Connection (Connection Pooling - port 6543 with pgbouncer)
# Password: Millionaire2030!!
# Encoded: Millionaire2030%21%21
DATABASE_URL=postgresql://postgres:Millionaire2030%21%21@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true
```

## 🔑 Key Changes Made:

1. **NEXT_PUBLIC_SUPABASE_URL**: `https://ohavdvgesgxdndvocyio.supabase.co` ✅
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your anon key ✅
3. **SUPABASE_SERVICE_ROLE_KEY**: Your service role key ✅
4. **DATABASE_URL**:
   - Changed port: `5432` → `6543` ✅
   - Added: `?pgbouncer=true` ✅
   - Encoded password: `!` → `%21` (so `!!` → `%21%21`) ✅

## 📋 Step-by-Step:

1. **Open `.env.local`** in your project root
2. **Copy and paste** the configuration above
3. **Save the file**
4. **Restart your dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   pnpm dev
   ```
5. **Test connection**:
   ```bash
   npx tsx test-db-connection.ts
   ```
   Should see: `✅ Successfully connected to database!`

## ✅ After Update:

Try saving to database again in your app. It should now work!

---

## 🔄 Alternative: If URL Encoding Doesn't Work

If the encoded password doesn't work, try wrapping the entire URL in quotes:

```env
DATABASE_URL="postgresql://postgres:Millionaire2030!!@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true"
```

Make sure there are no spaces around the `=` sign.

