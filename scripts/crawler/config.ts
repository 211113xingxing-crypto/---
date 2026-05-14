// Crawler configuration — city pinyin mappings, source URLs, service type keywords

export interface CrawlerConfig {
  /** Supabase REST API base URL */
  supabaseUrl: string;
  /** Supabase anonymous key */
  anonKey: string;
  /** Delay between HTTP requests in ms */
  requestDelayMs: number;
  /** Max retries per request */
  maxRetries: number;
  /** Max list pages to crawl per city */
  maxPagesPerCity: number;
  /** User-Agent header sent with requests */
  userAgent: string;
  /** 高德 Web API key (empty string = skip geocoding) */
  amapKey: string;
  /** Cache file for geocoding results */
  geocodeCacheFile: string;
}

export const config: CrawlerConfig = {
  supabaseUrl: 'https://xcfwdwmqrdtchnckutoc.supabase.co',
  anonKey: 'sb_publishable_CGU-BxL8qvbyrL3d-SJE9g_eFTXtBtL',
  requestDelayMs: 600,
  maxRetries: 3,
  maxPagesPerCity: 8,
  userAgent: 'EldercareDataBot/1.0 (public-service data aggregation; +https://elder.navi-resources.com)',
  amapKey: '',
  geocodeCacheFile: './scripts/crawler/geocode-cache.json',
};

// 31 provincial capital city pinyin mappings for yanglao.com.cn URLs
export const CITY_PINYIN: Record<string, string> = {
  beijing: 'beijing',
  tianjin: 'tianjin',
  shanghai: 'shanghai',
  chongqing: 'chongqing',
  guangzhou: 'guangzhou',
  chengdu: 'chengdu',
  wuhan: 'wuhan',
  nanjing: 'nanjing',
  hangzhou: 'hangzhou',
  xian: 'xian',
  zhengzhou: 'zhengzhou',
  jinan: 'jinan',
  shenyang: 'shenyang',
  changsha: 'changsha',
  haerbin: 'haerbin',
  changchun: 'changchun',
  shijiazhuang: 'shijiazhuang',
  taiyuan: 'taiyuan',
  hefei: 'hefei',
  fuzhou: 'fuzhou',
  nanchang: 'nanchang',
  kunming: 'kunming',
  guiyang: 'guiyang',
  nanning: 'nanning',
  haikou: 'haikou',
  lanzhou: 'lanzhou',
  xining: 'xining',
  yinchuan: 'yinchuan',
  wulumuqi: 'wulumuqi',
  huhehaote: 'huhehaote',
  lasa: 'lasa',
  shenzhen: 'shenzhen',
  wuxi: 'wuxi',
  suzhou: 'suzhou',
  qingdao: 'qingdao',
  dalian: 'dalian',
  xiamen: 'xiamen',
  ningbo: 'ningbo',
};

// Service type keyword → DB slug mapping
// Used to classify crawled services into our service_type table
export const SERVICE_KEYWORD_MAP: Record<string, string> = {
  // hugong — 居家护理 / 护工
  居家护理: 'hugong',
  上门护理: 'hugong',
  居家照护: 'hugong',
  全天照护: 'hugong',
  半天照护: 'hugong',
  护工: 'hugong',
  居家: 'hugong',
  上门: 'hugong',
  上门服务: 'hugong',
  到家护理: 'hugong',
  生活照料: 'hugong',
  个人护理: 'hugong',
  起居照料: 'hugong',
  家庭照护: 'hugong',
  社区养老: 'hugong',
  长护险: 'hugong',
  洗澡: 'hugong',
  翻身拍背: 'hugong',
  喂食: 'hugong',
  鼻饲护理: 'hugong',
  导尿管护理: 'hugong',
  压疮护理: 'hugong',
  褥疮护理: 'hugong',
  大小便护理: 'hugong',
  // peizhen — 陪诊服务
  陪诊: 'peizhen',
  陪诊服务: 'peizhen',
  就医陪诊: 'peizhen',
  医院陪护: 'peizhen',
  就医陪同: 'peizhen',
  陪同就医: 'peizhen',
  陪同看病: 'peizhen',
  代挂号: 'peizhen',
  代取药: 'peizhen',
  排队取药: 'peizhen',
  // rijian-zhaoliao — 日间照料
  日间照料: 'rijian-zhaoliao',
  日托: 'rijian-zhaoliao',
  日间照护: 'rijian-zhaoliao',
  日间护理: 'rijian-zhaoliao',
  日间托管: 'rijian-zhaoliao',
  短期托养: 'rijian-zhaoliao',
  // shuhou-kangfu — 术后康复
  术后康复: 'shuhou-kangfu',
  康复护理: 'shuhou-kangfu',
  术后护理: 'shuhou-kangfu',
  中风康复: 'shuhou-kangfu',
  康复训练: 'shuhou-kangfu',
  康复理疗: 'shuhou-kangfu',
  中医康复: 'shuhou-kangfu',
  功能训练: 'shuhou-kangfu',
  理疗: 'shuhou-kangfu',
  失智照护: 'shuhou-kangfu',
  认知障碍: 'shuhou-kangfu',
  痴呆护理: 'shuhou-kangfu',
  阿兹海默: 'shuhou-kangfu',
  物理治疗: 'shuhou-kangfu',
  作业治疗: 'shuhou-kangfu',
  言语治疗: 'shuhou-kangfu',
  // xinli-weijie — 心理慰藉
  心理慰藉: 'xinli-weijie',
  心理关怀: 'xinli-weijie',
  心理疏导: 'xinli-weijie',
  精神慰藉: 'xinli-weijie',
  精神关怀: 'xinli-weijie',
  陪伴聊天: 'xinli-weijie',
  心理支持: 'xinli-weijie',
  情绪疏导: 'xinli-weijie',
  文娱活动: 'xinli-weijie',
  社交活动: 'xinli-weijie',
  // yanglaoyuan — 养老院 (also default for all agencies)
  养老院: 'yanglaoyuan',
  敬老院: 'yanglaoyuan',
  福利院: 'yanglaoyuan',
  老年公寓: 'yanglaoyuan',
  护理院: 'yanglaoyuan',
  养老公寓: 'yanglaoyuan',
  养老社区: 'yanglaoyuan',
  长者社区: 'yanglaoyuan',
  颐养院: 'yanglaoyuan',
  养护院: 'yanglaoyuan',
  养老中心: 'yanglaoyuan',
  // linzhong-guanhuai — 临终关怀
  临终关怀: 'linzhong-guanhuai',
  安宁疗护: 'linzhong-guanhuai',
  宁养: 'linzhong-guanhuai',
  安宁护理: 'linzhong-guanhuai',
  临终: 'linzhong-guanhuai',
  安宁: 'linzhong-guanhuai',
  姑息治疗: 'linzhong-guanhuai',
  舒缓治疗: 'linzhong-guanhuai',
  宁养院: 'linzhong-guanhuai',
};

// Source registry — each source export `crawlCity(citySlug: string): Promise<ScrapedProvider[]>`
export const SOURCES: Record<string, string> = {
  yanglao: './sources/yanglao',
};

// Raw scraped provider record before transformation
export interface ScrapedProvider {
  sourceName: string;
  sourceUrl: string;
  name: string;
  citySlug: string;
  addressText: string;
  phone: string;
  intro: string;
  institutionType: string;
  priceRange: string;
  bedCount: number | null;
  rating: number;
  features: string[];
  careLevels: string[];
  districtName: string;
}
