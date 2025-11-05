// Server-side auth utilities
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Check if user is admin
export async function isAdmin() {
  const { user } = await getUser();

  if (!user) {
    return false;
  }

  // Check user metadata or database for admin role
  // For now, we'll use a simple email whitelist
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

  return adminEmails.includes(user.email || '');
}

// Middleware helper for protecting routes
export async function requireAuth(request: NextRequest) {
  const { user } = await getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return null;
}

// Middleware helper for requiring admin role
export async function requireAdmin(request: NextRequest) {
  const { user } = await getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  return null;
}
