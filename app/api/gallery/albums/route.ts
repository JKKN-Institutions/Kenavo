import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/gallery/albums - List all active albums (Public endpoint)
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Fetch all active albums with image count
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
      .order('display_order', { ascending: true });

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

    const response = NextResponse.json({
      albums: transformedAlbums,
      total: transformedAlbums.length
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
