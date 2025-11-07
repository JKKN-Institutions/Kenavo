import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/gallery/albums/[slug]/images - Get all images for an album (Public endpoint)
// Supports pagination: ?page=1&limit=6
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: albumSlug } = await params;

  try {
    const supabase = supabaseAdmin;

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Calculate offset for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // First, get the album by slug
    const { data: album, error: albumError } = await supabase
      .from('gallery_albums')
      .select('id, name, slug, description')
      .eq('slug', albumSlug)
      .eq('is_active', true)
      .single();

    if (albumError) {
      if (albumError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Album not found' },
          { status: 404 }
        );
      }
      throw albumError;
    }

    // Get total count of images first
    const { count: totalCount, error: countError } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })
      .eq('album_id', album.id)
      .eq('is_active', true);

    if (countError) {
      console.error(`Error counting images for album "${albumSlug}":`, countError);
      throw countError;
    }

    // Get paginated active images for this album
    const { data: images, error: imagesError } = await supabase
      .from('gallery_images')
      .select('id, image_url, caption, display_order, created_at')
      .eq('album_id', album.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .range(from, to);

    if (imagesError) {
      console.error(`Error fetching images for album "${albumSlug}":`, imagesError);
      throw imagesError;
    }

    // Calculate pagination metadata
    const total = totalCount || 0;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    const response = NextResponse.json({
      album: {
        id: album.id,
        name: album.name,
        slug: album.slug,
        description: album.description
      },
      images: images || [],
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
    console.error(`Error in GET /api/gallery/albums/${albumSlug}/images:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch album images', details: error.message },
      { status: 500 }
    );
  }
}
