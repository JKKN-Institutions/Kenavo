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

    const body = await request.json();
    const { answers } = body; // Array of { question_id, answer }

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: 'Answers must be an array' }, { status: 400 });
    }

    // Prepare answers for upsert
    const answersToUpsert = answers
      .filter(a => a.answer && a.answer.trim() !== '') // Only save non-empty answers
      .map(a => ({
        profile_id: profileId,
        question_id: a.question_id,
        answer: a.answer,
      }));

    if (answersToUpsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No answers to update',
        count: 0,
      });
    }

    // Upsert Q&A answers (update if exists, insert if not)
    const { data, error } = await supabase
      .from('profile_answers')
      .upsert(answersToUpsert, {
        onConflict: 'profile_id,question_id',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update Q&A: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully updated ${data?.length || 0} Q&A answers`,
    });

  } catch (error) {
    console.error('Error updating Q&A:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
