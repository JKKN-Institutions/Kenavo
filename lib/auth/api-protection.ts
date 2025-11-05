// API Route Protection Helper
import { NextRequest, NextResponse } from 'next/server';
import { getUser, isAdmin } from './server';

/**
 * Protect API routes - require authentication and admin role
 *
 * Usage in API routes:
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const authCheck = await protectAdminRoute();
 *   if (authCheck) return authCheck;
 *
 *   // Your API logic here
 * }
 * ```
 */
export async function protectAdminRoute() {
  const { user, error } = await getUser();

  if (error || !user) {
    return NextResponse.json(
      {
        error: 'Unauthorized - Authentication required',
        message: 'Please login to access this resource',
      },
      { status: 401 }
    );
  }

  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        error: 'Forbidden - Admin access required',
        message: 'You do not have permission to access this resource',
        user: user.email,
      },
      { status: 403 }
    );
  }

  // Return null if authorized (no error response needed)
  return null;
}
