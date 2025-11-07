/**
 * Reorder Gallery Images API
 * PUT /api/admin/gallery/images/reorder
 * Bulk update display_order for multiple images
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'updates array is required' },
        { status: 400 }
      );
    }

    // Validate each update has id and display_order
    for (const update of updates) {
      if (!update.id || update.display_order === undefined) {
        return NextResponse.json(
          { error: 'Each update must have id and display_order' },
          { status: 400 }
        );
      }
    }

    // Update each image's display_order
    const updatePromises = updates.map(update =>
      supabaseAdmin
        .from('gallery_images')
        .update({ display_order: update.display_order })
        .eq('id', update.id)
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      updated_count: updates.length,
      message: `Successfully reordered ${updates.length} image(s)`,
    });
  } catch (error: any) {
    console.error('Error reordering images:', error);
    return NextResponse.json(
      { error: 'Failed to reorder images', details: error.message },
      { status: 500 }
    );
  }
}
