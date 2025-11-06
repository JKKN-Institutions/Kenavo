import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/admin/gallery/images/bulk-upload - Bulk upload images to an album
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
    const { album_id, images } = body;

    // Validate required fields
    if (!album_id) {
      return NextResponse.json(
        { error: 'album_id is required' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'images array is required and must not be empty' },
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

    // Validate each image has required fields
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.image_url) {
        return NextResponse.json(
          { error: `Image at index ${i} is missing image_url` },
          { status: 400 }
        );
      }
    }

    // Prepare bulk insert data
    const insertData = images.map((img, index) => ({
      album_id,
      image_url: img.image_url,
      caption: img.caption || null,
      display_order: img.display_order !== undefined ? img.display_order : index,
      is_active: img.is_active !== undefined ? img.is_active : true
    }));

    console.log(`📦 Bulk uploading ${insertData.length} images to album "${album.name}" (ID: ${album_id})`);

    // Bulk insert images
    const { data: insertedImages, error: insertError } = await supabase
      .from('gallery_images')
      .insert(insertData)
      .select();

    if (insertError) {
      console.error('Error bulk inserting images:', insertError);
      throw insertError;
    }

    console.log(`✅ Successfully inserted ${insertedImages?.length || 0} images`);

    return NextResponse.json({
      success: true,
      inserted_count: insertedImages?.length || 0,
      album_name: album.name,
      images: insertedImages,
      message: `Successfully uploaded ${insertedImages?.length || 0} images to "${album.name}"`
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/admin/gallery/images/bulk-upload:', error);
    return NextResponse.json(
      { error: 'Failed to bulk upload images', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Bulk Image Upload Endpoint',
    usage: 'Send POST request with album_id and images array',
    example: {
      album_id: 1,
      images: [
        { image_url: 'https://...', caption: 'Photo 1', display_order: 0 },
        { image_url: 'https://...', caption: 'Photo 2', display_order: 1 }
      ]
    }
  });
}
