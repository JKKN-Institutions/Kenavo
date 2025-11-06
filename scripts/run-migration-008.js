/**
 * Run Migration 008: Add Auto-Increment to profiles.id
 *
 * This script applies the migration directly to the Supabase database
 * Run with: node scripts/run-migration-008.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function runMigration() {
  console.log('🚀 Running Migration 008: Add Auto-Increment to profiles.id\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.log('\nPlease ensure these environment variables are set:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Migration SQL
  const migrationSQL = `
-- Step 1: Create sequence
CREATE SEQUENCE IF NOT EXISTS profiles_id_seq;

-- Step 2: Set sequence to start after existing max ID
SELECT setval('profiles_id_seq', (SELECT COALESCE(MAX(id), 0) FROM profiles), true);

-- Step 3: Set the sequence as default for id column
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT nextval('profiles_id_seq');

-- Step 4: Grant permissions
GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO anon;

-- Add comment
COMMENT ON SEQUENCE profiles_id_seq IS 'Auto-increment sequence for profiles.id';
  `.trim();

  try {
    console.log('📡 Connecting to Supabase...');
    console.log(`URL: ${supabaseUrl}\n`);

    // Execute migration using Supabase's query endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: migrationSQL })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log('✅ Migration executed successfully!\n');
    console.log('📝 Changes applied:');
    console.log('   ✓ Created sequence: profiles_id_seq');
    console.log('   ✓ Set sequence to start after existing profile IDs');
    console.log('   ✓ Configured profiles.id column to auto-increment');
    console.log('   ✓ Granted necessary permissions\n');
    console.log('🎉 You can now upload your CSV file through the admin panel!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📋 ALTERNATIVE: Run the migration manually in Supabase SQL Editor');
    console.log('─'.repeat(70));
    console.log('\n1. Go to: https://app.supabase.com/project/_/sql/new');
    console.log('\n2. Copy and paste this SQL:\n');
    console.log('─'.repeat(70));
    console.log(migrationSQL);
    console.log('─'.repeat(70));
    console.log('\n3. Click "Run" to execute the migration\n');
    process.exit(1);
  }
}

runMigration();
