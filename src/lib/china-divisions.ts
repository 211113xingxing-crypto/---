// Chinese administrative divisions: province → cities mapping
// Used for province landing pages and sitemap generation

export interface ProvinceInfo {
  name: string;
  slug: string;
  cities: string[]; // city slugs in this province
}

// City slug → province slug lookup (all 345 cities)
export const CITY_TO_PROVINCE: Record<string, string> = {
  // Municipalities
  beijing: 'beijing',
  tianjin: 'tianjin',
  shanghai: 'shanghai',
  chongqing: 'chongqing',

  // Hebei
  shijiazhuang: 'hebei', tangshan: 'hebei', qinhuangdao: 'hebei',
  handan: 'hebei', xingtai: 'hebei', baoding: 'hebei',
  zhangjiakou: 'hebei', chengde: 'hebei', cangzhou: 'hebei',
  langfang: 'hebei', hengshui: 'hebei',

  // Shanxi
  taiyuan: 'shanxi', datong: 'shanxi', yangquan: 'shanxi',
  changzhi: 'shanxi', jincheng: 'shanxi', shuozhou: 'shanxi',
  jinzhong: 'shanxi', yuncheng: 'shanxi', xinzhou: 'shanxi',
  linfen: 'shanxi', lvliang: 'shanxi',

  // Neimenggu
  huhehaote: 'neimenggu', baotou: 'neimenggu', wuhai: 'neimenggu',
  chifeng: 'neimenggu', tongliao: 'neimenggu', eerduosi: 'neimenggu',
  hulunbeier: 'neimenggu', bayannaoer: 'neimenggu', wulanchabu: 'neimenggu',
  xinganmeng: 'neimenggu', xilinguolemeng: 'neimenggu', alashanmeng: 'neimenggu',

  // Liaoning
  shenyang: 'liaoning', dalian: 'liaoning', anshan: 'liaoning',
  fushun: 'liaoning', benxi: 'liaoning', dandong: 'liaoning',
  jinzhou: 'liaoning', yingkou: 'liaoning', fuxin: 'liaoning',
  liaoyang: 'liaoning', panjin: 'liaoning', tieling: 'liaoning',
  'chaoyang-ln': 'liaoning', huludao: 'liaoning',

  // Jilin
  changchun: 'jilin', jilin: 'jilin', siping: 'jilin',
  liaoyuan: 'jilin', tonghua: 'jilin', baishan: 'jilin',
  songyuan: 'jilin', baicheng: 'jilin', yanbian: 'jilin',

  // Heilongjiang
  haerbin: 'heilongjiang', qiqihaer: 'heilongjiang', jixi: 'heilongjiang',
  hegang: 'heilongjiang', shuangyashan: 'heilongjiang', daqing: 'heilongjiang',
  yichun: 'heilongjiang', jiamusi: 'heilongjiang', qitaihe: 'heilongjiang',
  mudanjiang: 'heilongjiang', heihe: 'heilongjiang', suihua: 'heilongjiang',
  daxinganling: 'heilongjiang',

  // Jiangsu
  nanjing: 'jiangsu', wuxi: 'jiangsu', xuzhou: 'jiangsu',
  changzhou: 'jiangsu', suzhou: 'jiangsu', nantong: 'jiangsu',
  lianyungang: 'jiangsu', huaian: 'jiangsu', yancheng: 'jiangsu',
  yangzhou: 'jiangsu', zhenjiang: 'jiangsu', 'taizhou-js': 'jiangsu',
  suqian: 'jiangsu',

  // Zhejiang
  hangzhou: 'zhejiang', ningbo: 'zhejiang', wenzhou: 'zhejiang',
  jiaxing: 'zhejiang', huzhou: 'zhejiang', shaoxing: 'zhejiang',
  jinhua: 'zhejiang', quzhou: 'zhejiang', zhoushan: 'zhejiang',
  'taizhou-zj': 'zhejiang', lishui: 'zhejiang',

  // Anhui
  hefei: 'anhui', wuhu: 'anhui', bengbu: 'anhui',
  huainan: 'anhui', maanshan: 'anhui', huaibei: 'anhui',
  tongling: 'anhui', anqing: 'anhui', huangshan: 'anhui',
  chuzhou: 'anhui', fuyang: 'anhui', 'suzhou-ah': 'anhui',
  luan: 'anhui', bozhou: 'anhui', chizhou: 'anhui',
  xuancheng: 'anhui',

  // Fujian
  fuzhou: 'fujian', xiamen: 'fujian', putian: 'fujian',
  sanming: 'fujian', quanzhou: 'fujian', zhangzhou: 'fujian',
  nanping: 'fujian', longyan: 'fujian', ningde: 'fujian',

  // Jiangxi
  nanchang: 'jiangxi', jingdezhen: 'jiangxi', pingxiang: 'jiangxi',
  jiujiang: 'jiangxi', xinyu: 'jiangxi', yingtan: 'jiangxi',
  ganzhou: 'jiangxi', jian: 'jiangxi', 'yichun-jx': 'jiangxi',
  'fuzhou-jx': 'jiangxi', shangrao: 'jiangxi',

  // Shandong
  jinan: 'shandong', qingdao: 'shandong', zibo: 'shandong',
  zaozhuang: 'shandong', dongying: 'shandong', yantai: 'shandong',
  weifang: 'shandong', jining: 'shandong', taian: 'shandong',
  weihai: 'shandong', rizhao: 'shandong', linyi: 'shandong',
  dezhou: 'shandong', liaocheng: 'shandong', binzhou: 'shandong',
  heze: 'shandong',

  // Henan
  zhengzhou: 'henan', kaifeng: 'henan', luoyang: 'henan',
  pingdingshan: 'henan', anyang: 'henan', hebi: 'henan',
  xinxiang: 'henan', jiaozuo: 'henan', puyang: 'henan',
  xuchang: 'henan', luohe: 'henan', sanmenxia: 'henan',
  nanyang: 'henan', shangqiu: 'henan', xinyang: 'henan',
  zhoukou: 'henan', zhumadian: 'henan',

  // Hubei
  wuhan: 'hubei', huangshi: 'hubei', shiyan: 'hubei',
  yichang: 'hubei', xiangyang: 'hubei', ezhou: 'hubei',
  jingmen: 'hubei', xiaogan: 'hubei', jingzhou: 'hubei',
  huanggang: 'hubei', xianning: 'hubei', suizhou: 'hubei',
  enshi: 'hubei',

  // Hunan
  changsha: 'hunan', zhuzhou: 'hunan', xiangtan: 'hunan',
  hengyang: 'hunan', shaoyang: 'hunan', yueyang: 'hunan',
  changde: 'hunan', zhangjiajie: 'hunan', yiyang: 'hunan',
  chenzhou: 'hunan', yongzhou: 'hunan', huaihua: 'hunan',
  loudi: 'hunan', xiangxi: 'hunan',

  // Guangdong
  guangzhou: 'guangdong', shaoguan: 'guangdong', shenzhen: 'guangdong',
  zhuhai: 'guangdong', shantou: 'guangdong', foshan: 'guangdong',
  jiangmen: 'guangdong', zhanjiang: 'guangdong', maoming: 'guangdong',
  zhaoqing: 'guangdong', huizhou: 'guangdong', meizhou: 'guangdong',
  shanwei: 'guangdong', heyuan: 'guangdong', yangjiang: 'guangdong',
  qingyuan: 'guangdong', dongguan: 'guangdong', zhongshan: 'guangdong',
  chaozhou: 'guangdong', jieyang: 'guangdong', yunfu: 'guangdong',

  // Guangxi
  nanning: 'guangxi', liuzhou: 'guangxi', guilin: 'guangxi',
  wuzhou: 'guangxi', beihai: 'guangxi', fangchenggang: 'guangxi',
  qinzhou: 'guangxi', guigang: 'guangxi', yulin: 'guangxi',
  baise: 'guangxi', hezhou: 'guangxi', hechi: 'guangxi',
  laibin: 'guangxi', chongzuo: 'guangxi',

  // Hainan
  haikou: 'hainan', sanya: 'hainan', sansha: 'hainan',
  danzhou: 'hainan',

  // Sichuan
  chengdu: 'sichuan', zigong: 'sichuan', panzhihua: 'sichuan',
  luzhou: 'sichuan', deyang: 'sichuan', mianyang: 'sichuan',
  guangyuan: 'sichuan', suining: 'sichuan', neijiang: 'sichuan',
  leshan: 'sichuan', nanchong: 'sichuan', meishan: 'sichuan',
  yibin: 'sichuan', guangan: 'sichuan', dazhou: 'sichuan',
  yaan: 'sichuan', bazhong: 'sichuan', ziyang: 'sichuan',
  aba: 'sichuan', ganzi: 'sichuan', liangshan: 'sichuan',

  // Guizhou
  guiyang: 'guizhou', liupanshui: 'guizhou', zunyi: 'guizhou',
  anshun: 'guizhou', bijie: 'guizhou', tongren: 'guizhou',
  qianxinan: 'guizhou', qiandongnan: 'guizhou', qiannan: 'guizhou',

  // Yunnan
  kunming: 'yunnan', qujing: 'yunnan', yuxi: 'yunnan',
  baoshan: 'yunnan', zhaotong: 'yunnan', lijiang: 'yunnan',
  puer: 'yunnan', lincang: 'yunnan', chuxiong: 'yunnan',
  honghe: 'yunnan', wenshan: 'yunnan', xishuangbanna: 'yunnan',
  dali: 'yunnan', dehong: 'yunnan', nujiang: 'yunnan',
  diqing: 'yunnan',

  // Xizang
  lasa: 'xizang', rikaze: 'xizang', changdu: 'xizang',
  linzhi: 'xizang', shannan: 'xizang', naqu: 'xizang',
  ali: 'xizang',

  // Shaanxi
  xian: 'shaanxi', tongchuan: 'shaanxi', baoji: 'shaanxi',
  xianyang: 'shaanxi', weinan: 'shaanxi', yanan: 'shaanxi',
  hanzhong: 'shaanxi', 'yulin-sn': 'shaanxi', ankang: 'shaanxi',
  shangluo: 'shaanxi',

  // Gansu
  lanzhou: 'gansu', jiayuguan: 'gansu', jinchang: 'gansu',
  baiyin: 'gansu', tianshui: 'gansu', wuwei: 'gansu',
  zhangye: 'gansu', pingliang: 'gansu', jiuquan: 'gansu',
  qingyang: 'gansu', dingxi: 'gansu', longnan: 'gansu',
  linxia: 'gansu', gannan: 'gansu',

  // Qinghai
  xining: 'qinghai', haidong: 'qinghai', haibei: 'qinghai',
  huangnan: 'qinghai', 'hainan-z': 'qinghai', guoluo: 'qinghai',
  yushu: 'qinghai', haixi: 'qinghai',

  // Ningxia
  yinchuan: 'ningxia', shizuishan: 'ningxia', wuzhong: 'ningxia',
  guyuan: 'ningxia', zhongwei: 'ningxia',

  // Xinjiang
  wulumuqi: 'xinjiang', kelamayi: 'xinjiang', tulufan: 'xinjiang',
  hami: 'xinjiang', changji: 'xinjiang', boertala: 'xinjiang',
  bayinguoleng: 'xinjiang', akesu: 'xinjiang', kezilesu: 'xinjiang',
  kashi: 'xinjiang', hetian: 'xinjiang', yili: 'xinjiang',
  tacheng: 'xinjiang', aletai: 'xinjiang',

  // Taiwan
  taibei: 'taiwan', gaoxiong: 'taiwan', taizhong: 'taiwan',
  tainan: 'taiwan', jilong: 'taiwan', xinzhu: 'taiwan',

  // SARs
  xianggang: 'xianggang',
  aomen: 'aomen',
};

