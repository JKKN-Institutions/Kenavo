/**
 * Gallery System Migration Script
 * Run this script to set up the gallery system database tables
 */

const { createClient } = require('@supabase/supabase-js');
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
  console.log('🚀 Starting Gallery System Migration...\n');

  try {
    // Step 1: Create gallery_albums table
    console.log('📦 Creating gallery_albums table...');
    const { error: albumsTableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS gallery_albums (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          thumbnail_url TEXT,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (albumsTableError) {
      console.error('❌ Error creating gallery_albums table:', albumsTableError);
      throw albumsTableError;
    }
    console.log('✅ gallery_albums table created\n');

    // Step 2: Create gallery_images table
    console.log('📦 Creating gallery_images table...');
    const { error: imagesTableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS gallery_images (
          id BIGSERIAL PRIMARY KEY,
          album_id BIGINT NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
          image_url TEXT NOT NULL,
          caption TEXT,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (imagesTableError) {
      console.error('❌ Error creating gallery_images table:', imagesTableError);
      throw imagesTableError;
    }
    console.log('✅ gallery_images table created\n');

    // Step 3: Create indexes
    console.log('📊 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id ON gallery_images(album_id);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums(slug);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_albums_display_order ON gallery_albums(display_order);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_albums_is_active ON gallery_albums(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON gallery_images(is_active);'
    ];

    for (const index of indexes) {
      const { error } = await supabase.rpc('exec', { sql: index });
      if (error) console.warn('⚠️  Index warning:', error.message);
    }
    console.log('✅ Indexes created\n');

    // Step 4: Create trigger function
    console.log('⚡ Creating trigger function...');
    const { error: triggerFunctionError } = await supabase.rpc('exec', {
      sql: `
        CREATE OR REPLACE FUNCTION update_gallery_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (triggerFunctionError) {
      console.error('❌ Error creating trigger function:', triggerFunctionError);
      throw triggerFunctionError;
    }
    console.log('✅ Trigger function created\n');

    // Step 5: Create triggers
    console.log('⚡ Creating triggers...');
    const triggers = [
      'DROP TRIGGER IF EXISTS gallery_albums_updated_at ON gallery_albums;',
      `CREATE TRIGGER gallery_albums_updated_at
         BEFORE UPDATE ON gallery_albums
         FOR EACH ROW
         EXECUTE FUNCTION update_gallery_updated_at();`,
      'DROP TRIGGER IF EXISTS gallery_images_updated_at ON gallery_images;',
      `CREATE TRIGGER gallery_images_updated_at
         BEFORE UPDATE ON gallery_images
         FOR EACH ROW
         EXECUTE FUNCTION update_gallery_updated_at();`
    ];

    for (const trigger of triggers) {
      const { error } = await supabase.rpc('exec', { sql: trigger });
      if (error) console.warn('⚠️  Trigger warning:', error.message);
    }
    console.log('✅ Triggers created\n');

    // Step 6: Seed initial albums
    console.log('🌱 Seeding initial albums...');
    const albums = [
      { name: 'Group Photos', slug: 'group', description: 'Class photos and group memories from our time together', display_order: 1, is_active: true },
      { name: 'Sports', slug: 'sports', description: 'Athletic achievements, tournaments, and sports day celebrations', display_order: 2, is_active: true },
      { name: 'Hostel Life', slug: 'hostel', description: 'Dormitory memories, late-night study sessions, and hostel fun', display_order: 3, is_active: true },
      { name: 'Tours & Trips', slug: 'tours', description: 'Educational trips, excursions, and travel adventures', display_order: 4, is_active: true },
      { name: 'Events', slug: 'events', description: 'School events, cultural programs, and special occasions', display_order: 5, is_active: true },
      { name: 'Annual Day', slug: 'annual-day', description: 'Annual day celebrations, performances, and ceremonies', display_order: 6, is_active: true }
    ];

    for (const album of albums) {
      const { error } = await supabase
        .from('gallery_albums')
        .upsert(album, { onConflict: 'slug', ignoreDuplicates: true });

      if (error) {
        console.warn(`⚠️  Seeding warning for "${album.name}":`, error.message);
      }
    }
    console.log('✅ Initial albums seeded\n');

    // Step 7: Enable RLS
    console.log('🔒 Enabling RLS...');
    const rlsCommands = [
      'ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;'
    ];

    for (const rls of rlsCommands) {
      const { error } = await supabase.rpc('exec', { sql: rls });
      if (error) console.warn('⚠️  RLS warning:', error.message);
    }
    console.log('✅ RLS enabled\n');

    // Step 8: Create RLS policies (albums)
    console.log('🔐 Creating RLS policies for gallery_albums...');
    const albumPolicies = [
      `CREATE POLICY "Public users can view active albums"
        ON gallery_albums FOR SELECT
        USING (is_active = true);`,
      `CREATE POLICY "Authenticated users can view all albums"
        ON gallery_albums FOR SELECT
        TO authenticated
        USING (true);`,
      `CREATE POLICY "Admin users can insert albums"
        ON gallery_albums FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );`,
      `CREATE POLICY "Admin users can update albums"
        ON gallery_albums FOR UPDATE
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );`,
      `CREATE POLICY "Admin users can delete albums"
        ON gallery_albums FOR DELETE
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );`
    ];

    for (const policy of albumPolicies) {
      const { error } = await supabase.rpc('exec', { sql: policy });
      if (error && !error.message.includes('already exists')) {
        console.warn('⚠️  Policy warning:', error.message);
      }
    }
    console.log('✅ Album policies created\n');

    // Step 9: Create RLS policies (images)
    console.log('🔐 Creating RLS policies for gallery_images...');
    const imagePolicies = [
      `CREATE POLICY "Public users can view active images"
        ON gallery_images FOR SELECT
        USING (
          is_active = true
          AND EXISTS (
            SELECT 1 FROM gallery_albums
            WHERE gallery_albums.id = gallery_images.album_id
            AND gallery_albums.is_active = true
          )
        );`,
      `CREATE POLICY "Authenticated users can view all images"
        ON gallery_images FOR SELECT
        TO authenticated
        USING (true);`,
      `CREATE POLICY "Admin users can insert images"
        ON gallery_images FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );`,
      `CREATE POLICY "Admin users can update images"
        ON gallery_images FOR UPDATE
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );`,
      `CREATE POLICY "Admin users can delete images"
        ON gallery_images FOR DELETE
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
          )
        );`
    ];

    for (const policy of imagePolicies) {
      const { error } = await supabase.rpc('exec', { sql: policy });
      if (error && !error.message.includes('already exists')) {
        console.warn('⚠️  Policy warning:', error.message);
      }
    }
    console.log('✅ Image policies created\n');

    // Step 10: Grant permissions
    console.log('🔑 Granting permissions...');
    const permissions = [
      'GRANT USAGE ON SEQUENCE gallery_albums_id_seq TO authenticated;',
      'GRANT USAGE ON SEQUENCE gallery_images_id_seq TO authenticated;',
      'GRANT SELECT ON gallery_albums TO anon, authenticated;',
      'GRANT SELECT ON gallery_images TO anon, authenticated;',
      'GRANT ALL ON gallery_albums TO authenticated;',
      'GRANT ALL ON gallery_images TO authenticated;'
    ];

    for (const permission of permissions) {
      const { error } = await supabase.rpc('exec', { sql: permission });
      if (error) console.warn('⚠️  Permission warning:', error.message);
    }
    console.log('✅ Permissions granted\n');

    console.log('🎉 Gallery System Migration Complete!\n');
    console.log('Summary:');
    console.log('  ✅ Tables created: gallery_albums, gallery_images');
    console.log('  ✅ Indexes created: 6');
    console.log('  ✅ Triggers created: 2');
    console.log('  ✅ Albums seeded: 6');
    console.log('  ✅ RLS enabled with policies');
    console.log('  ✅ Permissions granted\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
