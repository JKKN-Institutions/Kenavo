import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export async function GET() {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    // Get all profiles with their image URLs
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, profile_image_url')
      .order('id')
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Analyze the URLs
    const analysis = {
      total: profiles?.length || 0,
      withImages: 0,
      withoutImages: 0,
      alumniFolder: 0,
      profilesFolder: 0,
      otherFolder: 0,
      invalidUrls: [] as any[],
      samples: [] as any[],
    };

    profiles?.forEach(profile => {
      const url = profile.profile_image_url;

      if (!url) {
        analysis.withoutImages++;
        return;
      }

      analysis.withImages++;

      // Check which folder
      if (url.includes('/alumni/')) {
        analysis.alumniFolder++;
      } else if (url.includes('/profiles/')) {
        analysis.profilesFolder++;
      } else if (url.includes('profile-images')) {
        analysis.otherFolder++;
      } else {
        analysis.invalidUrls.push({
          id: profile.id,
          name: profile.name,
          url: url
        });
      }

      // Store first 5 samples
      if (analysis.samples.length < 5) {
        analysis.samples.push({
          id: profile.id,
          name: profile.name,
          url: url,
          folder: url.includes('/alumni/') ? 'alumni' :
                  url.includes('/profiles/') ? 'profiles' : 'other'
        });
      }
    });

    return NextResponse.json({
      success: true,
      analysis,
      recommendation: analysis.alumniFolder > 0 && analysis.profilesFolder > 0
        ? 'You have images in both alumni/ and profiles/ folders. Both should work fine if the bucket is public.'
        : 'All images are in a single folder structure.'
    });

  } catch (error) {
    console.error('Error diagnosing images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
