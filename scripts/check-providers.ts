import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
async function main() {
  const { count } = await s.from('service_provider').select('id', { count: 'exact', head: true });
  const { count: c2 } = await s.from('service_provider').select('id', { count: 'exact', head: true }).eq('provider_type', 'individual');
  const { count: c3 } = await s.from('service_provider').select('id', { count: 'exact', head: true }).eq('provider_type', 'agency');
  console.log('Total providers:', count);
  console.log('Individuals:', c2);
  console.log('Agencies:', c3);
}
main();
