const CITY_KEY = 'preferred_city';

export interface CityPreference {
  slug: string;
  name: string;
}

export function getStoredCity(): CityPreference | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CITY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredCity(city: CityPreference): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CITY_KEY, JSON.stringify(city));
}

// Map of known IP geolocation city names to our slugs
const IP_CITY_MAP: Record<string, CityPreference> = {
  'Beijing': { slug: 'beijing', name: '北京市' },
  'Tianjin': { slug: 'tianjin', name: '天津市' },
  'Shanghai': { slug: 'shanghai', name: '上海市' },
  'Chongqing': { slug: 'chongqing', name: '重庆市' },
  'Guangzhou': { slug: 'guangzhou', name: '广州市' },
  'Shenzhen': { slug: 'shenzhen', name: '深圳市' },
  'Chengdu': { slug: 'chengdu', name: '成都市' },
  'Hangzhou': { slug: 'hangzhou', name: '杭州市' },
  'Wuhan': { slug: 'wuhan', name: '武汉市' },
  'Nanjing': { slug: 'nanjing', name: '南京市' },
  'Xi\'an': { slug: 'xian', name: '西安市' },
  'Zhengzhou': { slug: 'zhengzhou', name: '郑州市' },
  'Jinan': { slug: 'jinan', name: '济南市' },
  'Shenyang': { slug: 'shenyang', name: '沈阳市' },
  'Changsha': { slug: 'changsha', name: '长沙市' },
  'Harbin': { slug: 'haerbin', name: '哈尔滨市' },
  'Changchun': { slug: 'changchun', name: '长春市' },
  'Shijiazhuang': { slug: 'shijiazhuang', name: '石家庄市' },
  'Taiyuan': { slug: 'taiyuan', name: '太原市' },
  'Hefei': { slug: 'hefei', name: '合肥市' },
  'Fuzhou': { slug: 'fuzhou', name: '福州市' },
  'Nanchang': { slug: 'nanchang', name: '南昌市' },
  'Kunming': { slug: 'kunming', name: '昆明市' },
  'Guiyang': { slug: 'guiyang', name: '贵阳市' },
  'Nanning': { slug: 'nanning', name: '南宁市' },
  'Haikou': { slug: 'haikou', name: '海口市' },
  'Lanzhou': { slug: 'lanzhou', name: '兰州市' },
  'Xining': { slug: 'xining', name: '西宁市' },
  'Yinchuan': { slug: 'yinchuan', name: '银川市' },
  'Urumqi': { slug: 'wulumuqi', name: '乌鲁木齐市' },
  'Hohhot': { slug: 'huhehaote', name: '呼和浩特市' },
  'Lhasa': { slug: 'lasa', name: '拉萨市' },
};

export function matchIPCity(geoCity: string | null): CityPreference | null {
  if (!geoCity) return null;
  return IP_CITY_MAP[geoCity] ?? null;
}
