// Seed individual caregivers across key cities via Supabase REST API
// Run: npx tsx scripts/seed-individual-caregivers.ts

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface CaregiverSeed {
  name: string;
  slug: string;
  gender: 'male' | 'female';
  age: number;
  yearsExperience: number;
  phone: string;
  bio: string;
  citySlug: string;
  districtSlug: string;
  serviceTypeSlugs: string[];
  listings: {
    title: string;
    description: string;
    price: number;
    priceUnit: string;
    serviceTypeSlug: string;
  }[];
}

// Helper to generate caregivers per city
function caregiversForCity(
  city: string,
  districts: string[],
  phonePrefix: string,
  startIndex: number,
): CaregiverSeed[] {
  const pool: Omit<CaregiverSeed, 'citySlug' | 'districtSlug' | 'phone'>[] = [
    {
      name: '李秀兰', slug: `${city}-lixiulan`, gender: 'female', age: 48, yearsExperience: 8,
      bio: '从事养老护理工作8年，持有养老护理员中级证书。擅长照顾半自理和失能老人，会打流食、翻身拍背、压疮预防。性格温和有耐心，曾在北京三甲医院做过5年护工，熟悉术后护理和康复训练。',
      serviceTypeSlugs: ['hugong', 'shuhou-kangfu'],
      listings: [
        { title: '全天居家护理', description: '24小时住家照护、做饭、清洁、用药提醒', price: 6500, priceUnit: 'month', serviceTypeSlug: 'hugong' },
        { title: '术后康复护理', description: '术后伤口护理、康复训练、营养餐制作', price: 7000, priceUnit: 'month', serviceTypeSlug: 'shuhou-kangfu' },
      ],
    },
    {
      name: '王美华', slug: `${city}-wangmeihua`, gender: 'female', age: 52, yearsExperience: 12,
      bio: '12年护工经验，曾在多家养老院和医院工作。擅长失能老人照护、阿尔茨海默症老人护理、临终关怀。持有高级养老护理员证和营养师证。会做各菜系家常菜，能根据老人口味和健康状况定制食谱。',
      serviceTypeSlugs: ['hugong', 'linzhong-guanhuai'],
      listings: [
        { title: '失能老人专业护理', description: '洗澡、喂饭、翻身、压疮护理、康复按摩', price: 7500, priceUnit: 'month', serviceTypeSlug: 'hugong' },
        { title: '安宁陪护服务', description: '终末期陪伴、疼痛观察、家属沟通、心理支持', price: 400, priceUnit: 'day', serviceTypeSlug: 'linzhong-guanhuai' },
      ],
    },
    {
      name: '张建国', slug: `${city}-zhangjianguo`, gender: 'male', age: 55, yearsExperience: 10,
      bio: '退伍军人出身，从事养老护理10年。体力好，擅长照顾男性失能老人和体重较大的老人。会基本的康复按摩和关节活动训练。持有中级护理员证书。做事认真负责，24小时尽心尽力。',
      serviceTypeSlugs: ['hugong'],
      listings: [
        { title: '男性老人专护', description: '翻身、搬运、洗浴、户外活动陪同', price: 7000, priceUnit: 'month', serviceTypeSlug: 'hugong' },
        { title: '夜间陪护', description: '夜间起床协助、安全监护、应急处理', price: 5000, priceUnit: 'month', serviceTypeSlug: 'hugong' },
      ],
    },
    {
      name: '赵玉琴', slug: `${city}-zhaoyuqin`, gender: 'female', age: 45, yearsExperience: 6,
      bio: '6年陪诊和居家护理经验。熟悉各大医院就诊流程，能帮助老人挂号、缴费、取药、陪同检查。持有健康管理师证书。擅长与医生沟通，能准确记录医嘱并向家属传达。性格开朗，善于与老人交流。',
      serviceTypeSlugs: ['peizhen', 'hugong'],
      listings: [
        { title: '全程陪诊服务', description: '挂号、候诊、陪检、取药、记录医嘱', price: 300, priceUnit: 'per_visit', serviceTypeSlug: 'peizhen' },
        { title: '半天居家照护', description: '做饭、清洁、陪伴、用药提醒', price: 3500, priceUnit: 'month', serviceTypeSlug: 'hugong' },
      ],
    },
    {
      name: '陈桂芳', slug: `${city}-chenguifang`, gender: 'female', age: 50, yearsExperience: 15,
      bio: '15年专业护理经验，曾在二甲医院内科病房工作8年。擅长各类慢性病护理、术后康复、中风后遗症康复训练。持有护士执业资格证和养老护理员高级证。能进行血压血糖监测、胰岛素注射、导管护理等专业操作。',
      serviceTypeSlugs: ['hugong', 'shuhou-kangfu'],
      listings: [
        { title: '专业医疗护理', description: '慢病管理、导管护理、注射、生命体征监测', price: 9000, priceUnit: 'month', serviceTypeSlug: 'hugong' },
        { title: '中风康复护理', description: '偏瘫康复训练、语言训练、吞咽功能训练', price: 8500, priceUnit: 'month', serviceTypeSlug: 'shuhou-kangfu' },
      ],
    },
    {
      name: '刘春梅', slug: `${city}-liuchunmei`, gender: 'female', age: 42, yearsExperience: 5,
      bio: '5年老年心理慰藉和陪伴经验。持有心理咨询师三级证书和社会工作师证书。擅长老年情绪疏导、认知训练、怀旧疗法。曾参与社区老年心理健康服务项目，善于组织老人活动，活跃气氛。',
      serviceTypeSlugs: ['xinli-weijie', 'rijian-zhaoliao'],
      listings: [
        { title: '老年心理陪伴', description: '情绪疏导、认知训练、兴趣活动组织', price: 300, priceUnit: 'per_visit', serviceTypeSlug: 'xinli-weijie' },
        { title: '日间陪伴照护', description: '白天陪伴、活动组织、简单家务、午餐', price: 4500, priceUnit: 'month', serviceTypeSlug: 'rijian-zhaoliao' },
      ],
    },
    {
      name: '周明德', slug: `${city}-zhoumingde`, gender: 'male', age: 58, yearsExperience: 20,
      bio: '20年护理经验，曾在养老院担任护理主管10年。擅长所有级别的老年护理，尤其精通失智失能老人的全方位照护。持有高级护理员证、营养师证、康复治疗师证。培训过上百名护工学员。',
      serviceTypeSlugs: ['hugong', 'shuhou-kangfu', 'rijian-zhaoliao'],
      listings: [
        { title: '全能型老人护理', description: '失能失智照护、营养管理、文娱活动', price: 10000, priceUnit: 'month', serviceTypeSlug: 'hugong' },
        { title: '日间康复照料', description: '白天照护、康复训练、营养午餐、活动', price: 6000, priceUnit: 'month', serviceTypeSlug: 'rijian-zhaoliao' },
      ],
    },
    {
      name: '杨淑珍', slug: `${city}-yangshuzhen`, gender: 'female', age: 47, yearsExperience: 9,
      bio: '9年居家护理和陪诊经验。性格温柔细腻，特别擅长照顾高龄女性和术后恢复期患者。会做营养汤羹和药膳，注重老人的饮食调理。熟悉本地各大医院，能高效完成陪诊服务。持有中级养老护理员证。',
      serviceTypeSlugs: ['hugong', 'peizhen'],
      listings: [
        { title: '居家护理（女老人）', description: '个人卫生、营养餐、陪伴、家务', price: 6000, priceUnit: 'month', serviceTypeSlug: 'hugong' },
        { title: '就医陪诊', description: '全程陪同就医、取药、记录整理', price: 280, priceUnit: 'per_visit', serviceTypeSlug: 'peizhen' },
      ],
    },
  ];

  return pool.map((c, i) => ({
    ...c,
    citySlug: city,
    districtSlug: districts[i % districts.length],
    phone: `${phonePrefix}****${String(startIndex + i).padStart(3, '0')}`,
  }));
}

