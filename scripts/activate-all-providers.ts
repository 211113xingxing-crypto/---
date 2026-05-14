// Activate ALL pending providers so they show on the frontend
// Usage: npx tsx scripts/activate-all-providers.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xcfwdwmqrdtchnckutoc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ';

async function main() {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);

  // Get count
  const { count: pendingCount } = await s
    .from('service_provider')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');
  console.log(`Pending providers: ${pendingCount}`);

  if (!pendingCount) {
    console.log('Nothing to do.');
    return;
  }

  // Update in batches of 500
  let updated = 0;
  const batchSize = 500;

  while (updated < pendingCount) {
    const { data: batch } = await s
      .from('service_provider')
      .select('id')
      .eq('status', 'pending')
      .limit(batchSize);

    if (!batch?.length) break;

    const ids = batch.map(p => p.id);
    const { error } = await s
      .from('service_provider')
      .update({ status: 'active' })
      .in('id', ids);

    if (error) {
      console.error('Update error:', error);
      break;
    }

    updated += ids.length;
    console.log(`  Activated ${updated}/${pendingCount}`);
  }

  console.log(`Done. ${updated} providers activated.`);
}

main();
