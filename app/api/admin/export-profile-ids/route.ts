import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export const dynamic = 'force-dynamic';

/**
 * Export Profile IDs API
 * Returns a CSV file with id, name, and year_graduated for all profiles
 * Useful for Q&A uploads and image naming reference
 */
export async function GET(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    // Fetch all profiles with minimal data
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, year_graduated')
      .order('id', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      );
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json(
        { error: 'No profiles found' },
        { status: 404 }
      );
    }

    // Create CSV content
    const headers = ['id', 'name', 'year_graduated'];
    const csvRows = [headers.join(',')];

    for (const profile of profiles) {
      const row = [
        profile.id,
        profile.name ? `"${profile.name.replace(/"/g, '""')}"` : '',
        profile.year_graduated || ''
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `profile_ids_${date}.csv`;

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Error exporting profile IDs:', error);
    return NextResponse.json(
      {
        error: 'Failed to export profile IDs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
