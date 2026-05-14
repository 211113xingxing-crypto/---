import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);
async function main() {
  const { count: total } = await s.from('service_provider').select('id', { count: 'exact', head: true });
  const { count: active } = await s.from('service_provider').select('id', { count: 'exact', head: true }).eq('status', 'active');
  const { count: ind } = await s.from('service_provider').select('id', { count: 'exact', head: true }).eq('provider_type', 'individual');
  const { count: ag } = await s.from('service_provider').select('id', { count: 'exact', head: true }).eq('provider_type', 'agency');
  const { count: rev } = await s.from('review').select('id', { count: 'exact', head: true });
  const { count: cities } = await s.from('city').select('id', { count: 'exact', head: true }).eq('is_active', true);
  const { data: st } = await s.from('service_type').select('name,slug');
  console.log('Cities:', cities);
  console.log('Total providers:', total);
  console.log('  Active:', active);
  console.log('  Individual:', ind);
  console.log('  Agency:', ag);
  console.log('Total reviews:', rev);
  console.log('Service types:', (st??[]).map(t => t.slug).join(', '));
}
main();
