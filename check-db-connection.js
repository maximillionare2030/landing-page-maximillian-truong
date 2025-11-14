// Quick diagnostic script to check DATABASE_URL format
// Run with: node check-db-connection.js

require('dotenv').config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

console.log('📋 Checking DATABASE_URL format...\n');

// Check format
const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
const match = dbUrl.match(urlPattern);

if (!match) {
  console.error('❌ Invalid DATABASE_URL format');
  console.error('Expected format: postgresql://postgres:password@host:port/database');
  console.error(`Your URL: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);
  process.exit(1);
}

const [, username, password, host, port, database] = match;

console.log('✅ Format is valid');
console.log(`   Username: ${username}`);
console.log(`   Password: ${password ? '****' : 'MISSING!'}`);
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Database: ${database}\n`);

// Check for common issues
const issues = [];

if (!password || password === '[YOUR-PASSWORD]') {
  issues.push('❌ Password is missing or placeholder');
}

if (port === '5432') {
  console.log('⚠️  Using direct connection port (5432)');
  console.log('   Try using connection pooling port (6543) instead');
  console.log('   Update your DATABASE_URL to use port 6543\n');
}

// Check for special characters that might need encoding
if (password && /[^a-zA-Z0-9]/.test(password)) {
  console.log('⚠️  Password contains special characters');
  console.log('   If connection fails, URL-encode special characters:');
  console.log('   @ → %40, # → %23, % → %25, & → %26, + → %2B, = → %3D, ? → %3F');
  console.log('   Or wrap the password in quotes in your .env.local file\n');
}

if (issues.length > 0) {
  issues.forEach(issue => console.log(issue));
  process.exit(1);
}

console.log('✅ All checks passed!');
console.log('\n💡 If you still have connection issues:');
console.log('   1. Check your Supabase project is active (not paused)');
console.log('   2. Verify the database password in Supabase dashboard');
console.log('   3. Try connection pooling (port 6543) instead of direct (5432)');
console.log('   4. Check your firewall/network allows connections to Supabase');

