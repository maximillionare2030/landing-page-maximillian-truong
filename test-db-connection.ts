// Database Connection Test Script
// Run with: npx tsx test-db-connection.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  console.log('🔍 Testing database connection...\n');

  // Check if DATABASE_URL is set
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('   Please set DATABASE_URL in your .env.local file');
    process.exit(1);
  }

  // Mask password for display
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log('📋 DATABASE_URL:', maskedUrl);

  // Check URL format
  const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
  const match = dbUrl.match(urlPattern);

  if (!match) {
    console.error('❌ Invalid DATABASE_URL format');
    console.error('   Expected: postgresql://username:password@host:port/database');
    process.exit(1);
  }

  const [, username, password, host, port, database] = match;
  console.log('   Username:', username);
  console.log('   Password:', password ? '****' : 'MISSING!');
  console.log('   Host:', host);
  console.log('   Port:', port);
  console.log('   Database:', database);

  // Check if using connection pooling
  if (port === '5432') {
    console.log('\n⚠️  Using direct connection port (5432)');
    console.log('   Supabase recommends using connection pooling (port 6543)');
    console.log('   Update your DATABASE_URL to use port 6543 with ?pgbouncer=true\n');
  } else if (port === '6543') {
    console.log('\n✅ Using connection pooling port (6543)');
    if (!dbUrl.includes('pgbouncer=true')) {
      console.log('⚠️  Consider adding ?pgbouncer=true to your DATABASE_URL');
    }
  }

  // Try to connect
  console.log('\n🔌 Attempting to connect to database...');
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to database!\n');

    // Test a simple query
    console.log('🧪 Testing query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query successful:', result);

    // Check if tables exist
    console.log('\n📊 Checking for tables...');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

    if (tables.length > 0) {
      console.log('✅ Found tables:', tables.map(t => t.tablename).join(', '));
    } else {
      console.log('⚠️  No tables found. You may need to run migrations:');
      console.log('   pnpm exec prisma migrate dev');
    }

    console.log('\n✅ Database connection is working correctly!');
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error) {
      // Check for common error types
      if (error.message.includes("P1001") || error.message.includes("Can't reach database")) {
        console.error('\n💡 Troubleshooting steps:');
        console.error('   1. Check if your Supabase project is active (not paused)');
        console.error('   2. Verify the database password is correct');
        console.error('   3. Try using connection pooling (port 6543 with ?pgbouncer=true)');
        console.error('   4. Check your firewall/network allows connections to Supabase');
        console.error('   5. URL-encode special characters in your password');
      } else if (error.message.includes("P1000") || error.message.includes("authentication")) {
        console.error('\n💡 Authentication failed:');
        console.error('   1. Verify your database password is correct');
        console.error('   2. Check if you need to URL-encode special characters');
        console.error('   3. Ensure you\'re using the correct connection string from Supabase');
      } else if (error.message.includes("does not exist")) {
        console.error('\n💡 Database does not exist:');
        console.error('   1. Verify the database name in your connection string');
        console.error('   2. Check your Supabase project settings');
      }
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n👋 Disconnected from database');
  }
}

testConnection().catch(console.error);

