import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/eldercare';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...\n');

  // ── Cities (31 provincial capitals + municipalities) ──
  const citiesList = [
    { name: '北京市', slug: 'beijing', lat: 39.9042, lng: 116.4074 },
    { name: '天津市', slug: 'tianjin', lat: 39.3434, lng: 117.3616 },
    { name: '上海市', slug: 'shanghai', lat: 31.2304, lng: 121.4737 },
    { name: '重庆市', slug: 'chongqing', lat: 29.4316, lng: 106.9123 },
    { name: '广州市', slug: 'guangzhou', lat: 23.1291, lng: 113.2644 },
    { name: '成都市', slug: 'chengdu', lat: 30.5728, lng: 104.0668 },
    { name: '武汉市', slug: 'wuhan', lat: 30.5928, lng: 114.3055 },
    { name: '南京市', slug: 'nanjing', lat: 32.0603, lng: 118.7969 },
    { name: '杭州市', slug: 'hangzhou', lat: 30.2741, lng: 120.1551 },
    { name: '西安市', slug: 'xian', lat: 34.3416, lng: 108.9398 },
    { name: '郑州市', slug: 'zhengzhou', lat: 34.7473, lng: 113.6254 },
    { name: '济南市', slug: 'jinan', lat: 36.6512, lng: 117.1201 },
    { name: '沈阳市', slug: 'shenyang', lat: 41.8057, lng: 123.4315 },
    { name: '长沙市', slug: 'changsha', lat: 28.2282, lng: 112.9388 },
    { name: '哈尔滨市', slug: 'haerbin', lat: 45.8038, lng: 126.5350 },
    { name: '长春市', slug: 'changchun', lat: 43.8171, lng: 125.3235 },
    { name: '石家庄市', slug: 'shijiazhuang', lat: 38.0428, lng: 114.5149 },
    { name: '太原市', slug: 'taiyuan', lat: 37.8706, lng: 112.5489 },
    { name: '合肥市', slug: 'hefei', lat: 31.8206, lng: 117.2272 },
    { name: '福州市', slug: 'fuzhou', lat: 26.0745, lng: 119.2965 },
    { name: '南昌市', slug: 'nanchang', lat: 28.6820, lng: 115.8579 },
    { name: '昆明市', slug: 'kunming', lat: 25.0389, lng: 102.7183 },
    { name: '贵阳市', slug: 'guiyang', lat: 26.6470, lng: 106.6302 },
    { name: '南宁市', slug: 'nanning', lat: 22.8170, lng: 108.3665 },
    { name: '海口市', slug: 'haikou', lat: 20.0440, lng: 110.1999 },
    { name: '兰州市', slug: 'lanzhou', lat: 36.0611, lng: 103.8343 },
    { name: '西宁市', slug: 'xining', lat: 36.6171, lng: 101.7785 },
    { name: '银川市', slug: 'yinchuan', lat: 38.4872, lng: 106.2309 },
    { name: '乌鲁木齐市', slug: 'wulumuqi', lat: 43.8256, lng: 87.6168 },
    { name: '呼和浩特市', slug: 'huhehaote', lat: 40.8424, lng: 111.7490 },
    { name: '拉萨市', slug: 'lasa', lat: 29.6500, lng: 91.1000 },
  ];
  for (const city of citiesList) {
    await prisma.city.upsert({ where: { slug: city.slug }, update: {}, create: city });
    console.log(`  ✓ City: ${city.name}`);
  }

  const shanghai = await prisma.city.findUniqueOrThrow({ where: { slug: 'shanghai' } });

  // ── Service Types ──
  const serviceTypeData = [
    { name: '居家护理', slug: 'hugong', description: '全天/半天居家照护、生活起居、康复训练、服药管理' },
    { name: '陪诊服务', slug: 'peizhen', description: '医院陪诊、代取药、检查陪同、病历整理' },
    { name: '日间照料', slug: 'rijian-zhaoliao', description: '日托服务、社区养老驿站、老年活动中心' },
    { name: '术后康复', slug: 'shuhou-kangfu', description: '术后护理、康复指导、功能训练、营养支持' },
    { name: '心理慰藉', slug: 'xinli-weijie', description: '老年陪伴、情绪疏导、认知训练' },
    { name: '养老院', slug: 'yanglaoyuan', description: '养老院、敬老院、福利院、老年公寓等机构养老资源' },
    { name: '临终关怀', slug: 'linzhong-guanhuai', description: '安宁疗护、临终关怀、宁养服务、疼痛管理' },
  ];
  const serviceTypes: Record<string, { id: number }> = {};
  for (const st of serviceTypeData) {
    const record = await prisma.serviceType.upsert({
      where: { slug: st.slug },
      update: {},
      create: st,
    });
    serviceTypes[st.slug] = record;
    console.log(`  ✓ ServiceType: ${record.name}`);
  }

  // ── Districts (all 16) ──
  const districtData = [
    { name: '黄浦区', slug: 'huangpu-qu', lat: 31.2313, lng: 121.4695 },
    { name: '徐汇区', slug: 'xuhui-qu', lat: 31.1886, lng: 121.4365 },
    { name: '长宁区', slug: 'changning-qu', lat: 31.2204, lng: 121.4232 },
    { name: '静安区', slug: 'jingan-qu', lat: 31.2284, lng: 121.4491 },
    { name: '普陀区', slug: 'putuo-qu', lat: 31.2496, lng: 121.3970 },
    { name: '虹口区', slug: 'hongkou-qu', lat: 31.2646, lng: 121.5051 },
    { name: '杨浦区', slug: 'yangpu-qu', lat: 31.2595, lng: 121.5257 },
    { name: '浦东新区', slug: 'pudong-xinqu', lat: 31.2213, lng: 121.5447 },
    { name: '闵行区', slug: 'minhang-qu', lat: 31.1128, lng: 121.3817 },
    { name: '宝山区', slug: 'baoshan-qu', lat: 31.4053, lng: 121.4895 },
    { name: '嘉定区', slug: 'jiading-qu', lat: 31.3756, lng: 121.2663 },
    { name: '松江区', slug: 'songjiang-qu', lat: 31.0322, lng: 121.2277 },
    { name: '青浦区', slug: 'qingpu-qu', lat: 31.1507, lng: 121.1242 },
    { name: '奉贤区', slug: 'fengxian-qu', lat: 30.9181, lng: 121.4739 },
    { name: '金山区', slug: 'jinshan-qu', lat: 30.7412, lng: 121.3423 },
    { name: '崇明区', slug: 'chongming-qu', lat: 31.6233, lng: 121.3973 },
  ];
  const districts: Record<string, { id: number }> = {};
  for (const d of districtData) {
    const record = await prisma.district.upsert({
      where: { cityId_slug: { cityId: shanghai.id, slug: d.slug } },
      update: {},
      create: { ...d, level: 'district', cityId: shanghai.id },
    });
    districts[d.slug] = record;
    console.log(`  ✓ District: ${d.name}`);
  }

  // ── Sub-districts (sample for each district) ──
  const subDistrictMap: Record<string, string[]> = {
    'huangpu-qu': ['南京东路街道', '外滩街道', '豫园街道', '老西门街道'],
    'xuhui-qu': ['徐家汇街道', '天平路街道', '湖南路街道', '田林街道'],
    'changning-qu': ['华阳路街道', '天山街道', '仙霞新村街道', '虹桥街道'],
    'jingan-qu': ['静安寺街道', '南京西路街道', '石门二路街道', '江宁路街道'],
    'pudong-xinqu': ['陆家嘴街道', '花木街道', '塘桥街道', '金杨新村街道'],
    'hongkou-qu': ['四川北路街道', '欧阳路街道', '广中路街道', '凉城新村街道'],
    'yangpu-qu': ['五角场街道', '控江路街道', '长白新村街道', '殷行街道'],
    'putuo-qu': ['长寿路街道', '曹杨新村街道', '长风新村街道', '真如镇街道'],
  };

  for (const [dSlug, subNames] of Object.entries(subDistrictMap)) {
    const parent = districts[dSlug];
    if (!parent) continue;
    for (const name of subNames) {
      const slug = name
        .replace(/[^一-龥a-zA-Z]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
      await prisma.district.upsert({
        where: { cityId_slug: { cityId: shanghai.id, slug } },
        update: {},
        create: {
          name,
          slug,
          level: 'sub_district',
          cityId: shanghai.id,
          parentId: parent.id,
          lat: 0,
          lng: 0,
        },
      });
    }
    console.log(`  ✓ Sub-districts for ${dSlug}: ${subNames.length}`);
  }

  // ── Key City Districts (Beijing, Guangzhou, Chengdu, Hangzhou, Wuhan) ──
  const keyCityDistricts: Record<string, { name: string; slug: string; lat: number; lng: number }[]> = {
    beijing: [
      { name: '东城区', slug: 'dongcheng-qu', lat: 39.9289, lng: 116.4164 },
      { name: '西城区', slug: 'xicheng-qu', lat: 39.9123, lng: 116.3659 },
      { name: '朝阳区', slug: 'chaoyang-qu', lat: 39.9215, lng: 116.4434 },
      { name: '海淀区', slug: 'haidian-qu', lat: 39.9598, lng: 116.2982 },
      { name: '丰台区', slug: 'fengtai-qu', lat: 39.8585, lng: 116.2870 },
      { name: '石景山区', slug: 'shijingshan-qu', lat: 39.9057, lng: 116.2229 },
      { name: '通州区', slug: 'tongzhou-qu', lat: 39.9021, lng: 116.6572 },
      { name: '大兴区', slug: 'daxing-qu', lat: 39.7268, lng: 116.3386 },
      { name: '昌平区', slug: 'changping-qu', lat: 40.2206, lng: 116.2312 },
      { name: '顺义区', slug: 'shunyi-qu', lat: 40.1302, lng: 116.6544 },
    ],
    guangzhou: [
      { name: '天河区', slug: 'tianhe-qu', lat: 23.1247, lng: 113.3612 },
      { name: '越秀区', slug: 'yuexiu-qu', lat: 23.1286, lng: 113.2668 },
      { name: '海珠区', slug: 'haizhu-qu', lat: 23.0833, lng: 113.3172 },
      { name: '荔湾区', slug: 'liwan-qu', lat: 23.1257, lng: 113.2439 },
      { name: '白云区', slug: 'baiyun-qu', lat: 23.1574, lng: 113.2732 },
      { name: '番禺区', slug: 'panyu-qu', lat: 22.9378, lng: 113.3844 },
      { name: '黄埔区', slug: 'huangpu-qu', lat: 23.1064, lng: 113.4597 },
      { name: '花都区', slug: 'huadu-qu', lat: 23.4039, lng: 113.2203 },
    ],
    chengdu: [
      { name: '锦江区', slug: 'jinjiang-qu', lat: 30.6558, lng: 104.0837 },
      { name: '青羊区', slug: 'qingyang-qu', lat: 30.6744, lng: 104.0613 },
      { name: '金牛区', slug: 'jinniu-qu', lat: 30.6912, lng: 104.0527 },
      { name: '武侯区', slug: 'wuhou-qu', lat: 30.6419, lng: 104.0433 },
      { name: '成华区', slug: 'chenghua-qu', lat: 30.6601, lng: 104.1019 },
      { name: '高新区', slug: 'gaoxin-qu', lat: 30.5965, lng: 104.0547 },
      { name: '双流区', slug: 'shuangliu-qu', lat: 30.5745, lng: 103.9238 },
      { name: '龙泉驿区', slug: 'longquanyi-qu', lat: 30.5565, lng: 104.2749 },
    ],
    hangzhou: [
      { name: '上城区', slug: 'shangcheng-qu', lat: 30.2426, lng: 120.1692 },
      { name: '拱墅区', slug: 'gongshu-qu', lat: 30.3191, lng: 120.1414 },
      { name: '西湖区', slug: 'xihu-qu', lat: 30.2597, lng: 120.1302 },
      { name: '滨江区', slug: 'binjiang-qu', lat: 30.2086, lng: 120.2121 },
      { name: '萧山区', slug: 'xiaoshan-qu', lat: 30.1853, lng: 120.2646 },
      { name: '余杭区', slug: 'yuhang-qu', lat: 30.4190, lng: 120.2993 },
      { name: '临平区', slug: 'linping-qu', lat: 30.4212, lng: 120.2990 },
    ],
    wuhan: [
      { name: '武昌区', slug: 'wuchang-qu', lat: 30.5539, lng: 114.3159 },
      { name: '江岸区', slug: 'jiangan-qu', lat: 30.5992, lng: 114.3091 },
      { name: '江汉区', slug: 'jianghan-qu', lat: 30.6014, lng: 114.2707 },
      { name: '洪山区', slug: 'hongshan-qu', lat: 30.5002, lng: 114.3436 },
      { name: '汉阳区', slug: 'hanyang-qu', lat: 30.5547, lng: 114.2181 },
      { name: '青山区', slug: 'qingshan-qu', lat: 30.6401, lng: 114.3855 },
      { name: '硚口区', slug: 'qiaokou-qu', lat: 30.5816, lng: 114.2148 },
      { name: '东西湖区', slug: 'dongxihu-qu', lat: 30.6200, lng: 114.1370 },
    ],
  };

  for (const [citySlug, districtList] of Object.entries(keyCityDistricts)) {
    const city = await prisma.city.findUnique({ where: { slug: citySlug } });
    if (!city) continue;
    for (const d of districtList) {
      await prisma.district.upsert({
        where: { cityId_slug: { cityId: city.id, slug: d.slug } },
        update: {},
        create: { ...d, level: 'district', cityId: city.id },
      });
    }
    console.log(`  ✓ ${city.name} districts: ${districtList.length}`);
  }

  // ── Seed Providers ──
  const providers = [
    {
      providerType: 'individual' as const,
      name: '王阿姨', slug: 'wang-ayi-changning',
      phone: '13812346789', wechatId: 'wang_ayi_care',
      bio: '10年居家养老护理经验，曾在三甲医院老年科工作3年。擅长术后康复护理和失能老人日常照护，尤其对髋关节/膝关节术后康复有丰富经验。性格温和有耐心，深受老人和家属信赖。持有高级养老护理员证书和红十字会急救证。',
      yearsExperience: 10, gender: '女', age: 52, verified: true,
      districtSlug: 'changning-qu', latitude: 31.216, longitude: 121.406,
      addressText: '上海市长宁区天山街道',
      serviceTypeSlugs: ['hugong', 'shuhou-kangfu'],
      verifications: ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
    },
    {
      providerType: 'individual' as const,
      name: '李叔叔', slug: 'li-shushu-jingan',
      phone: '13912348901', wechatId: 'li_care_giver',
      bio: '8年养老陪护经验，曾照顾过多位失智老人。擅长阿尔茨海默症老人的日常照护和情绪安抚。有耐心、力气大，可以协助行动不便的老人转移和外出。',
      yearsExperience: 8, gender: '男', age: 55, verified: true,
      districtSlug: 'jingan-qu', latitude: 31.228, longitude: 121.453,
      addressText: '上海市静安区南京西路街道',
      serviceTypeSlugs: ['hugong', 'peizhen'],
      verifications: ['id_card', 'nurse_cert', 'health_cert'],
    },
    {
      providerType: 'individual' as const,
      name: '张阿姨', slug: 'zhang-ayi-pudong',
      phone: '13712343456', wechatId: 'zhang_nurse_pd',
      bio: '12年专业养老护理经验，原华山医院老年科护士。擅长各类慢性病老人护理，包括高血压、糖尿病、中风后遗症的日常管理。能够进行生命体征监测、胰岛素注射等基础医疗操作。',
      yearsExperience: 12, gender: '女', age: 48, verified: true,
      districtSlug: 'pudong-xinqu', latitude: 31.235, longitude: 121.519,
      addressText: '上海市浦东新区陆家嘴街道',
      serviceTypeSlugs: ['hugong', 'peizhen', 'shuhou-kangfu', 'rijian-zhaoliao'],
      verifications: ['id_card', 'nurse_cert', 'health_cert', 'background_check'],
    },
    {
      providerType: 'agency' as const,
      name: '安康护理站', slug: 'ankang-huli-pudong',
      phone: '021-50808888', wechatId: 'ankang_care_center',
      bio: '安康护理站是经上海市卫健委批准设立的专业社区护理机构，拥有20余名持证护工和护士。提供从日常照护到专业医疗护理的全方位服务。',
      yearsExperience: null, verified: true,
      districtSlug: 'pudong-xinqu', latitude: 31.211, longitude: 121.548,
      addressText: '上海市浦东新区花木街道',
      serviceTypeSlugs: ['hugong', 'peizhen', 'rijian-zhaoliao'],
      verifications: ['id_card', 'nurse_cert'],
    },
    {
      providerType: 'individual' as const,
      name: '赵阿姨', slug: 'zhao-ayi-xuhui',
      phone: '13612347890', wechatId: 'zhao_care_xh',
      bio: '6年居家养老服务经验，性格开朗，擅长与老人沟通。主要服务生活半自理老人，提供日间照护、做饭、打扫、陪伴聊天、陪同散步等。',
      yearsExperience: 6, gender: '女', age: 50, verified: true,
      districtSlug: 'xuhui-qu', latitude: 31.168, longitude: 121.430,
      addressText: '上海市徐汇区田林街道',
      serviceTypeSlugs: ['hugong'],
      verifications: ['id_card', 'nurse_cert'],
    },
    {
      providerType: 'agency' as const,
      name: '颐养天年护理中心', slug: 'yiyang-tiannian-hongkou',
      phone: '021-36301666', wechatId: 'yiyang_hongkou',
      bio: '虹口区口碑领先的养老服务机构，提供居家护理和日间照料双重服务。团队均持证上岗，特别擅长中风后遗症康复护理。',
      yearsExperience: null, verified: true,
      districtSlug: 'hongkou-qu', latitude: 31.262, longitude: 121.484,
      addressText: '上海市虹口区四川北路街道',
      serviceTypeSlugs: ['hugong', 'rijian-zhaoliao', 'shuhou-kangfu'],
      verifications: ['nurse_cert'],
    },
    {
      providerType: 'individual' as const,
      name: '孙姐', slug: 'sun-jie-yangpu',
      phone: '13512345678', wechatId: 'sun_care_yp',
      bio: '7年养老护理经验，曾在杨浦区中心医院做护工3年。擅长心脑血管疾病老人护理、血压血糖监测。为人朴实勤快，主要服务杨浦区和虹口区。',
      yearsExperience: 7, gender: '女', age: 45, verified: true,
      districtSlug: 'yangpu-qu', latitude: 31.269, longitude: 121.528,
      addressText: '上海市杨浦区五角场街道',
      serviceTypeSlugs: ['hugong', 'peizhen'],
      verifications: ['id_card', 'nurse_cert', 'health_cert'],
    },
    {
      providerType: 'individual' as const,
      name: '刘阿姨', slug: 'liu-ayi-putuo',
      phone: '13212348901', wechatId: 'liu_care_pt',
      bio: '9年居家养老服务经验，特别擅长照顾独居老人。不仅是护工，更像是老人的家庭陪伴。会做一手好菜，特别会煲汤。',
      yearsExperience: 9, gender: '女', age: 51, verified: true,
      districtSlug: 'putuo-qu', latitude: 31.252, longitude: 121.400,
      addressText: '上海市普陀区长寿路街道',
      serviceTypeSlugs: ['hugong', 'xinli-weijie'],
      verifications: ['id_card', 'nurse_cert'],
    },
    {
      providerType: 'individual' as const,
      name: '陈护工', slug: 'chen-hugong-huangpu',
      phone: '13112346789', wechatId: 'chen_care_hp',
      bio: '5年黄浦区居家护理经验，擅长术后短期护理和陪诊。熟悉瑞金医院、长征医院等三甲医院的就诊流程，能高效完成陪诊和代取药。',
      yearsExperience: 5, gender: '男', age: 42, verified: true,
      districtSlug: 'huangpu-qu', latitude: 31.230, longitude: 121.470,
      addressText: '上海市黄浦区老西门街道',
      serviceTypeSlugs: ['hugong', 'peizhen'],
      verifications: ['id_card', 'nurse_cert'],
    },
    {
      providerType: 'agency' as const,
      name: '乐享颐年养老服务公司', slug: 'lexiang-yinian-minhang',
      phone: '021-64901234', wechatId: 'lexiang_care',
      bio: '闵行区大型综合养老服务机构，旗下50余名专业护工，覆盖居家护理、日间照料、康复理疗等全方位服务。与多家三甲医院建立合作转诊通道。',
      yearsExperience: null, verified: true,
      districtSlug: 'minhang-qu', latitude: 31.113, longitude: 121.382,
      addressText: '上海市闵行区莘庄镇',
      serviceTypeSlugs: ['hugong', 'peizhen', 'rijian-zhaoliao', 'shuhou-kangfu'],
      verifications: ['nurse_cert'],
    },
  ];

  for (const p of providers) {
    const { districtSlug, serviceTypeSlugs, verifications, ...providerData } = p;

    const district = districts[districtSlug];
    if (!district) { console.log(`  ⚠ District not found: ${districtSlug}`); continue; }

    const provider = await prisma.serviceProvider.upsert({
      where: { slug: providerData.slug },
      update: {},
      create: {
        ...providerData,
        districtId: district.id,
        cityId: shanghai.id,
        status: 'active',
      },
    });

    // Link service types
    for (const stSlug of serviceTypeSlugs) {
      const st = serviceTypes[stSlug];
      if (!st) continue;
      await prisma.providerServiceType.upsert({
        where: { providerId_serviceTypeId: { providerId: provider.id, serviceTypeId: st.id } },
        update: {},
        create: { providerId: provider.id, serviceTypeId: st.id },
      });
    }

    // Create verifications
    for (const vt of verifications) {
      await prisma.verification.upsert({
        where: { id: provider.id * 100 + verifications.indexOf(vt) }, // dummy unique
        update: {},
        create: {
          providerId: provider.id,
          verifyType: vt,
          verifyStatus: 'approved',
          verifiedAt: new Date(),
        },
      });
    }

    // Create sample service listings based on types
    const listingTemplates: Record<string, Array<{ title: string; desc: string; price: number; unit: string }>> = {
      hugong: [
        { title: '全天居家照护', desc: '24小时住家护理', price: 200, unit: 'day' },
        { title: '半天居家照护', desc: '8小时日间照护', price: 120, unit: 'day' },
      ],
      peizhen: [
        { title: '医院陪诊', desc: '陪同就医、取药、检查', price: 150, unit: 'per_visit' },
      ],
      'rijian-zhaoliao': [
        { title: '日间照料', desc: '8小时日托，含午餐和活动', price: 100, unit: 'day' },
      ],
      'shuhou-kangfu': [
        { title: '术后康复护理', desc: '专业康复指导和训练', price: 250, unit: 'day' },
      ],
      'xinli-weijie': [
        { title: '心理陪伴', desc: '情感陪伴、聊天交流', price: 100, unit: 'day' },
      ],
    };

    for (const stSlug of serviceTypeSlugs) {
      const templates = listingTemplates[stSlug];
      if (!templates) continue;
      const st = serviceTypes[stSlug];
      if (!st) continue;
      for (const tpl of templates) {
        await prisma.serviceListing.create({
          data: {
            providerId: provider.id,
            serviceTypeId: st.id,
            title: tpl.title,
            description: tpl.desc,
            price: tpl.price,
            priceUnit: tpl.unit,
          },
        });
      }
    }

    console.log(`  ✓ Provider: ${provider.name} (${districtSlug})`);
  }

  console.log(`\n✅ Seed completed!`);
  console.log(`   Cities: 1`);
  console.log(`   Districts: ${districtData.length}`);
  console.log(`   Service types: ${serviceTypeData.length}`);
  console.log(`   Providers: ${providers.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
