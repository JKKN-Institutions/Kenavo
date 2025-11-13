import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';
import type { UpdateGeminiDocumentInput } from '@/lib/types/database';

/**
 * GET /api/admin/gemini/documents/[id]
 * Get a single document by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const { data: document, error } = await supabaseAdmin
      .from('gemini_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching document:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error in GET /api/admin/gemini/documents/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/gemini/documents/[id]
 * Update a document's metadata
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { id } = await params;
    const body: UpdateGeminiDocumentInput = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Check if document exists
    const { data: existingDoc, error: fetchError } = await supabaseAdmin
      .from('gemini_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Build update object
    const updateData: any = {};
    if (body.display_name !== undefined) updateData.display_name = body.display_name;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.upload_status !== undefined) updateData.upload_status = body.upload_status;
    if (body.error_message !== undefined) updateData.error_message = body.error_message;
    if (body.rag_store_name !== undefined) updateData.rag_store_name = body.rag_store_name;
    if (body.gemini_file_name !== undefined) updateData.gemini_file_name = body.gemini_file_name;

    // Update document
    const { data: updatedDoc, error: updateError } = await supabaseAdmin
      .from('gemini_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating document:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Document updated successfully',
      document: updatedDoc,
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/gemini/documents/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/gemini/documents/[id]
 * Delete a document
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Check if document exists
    const { data: existingDoc, error: fetchError } = await supabaseAdmin
      .from('gemini_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('gemini_documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting document:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Note: We don't delete from RAG Store as multiple documents share the same store
    // and we want to keep the knowledge base intact

    return NextResponse.json({
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/gemini/documents/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
