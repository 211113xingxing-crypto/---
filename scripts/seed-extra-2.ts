// Batch insert 5 more providers + listings + verifications + reviews
const SUPABASE_URL = 'https://xcfwdwmqrdtchnckutoc.supabase.co';
const ANON_KEY = 'sb_publishable_CGU-BxL8qvbyrL3d-SJE9g_eFTXtBtL';

async function post(path: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`POST ${path} failed: ${res.status}`, err.slice(0, 200));
    return null;
  }
  return res.json();
}

async function get(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  return res.json();
}

interface ServiceType { id: number; name: string; slug: string; }

const providers = [
  { name: '孙阿姨', slug: 'sun-ayi-jinshan', provider_type: 'individual', verified: true, gender: '女', age: 47, years_experience: 8, phone: '137****3456', wechat_id: 'sun_ayi_js', address_text: '上海市金山区石化街道', latitude: 30.739, longitude: 121.342, bio: '8年养老服务经验，金山区本地人，熟悉石化地区的医疗和生活资源。擅长日常生活照护和情感陪伴，对待老人如亲人。持有中级养老护理员证书，价格公道，在金山区有很好的口碑。', district_id: 6, city_id: 1 },
  { name: '金叔叔', slug: 'jin-shushu-putuo', provider_type: 'individual', verified: true, gender: '男', age: 52, years_experience: 10, phone: '136****2345', wechat_id: 'jin_care_pt', address_text: '上海市普陀区长寿路街道', latitude: 31.239, longitude: 121.428, bio: '10年专业老年护理经验，曾在上海市第十人民医院老年科工作。特别擅长心血管疾病老人的照护，包括高血压管理、心脏术后康复。持有高级养老护理员证书和急救证书。性格稳重细心，对老人的健康状况变化非常敏感。', district_id: 8, city_id: 1 },
  { name: '康怡护理中心', slug: 'kangyi-huli-zhabei', provider_type: 'agency', verified: true, phone: '021-5****777', wechat_id: 'kangyi_zb', address_text: '上海市静安区大宁路街道', latitude: 31.276, longitude: 121.453, bio: '康怡护理中心是静安区卫健委备案的社区养老服务机构，团队20人含护士4名、持证护工16名。特色服务包括认知障碍老人专项照护和临终关怀。所有护工经过120小时岗前培训，服务过程有督导跟踪。', district_id: 2, city_id: 1 },
  { name: '蔡阿姨', slug: 'cai-ayi-minhang', provider_type: 'individual', verified: true, gender: '女', age: 45, years_experience: 6, phone: '158****7890', wechat_id: 'cai_ayi_mh', address_text: '上海市闵行区七宝镇', latitude: 31.157, longitude: 121.349, bio: '6年居家养老护理经验，特别擅长认知障碍（阿尔茨海默病）老人的照护。曾在专业认知障碍照护中心工作2年，懂得如何与失智老人沟通、管理情绪和行为问题。持有中级养老护理员证书和认知障碍照护专项培训证书。有耐心、有方法，是照护失智老人的好选择。', district_id: 3, city_id: 1 },
  { name: '黄阿姨', slug: 'huang-ayi-jiading', provider_type: 'individual', verified: true, gender: '女', age: 50, years_experience: 9, phone: '152****0123', wechat_id: 'huang_care_jd', address_text: '上海市嘉定区安亭镇', latitude: 31.292, longitude: 121.161, bio: '9年养老护理经验，嘉定安亭本地人。擅长半自理和不能自理老人的全方位照护，包括喂食、翻身、压疮护理、鼻饲护理等。性格温和有耐心，能吃苦耐劳。持有高级养老护理员证书。在安亭及花桥地区服务，熟悉当地医疗资源。', district_id: 1, city_id: 1 },
];

