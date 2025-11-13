import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * GET /api/auth/check-directory-access
 * Check if the current user has directory access permission
 * Returns user info and access status
 */
export async function GET(request: NextRequest) {
  try {
    // Get current authenticated user
    const { user } = await getUser();

    if (!user) {
      return NextResponse.json(
        {
          hasAccess: false,
          isAuthenticated: false,
          message: 'Not authenticated',
        },
        { status: 401 }
      );
    }

    // Check if user exists in app_users table
    const { data: appUser, error } = await supabaseAdmin
      .from('app_users')
      .select('id, email, username, has_directory_access, status')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error checking directory access:', error);

      // User is authenticated but not in app_users table
      // This could be an admin or a user created before the user management system
      return NextResponse.json(
        {
          hasAccess: false,
          isAuthenticated: true,
          message: 'User not found in system',
        },
        { status: 403 }
      );
    }

    // Check if account is active
    if (appUser.status !== 'active') {
      return NextResponse.json(
        {
          hasAccess: false,
          isAuthenticated: true,
          message: 'Account is inactive',
          user: {
            id: appUser.id,
            email: appUser.email,
            username: appUser.username,
            status: appUser.status,
          },
        },
        { status: 403 }
      );
    }

    // Check directory access permission
    if (!appUser.has_directory_access) {
      return NextResponse.json(
        {
          hasAccess: false,
          isAuthenticated: true,
          message: 'Directory access not granted',
          user: {
            id: appUser.id,
            email: appUser.email,
            username: appUser.username,
            status: appUser.status,
          },
        },
        { status: 403 }
      );
    }

    // User has access
    return NextResponse.json(
      {
        hasAccess: true,
        isAuthenticated: true,
        message: 'Access granted',
        user: {
          id: appUser.id,
          email: appUser.email,
          username: appUser.username,
          status: appUser.status,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in check-directory-access:', error);
    return NextResponse.json(
      {
        hasAccess: false,
        isAuthenticated: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
