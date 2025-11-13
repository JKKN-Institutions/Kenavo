import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import { getUser } from '@/lib/auth/server';
import type { CreateAppUserInput } from '@/lib/types/database';

/**
 * GET /api/admin/users
 * List all users with pagination and search
 */
export async function GET(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseAdmin
      .from('app_users')
      .select('*', { count: 'exact' });

    // Apply search filter (email or username)
    if (search) {
      query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%`);
    }

    // Apply status filter
    if (status && (status === 'active' || status === 'inactive')) {
      query = query.eq('status', status);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      users: users || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });

    // Prevent caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const body: CreateAppUserInput = await request.json();
    const { email, username, password, role, has_directory_access, status } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get current admin user
    const { user: currentUser } = await getUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 1: Create auth user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: username || null,
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: authError.message || 'Failed to create user account' },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Step 2: Create app user record in app_users table
    const { data: appUser, error: appUserError } = await supabaseAdmin
      .from('app_users')
      .insert({
        id: authData.user.id,
        email,
        username: username || null,
        role: role || 'user', // Default to 'user' role
        has_directory_access: has_directory_access !== undefined ? has_directory_access : true,
        status: status || 'active',
        created_by: currentUser.id,
      })
      .select()
      .single();

    if (appUserError) {
      console.error('Error creating app user:', appUserError);

      // Rollback: Delete auth user if app_users insert fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        console.log('✅ Rollback successful: Deleted orphaned auth user');
      } catch (deleteError) {
        console.error('⚠️ Rollback failed: Could not delete auth user:', deleteError);
      }

      // Check if error is due to missing table
      const errorMessage = appUserError.message || '';
      if (errorMessage.includes('app_users') &&
          (errorMessage.includes('does not exist') ||
           errorMessage.includes('Could not find') ||
           errorMessage.includes('PGRST205'))) {
        return NextResponse.json(
          {
            error: '❌ Database setup incomplete: The app_users table has not been created. Please run the database migration first. See FIX_USER_LOGIN_ERROR.md for instructions.',
            details: appUserError.message,
            fixInstructions: 'Run the migration: supabase/migrations/015_create_app_users_table.sql'
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: appUserError.message || 'Failed to create user record' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: appUser,
      },
      { status: 201 }
    );

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('Error in POST /api/admin/users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
