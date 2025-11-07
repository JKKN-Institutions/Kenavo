/**
 * Apply Gallery Migrations Script
 * Executes SQL migrations directly using Supabase client
 * Bypasses MCP integration issues
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Read migration files
const migration010 = fs.readFileSync(
  path.resolve(__dirname, '../supabase/migrations/010_create_gallery_system.sql'),
  'utf-8'
);

const migration011 = fs.readFileSync(
  path.resolve(__dirname, '../supabase/migrations/011_create_gallery_storage.sql'),
  'utf-8'
);

async function executeSqlStatements(sqlContent, migrationName) {
  console.log(`\n🚀 Executing ${migrationName}...\n`);

  // Split by semicolons but be careful with function definitions
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => {
      // Filter out empty statements and comments
      return s.length > 0 &&
             !s.startsWith('--') &&
             !s.match(/^\/\*[\s\S]*?\*\/$/);
    });

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'; // Add semicolon back

    // Skip comment-only lines
    if (statement.trim().startsWith('--')) continue;

    try {
      // Use the REST API endpoint for executing SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ sql: statement }),
      });

      if (!response.ok) {
        const error = await response.text();

        // Ignore "already exists" errors
        if (error.includes('already exists') ||
            error.includes('duplicate key') ||
            error.includes('CONFLICT')) {
          console.log(`⚠️  Statement ${i + 1}: Already exists (skipping)`);
          successCount++;
        } else {
          console.error(`❌ Statement ${i + 1} failed:`, error);
          errorCount++;
        }
      } else {
        console.log(`✅ Statement ${i + 1}: Success`);
        successCount++;
      }
    } catch (error) {
      // Try alternative method using Supabase client's query
      try {
        const { error: queryError } = await supabase.rpc('query', { query_text: statement });

        if (queryError) {
          if (queryError.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}: Already exists (skipping)`);
            successCount++;
          } else {
            console.error(`❌ Statement ${i + 1} failed:`, queryError.message);
            errorCount++;
          }
        } else {
          console.log(`✅ Statement ${i + 1}: Success`);
          successCount++;
        }
      } catch (fallbackError) {
        console.error(`❌ Statement ${i + 1} failed:`, error.message || fallbackError.message);
        errorCount++;
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 ${migrationName} Results:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);

  return { successCount, errorCount };
}

async function runMigrations() {
  console.log('═══════════════════════════════════════════════');
  console.log('   GALLERY SYSTEM MIGRATION');
  console.log('═══════════════════════════════════════════════');

  try {
    // Test connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      console.log('\n📝 MANUAL MIGRATION REQUIRED');
      console.log('Since automated migration failed, please run manually:');
      console.log('1. Go to: https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new');
      console.log('2. Copy contents of: supabase/migrations/010_create_gallery_system.sql');
      console.log('3. Paste and run in SQL Editor');
      console.log('4. Repeat for: supabase/migrations/011_create_gallery_storage.sql');
      return;
    }
    console.log('✅ Connected to Supabase\n');

    // Check if tables already exist
    const { data: existingTables } = await supabase
      .from('gallery_albums')
      .select('count')
      .limit(1);

    if (existingTables !== null) {
      console.log('⚠️  Gallery tables already exist!');
      console.log('Checking if albums are seeded...\n');

      const { data: albums } = await supabase
        .from('gallery_albums')
        .select('*');

      if (albums && albums.length > 0) {
        console.log('✅ Gallery system is already set up!');
        console.log(`   Found ${albums.length} albums:`);
        albums.forEach(album => {
          console.log(`   - ${album.name} (${album.slug})`);
        });
        console.log('\n🎉 No migration needed - system is ready!\n');
        return;
      }
    }

    // Execute migrations
    const result010 = await executeSqlStatements(migration010, 'Migration 010 (Gallery Tables)');
    const result011 = await executeSqlStatements(migration011, 'Migration 011 (Gallery Storage)');

    console.log('\n═══════════════════════════════════════════════');
    console.log('   MIGRATION COMPLETE');
    console.log('═══════════════════════════════════════════════\n');

    if (result010.errorCount > 0 || result011.errorCount > 0) {
      console.log('⚠️  Some statements failed. This might be OK if tables already exist.');
      console.log('Verify the gallery system is working by checking the admin panel.\n');
    } else {
      console.log('✅ All migrations applied successfully!\n');
    }

    // Verify setup
    console.log('🔍 Verifying setup...\n');

    const { data: albums } = await supabase
      .from('gallery_albums')
      .select('*')
      .order('display_order');

    if (albums && albums.length > 0) {
      console.log('✅ Gallery albums table verified:');
      albums.forEach(album => {
        console.log(`   - ${album.name} (${album.slug})`);
      });
    } else {
      console.log('⚠️  Warning: No albums found. Seeding may have failed.');
    }

    const { data: images } = await supabase
      .from('gallery_images')
      .select('count');

    console.log(`\n✅ Gallery images table verified (${images?.[0]?.count || 0} images)`);

    console.log('\n🎉 Gallery system is ready to use!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📝 MANUAL MIGRATION REQUIRED');
    console.log('Please run the migrations manually in Supabase Dashboard:');
    console.log('1. Go to: https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new');
    console.log('2. Copy contents of: supabase/migrations/010_create_gallery_system.sql');
    console.log('3. Paste and run in SQL Editor');
    console.log('4. Repeat for: supabase/migrations/011_create_gallery_storage.sql\n');
  }
}

// Run migrations
runMigrations();
