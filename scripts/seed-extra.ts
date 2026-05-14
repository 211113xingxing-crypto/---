// Batch insert extra providers, listings, reviews into Supabase
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

interface District { id: number; name: string; slug: string; }
interface ServiceType { id: number; name: string; slug: string; }
interface SubDistrict { id: number; name: string; slug: string; parent_id: number; }

const providers = [
  { name: '周姐', slug: 'zhou-jie-putuo', provider_type: 'individual', verified: true, gender: '女', age: 45, years_experience: 8, phone: '150****6789', wechat_id: 'zhou_care_pt', address_text: '上海市普陀区曹杨新村街道', latitude: 31.241, longitude: 121.402, bio: '8年居家养老护理经验，之前在养老院工作4年。擅长日常起居照护、饮食管理和陪伴聊天。性格温和细腻，尤其会照顾有轻度认知障碍的老人。持有中级养老护理员证书和急救证。', district_id: 8, city_id: 1 },
  { name: '徐叔叔', slug: 'xu-shushu-yangpu', provider_type: 'individual', verified: true, gender: '男', age: 57, years_experience: 15, phone: '139****2345', wechat_id: 'xu_elder_yangpu', address_text: '上海市杨浦区五角场街道', latitude: 31.298, longitude: 121.514, bio: '15年养老护理经验，曾在部队医院做护工。擅长失能老人照护、翻身拍背、压疮预防。力气大，能熟练使用轮椅和护理床。照顾过30多位老人，经验丰富。性格稳重、责任心强。', district_id: 6, city_id: 1 },
  { name: '钱阿姨', slug: 'qian-ayi-huangpu', provider_type: 'individual', verified: true, gender: '女', age: 50, years_experience: 7, phone: '138****7890', wechat_id: 'qian_care_hp', address_text: '上海市黄浦区老西门街道', latitude: 31.219, longitude: 121.484, bio: '7年居家护理经验，尤其擅长照顾患有糖尿病的老人。能协助进行血糖监测、胰岛素注射、饮食控制。同时擅长做上海本帮菜，老人普遍反映饭菜可口。性格开朗大方，好沟通。', district_id: 7, city_id: 1 },
  { name: '吴护工', slug: 'wu-hugong-hongkou', provider_type: 'individual', verified: true, gender: '男', age: 42, years_experience: 6, phone: '137****4567', wechat_id: 'wu_nurse_hk', address_text: '上海市虹口区广中路街道', latitude: 31.271, longitude: 121.477, bio: '6年康复护理经验，专攻中风后遗症康复训练。曾在二甲医院康复科工作2年。能够制定个性化康复计划，包括肢体功能训练、语言训练、吞咽训练。持有康复治疗师证书和养老护理员证书。', district_id: 5, city_id: 1 },
  { name: '郑阿姨', slug: 'zheng-ayi-xuhui', provider_type: 'individual', verified: true, gender: '女', age: 53, years_experience: 11, phone: '136****8901', wechat_id: 'zheng_care_xh', address_text: '上海市徐汇区漕河泾街道', latitude: 31.168, longitude: 121.404, bio: '11年专业养老护理经验，曾在上海市第六人民医院老年科担任护工5年。擅长各种慢性病老人照护，包括高血压、心脏病、糖尿病等。能够测量生命体征、进行简单的理疗。持有高级养老护理员证书。', district_id: 3, city_id: 1 },
  { name: '冯姐', slug: 'feng-jie-changning', provider_type: 'individual', verified: true, gender: '女', age: 47, years_experience: 9, phone: '158****3456', wechat_id: 'feng_jie_cn', address_text: '上海市长宁区新华路街道', latitude: 31.211, longitude: 121.42, bio: '9年居家养老服务经验，特别擅长照顾术后恢复期的老人。曾在华山医院骨科病房做护工，对髋关节、膝关节术后康复护理非常熟悉。性格耐心细致，做事有条理。持有护士执业证书。', district_id: 1, city_id: 1 },
  { name: '沈阿姨', slug: 'shen-ayi-baoshan', provider_type: 'individual', verified: true, gender: '女', age: 49, years_experience: 6, phone: '151****7890', wechat_id: 'shen_ayi_bs', address_text: '上海市宝山区友谊路街道', latitude: 31.405, longitude: 121.484, bio: '6年养老服务经验，擅长日间照料和陪诊服务。熟悉上海各大医院的就医流程，可以高效地帮老人挂号、取药、陪同检查。性格热情开朗，和老人相处融洽。持有养老护理员证书。', district_id: 3, city_id: 1 },
  { name: '褚护工', slug: 'chu-hugong-jiading', provider_type: 'individual', verified: true, gender: '男', age: 38, years_experience: 5, phone: '133****1234', wechat_id: 'chu_care_jd', address_text: '上海市嘉定区嘉定镇街道', latitude: 31.378, longitude: 121.248, bio: '5年养老护理经验，年轻力壮，擅长协助行动不便的老人转移、外出。曾在养老院工作3年，熟悉各类老人的照护需求。性格朴实肯干，能吃苦耐劳。持有中级养老护理员证书。', district_id: 1, city_id: 1 },
  { name: '松鹤养老服务中心', slug: 'songhe-yanglao-songjiang', provider_type: 'agency', verified: true, phone: '021-5****123', wechat_id: 'songhe_songjiang', address_text: '上海市松江区方松街道', latitude: 31.032, longitude: 121.245, bio: '松鹤养老服务中心是松江区较早开展居家养老服务的机构之一，现有持证护工18人。提供从基础照护到专业医疗护理的分级服务。所有护工均经过统一培训和背景核查，服务质量有保障。', district_id: 8, city_id: 1 },
  { name: '美华护理站', slug: 'meihua-huli-minhang', provider_type: 'agency', verified: true, phone: '021-6****888', wechat_id: 'meihua_minhang', address_text: '上海市闵行区莘庄镇', latitude: 31.115, longitude: 121.38, bio: '美华护理站是经上海市卫健委备案的社区护理机构，拥有护士5名、护工15名。可提供基础医疗护理服务，包括换药、注射、导管护理等。服务闵行区及周边区域，响应快速，24小时可联系。', district_id: 3, city_id: 1 },
  { name: '林阿姨', slug: 'lin-ayi-pudong', provider_type: 'individual', verified: true, gender: '女', age: 51, years_experience: 10, phone: '159****2345', wechat_id: 'lin_ayi_pudong', address_text: '上海市浦东新区金桥镇', latitude: 31.261, longitude: 121.613, bio: '10年居家护理经验，擅长照顾术后康复和慢性病老人。性格温柔细腻，对待老人如亲人。能根据老人身体状况调整饮食和活动计划。持有高级养老护理员证书和营养师证。', district_id: 4, city_id: 1 },
  { name: '顾叔叔', slug: 'gu-shushu-jingan', provider_type: 'individual', verified: false, gender: '男', age: 56, years_experience: 12, phone: '135****6789', wechat_id: 'gu_care_ja', address_text: '上海市静安区彭浦镇', latitude: 31.3, longitude: 121.436, bio: '12年养老护理经验，精通各类康复护理技术。曾在上海第一人民医院康复科工作。擅长中风、骨折术后康复训练。持有康复治疗师证书。', district_id: 2, city_id: 1 },
  { name: '福寿康护理中心', slug: 'fushoukang-qingpu', provider_type: 'agency', verified: true, phone: '021-3****999', wechat_id: 'fushoukang_qp', address_text: '上海市青浦区夏阳街道', latitude: 31.15, longitude: 121.12, bio: '福寿康护理中心是青浦区规模较大的养老护理机构，团队25人。提供居家护理、日间照料、术后康复等全方位服务。与中山医院青浦分院有合作关系，可为出院老人提供延续性护理。', district_id: 4, city_id: 1 },
  { name: '汤阿姨', slug: 'tang-ayi-fengxian', provider_type: 'individual', verified: true, gender: '女', age: 48, years_experience: 7, phone: '152****5678', wechat_id: 'tang_ayi_fx', address_text: '上海市奉贤区南桥镇', latitude: 30.918, longitude: 121.464, bio: '7年养老服务经验，擅长农村老人的日常照护。性格朴实善良，勤劳肯干。能够照顾半自理和不能自理的老人，包括喂饭、洗澡、翻身等。持有养老护理员证书，价格实惠。', district_id: 2, city_id: 1 },
  { name: '何阿姨', slug: 'he-ayi-chongming', provider_type: 'individual', verified: true, gender: '女', age: 46, years_experience: 5, phone: '156****8901', wechat_id: 'he_ayi_cm', address_text: '上海市崇明区城桥镇', latitude: 31.625, longitude: 121.395, bio: '5年养老护理经验，崇明本地人，熟悉本地区医疗资源。擅长日常生活照护和情感陪伴。性格温和有耐心，尤其擅长和老人聊天解闷。能够为农村老人提供贴心的居家养老服务。', district_id: 4, city_id: 1 },
];

