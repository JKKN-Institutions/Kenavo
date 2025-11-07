const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupQAAnswers() {
  console.log('=== CLEANING UP Q&A ANSWERS (profile_answers table) ===\n');
  console.log('This will delete all Q&A responses from the profile_answers table');
  console.log('Master questions in profile_questions will be preserved\n');

  try {
    // Step 1: Get current count
    const { count: beforeCount, error: countError } = await supabase
      .from('profile_answers')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error accessing profile_answers table:', countError);
      console.log('\nℹ️  The table might not exist or might be named differently.');
      console.log('   Please run this SQL manually in Supabase SQL Editor:\n');
      console.log('   TRUNCATE TABLE profile_answers;');
      return;
    }

    console.log(`Current Q&A answers in database: ${beforeCount}\n`);

    if (beforeCount === 0) {
      console.log('✅ No Q&A answers found. Database is already clean!');
      return;
    }

    // Step 2: Show sample data before deletion
    const { data: sampleBefore } = await supabase
      .from('profile_answers')
      .select('id, profile_id, question_id, answer')
      .limit(5);

    if (sampleBefore && sampleBefore.length > 0) {
      console.log('Sample Q&A answers BEFORE deletion:');
      console.log('─'.repeat(80));
      sampleBefore.forEach(qa => {
        console.log(`ID: ${qa.id} | Profile: ${qa.profile_id} | Question: ${qa.question_id}`);
        const answerPreview = qa.answer
          ? (qa.answer.length > 60 ? qa.answer.substring(0, 60) + '...' : qa.answer)
          : 'null';
        console.log(`  Answer: ${answerPreview}`);
        console.log('');
      });
    }

    // Step 3: Delete all Q&A answers
    console.log('Deleting all Q&A answers...\n');

    const { error: deleteError, count: deletedCount } = await supabase
      .from('profile_answers')
      .delete()
      .neq('id', 0); // Delete all rows (neq 0 matches everything)

    if (deleteError) {
      console.error('❌ Error during deletion:', deleteError);
      console.log('\nℹ️  Please run this SQL manually in Supabase SQL Editor:\n');
      console.log('   TRUNCATE TABLE profile_answers;');
      return;
    }

    console.log(`✅ Successfully deleted Q&A answers\n`);

    // Step 4: Verify deletion
    const { count: afterCount } = await supabase
      .from('profile_answers')
      .select('*', { count: 'exact', head: true });

    console.log('Verification:');
    console.log('─'.repeat(80));
    console.log(`Q&A answers BEFORE: ${beforeCount}`);
    console.log(`Q&A answers AFTER:  ${afterCount}`);
    console.log('');

    if (afterCount === 0) {
      console.log('=== Q&A ANSWERS CLEANUP COMPLETE ===');
      console.log(`✅ All ${beforeCount} Q&A answers have been deleted`);
      console.log(`✅ profile_answers table is now empty`);
      console.log(`✅ profile_questions table preserved (10 master questions)`);
      console.log(`✅ Individual profile pages will no longer show Q&A`);
      console.log(`✅ Ready for fresh Q&A data upload`);
    } else {
      console.log('⚠️  Warning: Some Q&A answers may still remain');
      console.log(`   Expected: 0, Found: ${afterCount}`);
      console.log('\n   Please run this SQL manually in Supabase SQL Editor:');
      console.log('   TRUNCATE TABLE profile_answers;');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    console.log('\nℹ️  Please run this SQL manually in Supabase SQL Editor:\n');
    console.log('   TRUNCATE TABLE profile_answers;');
  }
}

cleanupQAAnswers().catch(console.error);
