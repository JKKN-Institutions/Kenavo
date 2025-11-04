import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profileId = parseInt(id);

    if (isNaN(profileId)) {
      return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
    }

    const formData = await request.formData();

    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string || null;
    const phone = formData.get('phone') as string || null;
    const location = formData.get('location') as string || null;
    const year_graduated = formData.get('year_graduated') as string || null;
    const current_job = formData.get('current_job') as string || null;
    const company = formData.get('company') as string || null;
    const bio = formData.get('bio') as string || null;
    const linkedin_url = formData.get('linkedin_url') as string || null;
    const nicknames = formData.get('nicknames') as string || null;
    const imageFile = formData.get('image') as File | null;
    const existing_image_url = formData.get('existing_image_url') as string || null;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let profile_image_url = existing_image_url;

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Convert File to ArrayBuffer for Supabase upload
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, buffer, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue with update even if image upload fails
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        profile_image_url = publicUrl;
      }
    }

    // Update profile in database
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .update({
        name,
        email,
        phone,
        location,
        year_graduated,
        current_job,
        company,
        bio,
        linkedin_url,
        nicknames,
        profile_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to update profile: ' + dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
