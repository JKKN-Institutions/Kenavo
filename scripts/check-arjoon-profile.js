/**
 * Check A Arjoon's Profile
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfile() {
  console.log('Checking A Arjoon profile...\n');

  // Fetch A Arjoon's profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      year_graduated,
      profile_answers (
        answer,
        profile_questions (
          question_text
        )
      )
    `)
    .ilike('name', '%arjoon%')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Profile Found:');
  console.log('='.repeat(80));
  console.log(`ID: ${profile.id}`);
  console.log(`Name: ${profile.name}`);
  console.log(`Year Graduated: "${profile.year_graduated}"`);
  console.log('\nQ&A Answers:');

  if (profile.profile_answers && profile.profile_answers.length > 0) {
    profile.profile_answers.forEach((qa, index) => {
      if (qa.profile_questions) {
        console.log(`\n${index + 1}. ${qa.profile_questions.question_text}`);
        console.log(`   Answer: "${qa.answer}"`);
      }
    });
  } else {
    console.log('  No Q&A answers found');
  }

  console.log('\n' + '='.repeat(80));
}

checkProfile()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