export const PROVINCES: ProvinceInfo[] = [
  { name: '北京市', slug: 'beijing', cities: ['beijing'] },
  { name: '天津市', slug: 'tianjin', cities: ['tianjin'] },
  { name: '上海市', slug: 'shanghai', cities: ['shanghai'] },
  { name: '重庆市', slug: 'chongqing', cities: ['chongqing'] },
  {
    name: '河北省', slug: 'hebei',
    cities: ['shijiazhuang', 'tangshan', 'qinhuangdao', 'handan', 'xingtai', 'baoding', 'zhangjiakou', 'chengde', 'cangzhou', 'langfang', 'hengshui'],
  },
  {
    name: '山西省', slug: 'shanxi',
    cities: ['taiyuan', 'datong', 'yangquan', 'changzhi', 'jincheng', 'shuozhou', 'jinzhong', 'yuncheng', 'xinzhou', 'linfen', 'lvliang'],
  },
  {
    name: '内蒙古', slug: 'neimenggu',
    cities: ['huhehaote', 'baotou', 'wuhai', 'chifeng', 'tongliao', 'eerduosi', 'hulunbeier', 'bayannaoer', 'wulanchabu', 'xinganmeng', 'xilinguolemeng', 'alashanmeng'],
  },
  {
    name: '辽宁省', slug: 'liaoning',
    cities: ['shenyang', 'dalian', 'anshan', 'fushun', 'benxi', 'dandong', 'jinzhou', 'yingkou', 'fuxin', 'liaoyang', 'panjin', 'tieling', 'chaoyang-ln', 'huludao'],
  },
  {
    name: '吉林省', slug: 'jilin',
    cities: ['changchun', 'jilin', 'siping', 'liaoyuan', 'tonghua', 'baishan', 'songyuan', 'baicheng', 'yanbian'],
  },
  {
    name: '黑龙江省', slug: 'heilongjiang',
    cities: ['haerbin', 'qiqihaer', 'jixi', 'hegang', 'shuangyashan', 'daqing', 'yichun', 'jiamusi', 'qitaihe', 'mudanjiang', 'heihe', 'suihua', 'daxinganling'],
  },
  {
    name: '江苏省', slug: 'jiangsu',
    cities: ['nanjing', 'wuxi', 'xuzhou', 'changzhou', 'suzhou', 'nantong', 'lianyungang', 'huaian', 'yancheng', 'yangzhou', 'zhenjiang', 'taizhou-js', 'suqian'],
  },
  {
    name: '浙江省', slug: 'zhejiang',
    cities: ['hangzhou', 'ningbo', 'wenzhou', 'jiaxing', 'huzhou', 'shaoxing', 'jinhua', 'quzhou', 'zhoushan', 'taizhou-zj', 'lishui'],
  },
  {
    name: '安徽省', slug: 'anhui',
    cities: ['hefei', 'wuhu', 'bengbu', 'huainan', 'maanshan', 'huaibei', 'tongling', 'anqing', 'huangshan', 'chuzhou', 'fuyang', 'suzhou-ah', 'luan', 'bozhou', 'chizhou', 'xuancheng'],
  },
  {
    name: '福建省', slug: 'fujian',
    cities: ['fuzhou', 'xiamen', 'putian', 'sanming', 'quanzhou', 'zhangzhou', 'nanping', 'longyan', 'ningde'],
  },
  {
    name: '江西省', slug: 'jiangxi',
    cities: ['nanchang', 'jingdezhen', 'pingxiang', 'jiujiang', 'xinyu', 'yingtan', 'ganzhou', 'jian', 'yichun-jx', 'fuzhou-jx', 'shangrao'],
  },
  {
    name: '山东省', slug: 'shandong',
    cities: ['jinan', 'qingdao', 'zibo', 'zaozhuang', 'dongying', 'yantai', 'weifang', 'jining', 'taian', 'weihai', 'rizhao', 'linyi', 'dezhou', 'liaocheng', 'binzhou', 'heze'],
  },
  {
    name: '河南省', slug: 'henan',
    cities: ['zhengzhou', 'kaifeng', 'luoyang', 'pingdingshan', 'anyang', 'hebi', 'xinxiang', 'jiaozuo', 'puyang', 'xuchang', 'luohe', 'sanmenxia', 'nanyang', 'shangqiu', 'xinyang', 'zhoukou', 'zhumadian'],
  },
  {
    name: '湖北省', slug: 'hubei',
    cities: ['wuhan', 'huangshi', 'shiyan', 'yichang', 'xiangyang', 'ezhou', 'jingmen', 'xiaogan', 'jingzhou', 'huanggang', 'xianning', 'suizhou', 'enshi'],
  },
  {
    name: '湖南省', slug: 'hunan',
    cities: ['changsha', 'zhuzhou', 'xiangtan', 'hengyang', 'shaoyang', 'yueyang', 'changde', 'zhangjiajie', 'yiyang', 'chenzhou', 'yongzhou', 'huaihua', 'loudi', 'xiangxi'],
  },
  {
    name: '广东省', slug: 'guangdong',
    cities: ['guangzhou', 'shaoguan', 'shenzhen', 'zhuhai', 'shantou', 'foshan', 'jiangmen', 'zhanjiang', 'maoming', 'zhaoqing', 'huizhou', 'meizhou', 'shanwei', 'heyuan', 'yangjiang', 'qingyuan', 'dongguan', 'zhongshan', 'chaozhou', 'jieyang', 'yunfu'],
  },
  {
    name: '广西', slug: 'guangxi',
    cities: ['nanning', 'liuzhou', 'guilin', 'wuzhou', 'beihai', 'fangchenggang', 'qinzhou', 'guigang', 'yulin', 'baise', 'hezhou', 'hechi', 'laibin', 'chongzuo'],
  },
  {
    name: '海南省', slug: 'hainan',
    cities: ['haikou', 'sanya', 'sansha', 'danzhou'],
  },
  {
    name: '四川省', slug: 'sichuan',
    cities: ['chengdu', 'zigong', 'panzhihua', 'luzhou', 'deyang', 'mianyang', 'guangyuan', 'suining', 'neijiang', 'leshan', 'nanchong', 'meishan', 'yibin', 'guangan', 'dazhou', 'yaan', 'bazhong', 'ziyang', 'aba', 'ganzi', 'liangshan'],
  },
  {
    name: '贵州省', slug: 'guizhou',
    cities: ['guiyang', 'liupanshui', 'zunyi', 'anshun', 'bijie', 'tongren', 'qianxinan', 'qiandongnan', 'qiannan'],
  },
  {
    name: '云南省', slug: 'yunnan',
    cities: ['kunming', 'qujing', 'yuxi', 'baoshan', 'zhaotong', 'lijiang', 'puer', 'lincang', 'chuxiong', 'honghe', 'wenshan', 'xishuangbanna', 'dali', 'dehong', 'nujiang', 'diqing'],
  },
  {
    name: '西藏', slug: 'xizang',
    cities: ['lasa', 'rikaze', 'changdu', 'linzhi', 'shannan', 'naqu', 'ali'],
  },
  {
    name: '陕西省', slug: 'shaanxi',
    cities: ['xian', 'tongchuan', 'baoji', 'xianyang', 'weinan', 'yanan', 'hanzhong', 'yulin-sn', 'ankang', 'shangluo'],
  },
  {
    name: '甘肃省', slug: 'gansu',
    cities: ['lanzhou', 'jiayuguan', 'jinchang', 'baiyin', 'tianshui', 'wuwei', 'zhangye', 'pingliang', 'jiuquan', 'qingyang', 'dingxi', 'longnan', 'linxia', 'gannan'],
  },
  {
    name: '青海省', slug: 'qinghai',
    cities: ['xining', 'haidong', 'haibei', 'huangnan', 'hainan-z', 'guoluo', 'yushu', 'haixi'],
  },
  {
    name: '宁夏', slug: 'ningxia',
    cities: ['yinchuan', 'shizuishan', 'wuzhong', 'guyuan', 'zhongwei'],
  },
  {
    name: '新疆', slug: 'xinjiang',
    cities: ['wulumuqi', 'kelamayi', 'tulufan', 'hami', 'changji', 'boertala', 'bayinguoleng', 'akesu', 'kezilesu', 'kashi', 'hetian', 'yili', 'tacheng', 'aletai'],
  },
  {
    name: '台湾省', slug: 'taiwan',
    cities: ['taibei', 'gaoxiong', 'taizhong', 'tainan', 'jilong', 'xinzhu'],
  },
  { name: '香港', slug: 'xianggang', cities: ['xianggang'] },
  { name: '澳门', slug: 'aomen', cities: ['aomen'] },
];
