import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  const { data: sh } = await s.from('city').select('id').eq('slug', 'shanghai').single();
  const { data: agencies } = await s.from('service_provider')
    .select('id,name,bio').eq('city_id', sh!.id).eq('status', 'active')
    .eq('provider_type', 'agency').limit(30);

  console.log('Sample Shanghai agency names and bios:');
  for (const a of agencies ?? []) {
    console.log(`  [${a.id}] ${a.name}`);
    if (a.bio) console.log(`    bio: ${a.bio.slice(0, 80)}`);
  }
}

main();
