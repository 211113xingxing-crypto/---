import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const { data: sts } = await supabase.from('service_type').select('name, slug').order('name');
  console.log('Service types in DB:');
  for (const s of sts || []) console.log(`  ${s.slug} - ${s.name}`);

  // Ensure missing types exist
  const needed = [
    { name: '心理慰藉', slug: 'xinli-weijie', description: '老年陪伴、情绪疏导、认知训练' },
    { name: '养老院', slug: 'yanglaoyuan', description: '养老院、敬老院、福利院、老年公寓等机构养老资源' },
    { name: '临终关怀', slug: 'linzhong-guanhuai', description: '安宁疗护、临终关怀、宁养服务、疼痛管理' },
  ];

  for (const st of needed) {
    const exists = sts?.find(s => s.slug === st.slug);
    if (!exists) {
      const { error } = await supabase.from('service_type').insert(st);
      if (error) console.log(`  INSERT ${st.slug}: ${error.message}`);
      else console.log(`  ADDED ${st.slug}`);
    }
  }
}

main().catch(console.error);