let serviceTypes: ServiceType[] = [];

function getType(name: string) { return serviceTypes.find(t => t.slug === name)!; }

// Create listings data for each provider
const listingsByProvider: Record<string, { title: string; description: string; service_type_slug: string; price: number; price_unit: string }[]> = {
  'zhou-jie-putuo': [
    { title: '全天居家照护', description: '24小时住家照护，含做饭、打扫、陪伴', service_type_slug: 'hugong', price: 180, price_unit: 'day' },
    { title: '半天照护', description: '8小时日间照护', service_type_slug: 'hugong', price: 100, price_unit: 'day' },
  ],
  'xu-shushu-yangpu': [
    { title: '全天居家照护（重症）', description: '24小时住家，擅长失能老人照护', service_type_slug: 'hugong', price: 260, price_unit: 'day' },
    { title: '陪诊服务', description: '陪同就医，可协助转移', service_type_slug: 'peizhen', price: 180, price_unit: 'per_visit' },
  ],
  'qian-ayi-huangpu': [
    { title: '全天居家照护', description: '24小时住家护理，擅长糖尿病管理', service_type_slug: 'hugong', price: 220, price_unit: 'day' },
    { title: '日间照料', description: '8小时日间照护，含饮食管理', service_type_slug: 'rijian-zhaoliao', price: 140, price_unit: 'day' },
    { title: '陪诊服务', description: '陪同医院就诊、取药', service_type_slug: 'peizhen', price: 150, price_unit: 'per_visit' },
  ],
  'wu-hugong-hongkou': [
    { title: '中风康复护理', description: '专业中风后遗症康复训练', service_type_slug: 'shuhou-kangfu', price: 280, price_unit: 'day' },
    { title: '术后康复', description: '各类术后康复护理', service_type_slug: 'shuhou-kangfu', price: 240, price_unit: 'day' },
  ],
  'zheng-ayi-xuhui': [
    { title: '全天居家照护（专业级）', description: '含生命体征监测、基础医疗护理', service_type_slug: 'hugong', price: 300, price_unit: 'day' },
    { title: '术后康复', description: '专业术后康复护理', service_type_slug: 'shuhou-kangfu', price: 280, price_unit: 'day' },
  ],
  'feng-jie-changning': [
    { title: '全天居家照护', description: '24小时住家护理', service_type_slug: 'hugong', price: 240, price_unit: 'day' },
    { title: '术后康复护理', description: '骨科术后专业康复', service_type_slug: 'shuhou-kangfu', price: 280, price_unit: 'day' },
  ],
  'shen-ayi-baoshan': [
    { title: '日间照料', description: '8小时日间照护，含做饭、陪聊', service_type_slug: 'rijian-zhaoliao', price: 120, price_unit: 'day' },
    { title: '陪诊服务', description: '陪同就医、代取药', service_type_slug: 'peizhen', price: 130, price_unit: 'per_visit' },
  ],
  'chu-hugong-jiading': [
    { title: '全天居家照护', description: '24小时住家，可协助转移', service_type_slug: 'hugong', price: 160, price_unit: 'day' },
    { title: '半天照护', description: '8小时日间照护', service_type_slug: 'hugong', price: 80, price_unit: 'day' },
  ],
  'songhe-yanglao-songjiang': [
    { title: '居家护理（标准）', description: '持证护工上门，日常照护', service_type_slug: 'hugong', price: 170, price_unit: 'day' },
    { title: '日间照料', description: '机构日托，含午餐和活动', service_type_slug: 'rijian-zhaoliao', price: 100, price_unit: 'day' },
    { title: '术后康复', description: '专业康复护理', service_type_slug: 'shuhou-kangfu', price: 230, price_unit: 'day' },
  ],
  'meihua-huli-minhang': [
    { title: '居家护理（医疗级）', description: '护士上门，含换药、注射等', service_type_slug: 'hugong', price: 380, price_unit: 'day' },
    { title: '居家护理（标准）', description: '护工上门，日常照护', service_type_slug: 'hugong', price: 180, price_unit: 'day' },
    { title: '陪诊服务', description: '专人陪诊，含接送', service_type_slug: 'peizhen', price: 200, price_unit: 'per_visit' },
  ],
  'lin-ayi-pudong': [
    { title: '全天居家照护', description: '24小时照护，含营养餐制作', service_type_slug: 'hugong', price: 230, price_unit: 'day' },
    { title: '术后康复', description: '术后护理和康复指导', service_type_slug: 'shuhou-kangfu', price: 260, price_unit: 'day' },
    { title: '日间照料', description: '8小时照护', service_type_slug: 'rijian-zhaoliao', price: 150, price_unit: 'day' },
  ],
  'gu-shushu-jingan': [
    { title: '康复训练（上门）', description: '一对一康复训练指导', service_type_slug: 'shuhou-kangfu', price: 200, price_unit: 'hour' },
    { title: '全天居家照护', description: '含康复训练的24小时照护', service_type_slug: 'hugong', price: 280, price_unit: 'day' },
  ],
  'fushoukang-qingpu': [
    { title: '居家护理', description: '持证护工上门服务', service_type_slug: 'hugong', price: 160, price_unit: 'day' },
    { title: '日间照料', description: '机构内日托服务', service_type_slug: 'rijian-zhaoliao', price: 90, price_unit: 'day' },
    { title: '陪诊服务', description: '专人陪诊就医', service_type_slug: 'peizhen', price: 160, price_unit: 'per_visit' },
  ],
  'tang-ayi-fengxian': [
    { title: '全天居家照护', description: '24小时住家照护', service_type_slug: 'hugong', price: 140, price_unit: 'day' },
    { title: '半天照护', description: '8小时日间照护', service_type_slug: 'hugong', price: 70, price_unit: 'day' },
  ],
  'he-ayi-chongming': [
    { title: '全天居家照护', description: '24小时住家照护', service_type_slug: 'hugong', price: 130, price_unit: 'day' },
    { title: '日间照料', description: '8小时日间照护', service_type_slug: 'rijian-zhaoliao', price: 80, price_unit: 'day' },
  ],
};

