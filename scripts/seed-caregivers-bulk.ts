// Bulk seed individual caregivers for cities with few/no individuals
// Usage: npx tsx scripts/seed-caregivers-bulk.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xcfwdwmqrdtchnckutoc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ';

const SURNAMES = '王李张刘陈杨黄赵周吴徐孙马胡朱郭何罗高林郑梁谢宋唐许韩冯邓曹彭曾萧田董潘袁于叶蒋杜苏魏程吕丁'.split('');
const GIVEN_NAMES_F = '秀英芳丽萍芳芳敏静娟艳芳玲红燕霞梅丽华春兰桂芬淑珍蓉洁'.split('');
const GIVEN_NAMES_M = '伟强磊军勇杰涛明辉鹏彬浩波刚毅超峰健亮平宁鑫文博'.split('');

function pick(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

interface CaregiverSeed {
  name: string;
  gender: string;
  age: number;
  yearsExperience: number;
  services: string[];
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
}

// City center coordinates for generating locations
const CITY_COORDS: Record<string, { lat: number; lng: number; districts: string[] }> = {
  beijing: { lat: 39.904, lng: 116.407, districts: ['朝阳区', '海淀区', '丰台区', '东城区', '西城区', '通州区', '大兴区', '昌平区'] },
  shanghai: { lat: 31.230, lng: 121.474, districts: ['浦东新区', '徐汇区', '静安区', '长宁区', '杨浦区', '闵行区', '宝山区', '松江区'] },
  guangzhou: { lat: 23.130, lng: 113.264, districts: ['天河区', '越秀区', '海珠区', '白云区', '番禺区', '荔湾区', '黄埔区'] },
  chengdu: { lat: 30.573, lng: 104.067, districts: ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '高新区', '双流区'] },
  hangzhou: { lat: 30.274, lng: 120.155, districts: ['西湖区', '拱墅区', '上城区', '滨江区', '萧山区', '余杭区'] },
  nanjing: { lat: 32.060, lng: 118.797, districts: ['鼓楼区', '玄武区', '秦淮区', '建邺区', '江宁区', '栖霞区'] },
  wuhan: { lat: 30.593, lng: 114.305, districts: ['武昌区', '汉口区', '汉阳区', '洪山区', '江岸区', '硚口区'] },
  chongqing: { lat: 29.565, lng: 106.551, districts: ['渝中区', '江北区', '南岸区', '沙坪坝区', '九龙坡区', '渝北区', '巴南区'] },
  tianjin: { lat: 39.085, lng: 117.200, districts: ['和平区', '河西区', '南开区', '河东区', '河北区', '红桥区', '滨海新区'] },
  jinan: { lat: 36.651, lng: 117.120, districts: ['历下区', '市中区', '槐荫区', '天桥区', '历城区'] },
  zhengzhou: { lat: 34.747, lng: 113.625, districts: ['金水区', '二七区', '中原区', '管城区', '惠济区'] },
  xian: { lat: 34.265, lng: 108.954, districts: ['雁塔区', '碑林区', '未央区', '长安区', '新城区', '莲湖区'] },
  kunming: { lat: 25.039, lng: 102.718, districts: ['五华区', '盘龙区', '官渡区', '西山区', '呈贡区'] },
  guiyang: { lat: 26.647, lng: 106.630, districts: ['南明区', '云岩区', '花溪区', '乌当区', '观山湖区'] },
  changsha: { lat: 28.228, lng: 112.939, districts: ['岳麓区', '芙蓉区', '天心区', '开福区', '雨花区'] },
  shenyang: { lat: 41.806, lng: 123.431, districts: ['和平区', '沈河区', '皇姑区', '大东区', '铁西区'] },
  taiyuan: { lat: 37.871, lng: 112.549, districts: ['小店区', '迎泽区', '杏花岭区', '尖草坪区', '万柏林区'] },
  fuzhou: { lat: 26.074, lng: 119.296, districts: ['鼓楼区', '台江区', '仓山区', '晋安区', '马尾区'] },
  nanning: { lat: 22.817, lng: 108.367, districts: ['青秀区', '兴宁区', '西乡塘区', '江南区', '良庆区'] },
};

const SERVICE_TYPES = ['居家护理', '陪诊服务', '日间照料', '术后康复'];

const SERVICE_SLUGS: Record<string, string> = {
  '居家护理': 'hugong', '陪诊服务': 'peizhen', '日间照料': 'rijian-zhaoliao', '术后康复': 'shuhou-kangfu',
};

const BIO_TEMPLATES = [
  '从事养老护理工作{exp}年，持有养老护理员资格证和健康证，擅长{svc}。性格温和耐心，深受老人喜爱。',
  '{exp}年居家养老护理经验，曾在多家养老机构工作，对{svc}有丰富经验。做事细心，责任心强。',
  '护理专业毕业，{exp}年临床护理经验，专注{svc}。持有护士执业证书和养老护理员证书。',
  '热爱养老事业，{exp}年服务经验，尤其擅长{svc}。会做家常菜，能陪老人聊天解闷。',
];

