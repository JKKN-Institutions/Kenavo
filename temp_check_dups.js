const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDups() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, year_graduated')
    .order('name');

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('Total profiles:', data.length);
  
  const names = {};
  data.forEach(p => {
    const key = p.name.toLowerCase().trim();
    if (!names[key]) names[key] = [];
    names[key].push(p);
  });

  const dups = Object.entries(names).filter(([_, profiles]) => profiles.length > 1);
  
  console.log('\nProfiles with same name (case-insensitive):');
  console.log('Duplicate name groups:', dups.length);
  
  if (dups.length > 0) {
    dups.forEach(([name, profiles]) => {
      console.log('\n"' + name + '" (' + profiles.length + ' profiles):');
      profiles.forEach(p => {
        console.log('  ID ' + p.id + ': "' + p.name + '" (' + (p.year_graduated || 'no year') + ')');
      });
    });
  }
  
  process.exit(0);
}

checkDups();
