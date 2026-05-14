import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  const { data: st } = await s.from('service_type').select('id').eq('slug', 'yanglaoyuan').single();
  const { data: sh } = await s.from('city').select('id').eq('slug', 'shanghai').single();

  // Total yanglaoyuan junctions globally
  const { count: globalCount } = await s.from('provider_service_type')
    .select('id', { count: 'exact', head: true }).eq('service_type_id', st!.id);
  console.log('Global yanglaoyuan junctions:', globalCount);

  // Get Shanghai-specific: join provider_service_type with service_provider
  const { data: shProvs } = await s.from('service_provider')
    .select('id').eq('city_id', sh!.id).eq('status', 'active');
  const shIds = shProvs!.map(p => p.id);

  const { data: shJuncs } = await s.from('provider_service_type')
    .select('provider_id').eq('service_type_id', st!.id).in('provider_id', shIds);
  console.log('Shanghai yanglaoyuan junctions:', shJuncs!.length);

  // Sample 3 Shanghai yanglaoyuan providers
  if (shJuncs!.length > 0) {
    const sampleIds = shJuncs!.slice(0, 3).map(j => j.provider_id);
    const { data: samples } = await s.from('service_provider')
      .select('id,name,provider_type').in('id', sampleIds);
    console.log('Sample yanglaoyuan providers:', samples!.map(p => `${p.name} (${p.provider_type})`).join(', '));
  } else {
    console.log('NO Shanghai providers linked to yanglaoyuan!');
  }
}

main();
