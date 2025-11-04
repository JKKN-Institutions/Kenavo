import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profileId = parseInt(id);

    if (isNaN(profileId)) {
      return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
    }

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Fetch Q&A answers for this profile
    const { data: qaData, error: qaError } = await supabase
      .from('profile_answers')
      .select(`
        question_id,
        answer,
        profile_questions (
          question_text,
          order_index
        )
      `)
      .eq('profile_id', profileId)
      .order('profile_questions(order_index)');

    if (qaError) {
      console.warn('Error fetching Q&A:', qaError);
      // Continue without Q&A if table doesn't exist
    }

    // Transform Q&A data
    const qaResponses = qaData?.map((item: any) => ({
      question_id: item.question_id,
      question_text: item.profile_questions?.question_text || '',
      answer: item.answer,
      order_index: item.profile_questions?.order_index || 0
    })) || [];

    // Fetch all questions for the form (in case some aren't answered yet)
    const { data: allQuestions } = await supabase
      .from('profile_questions')
      .select('id, question_text, order_index')
      .eq('is_active', true)
      .order('order_index');

    return NextResponse.json({
      profile,
      qa_responses: qaResponses,
      all_questions: allQuestions || [],
    });

  } catch (error) {
    console.error('Error in get-profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
