import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import { extractGalleryStoragePath, deleteGalleryImage } from '@/lib/gallery-storage-utils';

export const dynamic = 'force-dynamic';

// GET /api/admin/gallery/images/[id] - Get single image
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  const { id: imageId } = await params;

  try {

    // Fetch image with album details
    const { data: image, error: imageError } = await supabaseAdmin
      .from('gallery_images')
      .select(`
        *,
        gallery_albums (
          id,
          name,
          slug
        )
      `)
      .eq('id', imageId)
      .single();

    if (imageError) {
      if (imageError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      throw imageError;
    }

    return NextResponse.json({ image });

  } catch (error: any) {
    console.error(`Error in GET /api/admin/gallery/images/${imageId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/gallery/images/[id] - Update image
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  const { id: imageId } = await params;

  try {
    const body = await request.json();
    const { album_id, image_url, caption, display_order, is_active } = body;

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (album_id !== undefined) updateData.album_id = album_id;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (caption !== undefined) updateData.caption = caption;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;

    // If album_id is being changed, verify the new album exists
    if (album_id !== undefined) {
      const { data: album, error: albumError } = await supabaseAdmin
        .from('gallery_albums')
        .select('id')
        .eq('id', album_id)
        .single();

      if (albumError || !album) {
        return NextResponse.json(
          { error: 'Album not found' },
          { status: 404 }
        );
      }
    }

    // Update image
    const { data: updatedImage, error: updateError } = await supabaseAdmin
      .from('gallery_images')
      .update(updateData)
      .eq('id', imageId)
      .select(`
        *,
        gallery_albums (
          id,
          name,
          slug
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating image:', updateError);

      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }

      throw updateError;
    }

    return NextResponse.json({
      success: true,
      image: updatedImage,
      message: 'Image updated successfully'
    });

  } catch (error: any) {
    console.error(`Error in PUT /api/admin/gallery/images/${imageId}:`, error);
    return NextResponse.json(
      { error: 'Failed to update image', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gallery/images/[id] - Delete image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  const { id: imageId } = await params;

  try {

    // Check if image exists
    const { data: image, error: checkError } = await supabaseAdmin
      .from('gallery_images')
      .select('id, image_url')
      .eq('id', imageId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
      throw checkError;
    }

    // Extract storage path from image_url
    const storagePath = extractGalleryStoragePath(image.image_url);

    // Delete from storage first (if path is valid)
    if (storagePath) {
      const deleted = await deleteGalleryImage(storagePath);
      if (!deleted) {
        console.warn(`Failed to delete image from storage: ${storagePath}`);
      }
    }

    // Delete image from database
    const { error: deleteError } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Error deleting image from database:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Image and file deleted successfully'
    });

  } catch (error: any) {
    console.error(`Error in DELETE /api/admin/gallery/images/${imageId}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete image', details: error.message },
      { status: 500 }
    );
  }
}
