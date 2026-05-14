import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  const { data: sh } = await s.from('city').select('id').eq('slug','shanghai').single();
  if (!sh) { console.error('Shanghai not found'); return; }

  // Counts
  const { count: total } = await s.from('service_provider').select('id',{count:'exact',head:true}).eq('city_id',sh.id).eq('status','active');
  const { count: withDistrict } = await s.from('service_provider').select('id',{count:'exact',head:true}).eq('city_id',sh.id).eq('status','active').not('district_id','is',null);
  const { count: nullDistrict } = await s.from('service_provider').select('id',{count:'exact',head:true}).eq('city_id',sh.id).eq('status','active').is('district_id',null);

  console.log('Shanghai active providers:', total);
  console.log('  Has district_id:', withDistrict);
  console.log('  district_id is NULL:', nullDistrict);

  // Check districts
  const { data: dists } = await s.from('district').select('id,name,slug').eq('city_id',sh.id).eq('level','district');
  console.log('Districts:', (dists??[]).map(d => `${d.slug}(${d.id})`).join(', '));

  // Check service type junctions
  const { data: providers } = await s.from('service_provider').select('id,name,provider_type,district_id').eq('city_id',sh.id).eq('status','active').limit(10);
  console.log('\nSample Shanghai providers:');
  for (const p of providers??[]) {
    const { data: j } = await s.from('provider_service_type').select('service_type_id').eq('provider_id', p.id);
    const stIds = (j??[]).map(r => r.service_type_id).join(',');
    console.log(`  ${p.name} (${p.provider_type}, d=${p.district_id}, st=[${stIds}])`);
  }

  // Count providers without service type junctions
  const { data: allProviders } = await s.from('service_provider').select('id').eq('city_id',sh.id).eq('status','active');
  let noJunction = 0;
  for (const p of allProviders??[]) {
    const { count } = await s.from('provider_service_type').select('id',{count:'exact',head:true}).eq('provider_id', p.id);
    if (!count) noJunction++;
  }
  console.log('\nProviders without service_type junction:', noJunction);
}

main();
