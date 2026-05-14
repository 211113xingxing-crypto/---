import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function fetchAll<T>(query: ReturnType<typeof s.from>, batchSize = 1000): Promise<T[]> {
  const results: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await query.range(from, from + batchSize - 1);
    if (error) { console.error('Fetch error:', error); break; }
    if (!data || data.length === 0) break;
    results.push(...(data as T[]));
    if (data.length < batchSize) break;
    from += batchSize;
  }
  return results;
}

async function main() {
  const providers = await fetchAll<{id: number; name: string; slug: string; city_id: number}>(
    s.from('service_provider').select('id,name,slug,city_id').eq('status', 'active')
  );
  console.log(`Total active providers: ${providers.length}`);
  
  // Check for empty/null slugs
  const emptySlugs = providers.filter(p => !p.slug || p.slug.trim() === '');
  console.log(`\nEmpty/null slugs: ${emptySlugs.length}`);
  if (emptySlugs.length > 0) {
    for (const p of emptySlugs.slice(0, 20)) console.log(`  id=${p.id} name=${p.name}`);
  }
  
  // Check for slugs with special/problematic characters
  const problematic: Array<{id: number; name: string; slug: string; issue: string}> = [];
  for (const p of providers) {
    if (!p.slug) continue;
    // Check for spaces
    if (/\s/.test(p.slug)) problematic.push({...p, issue: 'contains whitespace'});
    // Check for URL-unsafe chars (beyond common Chinese/English)
    else if (/[<>"#%{}|\^~\[\]`]/.test(p.slug)) problematic.push({...p, issue: 'contains special chars'});
    // Check for consecutive dashes
    else if (/--/.test(p.slug)) problematic.push({...p, issue: 'double dash'});
    // Check for leading/trailing dashes
    else if (/^-|-$/.test(p.slug)) problematic.push({...p, issue: 'leading/trailing dash'});
  }
  console.log(`\nProblematic slugs: ${problematic.length}`);
  for (const p of problematic.slice(0, 20)) console.log(`  ${p.slug} (${p.issue})`);
  
  // Check for duplicate slugs
  const slugMap = new Map<string, number[]>();
  for (const p of providers) {
    if (!p.slug) continue;
    const ids = slugMap.get(p.slug) || [];
    ids.push(p.id);
    slugMap.set(p.slug, ids);
  }
  const dupes = [...slugMap.entries()].filter(([_, ids]) => ids.length > 1);
  console.log(`\nDuplicate slugs: ${dupes.length}`);
  for (const [slug, ids] of dupes.slice(0, 20)) console.log(`  ${slug}: ${ids.length} providers (ids: ${ids.join(',')})`);
  
  // Check slug pattern distribution
  const patterns: Record<string, number> = {};
  for (const p of providers) {
    if (!p.slug) continue;
    if (/^[a-z0-9\-]+$/.test(p.slug)) patterns['ascii-only'] = (patterns['ascii-only'] || 0) + 1;
    else if (/[一-鿿]/.test(p.slug)) patterns['contains-chinese'] = (patterns['contains-chinese'] || 0) + 1;
    else patterns['other'] = (patterns['other'] || 0) + 1;
  }
  console.log(`\nSlug patterns:`);
  for (const [k, v] of Object.entries(patterns)) console.log(`  ${k}: ${v}`);
  
  // Check for very long slugs
  const longSlugs = providers.filter(p => p.slug && p.slug.length > 100);
  console.log(`\nVery long slugs (>100 chars): ${longSlugs.length}`);
  for (const p of longSlugs.slice(0, 5)) console.log(`  ${p.slug} (${p.slug.length} chars)`);
}
main();
