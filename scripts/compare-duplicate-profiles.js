const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function compareProfiles() {
  console.log('🔍 Comparing profiles with same slug but different years...\n');

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .in('id', [3, 135, 5, 136, 15, 137])
    .order('id');

  if (!data) {
    console.log('No data found');
    return;
  }

  const groups = [
    [3, 135],   // A S Syed Ahamed Khan
    [5, 136],   // Abishek Valluru
    [15, 137]   // Annadurai S.V
  ];

  groups.forEach(ids => {
    const profiles = data.filter(p => ids.includes(p.id));
    if (profiles.length < 2) return;

    console.log('='.repeat(80));
    console.log(`\n📝 NAME: ${profiles[0].name}\n`);

    profiles.forEach((p, idx) => {
      console.log(`Profile ${idx + 1}:`);
      console.log(`  ID: ${p.id}`);
      console.log(`  Name: ${p.name}`);
      console.log(`  Year Graduated: ${p.year_graduated || 'N/A'}`);
      console.log(`  Company: ${p.company || 'N/A'}`);
      console.log(`  Job: ${p.current_job || 'N/A'}`);
      console.log(`  Location: ${p.location || 'N/A'}`);
      console.log(`  Nickname: ${p.nicknames || 'N/A'}`);
      console.log(`  Updated: ${p.updated_at}`);

      // Calculate data completeness
      const score = (p.company ? 1 : 0) + (p.current_job ? 1 : 0) + (p.location ? 1 : 0);
      console.log(`  Data Score: ${score}/3`);
      console.log('');
    });

    // Recommendation
    const best = profiles.reduce((a, b) => {
      const scoreA = (a.company ? 1 : 0) + (a.current_job ? 1 : 0) + (a.location ? 1 : 0);
      const scoreB = (b.company ? 1 : 0) + (b.current_job ? 1 : 0) + (b.location ? 1 : 0);
      if (scoreB > scoreA) return b;
      if (scoreB === scoreA) return new Date(b.updated_at) > new Date(a.updated_at) ? b : a;
      return a;
    });

    console.log(`💡 RECOMMENDATION: Keep ID ${best.id} (most complete/recent data)`);
    console.log(`   Action: Merge or delete ID ${profiles.find(p => p.id !== best.id).id}\n`);
  });

  console.log('='.repeat(80));
  console.log('\n⚠️  ANALYSIS:');
  console.log('   These profiles have SAME names but DIFFERENT graduation years.');
  console.log('   Two possibilities:');
  console.log('   1. They are the SAME person with incorrect year data → Merge/delete one');
  console.log('   2. They are DIFFERENT people with same name → Keep both\n');
  console.log('   Check your source CSV to determine which is correct!\n');
}

compareProfiles()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
