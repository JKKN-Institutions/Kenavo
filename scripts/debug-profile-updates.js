require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugProfileUpdates() {
  console.log('🔍 Debugging Profile Update Issues...\n');

  try {
    // 1. Check for profiles with old updated_at timestamps
    console.log('1️⃣ Checking for stale profiles (not updated recently)...');
    const { data: allProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, name, updated_at, created_at')
      .order('updated_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError);
      return;
    }

    console.log(`📊 Total profiles: ${allProfiles.length}\n`);

    // Group by update age
    const now = new Date();
    const groups = {
      veryOld: [], // > 7 days
      old: [],     // 1-7 days
      recent: [],  // < 1 day
    };

    allProfiles.forEach(profile => {
      const updatedAt = new Date(profile.updated_at);
      const ageInDays = (now - updatedAt) / (1000 * 60 * 60 * 24);

      if (ageInDays > 7) {
        groups.veryOld.push({ ...profile, ageInDays: Math.floor(ageInDays) });
      } else if (ageInDays > 1) {
        groups.old.push({ ...profile, ageInDays: Math.floor(ageInDays) });
      } else {
        groups.recent.push({ ...profile, ageInDays: ageInDays.toFixed(2) });
      }
    });

    console.log(`📅 Profile Update Age Distribution:`);
    console.log(`   • Very Old (>7 days): ${groups.veryOld.length} profiles`);
    console.log(`   • Old (1-7 days): ${groups.old.length} profiles`);
    console.log(`   • Recent (<1 day): ${groups.recent.length} profiles\n`);

    if (groups.veryOld.length > 0) {
      console.log(`⚠️  ${groups.veryOld.length} profiles haven't been updated in over a week:`);
      groups.veryOld.slice(0, 10).forEach(p => {
        console.log(`   • ID ${p.id}: ${p.name} (${p.ageInDays} days old)`);
      });
      if (groups.veryOld.length > 10) {
        console.log(`   ... and ${groups.veryOld.length - 10} more`);
      }
      console.log();
    }

    // 2. Check for profiles with missing or null data
    console.log('2️⃣ Checking for profiles with incomplete data...');
    const { data: incompleteProfiles, error: incompleteError } = await supabase
      .from('profiles')
      .select('id, name, email, phone, location, year_graduated, current_job, company, bio')
      .or('email.is.null,location.is.null,year_graduated.is.null');

    if (incompleteError) {
      console.error('❌ Error fetching incomplete profiles:', incompleteError);
    } else {
      console.log(`📉 Profiles with missing data: ${incompleteProfiles.length}`);
      if (incompleteProfiles.length > 0) {
        incompleteProfiles.slice(0, 5).forEach(p => {
          const missing = [];
          if (!p.email) missing.push('email');
          if (!p.phone) missing.push('phone');
          if (!p.location) missing.push('location');
          if (!p.year_graduated) missing.push('year');
          if (!p.current_job) missing.push('job');
          if (!p.company) missing.push('company');
          if (!p.bio) missing.push('bio');
          console.log(`   • ID ${p.id}: ${p.name} - Missing: ${missing.join(', ')}`);
        });
        if (incompleteProfiles.length > 5) {
          console.log(`   ... and ${incompleteProfiles.length - 5} more`);
        }
      }
      console.log();
    }

    // 3. Check for duplicate names (potential update confusion)
    console.log('3️⃣ Checking for duplicate profile names...');
    const nameCount = {};
    allProfiles.forEach(p => {
      const normalizedName = p.name.toLowerCase().trim();
      if (!nameCount[normalizedName]) {
        nameCount[normalizedName] = [];
      }
      nameCount[normalizedName].push(p);
    });

    const duplicates = Object.entries(nameCount).filter(([_, profiles]) => profiles.length > 1);
    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} duplicate names:`);
      duplicates.slice(0, 5).forEach(([name, profiles]) => {
        console.log(`   • "${name}" appears ${profiles.length} times:`);
        profiles.forEach(p => {
          console.log(`     - ID ${p.id} (updated: ${new Date(p.updated_at).toLocaleString()})`);
        });
      });
      if (duplicates.length > 5) {
        console.log(`   ... and ${duplicates.length - 5} more duplicate names`);
      }
    } else {
      console.log('✅ No duplicate names found');
    }
    console.log();

    // 4. Test actual update on a sample profile
    console.log('4️⃣ Testing live update on first profile...');
    const testProfile = allProfiles[0];
    console.log(`   Testing with: ID ${testProfile.id} - ${testProfile.name}`);

    const { data: updateResult, error: updateError } = await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', testProfile.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update test FAILED:', updateError.message);
      console.log('   This indicates a database permission or constraint issue!');
    } else {
      console.log('✅ Update test PASSED');
      console.log(`   Old timestamp: ${testProfile.updated_at}`);
      console.log(`   New timestamp: ${updateResult.updated_at}`);
    }
    console.log();

    // 5. Summary and Recommendations
    console.log('📋 SUMMARY & RECOMMENDATIONS:\n');

    if (duplicates.length > 0) {
      console.log('⚠️  ISSUE: Duplicate profile names detected');
      console.log('   → This can cause confusion when updating profiles');
      console.log('   → Recommendation: Merge or differentiate duplicate profiles\n');
    }

    if (groups.veryOld.length > 50) {
      console.log('⚠️  ISSUE: Many profiles have very old timestamps');
      console.log('   → This suggests bulk updates may not be working correctly');
      console.log('   → Recommendation: Check bulk update script\n');
    }

    if (updateError) {
      console.log('❌ CRITICAL: Database update test failed!');
      console.log('   → Check RLS policies and permissions');
      console.log('   → Run: scripts/fix-rls-policies.js\n');
    } else {
      console.log('✅ Database updates are working correctly');
      console.log('   → Issue is likely on the frontend (caching)\n');
    }

    console.log('🔧 NEXT STEPS:');
    console.log('1. Clear browser cache and hard refresh (Ctrl+Shift+R)');
    console.log('2. Check if admin panel is using cached responses');
    console.log('3. Verify revalidation is working after profile updates');
    console.log('4. Run: node scripts/verify-profile-consistency.js\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugProfileUpdates();
