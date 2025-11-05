#!/usr/bin/env node
/**
 * Apply Supabase Security Migrations
 *
 * This script applies all pending security migrations to your Supabase database.
 * It uses your environment variables to connect.
 *
 * Usage:
 *   node apply-migrations.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ ERROR: Missing required environment variables!\n');
  console.error('Required:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY\n');
  console.error('Please check your .env.local file.\n');
  process.exit(1);
}

console.log('🚀 Supabase Migration Runner');
console.log('============================\n');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Using service role key: ${supabaseServiceKey.substring(0, 20)}...\n`);

// Migration files to apply
const migrations = [
  {
    name: '005_add_profiles_rls.sql',
    description: 'Add Row Level Security to profiles table'
  },
  {
    name: '006_strengthen_qa_rls.sql',
    description: 'Strengthen Q&A table RLS policies'
  },
  {
    name: '007_create_storage_policies.sql',
    description: 'Create storage bucket policies'
  }
];

// Read migration file
function readMigration(filename) {
  const filePath = path.join(__dirname, 'supabase', 'migrations', filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Migration file not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, 'utf-8');
}

// Apply migration using Supabase REST API
async function applyMigration(sql, migrationName) {
  const url = `${supabaseUrl}/rest/v1/rpc/exec_sql`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Check if it's a "policy already exists" error (which is OK)
      if (errorText.includes('already exists')) {
        console.log(`⚠️  Some policies already exist - skipping duplicates`);
        return { success: true, alreadyExists: true };
      }

      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return { success: true, alreadyExists: false };
  } catch (error) {
    throw new Error(`Failed to apply migration: ${error.message}`);
  }
}

// Alternative: Try using direct SQL execution
async function applyMigrationDirect(sql, migrationName) {
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`   Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments
    if (statement.startsWith('--')) continue;

    console.log(`   Executing statement ${i + 1}/${statements.length}...`);

    try {
      // Use Supabase Management API for DDL operations
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          query: statement + ';'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Check if error is because policy/table already exists
        if (errorText.includes('already exists')) {
          console.log(`   ⚠️  Already exists - skipping`);
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      console.log(`   ✅ Success`);
    } catch (error) {
      // If it's an "already exists" error, continue
      if (error.message.includes('already exists')) {
        console.log(`   ⚠️  Already exists - skipping`);
        continue;
      }

      throw error;
    }
  }

  return { success: true };
}

// Main execution
async function main() {
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    console.log(`\n📄 ${migration.name}`);
    console.log(`   ${migration.description}`);

    try {
      // Read migration SQL
      const sql = readMigration(migration.name);
      console.log(`   ✅ Migration file loaded (${sql.length} characters)`);

      // Apply migration
      console.log(`   🔄 Applying migration...`);
      const result = await applyMigrationDirect(sql, migration.name);

      if (result.alreadyExists) {
        console.log(`   ⏭️  Migration already applied (policies exist)`);
        skipCount++;
      } else {
        console.log(`   ✅ Migration applied successfully!`);
        successCount++;
      }

    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  // Summary
  console.log('\n============================');
  console.log('📊 Migration Summary');
  console.log('============================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⏭️  Skipped:    ${skipCount}`);
  console.log(`❌ Failed:     ${failCount}`);
  console.log(`📝 Total:      ${migrations.length}\n`);

  if (failCount > 0) {
    console.log('⚠️  Some migrations failed!');
    console.log('\nManual fallback option:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy each migration from supabase/migrations/');
    console.log('3. Run them manually in order (005, 006, 007)\n');
    process.exit(1);
  }

  console.log('🎉 All migrations completed successfully!\n');
  console.log('Next steps:');
  console.log('1. Test admin panel profile updates');
  console.log('2. Verify updates appear instantly on directory pages');
  console.log('3. Check browser console for any errors\n');
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error('\nPlease apply migrations manually using QUICK_START.md\n');
  process.exit(1);
});
