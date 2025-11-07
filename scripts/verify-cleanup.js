const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyCleanup() {
  console.log('=== VERIFYING DATABASE CLEANUP ===\n');

  try {
    // 1. Check profiles table
    console.log('1️⃣  Checking profiles table...\n');

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    const { count: totalProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    console.log(`Total profiles: ${totalProfiles}`);
    console.log('');

    // Check if all fields are cleared (except id and name)
    let fieldsCleared = true;
    const fieldsToCheck = [
      'email', 'phone', 'location', 'year_graduated',
      'current_job', 'company', 'bio', 'linkedin_url',
      'nicknames', 'profile_image_url'
    ];

    profiles.forEach(profile => {
      fieldsToCheck.forEach(field => {
        if (profile[field] !== null) {
          fieldsCleared = false;
        }
      });
    });

    if (fieldsCleared) {
      console.log('✅ All profile fields cleared (except id and name)');
    } else {
      console.log('⚠️  Some profile fields still have values');

      // Show which profiles still have data
      console.log('\nProfiles with remaining data:');
      profiles.forEach(profile => {
        const hasData = fieldsToCheck.some(field => profile[field] !== null);
        if (hasData) {
          console.log(`  - ID ${profile.id}: ${profile.name}`);
          fieldsToCheck.forEach(field => {
            if (profile[field] !== null) {
              console.log(`    ${field}: ${profile[field]}`);
            }
          });
        }
      });
    }

    // Show sample profiles
    console.log('\nSample profiles (first 5):');
    console.log('─'.repeat(80));
    profiles.slice(0, 5).forEach(p => {
      console.log(`ID: ${p.id} | Name: ${p.name}`);
      console.log(`  All other fields: ${fieldsToCheck.every(f => p[f] === null) ? 'NULL ✅' : 'HAS DATA ⚠️'}`);
    });
    console.log('');

    // 2. Check Q&A answers table (profile_answers)
    console.log('\n2️⃣  Checking profile_answers table...\n');

    const { count: qaCount, error: qaError } = await supabase
      .from('profile_answers')
      .select('*', { count: 'exact', head: true });

    if (qaError) {
      console.error('❌ Error checking Q&A answers:', qaError);
      console.log('   Table might not exist or might be named differently');
    } else {
      console.log(`Q&A answers in database: ${qaCount}`);

      if (qaCount === 0) {
        console.log('✅ Q&A answers table is empty');
      } else {
        console.log('⚠️  Q&A answers still exist in database');

        const { data: sampleQA } = await supabase
          .from('profile_answers')
          .select('id, profile_id, question_id')
          .limit(5);

        console.log('\nSample Q&A answers:');
        sampleQA?.forEach(qa => {
          console.log(`  - ID ${qa.id}: Profile ${qa.profile_id}, Question ${qa.question_id}`);
        });
      }
    }

    // Also check profile_questions (should remain intact)
    const { count: questionsCount } = await supabase
      .from('profile_questions')
      .select('*', { count: 'exact', head: true });

    console.log(`\nProfile questions (master): ${questionsCount} (should be 10)`);
    if (questionsCount === 10) {
      console.log('✅ Master questions preserved');
    } else {
      console.log('⚠️  Master questions count unexpected');
    }

    // 3. Check year_graduated column format
    console.log('\n3️⃣  Checking year_graduated column format...\n');

    const { data: columnInfo, error: columnError } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT column_name, data_type, character_maximum_length
          FROM information_schema.columns
          WHERE table_name = 'profiles' AND column_name = 'year_graduated'
        `
      });

    if (columnError) {
      console.log('⚠️  Could not verify column format (RPC function may not exist)');
      console.log('   Manual check: Run this SQL in Supabase SQL Editor:');
      console.log('   SELECT column_name, data_type, character_maximum_length');
      console.log('   FROM information_schema.columns');
      console.log('   WHERE table_name = \'profiles\' AND column_name = \'year_graduated\';');
    } else if (columnInfo && columnInfo.length > 0) {
      const col = columnInfo[0];
      console.log(`Column: ${col.column_name}`);
      console.log(`Type: ${col.data_type}`);
      console.log(`Max Length: ${col.character_maximum_length}`);

      if (col.character_maximum_length >= 20) {
        console.log('✅ Column can accept batch year format (e.g., "1993-2000")');
      } else {
        console.log('⚠️  Column may be too short for batch year format');
      }
    }

    // 4. Final Summary
    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log('─'.repeat(80));
    console.log(`Profiles in database: ${totalProfiles}`);
    console.log(`Profile fields cleared: ${fieldsCleared ? 'YES ✅' : 'NO ⚠️'}`);
    console.log(`Q&A answers deleted: ${qaError ? 'UNKNOWN ⚠️' : (qaCount === 0 ? 'YES ✅' : 'NO ⚠️')}`);
    console.log(`Master questions preserved: ${questionsCount === 10 ? 'YES ✅' : 'NO ⚠️'}`);
    console.log('');

    const cleanupComplete = fieldsCleared && (!qaError && qaCount === 0) && (questionsCount === 10);

    if (cleanupComplete) {
      console.log('✅ DATABASE CLEANUP SUCCESSFUL!');
      console.log('✅ Ready for fresh data upload');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Run year_graduated migration in Supabase SQL Editor (see CLEANUP_STEPS.md)');
      console.log('  2. Upload complete slambook CSV with all details + Q&A');
      console.log('  3. Use year format like "1993-2000" for batch years');
      console.log('  4. Upload profile images via bulk ZIP upload');
    } else {
      console.log('⚠️  CLEANUP INCOMPLETE - Please review warnings above');
      console.log('');
      if (!fieldsCleared) {
        console.log('❌ Profile fields not cleared - Run: node scripts/cleanup-profile-data.js');
      }
      if (!qaError && qaCount > 0) {
        console.log('❌ Q&A answers not deleted - Run: node scripts/cleanup-qa-answers.js');
      }
      if (qaError) {
        console.log('⚠️  Could not check Q&A answers table - See CLEANUP_STEPS.md for SQL commands');
      }
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

verifyCleanup().catch(console.error);
