/**
 * Apply Migration 008: Add Auto-Increment to profiles.id
 *
 * This script applies the migration to add SERIAL behavior to profiles.id
 * Run with: node scripts/apply-migration-008.js
 */

const fs = require('fs');
const path = require('path');

// Import Supabase admin client
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🚀 Starting Migration 008: Add Auto-Increment to profiles.id\n');

  try {
    // Step 1: Create sequence
    console.log('Step 1: Creating sequence profiles_id_seq...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: 'CREATE SEQUENCE IF NOT EXISTS profiles_id_seq;'
    });
    if (error1) {
      console.error('❌ Error creating sequence:', error1);
      // Try raw SQL query instead
      const { error: rawError1 } = await supabase.from('_sql_').insert({
        query: 'CREATE SEQUENCE IF NOT EXISTS profiles_id_seq;'
      });
      if (rawError1) {
        throw error1;
      }
    }
    console.log('✅ Sequence created\n');

    // Step 2: Set sequence value to max ID
    console.log('Step 2: Setting sequence to start after existing profiles...');
    const { data: maxIdResult, error: maxIdError } = await supabase
      .from('profiles')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      console.error('❌ Error getting max ID:', maxIdError);
      throw maxIdError;
    }

    const maxId = maxIdResult && maxIdResult.length > 0 ? maxIdResult[0].id : 0;
    console.log(`Current max profile ID: ${maxId}`);

    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `SELECT setval('profiles_id_seq', ${maxId}, true);`
    });
    if (error2) {
      console.error('❌ Error setting sequence value:', error2);
      throw error2;
    }
    console.log(`✅ Sequence set to start from ${maxId + 1}\n`);

    // Step 3: Alter column to use sequence
    console.log('Step 3: Setting id column default to use sequence...');
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE profiles ALTER COLUMN id SET DEFAULT nextval('profiles_id_seq');`
    });
    if (error3) {
      console.error('❌ Error altering column:', error3);
      throw error3;
    }
    console.log('✅ Column default set\n');

    // Step 4: Grant permissions
    console.log('Step 4: Granting permissions...');
    const { error: error4 } = await supabase.rpc('exec_sql', {
      sql: `
        GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO authenticated;
        GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO anon;
      `
    });
    if (error4) {
      console.error('❌ Error granting permissions:', error4);
      throw error4;
    }
    console.log('✅ Permissions granted\n');

    console.log('🎉 Migration 008 completed successfully!');
    console.log('📝 Summary:');
    console.log(`   - Auto-increment added to profiles.id`);
    console.log(`   - Existing profile IDs (1-${maxId}) preserved`);
    console.log(`   - New profiles will auto-generate IDs starting from ${maxId + 1}`);
    console.log('\n✅ You can now upload the CSV file through the admin panel!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.log('\n⚠️  ALTERNATIVE: Run the migration manually in Supabase SQL Editor:');
    console.log('1. Go to https://app.supabase.com/project/_/sql');
    console.log('2. Copy the contents of supabase/migrations/008_add_profiles_id_autoincrement.sql');
    console.log('3. Paste and click "Run"');
    process.exit(1);
  }
}

applyMigration();
