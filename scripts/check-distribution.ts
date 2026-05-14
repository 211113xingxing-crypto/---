import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'sb_publishable_CGU-BxL8qvbyrL3d-SJE9g_eFTXtBtL'
);
async function main() {
  const { data: cities } = await s.from('city').select('id,name,slug,is_active');
  const m = new Map((cities ?? []).map(c => [c.id, c]));

  const { data: providers } = await s.from('service_provider').select('city_id, provider_type, status');
  const groups: Record<number, { active: number; pending: number; individual: number; agency: number }> = {};

  for (const p of providers ?? []) {
    if (!groups[p.city_id]) groups[p.city_id] = { active: 0, pending: 0, individual: 0, agency: 0 };
    const g = groups[p.city_id];
    if (p.status === 'active') g.active++;
    else g.pending++;
    if (p.provider_type === 'individual') g.individual++;
    else g.agency++;
  }

  console.log('City'.padEnd(14), 'Total'.padStart(6), 'Active'.padStart(7), 'Pending'.padStart(8), '个体'.padStart(5), '机构'.padStart(6));
  console.log('-'.repeat(50));
  let grandTotal = 0;
  for (const [id, g] of Object.entries(groups).sort((a,b) => (b[1].active+b[1].pending) - (a[1].active+a[1].pending))) {
    const city = m.get(Number(id));
    const name = city?.name ?? `id=${id}`;
    const cityTotal = g.active + g.pending;
    console.log(name.padEnd(14), String(cityTotal).padStart(6), String(g.active).padStart(7), String(g.pending).padStart(8), String(g.individual).padStart(5), String(g.agency).padStart(6));
    grandTotal += cityTotal;
  }
  console.log('-'.repeat(50));
  console.log('Total:', providers?.length ?? 0);
}
main();
