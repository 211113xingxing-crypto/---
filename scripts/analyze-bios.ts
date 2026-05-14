// Analyze agency bios to find missing service type keywords
// Usage: npx tsx scripts/analyze-bios.ts
import { createClient } from '@supabase/supabase-js';
const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

// Common service-related keywords to search for
const SEARCH_TERMS = [
  '陪诊', '就医', '陪同', '挂号', '取药', '看病',
  '日间', '日托', '钟点', '小时工', '临时',
  '康复', '理疗', '中医', '针灸', '按摩', '推拿', '拔罐',
  '临终', '安宁', '宁养', '姑息', '舒缓',
  '心理', '精神', '慰藉', '陪伴', '聊天', '谈心', '关怀',
  '痴呆', '认知', '失智', '失能', '阿兹海默',
  '家政', '保洁', '做饭', '洗衣', '打扫', '买菜',
  '上门', '居家', '到家', '入户',
  '洗澡', '擦浴', '翻身', '拍背', '喂食',
  '鼻饲', '导尿', 'PICC', '压疮', '褥疮', '换药', '打针', '输液',
  '呼吸机', '吸氧', '雾化', '吸痰',
  '术后', '出院', '转院', '急救',
  '长护险', '医保', '护理保险',
];

async function main() {
  // Get a sample of 500 agency bios
  const { data: agencies } = await s.from('service_provider')
    .select('id,name,bio').eq('provider_type', 'agency').eq('status', 'active')
    .not('bio', 'is', null).limit(500);

  console.log(`Analyzing ${agencies!.length} agency bios\n`);

  const counts: Record<string, number> = {};
  for (const term of SEARCH_TERMS) {
    counts[term] = 0;
    for (const a of agencies ?? []) {
      if ((a.bio ?? '').includes(term) || a.name.includes(term)) {
        counts[term]++;
      }
    }
  }

  // Sort by count descending
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  console.log('Keyword frequencies in 500 agency name+bio:');
  console.log('');
  for (const [term, count] of sorted) {
    if (count > 0) {
      const bar = '█'.repeat(Math.floor(count / 5));
      console.log(`  ${term.padEnd(6)} ${String(count).padStart(3)} ${bar}`);
    }
  }

  // Current vs suggested service type coverage
  const { data: stList } = await s.from('service_type').select('id,slug,name');
  console.log('\n\nCurrent junction coverage per service type:');
  for (const st of stList ?? []) {
    const { count } = await s.from('provider_service_type')
      .select('id', { count: 'exact', head: true }).eq('service_type_id', st.id);
    console.log(`  ${st.name} (${st.slug}): ${count} agencies`);
  }

  // Print some sample bios that mention "陪诊" (under-represented)
  console.log('\n\nSample bios mentioning "陪诊" (only 4 agencies classified!):');
  let count = 0;
  for (const a of agencies ?? []) {
    if ((a.bio ?? '').includes('陪诊') || a.name.includes('陪诊')) {
      console.log(`  [${a.name}] ${(a.bio ?? '').slice(0, 120)}`);
      count++;
      if (count >= 5) break;
    }
  }
}

main();
