# Quick Fix: Database Connection

## Problem
Cannot connect to Supabase database at port 5432.

## Solution: Use Connection Pooling (Port 6543)

### Step 1: Get Your Connection String from Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **"Connection string"** section
5. Click on the **"URI"** tab
6. Select **"Connection pooling"** (NOT "Direct connection")
7. Copy the connection string - it should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
   ```

### Step 2: Update Your .env.local File

Open `.env.local` and update your `DATABASE_URL`:

**OLD (not working):**
```env
DATABASE_URL=postgresql://postgres:password@db.ohavdvgesgxdndvocyio.supabase.co:5432/postgres
```

**NEW (should work):**
```env
DATABASE_URL=postgresql://postgres:password@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true
```

**Key changes:**
- Port changed from `5432` → `6543`
- Added `?pgbouncer=true` at the end

### Step 3: Check Your Supabase Project Status

1. Go to your Supabase dashboard
2. Make sure your project shows **"Active"** (not "Paused")
3. If paused, click **"Resume"** or **"Restore"** to activate it

### Step 4: Test the Connection

After updating `.env.local`, restart your dev server:

```bash
# Stop your dev server (Ctrl+C)
# Then restart it
pnpm dev
```

Then test the connection:
```bash
npx tsx test-db-connection.ts
```

You should see: `✅ Successfully connected to database!`

### Step 5: If Password Has Special Characters

If your password contains special characters like `@`, `#`, `%`, etc., you need to URL-encode them:

| Character | Encoding |
|-----------|----------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |

**Example:** If password is `my@pass#123`
- Encoded: `my%40pass%23123`
- Connection string: `postgresql://postgres:my%40pass%23123@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true`

**Or wrap the entire URL in quotes:**
```env
DATABASE_URL="postgresql://postgres:my@pass#123@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
```

---

## Still Not Working?

1. **Verify password**: Double-check your database password in Supabase dashboard (Settings → Database → Database password)
2. **Check project status**: Make sure project is not paused
3. **Try the connection string from Supabase dashboard directly** (copy-paste, don't modify it)
4. **Check firewall**: Make sure your network/firewall allows outbound connections on port 6543
5. **Test from different network**: Try from a different network to rule out firewall issues

