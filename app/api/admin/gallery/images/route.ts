import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/gallery/images - List images (optionally filtered by album_id)
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('album_id');

    // Build query
    let query = supabase
      .from('gallery_images')
      .select(`
        *,
        gallery_albums (
          id,
          name,
          slug
        )
      `)
      .order('display_order', { ascending: true });

    // Filter by album if provided
    if (albumId) {
      query = query.eq('album_id', albumId);
    }

    const { data: images, error: imagesError } = await query;

    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      throw imagesError;
    }

    return NextResponse.json({
      images: images || [],
      total: images?.length || 0,
      album_id: albumId || null
    });

  } catch (error: any) {
    console.error('Error in GET /api/admin/gallery/images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/gallery/images - Create new image
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
    const { album_id, image_url, caption, display_order, is_active } = body;

    // Validate required fields
    if (!album_id || !image_url) {
      return NextResponse.json(
        { error: 'album_id and image_url are required' },
        { status: 400 }
      );
    }

    // Verify album exists
    const { data: album, error: albumError } = await supabase
      .from('gallery_albums')
      .select('id, name')
      .eq('id', album_id)
      .single();

    if (albumError || !album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // Create image
    const { data: newImage, error: createError } = await supabase
      .from('gallery_images')
      .insert({
        album_id,
        image_url,
        caption: caption || null,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true
      })
      .select(`
        *,
        gallery_albums (
          id,
          name,
          slug
        )
      `)
      .single();

    if (createError) {
      console.error('Error creating image:', createError);
      throw createError;
    }

    return NextResponse.json({
      success: true,
      image: newImage,
      message: `Image added to "${album.name}" successfully`
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/admin/gallery/images:', error);
    return NextResponse.json(
      { error: 'Failed to create image', details: error.message },
      { status: 500 }
    );
  }
}
