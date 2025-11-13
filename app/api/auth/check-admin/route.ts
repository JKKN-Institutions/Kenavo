import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * CHECK ADMIN AUTHORIZATION
 *
 * Verifies if the current authenticated user's email is in the ADMIN_EMAILS whitelist.
 * Used by client-side components to check authorization before accessing admin features.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Create Supabase SSR client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Error setting cookie:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error('Error removing cookie:', error);
            }
          },
        },
      }
    );

    // Get current user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          authorized: false,
          message: 'Not authenticated',
          user: null
        },
        { status: 401 }
      );
    }

    // Check if user email is in admin whitelist
    const userEmail = user.email || '';
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];

    console.log('Checking admin access for:', userEmail);
    console.log('Admin whitelist:', adminEmails);

    const isAdmin = adminEmails.includes(userEmail);

    if (!isAdmin) {
      return NextResponse.json(
        {
          authorized: false,
          message: 'Access denied. Your email is not authorized for admin access.',
          user: {
            email: userEmail,
            id: user.id
          }
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        authorized: true,
        message: 'Admin access granted',
        user: {
          email: userEmail,
          id: user.id,
          full_name: user.user_metadata?.full_name
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error checking admin authorization:', error);
    return NextResponse.json(
      {
        authorized: false,
        message: 'Server error',
        error: error.message
      },
      { status: 500 }
    );
  }
}
