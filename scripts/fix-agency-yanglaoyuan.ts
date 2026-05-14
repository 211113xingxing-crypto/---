// Add yanglaoyuan junction for all agency providers that don't have one
// Usage: npx tsx scripts/fix-agency-yanglaoyuan.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xcfwdwmqrdtchnckutoc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ';

async function fetchAll(query: (from: number, limit: number) => Promise<any[]>) {
  const all: any[] = [];
  let from = 0;
  const limit = 1000;
  while (true) {
    const data = await query(from, limit);
    if (data.length === 0) break;
    all.push(...data);
    if (data.length < limit) break;
    from += limit;
  }
  return all;
}

async function main() {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);

  // Get yanglaoyuan service type ID
  const { data: yl } = await s.from('service_type').select('id').eq('slug', 'yanglaoyuan').single();
  if (!yl) { console.log('yanglaoyuan service type not found'); return; }
  const ylId = yl.id;

  // Get all agency IDs
  const agencies = await fetchAll(async (from, limit) => {
    const { data } = await s.from('service_provider')
      .select('id,name').eq('status', 'active').eq('provider_type', 'agency')
      .range(from, from + limit - 1).order('id');
    return data ?? [];
  });
  console.log(`Total active agencies: ${agencies.length}`);

  // Get all existing yanglaoyuan junctions
  const existingJuncs = await fetchAll(async (from, limit) => {
    const { data } = await s.from('provider_service_type')
      .select('provider_id').eq('service_type_id', ylId)
      .range(from, from + limit - 1);
    return data ?? [];
  });
  const hasYl = new Set(existingJuncs.map(j => j.provider_id));
  console.log(`Agencies already linked to yanglaoyuan: ${hasYl.size}`);

  // Find agencies missing yanglaoyuan
  const missing = agencies.filter(a => !hasYl.has(a.id));
  console.log(`Agencies missing yanglaoyuan: ${missing.length}`);

  if (missing.length === 0) {
    console.log('All agencies have yanglaoyuan. Done.');
    return;
  }

  // Insert in batches
  const inserts = missing.map(a => ({ provider_id: a.id, service_type_id: ylId }));
  let inserted = 0;
  const batchSize = 200;
  for (let i = 0; i < inserts.length; i += batchSize) {
    const batch = inserts.slice(i, i + batchSize);
    const { error } = await s.from('provider_service_type').upsert(batch, {
      onConflict: 'provider_id,service_type_id',
      ignoreDuplicates: true,
    });
    if (error) {
      console.error(`Batch ${i} error:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  Inserted ${inserted}/${missing.length}...`);
    }
  }

  console.log(`Done. Added yanglaoyuan to ${inserted} agencies.`);
}

main();
