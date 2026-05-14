// Seed nursing home and hospice providers via Supabase REST API
// Run: npx tsx scripts/seed-eldercare-facilities.ts

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Nursing homes (养老院) and hospice care (临终关怀) providers
const facilities = [
  // === 北京 养老院 ===
  {
    providerType: 'agency', name: '北京夕阳红养老院', slug: 'beijing-xiyanghong',
    phone: '010-6****888', wechatId: 'xiyanghong_bj',
    bio: '北京夕阳红养老院成立于2005年，是北京市三星级养老机构。占地30亩，设有300张床位，环境优美。提供自理、半自理、全护理、特护四级护理服务。内设医务室，配备全科医生和护士24小时值班。配有康复训练室、棋牌室、书画室、户外花园等设施。膳食由营养师定制，每日三餐两点。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'beijing', districtSlug: 'chaoyang-qu',
    lat: 39.93, lng: 116.45, addressText: '北京市朝阳区来广营东路88号',
    serviceTypeSlugs: ['yanglaoyuan'],
    listings: [
      { title: '自理老人标准间', description: '含食宿、基础护理、文娱活动', price: 4500, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '半自理双人间', description: '含食宿、护理服务、康复指导', price: 6000, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '全护理单人间', description: '24小时护理、含食宿、医疗监测', price: 8500, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '特护VIP间', description: '一对一护理、医疗级护理、独立套间', price: 12000, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
  {
    providerType: 'agency', name: '北京颐和养老公寓', slug: 'beijing-yihe-gongyu',
    phone: '010-8****666', wechatId: 'yihe_apartment',
    bio: '颐和养老公寓位于海淀区，毗邻颐和园。以"医养结合"为特色，内设一级医院，可提供医保报销。拥有120张床位，全部为单人间和双人间。配备康复中心、中医理疗室、临终关怀室。专业医护团队30余人，其中主任医师2名。接收自理、半自理、失能、失智老人。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'beijing', districtSlug: 'haidian-qu',
    lat: 39.97, lng: 116.29, addressText: '北京市海淀区颐和园路5号',
    serviceTypeSlugs: ['yanglaoyuan', 'linzhong-guanhuai'],
    listings: [
      { title: '养老标准单人间', description: '独立卫浴、基础护理、三餐', price: 5500, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '医养结合双人间', description: '含医疗护理、康复训练、专家巡诊', price: 8000, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '安宁疗护套房', description: '临终关怀、疼痛管理、心理慰藉、家属陪护', price: 10000, priceUnit: 'month', serviceTypeSlug: 'linzhong-guanhuai' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
  // === 广州 养老院 ===
  {
    providerType: 'agency', name: '广州福寿康养老院', slug: 'guangzhou-fushoukang',
    phone: '020-3****999', wechatId: 'fushoukang_gz',
    bio: '福寿康养老院坐落于广州市番禺区，依山傍水，环境清幽。占地50亩，床位500张，是广州市规模较大的养老机构之一。配备专业医护团队、康复理疗中心、老年大学课堂。引入智慧养老系统，实时监测老人健康数据。每月组织外出游玩、节日庆祝等活动，让长者老有所乐。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'guangzhou', districtSlug: 'panyu-qu',
    lat: 22.93, lng: 113.38, addressText: '广州市番禺区市广路228号',
    serviceTypeSlugs: ['yanglaoyuan'],
    listings: [
      { title: '标准双人间', description: '含食宿、日常照护、文娱活动', price: 3800, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '舒适单人间', description: '独立空间、全护理服务、康复指导', price: 5800, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '豪华套间', description: '一室一厅、24小时专护、营养定制餐', price: 8800, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
  // === 广州 临终关怀 ===
  {
    providerType: 'agency', name: '广州宁养服务中心', slug: 'guangzhou-ningyang',
    phone: '020-8****111', wechatId: 'ningyang_care',
    bio: '广州宁养服务中心是经广州市卫健委批准的安宁疗护专业机构。由资深姑息治疗医生、疼痛科专家、心理咨询师、社工和志愿者组成的多学科团队。提供居家安宁疗护和机构安宁疗护两种服务模式。服务内容包括：疼痛管理、症状控制、心理疏导、灵性关怀、家属支持等。秉持"让生命有尊严地谢幕"的理念。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'guangzhou', districtSlug: 'yuexiu-qu',
    lat: 23.13, lng: 113.27, addressText: '广州市越秀区东风东路627号',
    serviceTypeSlugs: ['linzhong-guanhuai'],
    listings: [
      { title: '居家安宁疗护', description: '医护团队上门，含疼痛管理、心理疏导', price: 500, priceUnit: 'day', serviceTypeSlug: 'linzhong-guanhuai' },
      { title: '机构安宁疗护', description: '入住安宁病房，24小时医护值守', price: 800, priceUnit: 'day', serviceTypeSlug: 'linzhong-guanhuai' },
      { title: '家属心理支持', description: '心理咨询师一对一辅导', price: 300, priceUnit: 'per_visit', serviceTypeSlug: 'linzhong-guanhuai' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
  // === 成都 养老院 ===
  {
    providerType: 'agency', name: '成都蜀园养老社区', slug: 'chengdu-shuyuan',
    phone: '028-6****777', wechatId: 'shuyuan_cd',
    bio: '蜀园养老社区是成都高端养老社区，采用CCRC持续照料退休社区模式。社区占地100亩，包含独立生活区、协助生活区、专业护理区和记忆照护区。配有社区医院、游泳池、健身房、图书馆、棋牌室、教堂等设施。引入美国养老运营理念，结合四川本地文化特色，让长者享受品质晚年生活。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'chengdu', districtSlug: 'gaoxin-qu',
    lat: 30.58, lng: 104.05, addressText: '成都市高新区天府大道南段168号',
    serviceTypeSlugs: ['yanglaoyuan'],
    listings: [
      { title: '独立生活公寓', description: '一居室/两居室，含社区服务、餐饮', price: 5000, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '协助生活套房', description: '日常照护、用药管理、生活协助', price: 7500, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '记忆照护专区', description: '阿尔茨海默症专业照护、安全监护', price: 9500, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
  // === 成都 临终关怀 ===
  {
    providerType: 'agency', name: '成都安宁疗护中心', slug: 'chengdu-anning',
    phone: '028-8****333', wechatId: 'anning_chengdu',
    bio: '成都安宁疗护中心是四川省首批安宁疗护试点单位。中心设有30张安宁病床，由姑息治疗专科医生、疼痛管理师、安宁护士、心理师、营养师、社工组成的六位一体团队。提供疼痛控制、呼吸困难管理、营养支持、心理-灵性关怀等全方位服务。支持家属24小时陪护，设有告别室和哀伤辅导服务。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'chengdu', districtSlug: 'jinjiang-qu',
    lat: 30.65, lng: 104.08, addressText: '成都市锦江区静安路56号',
    serviceTypeSlugs: ['linzhong-guanhuai'],
    listings: [
      { title: '安宁病房（标准）', description: '疼痛管理、基础护理、心理支持', price: 600, priceUnit: 'day', serviceTypeSlug: 'linzhong-guanhuai' },
      { title: '安宁病房（VIP）', description: '单人套间、专家团队、家属陪护房', price: 1200, priceUnit: 'day', serviceTypeSlug: 'linzhong-guanhuai' },
      { title: '居家安宁疗护', description: '医护上门、远程监护、药品配送', price: 450, priceUnit: 'day', serviceTypeSlug: 'linzhong-guanhuai' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
  // === 杭州 养老院 ===
  {
    providerType: 'agency', name: '杭州怡养院', slug: 'hangzhou-yiyangyuan',
    phone: '0571-8****555', wechatId: 'yiyang_hz',
    bio: '杭州怡养院位于西湖区，毗邻西溪湿地。以"江南庭院"风格设计，环境优雅。床位180张，设有自理区、护理区、认知障碍专区。配备中医馆、康复大厅、室内恒温泳池。营养师和厨师团队提供杭帮菜、药膳等特色餐饮。定期组织茶艺、书法、越剧等活动，营造温馨的养老氛围。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'hangzhou', districtSlug: 'xihu-qu',
    lat: 30.27, lng: 120.12, addressText: '杭州市西湖区文三西路369号',
    serviceTypeSlugs: ['yanglaoyuan'],
    listings: [
      { title: '普通双人间', description: '基础护理、三餐、活动', price: 4200, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '标准单人间', description: '独立空间、全护理、个性化服务', price: 6500, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '认知障碍专区', description: '专业失智照护、安全环境、认知训练', price: 8500, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
  // === 武汉 养老院 + 临终关怀 ===
  {
    providerType: 'agency', name: '武汉康寿护理院', slug: 'wuhan-kangshou',
    phone: '027-6****222', wechatId: 'kangshou_wh',
    bio: '武汉康寿护理院是集养老、医疗、康复、护理、安宁疗护于一体的综合型医养机构。院内设有二级康复医院，可开展常见老年病诊治和康复治疗。拥有150张医疗床位和200张养老床位。是武汉市医保定点单位。特色科室：老年病科、康复医学科、疼痛科、临终关怀科。',
    yearsExperience: null, gender: null, age: null, verified: true,
    citySlug: 'wuhan', districtSlug: 'wuchang-qu',
    lat: 30.55, lng: 114.32, addressText: '武汉市武昌区中北路168号',
    serviceTypeSlugs: ['yanglaoyuan', 'shuhou-kangfu', 'linzhong-guanhuai'],
    listings: [
      { title: '养老床位（标准）', description: '生活照护、基础医疗、营养餐', price: 4000, priceUnit: 'month', serviceTypeSlug: 'yanglaoyuan' },
      { title: '康复护理床位', description: '术后/中风康复、专业康复治疗', price: 7000, priceUnit: 'month', serviceTypeSlug: 'shuhou-kangfu' },
      { title: '安宁疗护床位', description: '姑息治疗、疼痛控制、终末期护理', price: 500, priceUnit: 'day', serviceTypeSlug: 'linzhong-guanhuai' },
    ],
    verifications: ['id_card', 'health_cert'],
  },
];

async function main() {
  // Resolve city and district IDs
  for (const f of facilities) {
    const { data: city } = await supabase.from('city').select('id').eq('slug', f.citySlug).single();
    if (!city) { console.log(`SKIP ${f.name}: city ${f.citySlug} not found`); continue; }

    const { data: district } = await supabase
      .from('district')
      .select('id')
      .eq('city_id', city.id)
      .eq('slug', f.districtSlug)
      .single();

    // Insert provider
    const { data: provider, error: providerErr } = await supabase
      .from('service_provider')
      .upsert({
        provider_type: f.providerType,
        name: f.name,
        slug: f.slug,
        phone: f.phone,
        wechat_id: f.wechatId,
        bio: f.bio,
        years_experience: f.yearsExperience,
        gender: f.gender,
        age: f.age,
        verified: f.verified,
        city_id: city.id,
        district_id: district?.id ?? null,
        latitude: f.lat,
        longitude: f.lng,
        address_text: f.addressText,
        status: 'active',
      }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (providerErr) { console.log(`ERR ${f.name}: ${providerErr.message}`); continue; }
    if (!provider) { console.log(`SKIP ${f.name}: upsert returned no id`); continue; }

    // Link service types
    for (const stSlug of f.serviceTypeSlugs) {
      const { data: st } = await supabase.from('service_type').select('id').eq('slug', stSlug).single();
      if (!st) continue;
      await supabase.from('provider_service_type').upsert({
        provider_id: provider.id,
        service_type_id: st.id,
      }, { onConflict: 'provider_id,service_type_id' });
    }

    // Insert listings
    for (const l of f.listings) {
      const { data: st } = await supabase.from('service_type').select('id').eq('slug', l.serviceTypeSlug).single();
      if (!st) continue;
      await supabase.from('listing').upsert({
        provider_id: provider.id,
        title: l.title,
        description: l.description,
        price: l.price,
        price_unit: l.priceUnit,
        service_type_id: st.id,
        is_negotiable: false,
      }, { onConflict: 'provider_id,title' });
    }

    // Insert verifications
    for (const vType of f.verifications) {
      await supabase.from('verification').upsert({
        provider_id: provider.id,
        verify_type: vType,
        verify_status: 'approved',
      }, { onConflict: 'provider_id,verify_type' });
    }

    console.log(`  ✓ ${f.name} (${f.serviceTypeSlugs.join(', ')})`);
  }
  console.log(`\nTotal: ${facilities.length} facilities seeded`);
}

main().catch((e) => { console.error(e); process.exit(1); });