const allCaregivers: CaregiverSeed[] = [
  ...caregiversForCity('beijing', ['chaoyang-qu', 'haidian-qu', 'dongcheng-qu', 'xicheng-qu', 'fengtai-qu', 'tongzhou-qu', 'changping-qu', 'shunyi-qu'], '010-', 100),
  ...caregiversForCity('guangzhou', ['tianhe-qu', 'yuexiu-qu', 'haizhu-qu', 'liwan-qu', 'baiyun-qu', 'panyu-qu', 'huangpu-qu', 'huadu-qu'], '020-', 200),
  ...caregiversForCity('chengdu', ['jinjiang-qu', 'qingyang-qu', 'jinniu-qu', 'wuhou-qu', 'chenghua-qu', 'gaoxin-qu', 'shuangliu-qu', 'longquanyi-qu'], '028-', 300),
  ...caregiversForCity('hangzhou', ['shangcheng-qu', 'gongshu-qu', 'xihu-qu', 'binjiang-qu', 'xiaoshan-qu', 'yuhang-qu', 'linping-qu'], '0571-', 400),
  ...caregiversForCity('wuhan', ['wuchang-qu', 'jiangan-qu', 'jianghan-qu', 'hongshan-qu', 'hanyang-qu', 'qingshan-qu', 'qiaokou-qu', 'dongxihu-qu'], '027-', 500),
];

