# Fix Database Connection Error

## Error: `P1001: Can't reach database server`

This error means Prisma can't connect to your Supabase PostgreSQL database.

## Quick Fixes

### 1. **Use Connection Pooling Port (Recommended)**

Supabase recommends using **connection pooling** (port **6543**) instead of direct connection (port 5432).

**Update your `.env.local`:**

```env
# Change from port 5432 (direct) to 6543 (pooling)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true
```

**Important**: Add `?pgbouncer=true` parameter when using port 6543.

### 2. **URL-Encode Password Special Characters**

If your password contains special characters, you need to URL-encode them:

| Character | Encoding |
|-----------|----------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| `:` | `%3A` |
| ` ` (space) | `%20` |

**Example:**
- Password: `my@pass#123`
- Encoded: `my%40pass%23123`
- Connection string: `postgresql://postgres:my%40pass%23123@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true`

### 3. **Wrap Password in Quotes (Alternative)**

If your password has special characters, you can also wrap it in quotes:

```env
DATABASE_URL="postgresql://postgres:my@pass#123@db.ohavdvgesgxdndvocyio.supabase.co:6543/postgres?pgbouncer=true"
```

### 4. **Verify Supabase Project Status**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Check if your project is **paused** or **inactive**
3. If paused, click **"Restore"** or **"Resume"** to activate it

### 5. **Get Fresh Connection String from Supabase**

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Settings** → **Database**
3. Scroll to **"Connection string"** section
4. Select **"URI"** tab
5. Choose **"Connection pooling"** (port 6543) **OR** **"Direct connection"** (port 5432)
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password
8. Update `DATABASE_URL` in `.env.local`

## Test Connection

Run the diagnostic script:

```bash
node check-db-connection.js
```

Or test with Prisma:

```bash
pnpm exec prisma db pull
```

## Common Issues Checklist

- [ ] Using connection pooling port (6543) with `?pgbouncer=true`
- [ ] Password is URL-encoded if it contains special characters
- [ ] Password is correct (check in Supabase dashboard)
- [ ] Supabase project is active (not paused)
- [ ] DATABASE_URL is in `.env.local` (not just `.env`)
- [ ] No extra spaces or quotes around DATABASE_URL
- [ ] Restarted dev server after updating `.env.local`

## Still Not Working?

1. **Check Prisma can read the env file:**
   ```bash
   node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.DATABASE_URL ? 'Found' : 'Not found')"
   ```

2. **Test direct connection:**
   - Try connecting with a PostgreSQL client (pgAdmin, DBeaver, etc.)
   - This will help isolate if it's a network/credentials issue or a Prisma issue

3. **Check firewall/network:**
   - Make sure your firewall allows outbound connections on ports 5432/6543
   - Try from a different network

4. **Supabase Status:**
   - Check [status.supabase.com](https://status.supabase.com) for any outages

