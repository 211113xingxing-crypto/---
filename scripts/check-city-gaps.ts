import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  const { data: cities } = await s.from('city').select('id,slug,name').eq('is_active', true).order('id');
  const { data: stList } = await s.from('service_type').select('id,slug');

  console.log('City\tAgencies\tIndiv.\tReviews\tDistricts\tCemeteries');
  console.log('─'.repeat(80));

  for (const city of cities ?? []) {
    const { count: ag } = await s.from('service_provider')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id).eq('status', 'active').eq('provider_type', 'agency');
    const { count: ind } = await s.from('service_provider')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id).eq('status', 'active').eq('provider_type', 'individual');
    // Count reviews for this city's providers
    const { data: provs } = await s.from('service_provider')
      .select('id').eq('city_id', city.id).eq('status', 'active');
    const provIds = (provs ?? []).map(p => p.id);

    let reviewCount = 0;
    if (provIds.length > 0) {
      // Batch check in chunks of 100
      for (let i = 0; i < provIds.length; i += 100) {
        const chunk = provIds.slice(i, i + 100);
        const { count } = await s.from('review')
          .select('id', { count: 'exact', head: true })
          .in('provider_id', chunk);
        reviewCount += count ?? 0;
      }
    }

    const { count: dist } = await s.from('district')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id).eq('level', 'district');

    // Count cemeteries (mudi-fuwu)
    const mudi = stList!.find(s => s.slug === 'mudi-fuwu');
    let cemeteryCount = 0;
    if (mudi && provIds.length > 0) {
      const { data: mj } = await s.from('provider_service_type')
        .select('provider_id').eq('service_type_id', mudi.id).in('provider_id', provIds);
      cemeteryCount = (mj ?? []).length;
    }

    const shortName = city.name.length > 6 ? city.name.slice(0, 6) : city.name.padEnd(6, '　');
    console.log(`${shortName}\t${ag}\t${ind}\t${reviewCount}\t${dist}\t${cemeteryCount}`);
  }
}

main();