const verificationsByProvider: Record<string, string[]> = {
  'zhou-jie-putuo': ['id_card', 'nurse_cert', 'health_cert'],
  'xu-shushu-yangpu': ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
  'qian-ayi-huangpu': ['id_card', 'nurse_cert', 'health_cert'],
  'wu-hugong-hongkou': ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
  'zheng-ayi-xuhui': ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
  'feng-jie-changning': ['id_card', 'nurse_cert', 'health_cert'],
  'shen-ayi-baoshan': ['id_card', 'nurse_cert'],
  'chu-hugong-jiading': ['id_card', 'nurse_cert', 'health_cert'],
  'songhe-yanglao-songjiang': ['nurse_cert'],
  'meihua-huli-minhang': ['nurse_cert'],
  'lin-ayi-pudong': ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
  'gu-shushu-jingan': ['id_card', 'nurse_cert'],
  'fushoukang-qingpu': ['nurse_cert'],
  'tang-ayi-fengxian': ['id_card', 'nurse_cert'],
  'he-ayi-chongming': ['id_card', 'nurse_cert', 'health_cert'],
};

const reviewData = [
  { provider_slug: 'zhou-jie-putuo', rating: 5, content: '周姐照顾我妈半年了，很细心很有耐心。我妈有轻度帕金森，周姐每天按时提醒吃药、做简单的康复锻炼，现在情况稳定很多。', tags: ['细心', '专业', '耐心'], is_verified_booking: true },
  { provider_slug: 'xu-shushu-yangpu', rating: 5, content: '徐叔叔照顾我爸两年了，非常专业。我爸中风后半身不遂，徐叔叔每天给他做康复训练，现在能扶着站起来走几步了。特别感谢徐叔叔！', tags: ['专业', '负责', '有经验'], is_verified_booking: true },
  { provider_slug: 'qian-ayi-huangpu', rating: 5, content: '钱阿姨做的饭菜特别好吃，我妈胃口一直不好，钱阿姨来了之后变着花样做饭，我妈体重还长了几斤。照顾也很细致。', tags: ['会做饭', '细心', '态度好'], is_verified_booking: true },
  { provider_slug: 'wu-hugong-hongkou', rating: 5, content: '吴护工的康复技术真的很好。我爸爸中风后，医院说恢复希望不大，吴护工坚持每天做训练，半年后爸爸能自己吃饭了。太感谢了！', tags: ['专业', '有爱心', '康复效果好'], is_verified_booking: true },
  { provider_slug: 'zheng-ayi-xuhui', rating: 5, content: '郑阿姨非常专业，之前在六院工作的经验真的不一样。能及时发现老人的健康问题，有一次发现我爸血压异常，及时送医，医生说再晚来就危险了。', tags: ['专业', '细心', '救命恩人'], is_verified_booking: true },
  { provider_slug: 'feng-jie-changning', rating: 4, content: '冯姐照顾我妈做完膝关节置换手术后的康复，方法很专业。恢复得比医生预期的快。唯一一点是偶尔会请假，但都会提前通知。', tags: ['专业', '可靠'], is_verified_booking: true },
  { provider_slug: 'shen-ayi-baoshan', rating: 5, content: '沈阿姨陪我爸去瑞金医院看诊好几次了，每次都安排得很好，取号、排队、拿药都很快。我爸说比我们子女陪着去还省心。', tags: ['效率高', '熟悉医院', '贴心'], is_verified_booking: true },
  { provider_slug: 'lin-ayi-pudong', rating: 5, content: '林阿姨照顾我奶奶三年，从半自理到完全不能自理，林阿姨都没有放弃。最后那段日子尽心尽力，我们全家都很感激。', tags: ['有爱心', '耐心', '可靠'], is_verified_booking: true },
  { provider_slug: 'songhe-yanglao-songjiang', rating: 4, content: '松鹤的护工整体素质不错，派来的阿姨很有经验。机构管理也比较规范，有问题随时可以换人。价格合理，适合普通家庭。', tags: ['规范', '价格合理', '可靠'], is_verified_booking: true },
  { provider_slug: 'meihua-huli-minhang', rating: 5, content: '美华的护士很专业，上门换药、测血糖都很熟练。我妈的糖尿病足伤口护理得非常好，避免了恶化。虽然贵一点但物有所值。', tags: ['专业', '医疗级', '物有所值'], is_verified_booking: true },
  { provider_slug: 'chu-hugong-jiading', rating: 4, content: '褚护工年轻力壮，照顾我爸（180斤）很有优势。能轻松抱上抱下，推轮椅也很稳。态度很好，能吃苦。', tags: ['有力气', '肯吃苦', '态度好'], is_verified_booking: true },
  { provider_slug: 'zhou-jie-putuo', rating: 4, content: '周姐整体不错，对我妈照顾得当。偶尔有些小细节需要提醒，但沟通后都能改进。总体来说值得推荐。', tags: ['态度好', '可靠'], is_verified_booking: true },
  { provider_slug: 'xu-shushu-yangpu', rating: 5, content: '徐叔叔简直是我们家的贵人。我爸脾气不好，很多护工都受不了，徐叔叔特别有办法，现在我爸不光配合护理，脾气也好多了。', tags: ['有办法', '耐心', '专业'], is_verified_booking: true },
  { provider_slug: 'qian-ayi-huangpu', rating: 5, content: '钱阿姨照顾我妈的糖尿病管理特别到位，每天按时测血糖、提醒用药。三个月下来，我妈的糖化血红蛋白从9降到7了。', tags: ['专业', '负责', '糖尿病管理'], is_verified_booking: true },
  { provider_slug: 'zheng-ayi-xuhui', rating: 4, content: '郑阿姨的专业背景让人放心，照顾老人有条理。价格略高但一分钱一分货。希望能更灵活地调整服务时间。', tags: ['专业', '有条理'], is_verified_booking: true },
];