const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  beijing: { lat: 39.9042, lng: 116.4074 },
  guangzhou: { lat: 23.1291, lng: 113.2644 },
  chengdu: { lat: 30.5728, lng: 104.0668 },
  hangzhou: { lat: 30.2741, lng: 120.1551 },
  wuhan: { lat: 30.5928, lng: 114.3055 },
};

function jitter(v: number): number {
  return v + (Math.random() - 0.5) * 0.04;
}

async function main() {
  let inserted = 0;
  let skipped = 0;

  for (const c of allCaregivers) {
    // Resolve city
    const { data: city } = await supabase.from('city').select('id').eq('slug', c.citySlug).single();
    if (!city) { console.log(`SKIP ${c.name}: city ${c.citySlug} not found`); skipped++; continue; }

    // Resolve district
    const { data: district } = await supabase
      .from('district')
      .select('id')
      .eq('city_id', city.id)
      .eq('slug', c.districtSlug)
      .single();

    // Insert provider
    const { data: provider, error: providerErr } = await supabase
      .from('service_provider')
      .upsert({
        provider_type: 'individual',
        name: c.name,
        slug: c.slug,
        phone: c.phone,
        bio: c.bio,
        years_experience: c.yearsExperience,
        gender: c.gender,
        age: c.age,
        verified: true,
        city_id: city.id,
        district_id: district?.id ?? null,
        latitude: jitter(CITY_CENTERS[c.citySlug]?.lat ?? 31.23),
        longitude: jitter(CITY_CENTERS[c.citySlug]?.lng ?? 121.47),
        address_text: null,
        status: 'active',
      }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (providerErr) { console.log(`ERR ${c.name}: ${providerErr.message}`); skipped++; continue; }
    if (!provider) { console.log(`SKIP ${c.name}: upsert returned no id`); skipped++; continue; }

    // Link service types
    for (const stSlug of c.serviceTypeSlugs) {
      const { data: st } = await supabase.from('service_type').select('id').eq('slug', stSlug).single();
      if (!st) continue;
      await supabase.from('provider_service_type').upsert({
        provider_id: provider.id,
        service_type_id: st.id,
      }, { onConflict: 'provider_id,service_type_id' });
    }

    // Insert listings
    for (const l of c.listings) {
      const { data: st } = await supabase.from('service_type').select('id').eq('slug', l.serviceTypeSlug).single();
      if (!st) continue;
      await supabase.from('listing').upsert({
        provider_id: provider.id,
        title: l.title,
        description: l.description,
        price: l.price,
        price_unit: l.priceUnit,
        service_type_id: st.id,
        is_negotiable: true,
      }, { onConflict: 'provider_id,title' });
    }

    // Insert verifications for individual caregivers
    for (const vType of ['id_card', 'health_cert']) {
      await supabase.from('verification').upsert({
        provider_id: provider.id,
        verify_type: vType,
        verify_status: 'approved',
      }, { onConflict: 'provider_id,verify_type' });
    }

    inserted++;
    console.log(`  OK ${c.name} (${c.citySlug}/${c.districtSlug}) — ${c.serviceTypeSlugs.join(', ')}`);
  }

  console.log(`\nInserted: ${inserted}, Skipped: ${skipped}, Total: ${allCaregivers.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
