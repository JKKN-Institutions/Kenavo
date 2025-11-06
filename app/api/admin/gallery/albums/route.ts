import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/gallery/albums - List all albums
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all albums with image count
    const { data: albums, error: albumsError } = await supabase
      .from('gallery_albums')
      .select(`
        *,
        gallery_images (count)
      `)
      .order('display_order', { ascending: true });

    if (albumsError) {
      console.error('Error fetching albums:', albumsError);
      throw albumsError;
    }

    // Transform data to include image count
    const transformedAlbums = albums?.map(album => ({
      ...album,
      image_count: album.gallery_images?.[0]?.count || 0,
      gallery_images: undefined // Remove the nested array
    })) || [];

    return NextResponse.json({
      albums: transformedAlbums,
      total: transformedAlbums.length
    });

  } catch (error: any) {
    console.error('Error in GET /api/admin/gallery/albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/gallery/albums - Create new album
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { name, slug, description, thumbnail_url, display_order, is_active } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Create album
    const { data: newAlbum, error: createError } = await supabase
      .from('gallery_albums')
      .insert({
        name,
        slug,
        description: description || null,
        thumbnail_url: thumbnail_url || null,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating album:', createError);

      // Check for unique constraint violation
      if (createError.code === '23505') {
        return NextResponse.json(
          { error: 'An album with this name or slug already exists' },
          { status: 409 }
        );
      }

      throw createError;
    }

    return NextResponse.json({
      success: true,
      album: newAlbum,
      message: 'Album created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/admin/gallery/albums:', error);
    return NextResponse.json(
      { error: 'Failed to create album', details: error.message },
      { status: 500 }
    );
  }
}
