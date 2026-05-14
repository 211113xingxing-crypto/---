// Check how many real agencies offer hugong (home care) services
import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  const { data: stList } = await s.from('service_type').select('id,slug,name');
  const stMap = new Map(stList!.map(s => [s.id, s]));

  // Count agencies linked to each service type
  console.log('Service type distribution (agencies only):');
  console.log('');

  for (const st of stList ?? []) {
    const { data: juncs } = await s.from('provider_service_type')
      .select('provider_id').eq('service_type_id', st.id);

    if (!juncs || juncs.length === 0) {
      console.log(`  ${st.name} (${st.slug}): 0`);
      continue;
    }

    const provIds = [...new Set(juncs.map(j => j.provider_id))];

    // Count agencies among these
    let agencyCount = 0;
    for (let i = 0; i < provIds.length; i += 200) {
      const chunk = provIds.slice(i, i + 200);
      const { count } = await s.from('service_provider')
        .select('id', { count: 'exact', head: true })
        .in('id', chunk)
        .eq('provider_type', 'agency')
        .eq('status', 'active');
      agencyCount += count ?? 0;
    }

    const indCount = provIds.length - agencyCount;
    console.log(`  ${st.name} (${st.slug}): ${provIds.length} total (${agencyCount} agencies, ${indCount} individuals)`);
  }

  // Also verify: how many agencies have real phone numbers?
  console.log('\n\nAgencies with phone numbers:');
  const { count: totalAg } = await s.from('service_provider')
    .select('id', { count: 'exact', head: true })
    .eq('provider_type', 'agency').eq('status', 'active');
  const { count: withPhone } = await s.from('service_provider')
    .select('id', { count: 'exact', head: true })
    .eq('provider_type', 'agency').eq('status', 'active')
    .not('phone', 'is', null);
  console.log(`  Total agencies: ${totalAg}`);
  console.log(`  With phone: ${withPhone} (${((withPhone! / totalAg!) * 100).toFixed(1)}%)`);

  // Check individuals with real phone numbers
  const { count: totalInd } = await s.from('service_provider')
    .select('id', { count: 'exact', head: true })
    .eq('provider_type', 'individual').eq('status', 'active');
  const { count: indWithPhone } = await s.from('service_provider')
    .select('id', { count: 'exact', head: true })
    .eq('provider_type', 'individual').eq('status', 'active')
    .not('phone', 'is', null);
  console.log(`\n  Total individuals: ${totalInd}`);
  console.log(`  With phone: ${indWithPhone} (fake numbers)`);
}

main();
