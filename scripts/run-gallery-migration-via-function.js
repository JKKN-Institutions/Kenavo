/**
 * Gallery Migration Script using Supabase RPC Function
 * This bypasses REST API restrictions by using a database function
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

async function runMigration() {
  console.log('═══════════════════════════════════════════════');
  console.log('   GALLERY SYSTEM MIGRATION VIA RPC FUNCTION');
  console.log('═══════════════════════════════════════════════\n');

  try {
    // Step 1: Check if migration function exists
    console.log('🔍 Checking for migration function...');
    const { data: functionCheck, error: funcCheckError } = await supabase
      .rpc('run_migration_sql_unsafe', { migration_sql: 'SELECT 1;' });

    if (funcCheckError) {
      console.error('❌ Migration function not found!');
      console.log('\n📝 SETUP REQUIRED:');
      console.log('1. Go to: https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new');
      console.log('2. Copy contents of: supabase/migrations/009_create_migration_function.sql');
      console.log('3. Paste and run in SQL Editor');
      console.log('4. Re-run this script\n');
      return;
    }

    console.log('✅ Migration function is available\n');

    // Step 2: Check if tables already exist
    console.log('🔍 Checking existing setup...');
    const { data: existingAlbums, error: checkError } = await supabase
      .from('gallery_albums')
      .select('count');

    if (!checkError && existingAlbums !== null) {
      console.log('⚠️  Gallery tables already exist!');

      const { data: albums } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('display_order');

      if (albums && albums.length > 0) {
        console.log(`✅ Found ${albums.length} albums:`);
        albums.forEach(album => {
          console.log(`   - ${album.name} (${album.slug})`);
        });
        console.log('\n🎉 Gallery system is already set up!\n');
        return;
      }
    }

    console.log('📦 Tables not found, proceeding with migration...\n');

    // Step 3: Read migration files
    const migration010 = fs.readFileSync(
      path.resolve(__dirname, '../supabase/migrations/010_create_gallery_system.sql'),
      'utf-8'
    );

    const migration011 = fs.readFileSync(
      path.resolve(__dirname, '../supabase/migrations/011_create_gallery_storage.sql'),
      'utf-8'
    );

    // Step 4: Execute migration 010 via RPC function
    console.log('🚀 Executing Migration 010 (Gallery Tables)...');
    const { data: result010, error: error010 } = await supabase
      .rpc('run_migration_sql_unsafe', { migration_sql: migration010 });

    if (error010) {
      console.error('❌ Migration 010 failed:', error010.message);
      throw error010;
    }

    if (result010?.success) {
      console.log('✅ Migration 010 completed successfully\n');
    } else {
      console.error('❌ Migration 010 failed:', result010?.error);
      console.log('   Detail:', result010?.detail);
      throw new Error(result010?.error);
    }

    // Step 5: Execute migration 011 via RPC function
    console.log('🚀 Executing Migration 011 (Gallery Storage)...');
    const { data: result011, error: error011 } = await supabase
      .rpc('run_migration_sql_unsafe', { migration_sql: migration011 });

    if (error011) {
      console.error('❌ Migration 011 failed:', error011.message);
      throw error011;
    }

    if (result011?.success) {
      console.log('✅ Migration 011 completed successfully\n');
    } else {
      console.error('❌ Migration 011 failed:', result011?.error);
      console.log('   Detail:', result011?.detail);
      throw new Error(result011?.error);
    }

    // Step 6: Verify setup
    console.log('🔍 Verifying setup...\n');

    const { data: albums } = await supabase
      .from('gallery_albums')
      .select('*')
      .order('display_order');

    if (albums && albums.length > 0) {
      console.log('✅ Gallery albums verified:');
      albums.forEach(album => {
        console.log(`   - ${album.name} (${album.slug})`);
      });
    } else {
      console.log('⚠️  Warning: No albums found. Seeding may have failed.');
    }

    const { data: buckets } = await supabase
      .storage
      .listBuckets();

    const galleryBucket = buckets?.find(b => b.id === 'gallery-images');

    if (galleryBucket) {
      console.log('\n✅ Storage bucket verified:');
      console.log(`   - Name: ${galleryBucket.name}`);
      console.log(`   - Public: ${galleryBucket.public}`);
      console.log(`   - File size limit: ${galleryBucket.file_size_limit ? (galleryBucket.file_size_limit / 1024 / 1024).toFixed(1) + ' MB' : 'No limit'}`);
    } else {
      console.log('\n⚠️  Warning: gallery-images bucket not found');
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('   ✅ MIGRATION COMPLETE!');
    console.log('═══════════════════════════════════════════════');
    console.log('\n🎉 Gallery system is ready to use!\n');

    console.log('📝 Next Steps:');
    console.log('1. Run: npm install jszip @types/jszip');
    console.log('2. Start dev server: npm run dev');
    console.log('3. Open admin panel: http://localhost:3000/admin-panel');
    console.log('4. Start uploading gallery images!\n');

    // Cleanup: Drop the unsafe function for security
    console.log('🔒 Cleaning up unsafe migration function...');
    const { error: dropError } = await supabase.rpc('exec', {
      sql: 'DROP FUNCTION IF EXISTS public.run_migration_sql_unsafe(text);'
    }).catch(() => {
      // If exec RPC doesn't exist, that's fine - function will need manual cleanup
      console.log('⚠️  Auto-cleanup not available. Please run manually in SQL Editor:');
      console.log('   DROP FUNCTION IF EXISTS public.run_migration_sql_unsafe(text);\n');
      return { error: null };
    });

    if (!dropError) {
      console.log('✅ Migration function cleaned up successfully\n');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📝 FALLBACK: Manual Migration');
    console.log('If automated migration fails, run manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new');
    console.log('2. Copy contents of: supabase/migrations/010_create_gallery_system.sql');
    console.log('3. Paste and run in SQL Editor');
    console.log('4. Repeat for: supabase/migrations/011_create_gallery_storage.sql\n');
    process.exit(1);
  }
}

// Run migrations
runMigration();
