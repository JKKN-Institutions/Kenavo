/**
 * Migration Runner Script
 * Run this script to apply all pending security migrations
 *
 * Usage:
 * npx tsx scripts/run-migrations.ts
 *
 * Or run individual migrations through Supabase Dashboard:
 * https://supabase.com/dashboard/project/YOUR_PROJECT/sql
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

const MIGRATIONS_TO_RUN = [
  '005_add_profiles_rls.sql',
  '006_strengthen_qa_rls.sql',
  '007_create_storage_policies.sql',
];

async function runMigration(filename: string): Promise<boolean> {
  console.log(`\n🔄 Running migration: ${filename}`);

  const filePath = path.join(MIGRATIONS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Migration file not found: ${filePath}`);
    return false;
  }

  const sql = fs.readFileSync(filePath, 'utf-8');

  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error(`❌ Migration failed: ${filename}`);
      console.error('Error:', error);
      return false;
    }

    console.log(`✅ Migration completed: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Exception during migration: ${filename}`);
    console.error(error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Security Migrations');
  console.log('================================\n');

  let successCount = 0;
  let failCount = 0;

  for (const migration of MIGRATIONS_TO_RUN) {
    const success = await runMigration(migration);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n================================');
  console.log('📊 Migration Summary');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📝 Total: ${MIGRATIONS_TO_RUN.length}`);

  if (failCount > 0) {
    console.log('\n⚠️  Some migrations failed!');
    console.log('Manual steps:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy and paste each migration file from supabase/migrations/');
    console.log('3. Execute them in order (005, 006, 007)');
    process.exit(1);
  }

  console.log('\n🎉 All migrations completed successfully!');
}

main();
