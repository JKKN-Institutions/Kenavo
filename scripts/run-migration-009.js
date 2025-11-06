/**
 * Run Migration 009: Update profiles UNIQUE Constraint
 *
 * This script updates the UNIQUE constraint from 'name' only to 'name + year_graduated'
 * Run with: node scripts/run-migration-009.js
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function runMigration() {
  console.log('🚀 Running Migration 009: Update profiles UNIQUE Constraint\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.log('\nPlease ensure these environment variables are set:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Read migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '009_update_profiles_unique_constraint.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Extract just the DDL statements (skip comments and verification queries)
  const ddlStatements = `
-- Drop old UNIQUE constraint on name
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_name_key;

-- Add new composite UNIQUE constraint on (name, year_graduated)
ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique UNIQUE (name, year_graduated);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_name_year ON profiles(name, year_graduated);
  `.trim();

  console.log('📝 Migration SQL:');
  console.log('─'.repeat(70));
  console.log(ddlStatements);
  console.log('─'.repeat(70));
  console.log('\n⚠️  IMPORTANT: This will change the UNIQUE constraint on profiles table');
  console.log('   Old: UNIQUE (name)');
  console.log('   New: UNIQUE (name, year_graduated)\n');

  try {
    console.log('📡 Connecting to Supabase...');
    console.log(`URL: ${supabaseUrl}\n`);

    // For Supabase, we need to run this through the SQL Editor or use the REST API
    // Let's provide instructions since direct SQL execution requires special permissions

    console.log('⚠️  MANUAL EXECUTION REQUIRED\n');
    console.log('Please run this migration manually in Supabase SQL Editor:\n');
    console.log('1. Go to: https://app.supabase.com/project/_/sql/new');
    console.log('2. Copy and paste the migration SQL above');
    console.log('3. Click "Run" to execute the migration\n');
    console.log('After running the migration, the CSV upload will work with UPSERT logic!\n');

    // Alternatively, write to a temp file for easy copy-paste
    const tempFile = path.join(__dirname, '..', 'MIGRATION_009_TO_RUN.sql');
    fs.writeFileSync(tempFile, ddlStatements);
    console.log(`📄 Migration SQL also saved to: ${tempFile}`);
    console.log('   You can copy from this file and paste into Supabase SQL Editor.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

runMigration();
