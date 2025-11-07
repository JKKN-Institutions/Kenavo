const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, year_graduated, company, current_job, location, updated_at')
    .order('id');

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('Total profiles:', data.length);
  
  // Group by exact name match (case-sensitive)
  const exactNames = {};
  data.forEach(p => {
    const key = p.name;
    if (!exactNames[key]) exactNames[key] = [];
    exactNames[key].push(p);
  });

  const exactDups = Object.entries(exactNames).filter(([_, profiles]) => profiles.length > 1);
  
  console.log('\n=== EXACT NAME DUPLICATES (case-sensitive) ===');
  console.log('Duplicate groups:', exactDups.length);
  
  if (exactDups.length > 0) {
    exactDups.forEach(([name, profiles]) => {
      console.log('\n"' + name + '" (' + profiles.length + ' profiles):');
      profiles.forEach(p => {
        console.log('  ID ' + p.id + ': Year=' + (p.year_graduated || 'none') + 
                    ', Company=' + (p.company || 'none') + 
                    ', Job=' + (p.current_job || 'none') +
                    ', Updated=' + p.updated_at);
      });
    });
  }

  // Check for profiles with very similar IDs (like 1-134 and 135+)
  const beforeId135 = data.filter(p => p.id < 135);
  const afterId135 = data.filter(p => p.id >= 135);
  
  console.log('\n=== ID DISTRIBUTION ===');
  console.log('Profiles with ID < 135:', beforeId135.length);
  console.log('Profiles with ID >= 135:', afterId135.length);
  
  if (afterId135.length > 0) {
    console.log('\nProfiles with ID >= 135:');
    afterId135.forEach(p => {
      console.log('  ID ' + p.id + ': "' + p.name + '" (Year: ' + (p.year_graduated || 'none') + ')');
    });
  }
  
  process.exit(0);
}

checkAllProfiles();
