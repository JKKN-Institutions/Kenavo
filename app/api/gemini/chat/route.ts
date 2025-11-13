import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { chatWithDocuments, isRagStoreAccessible } from '@/lib/gemini/service';
import type { ChatRequest, ChatMessage } from '@/lib/types/database';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/gemini/chat
 * Public endpoint for chatting with documents
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create session ID
    const currentSessionId = sessionId || uuidv4();

    // Get active RAG Store - fetch all completed documents
    const { data: completedDocs } = await supabaseAdmin
      .from('gemini_documents')
      .select('id, rag_store_name')
      .eq('upload_status', 'completed')
      .not('rag_store_name', 'is', null)
      .order('created_at', { ascending: false });

    if (!completedDocs || completedDocs.length === 0) {
      return NextResponse.json({
        error: 'No documents available. Please upload documents first.',
      }, { status: 404 });
    }

    // Find the first accessible RAG store
    let accessibleRagStore: string | null = null;
    for (const doc of completedDocs) {
      if (doc.rag_store_name) {
        const isAccessible = await isRagStoreAccessible(doc.rag_store_name);
        if (isAccessible) {
          accessibleRagStore = doc.rag_store_name;
          break;
        } else {
          // Mark inaccessible documents as failed
          await supabaseAdmin
            .from('gemini_documents')
            .update({
              upload_status: 'failed',
              error_message: 'RAG store not accessible with current API key'
            })
            .eq('id', doc.id);
        }
      }
    }

    if (!accessibleRagStore) {
      return NextResponse.json({
        error: 'No accessible documents found. Please sync alumni profiles or upload new documents.',
      }, { status: 404 });
    }

    // Get chat history for this session
    const { data: historyRecords } = await supabaseAdmin
      .from('gemini_chat_history')
      .select('*')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: true });

    // Convert to ChatMessage format
    const history: ChatMessage[] = historyRecords?.map(record => ({
      role: record.message_role as 'user' | 'model',
      parts: [{ text: record.message_text }],
      groundingChunks: record.grounding_chunks || undefined,
    })) || [];

    // Call Gemini AI
    const response = await chatWithDocuments(
      accessibleRagStore,
      message,
      history
    );

    // Save user message to history
    await supabaseAdmin.from('gemini_chat_history').insert({
      session_id: currentSessionId,
      user_id: null, // Public chat - no user ID
      message_role: 'user',
      message_text: message,
      grounding_chunks: null,
    });

    // Save AI response to history
    await supabaseAdmin.from('gemini_chat_history').insert({
      session_id: currentSessionId,
      user_id: null,
      message_role: 'model',
      message_text: response.text,
      grounding_chunks: response.groundingChunks || null,
    });

    return NextResponse.json({
      response: response.text,
      groundingChunks: response.groundingChunks,
      sessionId: currentSessionId,
    });

  } catch (err: any) {
    console.error('Error in POST /api/gemini/chat:', err);

    // Check for specific Gemini API errors
    const errorMessage = err?.message?.toLowerCase() || '';

    // API Key errors
    if (errorMessage.includes('api key') || errorMessage.includes('api_key')) {
      return NextResponse.json({
        error: 'Gemini API key is not configured. Please contact administrator.',
      }, { status: 500 });
    }

    // Permission denied / RAG Store access errors (403)
    if (errorMessage.includes('permission') ||
        errorMessage.includes('permission_denied') ||
        errorMessage.includes('does not exist') ||
        err?.error?.status === 'PERMISSION_DENIED' ||
        err?.status === 403 ||
        err?.code === 403 ||
        err?.error?.code === 403) {
      return NextResponse.json({
        error: 'Documents need to be re-uploaded. The AI knowledge base is not accessible with the current API key. Please contact an administrator to sync alumni profiles.',
      }, { status: 403 });
    }

    // Quota/Rate limit errors (429)
    if (errorMessage.includes('quota') ||
        errorMessage.includes('rate limit') ||
        errorMessage.includes('resource_exhausted') ||
        errorMessage.includes('429') ||
        err?.status === 429 ||
        err?.code === 429) {
      return NextResponse.json({
        error: 'AI service is temporarily unavailable due to rate limits. Please try again in a few minutes.',
      }, { status: 429 });
    }

    return NextResponse.json({
      error: 'Failed to process your message. Please try again.',
    }, { status: 500 });
  }
}
