// Fix providers that have no provider_service_type junction records
// Usage: npx tsx scripts/fix-missing-junctions.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xcfwdwmqrdtchnckutoc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ';

const SERVICE_KEYWORD_MAP: Record<string, string> = {
  // hugong
  '居家护理': 'hugong', '上门护理': 'hugong', '护工': 'hugong', '居家养老': 'hugong',
  '居家照护': 'hugong', '全天照护': 'hugong', '半天照护': 'hugong', '上门服务': 'hugong',
  '生活照料': 'hugong', '个人护理': 'hugong', '起居照料': 'hugong',
  '洗澡': 'hugong', '翻身拍背': 'hugong', '喂食': 'hugong',
  '鼻饲护理': 'hugong', '压疮护理': 'hugong', '褥疮护理': 'hugong', '大小便护理': 'hugong',
  // peizhen
  '陪诊': 'peizhen', '就医陪诊': 'peizhen', '医院陪护': 'peizhen', '就医陪同': 'peizhen',
  '陪同就医': 'peizhen', '陪同看病': 'peizhen', '代挂号': 'peizhen', '代取药': 'peizhen', '排队取药': 'peizhen',
  // rijian-zhaoliao
  '日间照料': 'rijian-zhaoliao', '日托': 'rijian-zhaoliao', '日间照护': 'rijian-zhaoliao',
  '日间护理': 'rijian-zhaoliao', '日间托管': 'rijian-zhaoliao', '短期托养': 'rijian-zhaoliao',
  // shuhou-kangfu
  '术后康复': 'shuhou-kangfu', '康复护理': 'shuhou-kangfu', '术后护理': 'shuhou-kangfu',
  '中风康复': 'shuhou-kangfu', '康复训练': 'shuhou-kangfu', '康复理疗': 'shuhou-kangfu',
  '中医康复': 'shuhou-kangfu', '功能训练': 'shuhou-kangfu', '理疗': 'shuhou-kangfu',
  '失智照护': 'shuhou-kangfu', '认知障碍': 'shuhou-kangfu', '痴呆护理': 'shuhou-kangfu',
  '阿兹海默': 'shuhou-kangfu', '物理治疗': 'shuhou-kangfu',
  // xinli-weijie
  '心理慰藉': 'xinli-weijie', '心理关怀': 'xinli-weijie', '心理疏导': 'xinli-weijie',
  '精神慰藉': 'xinli-weijie', '精神关怀': 'xinli-weijie', '陪伴聊天': 'xinli-weijie',
  '心理支持': 'xinli-weijie', '情绪疏导': 'xinli-weijie', '文娱活动': 'xinli-weijie',
  // yanglaoyuan (also default for all agencies)
  '养老院': 'yanglaoyuan', '敬老院': 'yanglaoyuan', '福利院': 'yanglaoyuan',
  '老年公寓': 'yanglaoyuan', '护理院': 'yanglaoyuan', '养老公寓': 'yanglaoyuan',
  '养老社区': 'yanglaoyuan', '长者社区': 'yanglaoyuan', '颐养院': 'yanglaoyuan',
  '养护院': 'yanglaoyuan', '养老中心': 'yanglaoyuan',
  // linzhong-guanhuai
  '临终关怀': 'linzhong-guanhuai', '安宁疗护': 'linzhong-guanhuai', '宁养': 'linzhong-guanhuai',
  '安宁护理': 'linzhong-guanhuai', '临终': 'linzhong-guanhuai', '安宁': 'linzhong-guanhuai',
  '姑息治疗': 'linzhong-guanhuai', '舒缓治疗': 'linzhong-guanhuai', '宁养院': 'linzhong-guanhuai',
  // mudi-fuwu
  '墓地': 'mudi-fuwu', '陵园': 'mudi-fuwu', '公墓': 'mudi-fuwu',
};

function classify(text: string, providerType: string): string[] {
  const slugs = new Set<string>();
  for (const [keyword, slug] of Object.entries(SERVICE_KEYWORD_MAP)) {
    if (text.includes(keyword)) slugs.add(slug);
  }
  // Agencies always get yanglaoyuan as base service type
  if (providerType === 'agency') slugs.add('yanglaoyuan');
  if (slugs.size === 0) slugs.add('hugong');
  return [...slugs];
}

async function fetchAll(table: string, columns: string, filter?: (q: any) => any) {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);
  const all: any[] = [];
  let from = 0;
  const limit = 1000;
  while (true) {
    let q = s.from(table).select(columns).range(from, from + limit - 1);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) { console.error(`Fetch error at ${from}:`, error); break; }
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < limit) break;
    from += limit;
  }
  return all;
}

async function main() {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);

  // Get all service types
  const stList = await fetchAll('service_type', 'id,slug');

  // Get all active provider IDs
  const providers = await fetchAll('service_provider', 'id,name,provider_type,bio', (q) => q.eq('status', 'active'));
  console.log(`Active providers: ${providers.length}`);

  // Get all distinct provider IDs that already have junctions
  const existingJunctions = await fetchAll('provider_service_type', 'provider_id');
  const hasJunction = new Set(existingJunctions.map((r: any) => r.provider_id));
  console.log(`Providers with junctions: ${hasJunction.size}`);

  // Find missing
  const missing = providers.filter((p: any) => !hasJunction.has(p.id));
  console.log(`Providers missing junctions: ${missing.length}`);

  if (missing.length === 0) {
    console.log('All providers have junctions. Nothing to fix.');
    return;
  }

  // Batch insert junctions
  let fixed = 0;
  const batchSize = 50;
  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);
    const inserts: any[] = [];

    for (const p of batch) {
      const text = `${p.name} ${p.bio ?? ''}`;
      const slugs = classify(text, p.provider_type);
      for (const slug of slugs) {
        const st = stList.find((t: any) => t.slug === slug);
        if (st) {
          inserts.push({ provider_id: p.id, service_type_id: st.id });
        }
      }
    }

    if (inserts.length > 0) {
      const { error } = await s.from('provider_service_type').upsert(inserts, {
        onConflict: 'provider_id,service_type_id',
        ignoreDuplicates: true,
      });
      if (error) {
        console.error(`Batch ${i}-${i + batch.length} error:`, error.message);
      }
    }

    fixed += batch.length;
    if (fixed % 500 === 0) console.log(`  Fixed ${fixed}/${missing.length}...`);
  }

  console.log(`Done. Fixed ${missing.length} providers.`);
}

main();
