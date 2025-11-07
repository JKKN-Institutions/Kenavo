const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupQAData() {
  console.log('=== CLEANING UP Q&A DATA ===\n');
  console.log('This will delete all Q&A answers from slambook_responses table\n');

  try {
    // Get current Q&A count
    const { count: totalQA, error: countError } = await supabase
      .from('slambook_responses')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error counting Q&A responses:', countError);
      console.log('ℹ️  Table may not exist or may be empty');
      return;
    }

    console.log(`Total Q&A responses in database: ${totalQA}\n`);

    if (totalQA === 0) {
      console.log('ℹ️  No Q&A responses to delete. Database is already clean.');
      return;
    }

    // Show sample Q&A data before deletion
    const { data: sampleBefore } = await supabase
      .from('slambook_responses')
      .select('*')
      .limit(3);

    if (sampleBefore && sampleBefore.length > 0) {
      console.log('Sample Q&A responses BEFORE deletion:');
      console.log('─'.repeat(80));
      sampleBefore.forEach(qa => {
        console.log(`  Row: ${JSON.stringify(qa).substring(0, 100)}...`);
      });
    }

    console.log('Starting Q&A deletion...\n');

    // Delete all Q&A responses
    const { error: deleteError, count: deletedCount } = await supabase
      .from('slambook_responses')
      .delete()
      .not('id', 'is', null); // Delete all rows

    if (deleteError) {
      console.error('❌ Error during Q&A deletion:', deleteError);
      return;
    }

    console.log(`✅ Successfully deleted all Q&A responses\n`);

    // Verify deletion
    const { count: afterCount } = await supabase
      .from('slambook_responses')
      .select('*', { count: 'exact', head: true });

    console.log('Verification:');
    console.log('─'.repeat(80));
    console.log(`Q&A responses before: ${totalQA}`);
    console.log(`Q&A responses after: ${afterCount}`);
    console.log('');

    if (afterCount === 0) {
      console.log('=== Q&A CLEANUP COMPLETE ===');
      console.log(`✅ All ${totalQA} Q&A responses have been deleted`);
      console.log(`✅ slambook_responses table is now empty`);
      console.log(`✅ Ready for fresh Q&A data upload`);
    } else {
      console.log('⚠️  Warning: Some Q&A responses may still remain');
      console.log(`   Expected: 0, Found: ${afterCount}`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

cleanupQAData().catch(console.error);
