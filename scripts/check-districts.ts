import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
async function main() {
  const { data: cities } = await s.from('city').select('id, name, slug').order('name');
  for (const c of cities || []) {
    const { count, error } = await s.from('district').select('id', { count: 'exact', head: true }).eq('city_id', c.id);
    console.log(`${c.slug.padEnd(20)} ${c.name.padEnd(8)} ${(count ?? 0).toString().padStart(3)} districts${error ? ' ERR:'+error.message : ''}`);
  }
}
main();
