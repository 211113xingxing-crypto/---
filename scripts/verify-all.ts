import { createClient } from '@supabase/supabase-js';
const s = createClient('https://xcfwdwmqrdtchnckutoc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ');
async function main() {
  const { data: mudi } = await s.from('service_type').select('id').eq('slug', 'mudi-fuwu').single();
  const { data: j } = await s.from('provider_service_type').select('provider_id').eq('service_type_id', mudi!.id);
  const ids = [...new Set((j ?? []).map(r => r.provider_id))];
  const { data: provs } = await s.from('service_provider').select('id,name,city_id').in('id', ids).eq('status', 'active');
  const { data: cities } = await s.from('city').select('id,slug');
  const cityMap = new Map((cities ?? []).map(c => [c.id, c.slug]));
  const perCity: Record<string, number> = {};
  for (const p of provs ?? []) { const cs = cityMap.get(p.city_id) || '?'; perCity[cs] = (perCity[cs] || 0) + 1; }
  console.log(`Cemetery providers: ${provs!.length} across ${Object.keys(perCity).length} cities`);
  for (const [city, n] of Object.entries(perCity)) console.log(`  ${city}: ${n}`);
  const { count: total } = await s.from('service_provider').select('id', { count: 'exact', head: true }).eq('status', 'active');
  console.log(`\nTotal active providers: ${total}`);
}
main();
