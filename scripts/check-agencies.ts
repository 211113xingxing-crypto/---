import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  // Agency count per city
  const { data: cities } = await s.from('city').select('id,slug,name').eq('is_active', true).order('id');

  for (const city of cities ?? []) {
    const { count: agencyCount } = await s.from('service_provider')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id).eq('status', 'active').eq('provider_type', 'agency');
    const { count: indCount } = await s.from('service_provider')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id).eq('status', 'active').eq('provider_type', 'individual');
    if (agencyCount || indCount) {
      console.log(`${city.name}: ${agencyCount} agencies, ${indCount} individuals`);
    }
  }

  // Get service type IDs
  const { data: stList } = await s.from('service_type').select('id,slug');
  const yanglaoyuanId = stList!.find(s => s.slug === 'yanglaoyuan')!.id;

  // How many total yanglaoyuan junctions?
  const { data: ylJuncs } = await s.from('provider_service_type').select('provider_id').eq('service_type_id', yanglaoyuanId);
  const ylProviderIds = (ylJuncs ?? []).map(j => j.provider_id);

  if (ylProviderIds.length === 0) {
    console.log('\nZERO providers linked to yanglaoyuan globally!');
    return;
  }

  // Sample agencies that are linked to yanglaoyuan
  const sampleIds = ylProviderIds.slice(0, 10);
  const { data: samples } = await s.from('service_provider').select('id,name,provider_type,city_id').in('id', sampleIds);
  console.log(`\nSample yanglaoyuan providers (${ylProviderIds.length} total):`);
  for (const p of samples ?? []) {
    const city = cities!.find(c => c.id === p.city_id);
    console.log(`  ${p.name} (${p.provider_type}, ${city?.name ?? '?'})`);
  }
}

main();
