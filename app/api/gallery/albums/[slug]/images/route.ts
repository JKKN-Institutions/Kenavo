import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/gallery/albums/[slug]/images - Get all images for an album (Public endpoint)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: albumSlug } = await params;
    const supabase = supabaseAdmin;

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

    // Get all active images for this album
    const { data: images, error: imagesError } = await supabase
      .from('gallery_images')
      .select('id, image_url, caption, display_order, created_at')
      .eq('album_id', album.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (imagesError) {
      console.error(`Error fetching images for album "${albumSlug}":`, imagesError);
      throw imagesError;
    }

    const response = NextResponse.json({
      album: {
        id: album.id,
        name: album.name,
        slug: album.slug,
        description: album.description
      },
      images: images || [],
      total_images: images?.length || 0
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
