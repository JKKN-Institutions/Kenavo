import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { generateExampleQuestions, isRagStoreAccessible } from '@/lib/gemini/service';

/**
 * GET /api/gemini/example-questions
 * Get AI-generated example questions based on uploaded documents
 */
export async function GET(request: NextRequest) {
  try {
    // Get active RAG Store - fetch all completed documents
    const { data: completedDocs } = await supabaseAdmin
      .from('gemini_documents')
      .select('id, rag_store_name')
      .eq('upload_status', 'completed')
      .not('rag_store_name', 'is', null)
      .order('created_at', { ascending: false });

    if (!completedDocs || completedDocs.length === 0) {
      return NextResponse.json({
        questions: [
          "Who's in the alumni directory?",
          "Tell me about classmates working in tech",
          "Any alumni in my area?",
          "What are people up to these days?"
        ]
      });
    }

    // Find the first accessible RAG store
    let accessibleRagStore: string | null = null;
    for (const doc of completedDocs) {
      if (doc.rag_store_name) {
        const isAccessible = await isRagStoreAccessible(doc.rag_store_name);
        if (isAccessible) {
          accessibleRagStore = doc.rag_store_name;
          break;
        }
      }
    }

    if (!accessibleRagStore) {
      return NextResponse.json({
        questions: [
          "Who's in the alumni directory?",
          "Tell me about classmates working in tech",
          "Any alumni in my area?",
          "What are people up to these days?"
        ]
      });
    }

    // Generate questions using Gemini
    const questions = await generateExampleQuestions(accessibleRagStore);

    // Fallback questions if generation fails
    if (!questions || questions.length === 0) {
      return NextResponse.json({
        questions: [
          "Who's working in tech these days?",
          "Tell me about classmates in medicine",
          "Any alumni in my city?",
          "What are people doing now?",
          "Who's working abroad?",
          "Tell me about someone interesting"
        ]
      });
    }

    return NextResponse.json({
      questions: questions.slice(0, 6) // Return max 6 questions
    });

  } catch (error) {
    console.error('Error generating example questions:', error);

    // Return fallback questions on error
    return NextResponse.json({
      questions: [
        "Who's working in tech these days?",
        "Tell me about classmates in medicine",
        "Any alumni in my city?",
        "What are people doing now?",
        "Who's working abroad?",
        "Tell me about someone interesting"
      ]
    });
  }
}
