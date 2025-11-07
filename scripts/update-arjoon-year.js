/**
 * Update A Arjoon's year to 1993-2000
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateArjoon() {
  console.log('Updating A Arjoon year from "2000" to "1993-2000"...\n');

  const { data, error } = await supabase
    .from('profiles')
    .update({ year_graduated: '1993-2000' })
    .eq('id', 1)
    .select();

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('✓ Successfully updated!');
  console.log('\nProfile:', data[0]);
  console.log(`\nYear Graduated: ${data[0].year_graduated}`);
}

updateArjoon()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
