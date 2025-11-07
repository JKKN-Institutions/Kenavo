const {createClient}=require('@supabase/supabase-js');
const path=require('path');
require('dotenv').config({path:path.join(__dirname,'../.env.local')});
const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const {data,count} = await s.from('profiles').select('id,name,year_graduated',{count:'exact'}).order('id',{ascending:false}).limit(5);
  console.log('Total profiles:',count);
  console.log('\nLast 5 profiles:');
  data.forEach(p=>console.log(p.id + '. ' + p.name + ' - Year: ' + p.year_graduated));
}

check().then(()=>process.exit(0));
