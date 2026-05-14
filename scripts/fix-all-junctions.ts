import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

const SERVICE_KEYWORD_MAP: Record<string, string> = {
  '居家护理': 'hugong', '上门护理': 'hugong', '护工': 'hugong', '居家养老': 'hugong',
  '居家照护': 'hugong', '全天照护': 'hugong', '半天照护': 'hugong', '上门服务': 'hugong',
  '生活照料': 'hugong', '个人护理': 'hugong', '起居照料': 'hugong',
  '洗澡': 'hugong', '翻身拍背': 'hugong', '喂食': 'hugong',
  '鼻饲护理': 'hugong', '压疮护理': 'hugong', '褥疮护理': 'hugong', '大小便护理': 'hugong',
  '陪诊': 'peizhen', '就医陪诊': 'peizhen', '医院陪护': 'peizhen', '就医陪同': 'peizhen',
  '陪同就医': 'peizhen', '陪同看病': 'peizhen', '代挂号': 'peizhen', '代取药': 'peizhen', '排队取药': 'peizhen',
  '日间照料': 'rijian-zhaoliao', '日托': 'rijian-zhaoliao', '日间照护': 'rijian-zhaoliao',
  '日间护理': 'rijian-zhaoliao', '日间托管': 'rijian-zhaoliao', '短期托养': 'rijian-zhaoliao',
  '康复': 'shuhou-kangfu', '术后': 'shuhou-kangfu', '理疗': 'shuhou-kangfu',
  '康复护理': 'shuhou-kangfu', '康复训练': 'shuhou-kangfu', '康复治疗': 'shuhou-kangfu',
  '失智': 'shuhou-kangfu', '认知症': 'shuhou-kangfu', '痴呆': 'shuhou-kangfu', '阿尔茨海默': 'shuhou-kangfu',
  '心理': 'xinli-weijie', '精神慰藉': 'xinli-weijie', '心理咨询': 'xinli-weijie',
  '安宁': 'linzhong-guanhuai', '临终': 'linzhong-guanhuai', '姑息': 'linzhong-guanhuai', '舒缓': 'linzhong-guanhuai',
  '墓': 'mudi-fuwu', '殡': 'mudi-fuwu', '陵园': 'mudi-fuwu', '公墓': 'mudi-fuwu',
};

function classify(text: string, providerType: string): string[] {
  const slugs = new Set<string>();
  for (const [keyword, slug] of Object.entries(SERVICE_KEYWORD_MAP)) {
    if (text.includes(keyword)) slugs.add(slug);
  }
  if (providerType === 'agency') slugs.add('yanglaoyuan');
  if (slugs.size === 0) slugs.add('hugong');
  return [...slugs];
}

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
  // Get service type IDs
  const { data: serviceTypes } = await s.from('service_type').select('id,slug');
  const stMap = new Map(serviceTypes?.map(s => [s.slug, s.id]));
  
  // Get ALL providers with pagination
  const allProviders = await fetchAll<{id: number; name: string; bio: string | null; provider_type: string}>(
    s.from('service_provider').select('id,name,bio,provider_type').eq('status', 'active')
  );
  console.log(`All active providers: ${allProviders.length}`);
  
  // Get ALL existing junctions with pagination
  const allJunctions = await fetchAll<{provider_id: number; service_type_id: number}>(
    s.from('provider_service_type').select('provider_id,service_type_id')
  );
  console.log(`Existing junctions: ${allJunctions.length}`);
  
  // Build map of provider_id -> set of service_type_ids
  const junctionMap = new Map<number, Set<number>>();
  for (const j of allJunctions) {
    const set = junctionMap.get(j.provider_id) || new Set();
    set.add(j.service_type_id);
    junctionMap.set(j.provider_id, set);
  }
  
  // Find providers missing ALL junctions
  const missingAll = allProviders.filter(p => !junctionMap.has(p.id));
  console.log(`Providers with ZERO junctions: ${missingAll.length}`);
  
  // Classify and add junctions for all missing providers
  if (missingAll.length > 0) {
    let added = 0;
    for (const p of missingAll) {
      const text = (p.name || '') + ' ' + (p.bio || '');
      const slugs = classify(text, p.provider_type || 'agency');
      for (const slug of slugs) {
        const stId = stMap.get(slug);
        if (!stId) continue;
        const { error } = await s.from('provider_service_type').upsert({
          provider_id: p.id,
          service_type_id: stId,
        }, { onConflict: 'provider_id,service_type_id' });
        if (!error) added++;
      }
    }
    console.log(`Added ${added} junction rows for ${missingAll.length} providers`);
  }
  
  // Verify final state
  const { count: finalCount } = await s.from('provider_service_type').select('id', { count: 'exact', head: true });
  console.log(`\nFinal provider_service_type rows: ${finalCount}`);
  
  // Check per service type
  for (const st of serviceTypes ?? []) {
    const { count } = await s.from('provider_service_type').select('id', { count: 'exact', head: true }).eq('service_type_id', st.id);
    console.log(`  ${st.slug}: ${count} providers`);
  }
}
main();
