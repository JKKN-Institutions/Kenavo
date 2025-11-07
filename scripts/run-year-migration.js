const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runYearMigration() {
  console.log('=== RUNNING YEAR_GRADUATED MIGRATION ===\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '012_update_year_graduated_format.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Migration SQL:');
    console.log('─'.repeat(80));
    console.log(migrationSQL);
    console.log('─'.repeat(80));
    console.log('');

    // Execute the SQL directly
    console.log('Executing migration...\n');

    // Since we can't run raw SQL directly with the JS client, we'll use the REST API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          query: `
            ALTER TABLE profiles
              ALTER COLUMN year_graduated TYPE VARCHAR(20);

            COMMENT ON COLUMN profiles.year_graduated IS 'Year graduated or batch years (e.g., "2007" or "1993-2000")';
          `
        })
      }
    );

    if (!response.ok) {
      // If RPC doesn't exist, let's try a different approach
      console.log('⚠️  Direct SQL execution not available via RPC');
      console.log('Please run the following SQL manually in Supabase SQL Editor:\n');
      console.log('─'.repeat(80));
      console.log(`ALTER TABLE profiles ALTER COLUMN year_graduated TYPE VARCHAR(20);`);
      console.log(`COMMENT ON COLUMN profiles.year_graduated IS 'Year graduated or batch years (e.g., "2007" or "1993-2000")';`);
      console.log('─'.repeat(80));
      console.log('\nOR copy and run the migration file:');
      console.log(`  ${migrationPath}`);
      return;
    }

    const result = await response.json();
    console.log('✅ Migration executed successfully!');
    console.log('');
    console.log('Changes made:');
    console.log('  - year_graduated column type changed from VARCHAR(4) to VARCHAR(20)');
    console.log('  - Can now accept batch year format like "1993-2000"');
    console.log('');

  } catch (error) {
    console.error('❌ Error running migration:', error);
    console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:\n');
    console.log('─'.repeat(80));
    console.log(`ALTER TABLE profiles ALTER COLUMN year_graduated TYPE VARCHAR(20);`);
    console.log('─'.repeat(80));
  }
}

runYearMigration().catch(console.error);