const listingsByProvider: Record<string, { title: string; description: string; service_type_slug: string; price: number; price_unit: string }[]> = {
  'sun-ayi-jinshan': [
    { title: '全天居家照护', description: '24小时住家照护，金山区本地护工', service_type_slug: 'hugong', price: 150, price_unit: 'day' },
    { title: '日间照料', description: '8小时日间照护', service_type_slug: 'rijian-zhaoliao', price: 80, price_unit: 'day' },
  ],
  'jin-shushu-putuo': [
    { title: '全天居家照护（心血管专长）', description: '24小时住家，擅长高血压/心脏病老人照护', service_type_slug: 'hugong', price: 280, price_unit: 'day' },
    { title: '术后康复（心脏）', description: '心脏术后专业康复护理', service_type_slug: 'shuhou-kangfu', price: 300, price_unit: 'day' },
  ],
  'kangyi-huli-zhabei': [
    { title: '认知障碍专项照护', description: '专业失智老人照护，含行为管理', service_type_slug: 'hugong', price: 350, price_unit: 'day' },
    { title: '居家护理（标准）', description: '持证护工上门日常照护', service_type_slug: 'hugong', price: 190, price_unit: 'day' },
    { title: '日间照料', description: '机构日托，含认知训练活动', service_type_slug: 'rijian-zhaoliao', price: 130, price_unit: 'day' },
  ],
  'cai-ayi-minhang': [
    { title: '认知障碍专项照护', description: '专业失智老人居家照护', service_type_slug: 'hugong', price: 260, price_unit: 'day' },
    { title: '日间照料', description: '8小时日间照护，含认知训练', service_type_slug: 'rijian-zhaoliao', price: 150, price_unit: 'day' },
  ],
  'huang-ayi-jiading': [
    { title: '全天居家照护（重症）', description: '24小时住家，擅长失能老人全方位照护', service_type_slug: 'hugong', price: 220, price_unit: 'day' },
    { title: '半天照护', description: '8小时日间照护', service_type_slug: 'hugong', price: 100, price_unit: 'day' },
    { title: '陪诊服务', description: '陪同就医', service_type_slug: 'peizhen', price: 120, price_unit: 'per_visit' },
  ],
};

const verificationsByProvider: Record<string, string[]> = {
  'sun-ayi-jinshan': ['id_card', 'nurse_cert', 'health_cert'],
  'jin-shushu-putuo': ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
  'kangyi-huli-zhabei': ['nurse_cert'],
  'cai-ayi-minhang': ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
  'huang-ayi-jiading': ['id_card', 'nurse_cert', 'health_cert'],
};

const reviewData = [
  { provider_slug: 'sun-ayi-jinshan', rating: 5, content: '孙阿姨照顾我妈一年多了，特别细心。金山这边靠谱护工不好找，遇到孙阿姨是我们的福气。性格特别好，我妈很喜欢她。', tags: ['细心', '态度好', '本地人'], is_verified_booking: true },
  { provider_slug: 'sun-ayi-jinshan', rating: 4, content: '孙阿姨做事踏实，价格也公道。唯一希望的是能更灵活调整休息时间，不过都能沟通解决。', tags: ['实在', '价格公道'], is_verified_booking: true },
  { provider_slug: 'jin-shushu-putuo', rating: 5, content: '金叔叔照顾我爸（心脏病+高血压）三年了，非常专业。每天按时测血压、提醒用药，有一次发现心电图异常及时送医，医生说再晚来就是心梗。真的非常感激！', tags: ['专业', '救命恩人', '负责'], is_verified_booking: true },
  { provider_slug: 'jin-shushu-putuo', rating: 5, content: '给金叔叔点赞！之前在医院就听说他口碑好。来了之后确实名不虚传，对我爸的护理非常专业，康复训练也做得好。强烈推荐给有心脑血管病的老人家庭。', tags: ['专业', '口碑好', '康复效果好'], is_verified_booking: true },
  { provider_slug: 'kangyi-huli-zhabei', rating: 5, content: '康怡的认知障碍照护真的很专业。我妈得了阿尔茨海默病后换了好几个护工都不行，康怡派的阿姨是专门受过训练的，知道怎么和失智老人沟通。现在情况稳定很多，家里终于太平了。', tags: ['专业', '认知障碍专长', '可靠'], is_verified_booking: true },
  { provider_slug: 'kangyi-huli-zhabei', rating: 4, content: '康怡整体管理规范，派来的护工经过专业培训。价格稍高但服务匹配。有督导定期回访，这点让人放心。', tags: ['规范', '有督导', '放心'], is_verified_booking: true },
  { provider_slug: 'cai-ayi-minhang', rating: 5, content: '蔡阿姨照顾我妈（阿尔茨海默病中期）很有方法。会用各种方式引导我妈做日常活动，比以前请的普通护工强太多了。感谢蔡阿姨让我们的家庭重新有了安宁。', tags: ['专业', '有方法', '耐心'], is_verified_booking: true },
  { provider_slug: 'cai-ayi-minhang', rating: 5, content: '认知障碍照护真的需要专业知识，蔡阿姨懂得行为引导、情绪安抚，还会做认知训练游戏。推荐给所有家里有失智老人的家庭。', tags: ['专业', '认知训练', '推荐'], is_verified_booking: true },
  { provider_slug: 'huang-ayi-jiading', rating: 5, content: '黄阿姨照顾我爸（卧床、鼻饲）一年半了，操作非常规范。翻身、拍背、鼻饲、口腔护理都做得很专业。一年多来没有发生过压疮。非常感激黄阿姨的付出。', tags: ['专业', '细心', '重症护理'], is_verified_booking: true },
  { provider_slug: 'huang-ayi-jiading', rating: 4, content: '黄阿姨技术过硬，照顾不能自理的老人很有经验。在安亭这片算是最好的护工之一了。希望保持这个水准。', tags: ['技术好', '有经验'], is_verified_booking: true },
];

