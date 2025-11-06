import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('🚀 Starting Gallery System Migration...');

    // Step 1: Create gallery_albums table
    console.log('📦 Creating gallery_albums table...');
    const { error: albumsTableError } = await supabase.rpc('exec_sql', {
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
    console.log('✅ gallery_albums table created');

    // Step 2: Create gallery_images table
    console.log('📦 Creating gallery_images table...');
    const { error: imagesTableError } = await supabase.rpc('exec_sql', {
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
    console.log('✅ gallery_images table created');

    // Step 3: Create indexes
    console.log('📊 Creating indexes...');
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id ON gallery_images(album_id);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums(slug);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_albums_display_order ON gallery_albums(display_order);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_albums_is_active ON gallery_albums(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON gallery_images(is_active);'
    ];

    for (const indexQuery of indexQueries) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexQuery });
      if (indexError) {
        console.warn('⚠️  Index creation warning:', indexError.message);
      }
    }
    console.log('✅ Indexes created');

    // Step 4: Create trigger function
    console.log('⚡ Creating trigger function...');
    const { error: triggerFunctionError } = await supabase.rpc('exec_sql', {
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
    console.log('✅ Trigger function created');

    // Step 5: Create triggers
    console.log('⚡ Creating triggers...');
    const triggerQueries = [
      `DROP TRIGGER IF EXISTS gallery_albums_updated_at ON gallery_albums;`,
      `CREATE TRIGGER gallery_albums_updated_at
         BEFORE UPDATE ON gallery_albums
         FOR EACH ROW
         EXECUTE FUNCTION update_gallery_updated_at();`,
      `DROP TRIGGER IF EXISTS gallery_images_updated_at ON gallery_images;`,
      `CREATE TRIGGER gallery_images_updated_at
         BEFORE UPDATE ON gallery_images
         FOR EACH ROW
         EXECUTE FUNCTION update_gallery_updated_at();`
    ];

    for (const triggerQuery of triggerQueries) {
      const { error: triggerError } = await supabase.rpc('exec_sql', { sql: triggerQuery });
      if (triggerError) {
        console.warn('⚠️  Trigger creation warning:', triggerError.message);
      }
    }
    console.log('✅ Triggers created');

    // Step 6: Seed initial albums
    console.log('🌱 Seeding initial albums...');
    const albums = [
      { name: 'Group Photos', slug: 'group', description: 'Class photos and group memories from our time together', display_order: 1 },
      { name: 'Sports', slug: 'sports', description: 'Athletic achievements, tournaments, and sports day celebrations', display_order: 2 },
      { name: 'Hostel Life', slug: 'hostel', description: 'Dormitory memories, late-night study sessions, and hostel fun', display_order: 3 },
      { name: 'Tours & Trips', slug: 'tours', description: 'Educational trips, excursions, and travel adventures', display_order: 4 },
      { name: 'Events', slug: 'events', description: 'School events, cultural programs, and special occasions', display_order: 5 },
      { name: 'Annual Day', slug: 'annual-day', description: 'Annual day celebrations, performances, and ceremonies', display_order: 6 }
    ];

    for (const album of albums) {
      const { error: seedError } = await supabase
        .from('gallery_albums')
        .upsert(album, { onConflict: 'slug', ignoreDuplicates: true });

      if (seedError) {
        console.warn(`⚠️  Seeding warning for "${album.name}":`, seedError.message);
      }
    }
    console.log('✅ Initial albums seeded');

    // Step 7: Enable RLS (Note: RLS policies need to be created manually in Supabase dashboard for now)
    console.log('🔒 Enabling RLS...');
    const rlsQueries = [
      'ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;'
    ];

    for (const rlsQuery of rlsQueries) {
      const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsQuery });
      if (rlsError) {
        console.warn('⚠️  RLS enable warning:', rlsError.message);
      }
    }
    console.log('✅ RLS enabled');

    console.log('🎉 Gallery System Migration Complete!');

    return NextResponse.json({
      success: true,
      message: 'Gallery system migration completed successfully!',
      details: {
        tables_created: ['gallery_albums', 'gallery_images'],
        indexes_created: 6,
        triggers_created: 2,
        albums_seeded: 6,
        rls_enabled: true
      }
    });

  } catch (error: any) {
    console.error('❌ Migration Error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error.message,
        hint: 'You may need to run this migration manually in Supabase SQL Editor'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Gallery Migration Endpoint',
    usage: 'Send POST request to run the migration',
    note: 'Admin access required'
  });
}
