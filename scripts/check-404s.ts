import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  // Check provider slugs
  const { data: providers } = await s.from('service_provider').select('id,slug,name,city_id').eq('status', 'active');
  console.log(`Total active providers: ${providers?.length}`);
  
  // Check for empty/null slugs
  const badSlugs = (providers ?? []).filter(p => !p.slug || p.slug.trim() === '');
  console.log(`Providers with empty slug: ${badSlugs.length}`);
  for (const p of badSlugs) console.log(`  id=${p.id} name=${p.name}`);
  
  // Check for duplicate slugs
  const slugMap = new Map<string, number[]>();
  for (const p of providers ?? []) {
    if (!p.slug) continue;
    const ids = slugMap.get(p.slug) || [];
    ids.push(p.id);
    slugMap.set(p.slug, ids);
  }
  const dupes = [...slugMap.entries()].filter(([_, ids]) => ids.length > 1);
  console.log(`\nDuplicate slugs: ${dupes.length}`);
  for (const [slug, ids] of dupes.slice(0, 10)) {
    console.log(`  ${slug}: ids=${ids.join(',')}`);
  }
  
  // Check if "guangdong" etc are in city table (this would cause route conflicts)
  const provinceSlugs = ['guangdong', 'henan', 'jiangsu', 'zhejiang', 'shandong'];
  const { data: provincesInCities } = await s.from('city').select('slug').in('slug', provinceSlugs);
  console.log(`\nProvince slugs that are ALSO in city table: ${provincesInCities?.length}`);
  for (const c of provincesInCities ?? []) console.log(`  ${c.slug} - THIS CAUSES ROUTE CONFLICT`);
  
  // Check each [city]/[serviceType] page: which service types have 0 results per city?
  const { data: serviceTypes } = await s.from('service_type').select('id,slug,name');
  const { data: cities } = await s.from('city').select('id,slug,name').eq('is_active', true);
  const { data: pst } = await s.from('provider_service_type').select('provider_id, service_type_id');
  
  console.log(`\n=== Cities with 0 providers for specific service types ===`);
  for (const c of cities ?? []) {
    const { data: cityProvs } = await s.from('service_provider').select('id').eq('city_id', c.id).eq('status', 'active');
    const cityProvIds = new Set((cityProvs ?? []).map(p => p.id));
    
    for (const st of serviceTypes ?? []) {
      const matching = (pst ?? []).filter(
        r => cityProvIds.has(r.provider_id) && r.service_type_id === st.id
      );
      if (matching.length === 0) {
        console.log(`  /${c.slug}/${st.slug}: 0 providers (shows empty state, won't 404)`);
      }
    }
  }
  
  // The REAL 404 test:
  // [city]/[slug] returns notFound() only when slug is NEITHER district NOR serviceType
  // So let's check for slugs that users might actually click
  console.log(`\n=== Checking actual link targets ===`);
  
  // For each city, what district links exist?
  const { data: districts } = await s.from('district').select('id,slug,name,city_id');
  const cityDistricts = new Map<number, Set<string>>();
  for (const d of districts ?? []) {
    const set = cityDistricts.get(d.city_id) || new Set();
    set.add(d.slug);
    cityDistricts.set(d.city_id, set);
  }
  
  // Check: do any cities have a service type slug that matches a district slug?
  // E.g. if a city has a district called "hugong", there'd be ambiguity
  const allServiceTypeSlugs = new Set((serviceTypes ?? []).map(s => s.slug));
  for (const c of cities ?? []) {
    const ds = cityDistricts.get(c.id) || new Set();
    for (const dSlug of ds) {
      if (allServiceTypeSlugs.has(dSlug)) {
        console.log(`  SLUG CONFLICT in ${c.slug}: "${dSlug}" is both district and service type!`);
      }
    }
  }
  
  // Actually, the REAL issue might be: new cities have NO districts at all
  // But they still have the district link section rendered on the city page
  // Wait - the city page checks `districts.length > 0` before rendering
  // So that shouldn't be the issue.

  // Let me check: what about the "按服务类型查找" links?
  // These are generated from serviceTypes which all exist in the DB
  // So `/${city}/${serviceType}` should work for all combinations
  
  // What about subSlug pages? `/${city}/${district}/${serviceType}`
  // These require district to exist. They're only linked from district pages.
  // Since district pages only show for cities WITH districts, this should be fine.
  
  console.log(`\n=== Checking provider detail pages ===`);
  // All provider links: /provider/${provider.slug}
  const { data: provSlugs } = await s.from('service_provider').select('slug').eq('status', 'active');
  console.log(`Total provider slugs: ${provSlugs?.length}`);
  
  // Check for slugs with special characters that might break URLs
  const badChars = (providers ?? []).filter(p => p.slug && /[^a-z0-9\-]/.test(p.slug));
  console.log(`Slugs with non-standard chars: ${badChars.length}`);
  for (const p of badChars.slice(0, 5)) console.log(`  ${p.slug}`);
}
main();