async function main() {
  console.log('Starting seed-extra-2...');
  const serviceTypes: ServiceType[] = await get('service_type?select=id,name,slug');
  console.log('Service types:', serviceTypes.map(s => s.slug));
  const getType = (name: string) => serviceTypes.find(t => t.slug === name)!;

  let successCount = 0;
  for (const p of providers) {
    const { name, slug, ...rest } = p;
    console.log(`Inserting provider: ${name} (${slug})...`);

    const result = await post('service_provider', {
      ...rest,
      name,
      slug,
      avg_rating: 0,
      review_count: 0,
      status: 'active',
    });

    if (!result) { console.error(`  Failed: ${name}`); continue; }
    const providerId = result[0]?.id || result?.id;
    if (!providerId) { console.error(`  No ID: ${name}`); continue; }

    successCount++;
    console.log(`  ID: ${providerId}`);

    // Listings
    for (const l of listingsByProvider[slug] || []) {
      const st = getType(l.service_type_slug);
      if (!st) continue;
      await post('service_listing', {
        provider_id: providerId,
        service_type_id: st.id,
        title: l.title,
        description: l.description,
        price: l.price,
        price_unit: l.price_unit,
        is_active: true,
      });
    }

    // Verifications
    for (const v of verificationsByProvider[slug] || []) {
      await post('verification', {
        provider_id: providerId,
        verify_type: v,
        verify_status: 'approved',
      });
    }

    // Provider-service_type relations
    const typeSlugs = [...new Set((listingsByProvider[slug] || []).map(l => l.service_type_slug))];
    for (const ts of typeSlugs) {
      const st = getType(ts);
      if (!st) continue;
      await post('provider_service_type', {
        provider_id: providerId,
        service_type_id: st.id,
      });
    }
  }

  console.log(`\nInserted ${successCount} providers. Inserting reviews...`);

  const allProviders: { id: number; slug: string }[] = await get('service_provider?select=id,slug');
  const slugToId: Record<string, number> = {};
  allProviders.forEach((p: { id: number; slug: string }) => { slugToId[p.slug] = p.id; });

  let reviewCount = 0;
  for (const r of reviewData) {
    const pid = slugToId[r.provider_slug];
    if (!pid) { console.error(`  Provider not found: ${r.provider_slug}`); continue; }
    const result = await post('review', {
      provider_id: pid,
      user_id: Math.floor(Math.random() * 3) + 1,
      rating: r.rating,
      content: r.content,
      tags: r.tags,
      is_verified_booking: r.is_verified_booking,
    });
    if (result) reviewCount++;
  }

  // Update avg_rating and review_count for all providers
  console.log('\nUpdating avg_rating and review_count...');
  let updatedCount = 0;
  for (const p of allProviders) {
    const reviews = await get(`review?provider_id=eq.${p.id}&select=rating`);
    const ratings = Array.isArray(reviews) ? reviews.map((r: { rating: number }) => r.rating) : [];
    const count = ratings.length;
    const avg = count > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / count : 0;
    await fetch(`${SUPABASE_URL}/rest/v1/service_provider?id=eq.${p.id}`, {
      method: 'PATCH',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        review_count: count,
        avg_rating: Math.round(avg * 10) / 10,
      }),
    });
    if (count > 0) updatedCount++;
  }

  console.log(`\nDone! ${successCount} providers, ${reviewCount} reviews. Updated ${updatedCount} providers.`);
  console.log(`Total providers now: ${allProviders.length}`);
}

main().catch(console.error);
