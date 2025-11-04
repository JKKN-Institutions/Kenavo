import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
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

    // Validate required columns
    const requiredColumns = ['profile_id', 'question_id', 'answer'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
      return NextResponse.json({
        error: `CSV must contain columns: ${requiredColumns.join(', ')}. Missing: ${missingColumns.join(', ')}`,
      }, { status: 400 });
    }

    // Parse rows
    const answers = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      const row: any = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (value) {
          row[header] = value;
        }
      });

      if (row.profile_id && row.question_id && row.answer) {
        answers.push({
          profile_id: parseInt(row.profile_id),
          question_id: parseInt(row.question_id),
          answer: row.answer,
        });
      }
    }

    if (answers.length === 0) {
      return NextResponse.json({ error: 'No valid Q&A answers found in CSV' }, { status: 400 });
    }

    // Bulk insert/upsert into database
    const { data, error } = await supabase
      .from('profile_answers')
      .upsert(answers, {
        onConflict: 'profile_id,question_id',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to insert Q&A answers: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully uploaded ${data?.length || 0} Q&A answers`,
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
