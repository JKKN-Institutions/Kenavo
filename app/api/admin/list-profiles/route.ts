import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export async function GET(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const year = searchParams.get('year') || '';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Apply year filter
    if (year) {
      query = query.eq('year_graduated', year);
    }

    // Apply pagination and ordering
    query = query
      .order('name')
      .range(offset, offset + limit - 1);

    const { data: profiles, error, count } = await query;

    if (error) {
      console.error('Error fetching profiles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      profiles: profiles || [],
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
    console.error('Error in list-profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
