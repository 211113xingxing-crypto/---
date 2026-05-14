import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

async function main() {
  // Get all service types
  const { data: serviceTypes } = await s.from('service_type').select('id,slug');
  const stMap = new Map(serviceTypes?.map(s => [s.slug, s.id]));
  const yanglaoyuanId = stMap.get('yanglaoyuan');
  const mudiId = stMap.get('mudi-fuwu');
  console.log(`Service types: yanglaoyuan=${yanglaoyuanId}, mudi-fuwu=${mudiId}`);
  
  // Get providers that have NO junctions at all
  // First get all providers
  const { data: allProviders } = await s.from('service_provider').select('id,name,slug,city_id,provider_type').eq('status', 'active');
  console.log(`Total active providers: ${allProviders?.length}`);
  
  // Get all existing junctions
  const { data: allJunctions } = await s.from('provider_service_type').select('provider_id, service_type_id');
  const junctionProviderIds = new Set((allJunctions ?? []).map(j => j.provider_id));
  
  const missingProviders = (allProviders ?? []).filter(p => !junctionProviderIds.has(p.id));
  console.log(`Providers missing ALL junctions: ${missingProviders.length}`);
  
  // Show by city
  const { data: cities } = await s.from('city').select('id,slug,name');
  const cityMap = new Map(cities?.map(c => [c.id, c.slug]));
  
  const byCity: Record<string, number> = {};
  for (const p of missingProviders) {
    const cs = cityMap.get(p.city_id) || '?';
    byCity[cs] = (byCity[cs] || 0) + 1;
  }
  console.log(`\nMissing by city:`);
  for (const [city, count] of Object.entries(byCity).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${city}: ${count}`);
  }
  
  // Fix: add yanglaoyuan junction to all missing agencies
  if (missingProviders.length > 0 && yanglaoyuanId) {
    let added = 0;
    for (const p of missingProviders) {
      // Agency gets yanglaoyuan; individual gets hugong
      const stId = p.provider_type === 'agency' ? yanglaoyuanId : (stMap.get('hugong') || yanglaoyuanId);
      const { error } = await s.from('provider_service_type').upsert({
        provider_id: p.id,
        service_type_id: stId,
      }, { onConflict: 'provider_id,service_type_id' });
      if (error) {
        console.log(`  Error for ${p.name}: ${error.message}`);
      } else {
        added++;
      }
    }
    console.log(`\nAdded ${added} junctions for ${missingProviders.length} missing providers`);
  }
  
  // Also run keyword classification for the new providers
  // (Same as reclassify but just for providers missing junctions)
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
  
  // For providers missing junctions, classify and add all matching
  let extraAdded = 0;
  for (const p of missingProviders) {
    const text = (p.name || '') + ' ' + (p.bio || '');
    const slugs = classify(text, p.provider_type || 'agency');
    for (const slug of slugs) {
      const stId = stMap.get(slug);
      if (!stId) continue;
      const { error } = await s.from('provider_service_type').upsert({
        provider_id: p.id,
        service_type_id: stId,
      }, { onConflict: 'provider_id,service_type_id' });
      if (!error) extraAdded++;
    }
  }
  console.log(`Total junction rows added: ${extraAdded}`);
  
  // Verify
  const { count: totalJunctions } = await s.from('provider_service_type').select('id', { count: 'exact', head: true });
  console.log(`Total provider_service_type rows now: ${totalJunctions}`);
}
main();
