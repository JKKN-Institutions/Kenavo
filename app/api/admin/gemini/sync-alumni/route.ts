import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import { createRagStore, uploadToRagStore, isRagStoreAccessible } from '@/lib/gemini/service';
import { getUser } from '@/lib/auth/server';

/**
 * POST /api/admin/gemini/sync-alumni
 * Auto-sync alumni profiles to Gemini RAG Store
 */
export async function POST(request: NextRequest) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    // Get current user
    const { user } = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all alumni profiles from database
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('name', { ascending: true });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch alumni profiles' }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'No alumni profiles found' }, { status: 404 });
    }

    // Generate text content from profiles
    const alumniText = generateAlumniTextContent(profiles);

    // Create a text file as Buffer
    const textContent = Buffer.from(alumniText, 'utf-8');
    const fileName = `alumni_profiles_${Date.now()}.txt`;

    // Create document record
    const { data: document, error: dbError } = await supabaseAdmin
      .from('gemini_documents')
      .insert({
        name: `alumni_sync_${Date.now()}`,
        display_name: 'Alumni Profiles (Auto-synced)',
        file_name: fileName,
        file_size: textContent.length,
        file_type: 'text/plain',
        category: 'alumni_profiles',
        tags: ['auto-sync', 'alumni'],
        description: `Auto-synced ${profiles.length} alumni profiles`,
        upload_status: 'pending',
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating document record:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Start async upload
    uploadAlumniAsync(document.id, textContent, fileName, profiles.length);

    return NextResponse.json({
      message: 'Alumni sync started',
      document,
      profileCount: profiles.length,
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/gemini/sync-alumni:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Generate text content from alumni profiles
 */
function generateAlumniTextContent(profiles: any[]): string {
  let content = '# Kenavo Alumni Directory\n\n';
  content += `Total Alumni: ${profiles.length}\n\n`;
  content += '---\n\n';

  profiles.forEach((profile, index) => {
    content += `## Alumni Profile ${index + 1}\n\n`;
    content += `**Name:** ${profile.name}\n`;

    if (profile.year_graduated) {
      content += `**Graduation Year:** ${profile.year_graduated}\n`;
    }

    if (profile.location) {
      content += `**Location:** ${profile.location}\n`;
    }

    if (profile.current_job) {
      content += `**Current Position:** ${profile.current_job}\n`;
    }

    if (profile.designation_organisation) {
      content += `**Organization:** ${profile.designation_organisation}\n`;
    }

    if (profile.email) {
      content += `**Email:** ${profile.email}\n`;
    }

    if (profile.phone) {
      content += `**Phone:** ${profile.phone}\n`;
    }

    if (profile.linkedin_url) {
      content += `**LinkedIn:** ${profile.linkedin_url}\n`;
    }

    if (profile.nicknames) {
      content += `**Nicknames:** ${profile.nicknames}\n`;
    }

    if (profile.bio) {
      content += `**Bio:** ${profile.bio}\n`;
    }

    content += '\n---\n\n';
  });

  return content;
}

/**
 * Async function to upload alumni data
 */
async function uploadAlumniAsync(documentId: string, textContent: Buffer, fileName: string, profileCount: number) {
  try {
    // Update status to uploading
    await supabaseAdmin
      .from('gemini_documents')
      .update({ upload_status: 'uploading' })
      .eq('id', documentId);

    // Get or create RAG Store
    const ragStoreName = await getOrCreateRagStore();

    // Upload to Gemini
    await uploadToRagStore(ragStoreName, textContent, fileName, 'text/plain');

    // Update status to completed
    await supabaseAdmin
      .from('gemini_documents')
      .update({
        upload_status: 'completed',
        rag_store_name: ragStoreName,
        gemini_file_name: fileName,
        description: `Auto-synced ${profileCount} alumni profiles - Completed`,
      })
      .eq('id', documentId);

    console.log(`✅ Alumni profiles synced successfully: ${profileCount} profiles`);
  } catch (error) {
    console.error(`❌ Error syncing alumni profiles:`, error);

    // Update status to failed
    await supabaseAdmin
      .from('gemini_documents')
      .update({
        upload_status: 'failed',
        error_message: error instanceof Error ? error.message : 'Sync failed',
      })
      .eq('id', documentId);
  }
}

/**
 * Get or create shared RAG Store
 * Verifies accessibility before returning existing store
 */
async function getOrCreateRagStore(): Promise<string> {
  const { data: existingDoc } = await supabaseAdmin
    .from('gemini_documents')
    .select('rag_store_name')
    .eq('upload_status', 'completed')
    .not('rag_store_name', 'is', null)
    .limit(1)
    .single();

  if (existingDoc?.rag_store_name) {
    // Verify the RAG store is accessible with current API key
    const isAccessible = await isRagStoreAccessible(existingDoc.rag_store_name);

    if (isAccessible) {
      console.log(`✅ Using existing RAG store: ${existingDoc.rag_store_name}`);
      return existingDoc.rag_store_name;
    } else {
      console.warn(`⚠️  Existing RAG store is not accessible. Creating new one...`);
      // Mark old documents as failed since they're tied to inaccessible store
      await supabaseAdmin
        .from('gemini_documents')
        .update({
          upload_status: 'failed',
          error_message: 'RAG store not accessible with current API key'
        })
        .eq('rag_store_name', existingDoc.rag_store_name);
    }
  }

  const ragStoreName = await createRagStore('Kenavo Alumni Directory');
  console.log(`✅ Created new RAG store: ${ragStoreName}`);
  return ragStoreName;
}
