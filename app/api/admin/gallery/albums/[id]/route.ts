import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/gallery/albums/[id] - Get single album
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

    const albumId = params.id;

    // Fetch album with images
    const { data: album, error: albumError } = await supabase
      .from('gallery_albums')
      .select(`
        *,
        gallery_images (
          id,
          image_url,
          caption,
          display_order,
          is_active,
          created_at
        )
      `)
      .eq('id', albumId)
      .single();

    if (albumError) {
      if (albumError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      }
      throw albumError;
    }

    return NextResponse.json({ album });

  } catch (error: any) {
    console.error(`Error in GET /api/admin/gallery/albums/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch album', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/gallery/albums/[id] - Update album
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

    const albumId = params.id;
    const body = await request.json();
    const { name, slug, description, thumbnail_url, display_order, is_active } = body;

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update album
    const { data: updatedAlbum, error: updateError } = await supabase
      .from('gallery_albums')
      .update(updateData)
      .eq('id', albumId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating album:', updateError);

      // Check for unique constraint violation
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: 'An album with this name or slug already exists' },
          { status: 409 }
        );
      }

      // Check if album not found
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      }

      throw updateError;
    }

    return NextResponse.json({
      success: true,
      album: updatedAlbum,
      message: 'Album updated successfully'
    });

  } catch (error: any) {
    console.error(`Error in PUT /api/admin/gallery/albums/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update album', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gallery/albums/[id] - Delete album
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

    const albumId = params.id;

    // Check if album exists and get image count
    const { data: album, error: checkError } = await supabase
      .from('gallery_albums')
      .select('id, name, gallery_images(count)')
      .eq('id', albumId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      }
      throw checkError;
    }

    const imageCount = album.gallery_images?.[0]?.count || 0;

    // Delete album (CASCADE will delete related images)
    const { error: deleteError } = await supabase
      .from('gallery_albums')
      .delete()
      .eq('id', albumId);

    if (deleteError) {
      console.error('Error deleting album:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: `Album "${album.name}" and ${imageCount} associated image(s) deleted successfully`,
      deleted_images: imageCount
    });

  } catch (error: any) {
    console.error(`Error in DELETE /api/admin/gallery/albums/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete album', details: error.message },
      { status: 500 }
    );
  }
}
