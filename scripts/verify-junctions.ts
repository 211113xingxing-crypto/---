import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  const { data: sh } = await s.from('city').select('id').eq('slug', 'shanghai').single();
  if (!sh) { console.log('Shanghai not found'); return; }

  const { data: provs } = await s.from('service_provider').select('id,name').eq('city_id', sh.id).eq('status', 'active');
  const provIds = provs!.map(p => p.id);

  const { data: juncs } = await s.from('provider_service_type').select('provider_id').in('provider_id', provIds);
  const hasJunc = new Set((juncs ?? []).map(j => j.provider_id));
  const missing = provs!.filter(p => !hasJunc.has(p.id));

  console.log('Shanghai active:', provs!.length);
  console.log('Have junctions:', hasJunc.size);
  console.log('Missing:', missing.length);
  if (missing.length > 0) {
    console.log('Missing names:', missing.map(p => p.name).join(', '));
  }

  // Also check service types
  const { data: stList } = await s.from('service_type').select('id,slug');
  console.log('\nService types:', stList!.map(s => s.slug).join(', '));

  // Check yanglaoyuan specifically for Shanghai
  const yanglaoyuan = stList!.find(s => s.slug === 'yanglaoyuan');
  if (yanglaoyuan) {
    const { count } = await s.from('provider_service_type').select('id', { count: 'exact', head: true })
      .eq('service_type_id', yanglaoyuan.id)
      .in('provider_id', provIds);
    console.log(`\nShanghai providers linked to yanglaoyuan: ${count}`);
  }
}

main();
