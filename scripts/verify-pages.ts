import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  // 1. Get all active cities
  const { data: cities } = await s.from('city').select('id,slug,name').eq('is_active', true);
  console.log(`=== Cities: ${cities?.length} ===`);
  
  // 2. Get all districts with their city
  const { data: districts } = await s.from('district').select('id,slug,name,city_id,level');
  console.log(`=== Districts: ${districts?.length} ===`);
  
  // Group districts by city
  const cityDistricts = new Map<number, typeof districts>();
  for (const d of districts ?? []) {
    const list = cityDistricts.get(d.city_id) || [];
    list.push(d);
    cityDistricts.set(d.city_id, list);
  }
  
  // 3. Get all service types
  const { data: serviceTypes } = await s.from('service_type').select('id,slug,name');
  console.log(`=== Service Types: ${serviceTypes?.length} ===`);
  for (const st of serviceTypes ?? []) console.log(`  ${st.slug} -> ${st.name}`);
  
  // 4. Check each city - does it have districts?
  console.log(`\n=== Cities WITHOUT districts ===`);
  for (const c of cities ?? []) {
    const ds = cityDistricts.get(c.id) || [];
    if (ds.length === 0) {
      console.log(`  ${c.slug} (${c.name}): 0 districts - all district links will 404`);
    }
  }
  
  // 5. Check district levels
  console.log(`\n=== District levels ===`);
  const levels = new Map<string, number>();
  for (const d of districts ?? []) {
    levels.set(d.level, (levels.get(d.level) || 0) + 1);
  }
  for (const [level, count] of levels) console.log(`  ${level}: ${count}`);
  
  // 6. Check provider_service_type junction coverage
  const { data: pst } = await s.from('provider_service_type').select('provider_id, service_type_id');
  const stMap = new Map((serviceTypes ?? []).map(st => [st.id, st.slug]));
  
  // For each city+serviceType combination, check if there are providers
  console.log(`\n=== Cities with NO providers per service type ===`);
  for (const st of serviceTypes ?? []) {
    for (const c of cities ?? []) {
      // Get providers in this city
      const { data: cityProviders } = await s.from('service_provider')
        .select('id').eq('city_id', c.id).eq('status', 'active');
      if (!cityProviders || cityProviders.length === 0) {
        console.log(`  /${c.slug}/${st.slug}: city has 0 providers`);
        continue;
      }
      
      // Check if any provider in this city has this service type
      const provIds = cityProviders.map(p => p.id);
      const matching = (pst ?? []).filter(
        r => provIds.includes(r.provider_id) && r.service_type_id === st.id
      );
      
      // This isn't necessarily a 404 - the page renders with 0 results but doesn't 404
      // It only 404s if the slug is neither district nor service type
    }
  }
  
  // 7. Key check: which [city]/[slug] combinations would 404
  // A slug 404s if it's NOT a district for that city AND NOT a service type
  console.log(`\n=== Potential 404 analysis ===`);
  console.log(`Service type slugs: ${(serviceTypes ?? []).map(s => s.slug).join(', ')}`);
  
  // Count how many cities have district coverage
  const citiesWithDistricts = (cities ?? []).filter(c => (cityDistricts.get(c.id) || []).length > 0);
  console.log(`Cities with districts: ${citiesWithDistricts.length}/${cities?.length}`);
  
  // 8. Show sample district slugs per city
  console.log(`\n=== Sample districts per city ===`);
  for (const c of (cities ?? []).slice(0, 10)) {
    const ds = (cityDistricts.get(c.id) || []).slice(0, 5).map(d => d.slug);
    console.log(`  ${c.slug}: [${ds.join(', ')}]`);
  }
  
  // 9. Check the actual provider distribution
  const { data: providers } = await s.from('service_provider').select('id,city_id').eq('status', 'active');
  const cityProvCount = new Map<number, number>();
  for (const p of providers ?? []) {
    cityProvCount.set(p.city_id, (cityProvCount.get(p.city_id) || 0) + 1);
  }
  console.log(`\n=== Providers per city (top 10) ===`);
  const sorted = [...cityProvCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const cityIdMap = new Map((cities ?? []).map(c => [c.id, c.slug]));
  for (const [cid, count] of sorted) {
    console.log(`  ${cityIdMap.get(cid) || '?'}: ${count}`);
  }
}
main();
