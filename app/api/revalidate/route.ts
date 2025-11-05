import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { protectAdminRoute } from '@/lib/auth/api-protection';

/**
 * Revalidation API Route
 * Triggers on-demand ISR revalidation for updated profiles
 *
 * This enables instant updates to appear on the public site
 * after admin makes changes in the admin panel
 *
 * Usage:
 * POST /api/revalidate
 * Body: { path: "/directory/john-doe" } or { paths: ["/directory", "/directory/john-doe"] }
 */

export async function POST(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();

    // Support both single path and multiple paths
    const paths = body.paths || (body.path ? [body.path] : []);

    if (paths.length === 0) {
      return NextResponse.json(
        { error: 'Must provide "path" or "paths" parameter' },
        { status: 400 }
      );
    }

    const revalidated: string[] = [];
    const errors: string[] = [];

    // Revalidate paths
    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidated.push(`path: ${path}`);
        console.log(`✅ Revalidated path: ${path}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`path: ${path} - ${errorMsg}`);
        console.error(`❌ Failed to revalidate path ${path}:`, error);
      }
    }

    // Return response
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          revalidated,
          errors,
          message: 'Some revalidations failed',
        },
        { status: 207 } // Multi-Status
      );
    }

    return NextResponse.json({
      success: true,
      revalidated,
      message: `Successfully revalidated ${revalidated.length} item(s)`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in revalidation API:', error);
    return NextResponse.json(
      {
        error: 'Failed to process revalidation request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Revalidation API is running',
    usage: 'POST with { path: "/directory/profile-slug" } or { paths: [...] }',
  });
}