async function main() {
  console.log('Starting seed data insertion...');
  serviceTypes = await get('service_type?select=id,name,slug');
  console.log('Service types:', serviceTypes.map(s => s.slug));
  let successCount = 0;

  for (const p of providers) {
    const { name, slug, ...rest } = p;
    console.log(`Inserting provider: ${name} (${slug})...`);

    // Insert provider
    const avg = 4.0 + Math.random() * 1.0;
    const reviews = Math.floor(Math.random() * 30) + 5;
    const result = await post('service_provider', {
      ...rest,
      name,
      slug,
      avg_rating: Math.round(avg * 10) / 10,
      review_count: 0,
      status: 'active',
      latitude: rest.latitude,
      longitude: rest.longitude,
    });

    if (!result) {
      console.error(`  Failed to insert provider ${name}`);continue;
    }
    const providerId = result[0]?.id || result?.id;
    if (!providerId) { console.error(`  No ID returned for ${name}`); continue; }

    successCount++;
    console.log(`  Provider ID: ${providerId}`);

    // Insert listings
    const listings = listingsByProvider[slug] || [];
    for (const l of listings) {
      const st = getType(l.service_type_slug);
      if (!st) { console.error(`  Service type not found: ${l.service_type_slug}`); continue; }
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

    // Insert verifications
    const verifications = verificationsByProvider[slug] || [];
    for (const v of verifications) {
      await post('verification', {
        provider_id: providerId,
        verify_type: v,
        verify_status: 'approved',
      });
    }

    // Insert provider_service_type relations
    const typeSlugs = [...new Set(listings.map(l => l.service_type_slug))];
    for (const ts of typeSlugs) {
      const st = getType(ts);
      if (!st) continue;
      await post('provider_service_type', {
        provider_id: providerId,
        service_type_id: st.id,
      });
    }
  }

  console.log(`\nInserted ${successCount} providers. Now inserting reviews...`);

  // Insert reviews
  // First get all provider IDs
  const allProviders: { id: number; slug: string }[] = await get('service_provider?select=id,slug');
  const slugToId: Record<string, number> = {};
  allProviders.forEach(p => { slugToId[p.slug] = p.id; });

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

  // Update review counts
  for (const p of allProviders) {
    const countResult = await get(`review?provider_id=eq.${p.id}&select=id`);
    const count = Array.isArray(countResult) ? countResult.length : 0;
    if (count > 0) {
      // Update avg rating
      const reviews = await get(`review?provider_id=eq.${p.id}&select=rating`);
      const ratings = Array.isArray(reviews) ? reviews.map((r: { rating: number }) => r.rating) : [];
      const avg = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
      // PATCH to update
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
    }
  }

  console.log(`\nDone! Inserted ${successCount} providers and ${reviewCount} reviews.`);
}

main().catch(console.error);
