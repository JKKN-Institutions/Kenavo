import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export async function POST(request: NextRequest) {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read CSV file
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty or invalid' }, { status: 400 });
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());

    // Validate required column
    if (!headers.includes('name')) {
      return NextResponse.json({ error: 'CSV must contain "name" column' }, { status: 400 });
    }

    // Parse rows
    const profiles = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      const profile: any = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (value) {
          profile[header] = value;
        }
      });

      if (profile.name) {
        // Validate year_graduated length (database constraint: VARCHAR(4))
        const yearGrad = profile.year_graduated?.trim();
        if (yearGrad && yearGrad.length > 4) {
          console.warn(`Skipping profile "${profile.name}": year_graduated "${yearGrad}" exceeds 4 characters`);
          continue;
        }

        profiles.push({
          name: profile.name,
          email: profile.email || null,
          phone: profile.phone || null,
          location: profile.location || null,
          year_graduated: yearGrad || null,
          current_job: profile.current_job || null,
          company: profile.company || null,
          bio: profile.bio || null,
          linkedin_url: profile.linkedin_url || null,
          nicknames: profile.nicknames || null,
          profile_image_url: profile.profile_image_url || null,
        });
      }
    }

    if (profiles.length === 0) {
      return NextResponse.json({ error: 'No valid profiles found in CSV' }, { status: 400 });
    }

    // Bulk insert into database
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert(profiles)
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to insert profiles: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      profiles: data,
      message: `Successfully uploaded ${data?.length || 0} profiles`,
    });

  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to parse CSV line (handles quoted values with commas)
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
