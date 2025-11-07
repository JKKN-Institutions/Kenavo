/**
 * Set Album Thumbnail API
 * PUT /api/admin/gallery/albums/[id]/thumbnail
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { id: albumId } = await params;
    const { image_url } = await request.json();

    if (!image_url) {
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      );
    }

    // Verify album exists
    const { data: album, error: albumError } = await supabaseAdmin
      .from('gallery_albums')
      .select('id, name')
      .eq('id', albumId)
      .single();

    if (albumError || !album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    // Update thumbnail_url
    const { data: updatedAlbum, error: updateError } = await supabaseAdmin
      .from('gallery_albums')
      .update({ thumbnail_url: image_url })
      .eq('id', albumId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      album: updatedAlbum,
      message: `Thumbnail updated for album "${album.name}"`,
    });
  } catch (error: any) {
    console.error(`Error setting thumbnail for album ${albumId}:`, error);
    return NextResponse.json(
      { error: 'Failed to set thumbnail', details: error.message },
      { status: 500 }
    );
  }
}
