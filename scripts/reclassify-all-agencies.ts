// Delete ALL agency junctions and reclassify with expanded keywords
// Usage: npx tsx scripts/reclassify-all-agencies.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xcfwdwmqrdtchnckutoc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ';

const SERVICE_KEYWORD_MAP: Record<string, string> = {
  // hugong — home care / community care
  '居家护理': 'hugong', '上门护理': 'hugong', '护工': 'hugong', '居家养老': 'hugong',
  '居家照护': 'hugong', '全天照护': 'hugong', '半天照护': 'hugong', '上门服务': 'hugong',
  '生活照料': 'hugong', '个人护理': 'hugong', '起居照料': 'hugong',
  '洗澡': 'hugong', '翻身拍背': 'hugong', '喂食': 'hugong',
  '鼻饲护理': 'hugong', '压疮护理': 'hugong', '褥疮护理': 'hugong', '大小便护理': 'hugong',
  '居家': 'hugong', '上门': 'hugong', '到家': 'hugong',
  '长护险': 'hugong', '家庭照护': 'hugong', '社区养老': 'hugong',
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
  // yanglaoyuan (always added for agencies)
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

function classify(text: string): string[] {
  const slugs = new Set<string>();
  for (const [keyword, slug] of Object.entries(SERVICE_KEYWORD_MAP)) {
    if (text.includes(keyword)) slugs.add(slug);
  }
  slugs.add('yanglaoyuan'); // all agencies are nursing homes
  return [...slugs];
}

async function fetchAll(table: string, columns: string, filter?: (q: any) => any): Promise<any[]> {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);
  const all: any[] = [];
  let from = 0;
  const limit = 1000;
  while (true) {
    let q = s.from(table).select(columns).range(from, from + limit - 1);
    if (filter) q = filter(q);
    const { data } = await q;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < limit) break;
    from += limit;
  }
  return all;
}

async function main() {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);

  // 1. Delete ALL existing agency junctions
  console.log('Deleting all agency junctions...');
  const agencies = await fetchAll('service_provider', 'id', q => q.eq('status','active').eq('provider_type','agency'));
  console.log(`  Found ${agencies.length} agencies`);

  let deleted = 0;
  for (let i = 0; i < agencies.length; i += 200) {
    const chunk = agencies.slice(i, i + 200).map(a => a.id);
    const { error } = await s.from('provider_service_type').delete().in('provider_id', chunk);
    if (error) {
      console.error(`  Delete error at ${i}: ${error.message}`);
    } else {
      deleted += chunk.length;
    }
  }
  console.log(`  Deleted junctions for ${deleted} agencies`);

  // 2. Get service types
  const stList = await fetchAll('service_type', 'id,slug');
  const stBySlug = new Map(stList.map(s => [s.slug, s.id]));

  // 3. Reclassify and insert in batches
  console.log('Reclassifying...');
  const batchSize = 100;
  let processed = 0;
  const stats: Record<string, number> = {};

  for (let i = 0; i < agencies.length; i += batchSize) {
    const batch = agencies.slice(i, i + batchSize);

    // Get full data for this batch
    const { data: fullBatch } = await s.from('service_provider')
      .select('id,name,bio').in('id', batch.map(a => a.id));

    const inserts: { provider_id: number; service_type_id: number }[] = [];

    for (const a of fullBatch ?? []) {
      const text = `${a.name} ${a.bio ?? ''}`;
      const slugs = classify(text);

      for (const slug of slugs) {
        const stId = stBySlug.get(slug);
        if (stId) {
          inserts.push({ provider_id: a.id, service_type_id: stId });
        }
      }

      // Track stats
      for (const slug of slugs) {
        stats[slug] = (stats[slug] ?? 0) + 1;
      }
    }

    // Insert this batch
    if (inserts.length > 0) {
      const { error } = await s.from('provider_service_type').insert(inserts);
      if (error) {
        console.error(`  Insert error at ${i}: ${error.message}`);
      }
    }

    processed += batch.length;
    if (processed % 1000 === 0) console.log(`  Processed ${processed}/${agencies.length}...`);
  }

  console.log(`\nDone. Reclassified ${agencies.length} agencies.\n`);

  // Print stats
  console.log('Service type coverage:');
  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  for (const [slug, count] of sorted) {
    const st = stList.find(s => s.slug === slug);
    console.log(`  ${st?.name ?? slug}: ${count} agencies`);
  }
}

main();
