// Delete all fake individual caregivers and their associated data
// Usage: npx tsx scripts/delete-fake-individuals.ts
import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  // Get all individual providers
  const { data: individuals } = await s.from('service_provider')
    .select('id,name').eq('provider_type', 'individual').eq('status', 'active');

  if (!individuals || individuals.length === 0) {
    console.log('No individual caregivers found.');
    return;
  }

  console.log(`Found ${individuals.length} individual caregivers to delete`);

  const ids = individuals.map(p => p.id);

  // Delete in order: reviews → service_listing → provider_service_type → service_provider
  const steps = [
    { table: 'review', col: 'provider_id', label: 'reviews' },
    { table: 'service_listing', col: 'provider_id', label: 'service listings' },
    { table: 'provider_service_type', col: 'provider_id', label: 'provider_service_type junctions' },
  ];

  for (const step of steps) {
    let deleted = 0;
    for (let i = 0; i < ids.length; i += 100) {
      const chunk = ids.slice(i, i + 100);
      const { error } = await s.from(step.table).delete().in(step.col, chunk);
      if (error) {
        console.error(`  Error deleting ${step.label}: ${error.message}`);
      } else {
        deleted += chunk.length;
      }
    }
    console.log(`  Deleted ${step.label} for ${individuals.length} providers`);
  }

  // Finally delete the providers themselves
  let providerDeleted = 0;
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const { error } = await s.from('service_provider').delete().in('id', chunk);
    if (error) {
      console.error(`  Error deleting providers: ${error.message}`);
    } else {
      providerDeleted += chunk.length;
    }
  }
  console.log(`  Deleted ${providerDeleted} individual caregiver providers`);

  // Verify
  const { count: remaining } = await s.from('service_provider')
    .select('id', { count: 'exact', head: true })
    .eq('provider_type', 'individual').eq('status', 'active');
  console.log(`\nRemaining individuals: ${remaining}`);

  const { count: total } = await s.from('service_provider')
    .select('id', { count: 'exact', head: true }).eq('status', 'active');
  console.log(`Total active providers: ${total}`);
}

main();
