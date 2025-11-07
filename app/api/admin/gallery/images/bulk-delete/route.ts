import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import { extractGalleryStoragePath, deleteGalleryImagesBulk } from '@/lib/gallery-storage-utils';

export const dynamic = 'force-dynamic';

/**
 * Bulk Delete Gallery Images API
 *
 * Deletes multiple gallery images from both database and storage
 *
 * @route POST /api/admin/gallery/images/bulk-delete
 * @access Admin only
 */
export async function POST(request: NextRequest) {
  try {
    // Protect route - admin only
    const authCheck = await protectAdminRoute();
    if (authCheck) return authCheck;

    // Parse request body
    const body = await request.json();
    const { image_ids } = body;

    // Validate input
    if (!image_ids || !Array.isArray(image_ids) || image_ids.length === 0) {
      return NextResponse.json(
        { error: 'image_ids array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate all IDs are numbers
    if (!image_ids.every((id) => typeof id === 'number' && id > 0)) {
      return NextResponse.json(
        { error: 'All image_ids must be positive numbers' },
        { status: 400 }
      );
    }

    // Fetch all images to get their storage URLs
    const { data: images, error: fetchError } = await supabaseAdmin
      .from('gallery_images')
      .select('id, image_url')
      .in('id', image_ids);

    if (fetchError) {
      console.error('Error fetching images for bulk delete:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch images for deletion' },
        { status: 500 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'No images found with the provided IDs' },
        { status: 404 }
      );
    }

    // Extract storage paths from image URLs
    const storagePaths: string[] = [];
    for (const image of images) {
      if (image.image_url) {
        const path = extractGalleryStoragePath(image.image_url);
        if (path) {
          storagePaths.push(path);
        }
      }
    }

    // Track results
    let storageDeletedCount = 0;
    let storageFailedCount = 0;
    let dbDeletedCount = 0;
    const errors: string[] = [];

    // Delete from storage if we have paths
    if (storagePaths.length > 0) {
      try {
        storageDeletedCount = await deleteGalleryImagesBulk(storagePaths);
        storageFailedCount = storagePaths.length - storageDeletedCount;

        if (storageFailedCount > 0) {
          errors.push(`Failed to delete ${storageFailedCount} images from storage`);
        }
      } catch (storageError: any) {
        console.error('Error deleting from storage:', storageError);
        errors.push(`Storage deletion error: ${storageError.message}`);
        storageFailedCount = storagePaths.length;
      }
    }

    // Delete from database (even if storage deletion failed)
    const { error: deleteError, count } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .in('id', image_ids);

    if (deleteError) {
      console.error('Error deleting images from database:', deleteError);
      errors.push(`Database deletion error: ${deleteError.message}`);
      return NextResponse.json(
        {
          success: false,
          deleted_count: 0,
          failed_count: images.length,
          storage_deleted: storageDeletedCount,
          storage_failed: storageFailedCount,
          errors,
        },
        { status: 500 }
      );
    }

    dbDeletedCount = count || 0;

    // Determine overall success
    const success = dbDeletedCount > 0;
    const totalFailed = images.length - dbDeletedCount;

    return NextResponse.json({
      success,
      deleted_count: dbDeletedCount,
      failed_count: totalFailed,
      storage_deleted: storageDeletedCount,
      storage_failed: storageFailedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: success
        ? `Successfully deleted ${dbDeletedCount} image${dbDeletedCount !== 1 ? 's' : ''}`
        : 'Failed to delete images',
    });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
