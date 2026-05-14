// Add districts (区) for the 7 new cities that currently have 0 districts
// Usage: npx tsx scripts/add-districts-new-cities.ts
import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

const NEW_DISTRICTS: Record<string, Array<{ name: string; slug: string }>> = {
  shenzhen: [
    { name: '南山区', slug: 'nanshan-qu' },
    { name: '福田区', slug: 'futian-qu' },
    { name: '罗湖区', slug: 'luohu-qu' },
    { name: '宝安区', slug: 'baoan-qu' },
    { name: '龙岗区', slug: 'longgang-qu' },
    { name: '龙华区', slug: 'longhua-qu' },
    { name: '盐田区', slug: 'yantian-qu' },
    { name: '坪山区', slug: 'pingshan-qu' },
    { name: '光明区', slug: 'guangming-qu' },
  ],
  wuxi: [
    { name: '梁溪区', slug: 'liangxi-qu' },
    { name: '滨湖区', slug: 'binhu-qu' },
    { name: '新吴区', slug: 'xinwu-qu' },
    { name: '锡山区', slug: 'xishan-qu' },
    { name: '惠山区', slug: 'huishan-qu' },
  ],
  suzhou: [
    { name: '姑苏区', slug: 'gusu-qu' },
    { name: '虎丘区', slug: 'huqiu-qu' },
    { name: '吴中区', slug: 'wuzhong-qu' },
    { name: '相城区', slug: 'xiangcheng-qu' },
    { name: '吴江区', slug: 'wujiang-qu' },
  ],
  qingdao: [
    { name: '市南区', slug: 'shinan-qu' },
    { name: '市北区', slug: 'shibei-qu' },
    { name: '李沧区', slug: 'licang-qu' },
    { name: '崂山区', slug: 'laoshan-qu' },
    { name: '城阳区', slug: 'chengyang-qu' },
    { name: '黄岛区', slug: 'huangdao-qu' },
  ],
  dalian: [
    { name: '中山区', slug: 'zhongshan-qu' },
    { name: '西岗区', slug: 'xigang-qu' },
    { name: '沙河口区', slug: 'shahekou-qu' },
    { name: '甘井子区', slug: 'ganjingzi-qu' },
    { name: '旅顺口区', slug: 'lvshunkou-qu' },
  ],
  xiamen: [
    { name: '思明区', slug: 'siming-qu' },
    { name: '湖里区', slug: 'huli-qu' },
    { name: '集美区', slug: 'jimei-qu' },
    { name: '海沧区', slug: 'haicang-qu' },
    { name: '同安区', slug: 'tongan-qu' },
    { name: '翔安区', slug: 'xiangan-qu' },
  ],
  ningbo: [
    { name: '海曙区', slug: 'haishu-qu' },
    { name: '江北区', slug: 'jiangbei-qu' },
    { name: '鄞州区', slug: 'yinzhou-qu' },
    { name: '北仑区', slug: 'beilun-qu' },
    { name: '镇海区', slug: 'zhenhai-qu' },
  ],
};

async function main() {
  for (const [citySlug, districts] of Object.entries(NEW_DISTRICTS)) {
    const { data: city } = await s.from('city').select('id').eq('slug', citySlug).single();
    if (!city) { console.log(`City not found: ${citySlug}`); continue; }

    let added = 0;
    for (const d of districts) {
      // Check if this district already exists
      const { data: existing } = await s.from('district')
        .select('id').eq('slug', d.slug).eq('city_id', city.id).maybeSingle();
      if (existing) continue;

      const { error } = await s.from('district').insert({
        name: d.name,
        slug: d.slug,
        city_id: city.id,
        level: 'district',
      });
      if (error) {
        console.log(`  Error adding ${d.name} to ${citySlug}: ${error.message}`);
      } else {
        added++;
      }
    }
    console.log(`${citySlug}: added ${added} districts`);
  }

  // Verify
  const { data: cities } = await s.from('city').select('id,slug,name').eq('is_active', true);
  for (const c of cities ?? []) {
    const { count } = await s.from('district').select('id', { count: 'exact', head: true }).eq('city_id', c.id);
    if (!count) console.log(`WARNING: ${c.slug} (${c.name}) still has 0 districts`);
  }
}
main();