function randomCoords(baseLat: number, baseLng: number) {
  return {
    lat: baseLat + (Math.random() - 0.5) * 0.08,
    lng: baseLng + (Math.random() - 0.5) * 0.08,
  };
}

function generateCaregivers(citySlug: string, count: number): CaregiverSeed[] {
  const coords = CITY_COORDS[citySlug];
  if (!coords) return [];

  const result: CaregiverSeed[] = [];
  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.2 ? '女' : '男';
    const surname = pick(SURNAMES);
    const given = gender === '女' ? pick(GIVEN_NAMES_F) + pick(GIVEN_NAMES_F) : pick(GIVEN_NAMES_M) + pick(GIVEN_NAMES_M);
    const exp = 2 + Math.floor(Math.random() * 13);
    const services = [pick(SERVICE_TYPES)];
    if (Math.random() > 0.5) services.push(pick(SERVICE_TYPES.filter(s => s !== services[0])));
    const { lat, lng } = randomCoords(coords.lat, coords.lng);
    const district = pick(coords.districts);

    result.push({
      name: `${surname}${given}`,
      gender,
      age: 35 + Math.floor(Math.random() * 25),
      yearsExperience: exp,
      services,
      address: `${district}`,
      lat,
      lng,
      phone: Math.random() > 0.7 ? `1${3 + Math.floor(Math.random() * 7)}${String(Math.floor(Math.random() * 1e9)).padStart(9, '0')}` : null,
    });
  }
  return result;
}

async function main() {
  const s = createClient(SUPABASE_URL, SERVICE_KEY);

  // Ensure 深圳 exists
  const { data: sz } = await s.from('city').select('id').eq('slug', 'shenzhen').maybeSingle();
  if (!sz) {
    await s.from('city').insert({ name: '深圳市', slug: 'shenzhen', lat: 22.543, lng: 114.058, is_active: true });
    console.log('Added city: 深圳市');
  }

  // Get all cities
  const { data: cities } = await s.from('city').select('id,slug,name').order('id');

  // Get service type IDs
  const { data: stList } = await s.from('service_type').select('id,slug,name');

  // Target: add ~5-15 individual caregivers per city
  let total = 0;
  for (const city of cities ?? []) {
    if (!CITY_COORDS[city.slug]) continue;

    // Count existing individuals in this city
    const { count: existing } = await s
      .from('service_provider')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id)
      .eq('provider_type', 'individual');

    const target = 10;
    const needed = Math.max(0, target - (existing ?? 0));
    if (needed <= 0) continue;

    const caregivers = generateCaregivers(city.slug, needed);
    for (const cg of caregivers) {
      const ts36 = Date.now().toString(36);
      const rand36 = Math.random().toString(36).slice(2, 6);
      const slug = `hugong-${city.slug}-${ts36}${rand36}`;

      const bio = pick(BIO_TEMPLATES)
        .replace('{exp}', String(cg.yearsExperience))
        .replace('{svc}', cg.services.join('、'));

      const { data: provider } = await s.from('service_provider').insert({
        name: cg.name,
        slug,
        provider_type: 'individual',
        phone: cg.phone,
        gender: cg.gender,
        age: cg.age,
        years_experience: cg.yearsExperience,
        bio,
        address_text: `${city.name}${cg.address}`,
        city_id: city.id,
        latitude: cg.lat,
        longitude: cg.lng,
        status: 'active',
        verified: Math.random() > 0.3,
        avg_rating: 3.5 + Math.random() * 1.5,
        review_count: 0,
      }).select('id').single();

      if (!provider) continue;

      // Add service listings
      for (const svc of cg.services) {
        const slugName = SERVICE_SLUGS[svc];
        if (!slugName) continue;
        const st = (stList ?? []).find(t => t.slug === slugName);
        if (!st) continue;

        const price = svc === '陪诊服务' ? 150 + Math.floor(Math.random() * 100) : 100 + Math.floor(Math.random() * 250);
        const unit = svc === '陪诊服务' ? 'per_visit' : 'day';

        await s.from('service_listing').insert({
          provider_id: provider.id,
          service_type_id: st.id,
          title: `${cg.name} - ${svc}`,
          price,
          price_unit: unit,
          is_active: true,
        });

        await s.from('provider_service_type').insert({
          provider_id: provider.id,
          service_type_id: st.id,
        });
      }
      total++;
    }
    console.log(`  ${city.name}: +${needed} caregivers`);
  }

  console.log(`\nDone. ${total} individual caregivers added.`);
}

main();
