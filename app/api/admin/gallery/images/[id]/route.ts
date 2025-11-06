import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/gallery/images/[id] - Get single image
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const imageId = params.id;

    // Fetch image with album details
    const { data: image, error: imageError } = await supabase
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
    console.error(`Error in GET /api/admin/gallery/images/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/gallery/images/[id] - Update image
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const imageId = params.id;
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
      const { data: album, error: albumError } = await supabase
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
    const { data: updatedImage, error: updateError } = await supabase
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
    console.error(`Error in PUT /api/admin/gallery/images/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update image', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gallery/images/[id] - Delete image
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const imageId = params.id;

    // Check if image exists
    const { data: image, error: checkError } = await supabase
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

    // Delete image from database
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Error deleting image:', deleteError);
      throw deleteError;
    }

    // TODO: Optionally delete the actual image file from Supabase Storage
    // This would require parsing the image_url to extract the storage path
    // and calling supabase.storage.from('gallery-images').remove([path])

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      note: 'Image file remains in storage (manual cleanup required if needed)'
    });

  } catch (error: any) {
    console.error(`Error in DELETE /api/admin/gallery/images/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete image', details: error.message },
      { status: 500 }
    );
  }
}
