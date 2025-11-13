import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import { createRagStore, uploadToRagStore, isRagStoreAccessible } from '@/lib/gemini/service';
import type { CreateGeminiDocumentInput, GeminiDocument } from '@/lib/types/database';
import { getUser } from '@/lib/auth/server';

/**
 * GET /api/admin/gemini/documents
 * List all uploaded documents with filtering
 */
export async function GET(request: NextRequest) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('gemini_documents')
      .select('*', { count: 'exact' });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (status && status !== 'all') {
      query = query.eq('upload_status', status);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: documents, error, count } = await query;

    if (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      documents: documents || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error in GET /api/admin/gemini/documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/gemini/documents
 * Upload a new document to Gemini RAG Store
 */
export async function POST(request: NextRequest) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const displayName = formData.get('displayName') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!displayName) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Get current user
    const { user } = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse tags
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];

    // Create document record in database (status: pending)
    const { data: document, error: dbError } = await supabaseAdmin
      .from('gemini_documents')
      .insert({
        name: `doc_${Date.now()}`,
        display_name: displayName,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        category,
        tags: tagsArray,
        description: description || null,
        upload_status: 'pending',
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating document record:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Start async upload process
    uploadDocumentAsync(document.id, file);

    return NextResponse.json({
      message: 'Document upload started',
      document,
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/gemini/documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Async function to upload document to Gemini
 */
async function uploadDocumentAsync(documentId: string, file: File) {
  try {
    // Update status to uploading
    await supabaseAdmin
      .from('gemini_documents')
      .update({ upload_status: 'uploading' })
      .eq('id', documentId);

    // Get or create RAG Store
    const ragStoreName = await getOrCreateRagStore();

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Gemini
    await uploadToRagStore(ragStoreName, buffer, file.name, file.type);

    // Update status to completed
    await supabaseAdmin
      .from('gemini_documents')
      .update({
        upload_status: 'completed',
        rag_store_name: ragStoreName,
        gemini_file_name: file.name,
      })
      .eq('id', documentId);

    console.log(`✅ Document ${documentId} uploaded successfully`);
  } catch (error) {
    console.error(`❌ Error uploading document ${documentId}:`, error);

    // Update status to failed
    await supabaseAdmin
      .from('gemini_documents')
      .update({
        upload_status: 'failed',
        error_message: error instanceof Error ? error.message : 'Upload failed',
      })
      .eq('id', documentId);
  }
}

/**
 * Get or create a shared RAG Store
 * Verifies accessibility before returning existing store
 */
async function getOrCreateRagStore(): Promise<string> {
  // Check if we have an active RAG Store
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

  // Create new RAG Store
  const ragStoreName = await createRagStore('Kenavo Alumni Directory');
  console.log(`✅ Created new RAG store: ${ragStoreName}`);
  return ragStoreName;
}
