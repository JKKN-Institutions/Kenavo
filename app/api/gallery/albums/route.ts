import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/gallery/albums - List all active albums (Public endpoint)
// Supports pagination: ?page=1&limit=6
export async function GET(request: Request) {
  try {
    const supabase = supabaseAdmin;

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Calculate offset for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count first
    const { count: totalCount, error: countError } = await supabase
      .from('gallery_albums')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countError) {
      console.error('Error counting albums:', countError);
      throw countError;
    }

    // Fetch paginated active albums with image count
    const { data: albums, error: albumsError } = await supabase
      .from('gallery_albums')
      .select(`
        id,
        name,
        slug,
        description,
        thumbnail_url,
        display_order,
        gallery_images!inner (count)
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .range(from, to);

    if (albumsError) {
      console.error('Error fetching albums:', albumsError);
      throw albumsError;
    }

    // Transform data to include image count
    const transformedAlbums = albums?.map(album => ({
      id: album.id,
      name: album.name,
      slug: album.slug,
      description: album.description,
      thumbnail_url: album.thumbnail_url,
      display_order: album.display_order,
      image_count: album.gallery_images?.[0]?.count || 0,
    })) || [];

    // Calculate pagination metadata
    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    const response = NextResponse.json({
      albums: transformedAlbums,
      total,
      currentPage: page,
      totalPages,
      hasMore,
      limit
    });

    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;

  } catch (error: any) {
    console.error('Error in GET /api/gallery/albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums', details: error.message },
      { status: 500 }
    );
  }
}
