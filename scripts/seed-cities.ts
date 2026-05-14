// Seed 31 provincial capital cities into Supabase
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

const cities = [
  { name: '北京市', slug: 'beijing', lat: 39.9042, lng: 116.4074 },
  { name: '天津市', slug: 'tianjin', lat: 39.1252, lng: 117.1906 },
  { name: '上海市', slug: 'shanghai', lat: 31.2304, lng: 121.4737 },
  { name: '重庆市', slug: 'chongqing', lat: 29.4316, lng: 106.9123 },
  { name: '广州市', slug: 'guangzhou', lat: 23.1291, lng: 113.2644 },
  { name: '成都市', slug: 'chengdu', lat: 30.5728, lng: 104.0668 },
  { name: '武汉市', slug: 'wuhan', lat: 30.5928, lng: 114.3055 },
  { name: '南京市', slug: 'nanjing', lat: 32.0603, lng: 118.7969 },
  { name: '杭州市', slug: 'hangzhou', lat: 30.2741, lng: 120.1551 },
  { name: '西安市', slug: 'xian', lat: 34.3416, lng: 108.9398 },
  { name: '郑州市', slug: 'zhengzhou', lat: 34.7466, lng: 113.6254 },
  { name: '济南市', slug: 'jinan', lat: 36.6512, lng: 116.9974 },
  { name: '沈阳市', slug: 'shenyang', lat: 41.8057, lng: 123.4315 },
  { name: '长沙市', slug: 'changsha', lat: 28.2282, lng: 112.9388 },
  { name: '哈尔滨市', slug: 'haerbin', lat: 45.8038, lng: 126.5350 },
  { name: '长春市', slug: 'changchun', lat: 43.8171, lng: 125.3235 },
  { name: '石家庄市', slug: 'shijiazhuang', lat: 38.0428, lng: 114.5149 },
  { name: '太原市', slug: 'taiyuan', lat: 37.8706, lng: 112.5489 },
  { name: '合肥市', slug: 'hefei', lat: 31.8206, lng: 117.2272 },
  { name: '福州市', slug: 'fuzhou', lat: 26.0745, lng: 119.2965 },
  { name: '南昌市', slug: 'nanchang', lat: 28.6820, lng: 115.8581 },
  { name: '昆明市', slug: 'kunming', lat: 25.0389, lng: 102.7183 },
  { name: '贵阳市', slug: 'guiyang', lat: 26.6470, lng: 106.6302 },
  { name: '南宁市', slug: 'nanning', lat: 22.8170, lng: 108.3665 },
  { name: '海口市', slug: 'haikou', lat: 20.0174, lng: 110.3492 },
  { name: '兰州市', slug: 'lanzhou', lat: 36.0611, lng: 103.8343 },
  { name: '西宁市', slug: 'xining', lat: 36.6171, lng: 101.7782 },
  { name: '银川市', slug: 'yinchuan', lat: 38.4872, lng: 106.2309 },
  { name: '乌鲁木齐市', slug: 'wulumuqi', lat: 43.8256, lng: 87.6168 },
  { name: '呼和浩特市', slug: 'huhehaote', lat: 40.8424, lng: 111.7490 },
  { name: '拉萨市', slug: 'lasa', lat: 29.6500, lng: 91.1000 },
];

async function main() {
  // Get existing cities
  const existing: { id: number; slug: string }[] = await get('city?select=id,slug');
  const existingSlugs = new Set(existing.map(c => c.slug));
  console.log(`Existing cities: ${existing.length}`);

  let added = 0;
  let skipped = 0;

  for (const city of cities) {
    if (existingSlugs.has(city.slug)) {
      console.log(`  SKIP: ${city.name} (${city.slug}) - already exists`);
      skipped++;
      continue;
    }

    const result = await post('city', {
      name: city.name,
      slug: city.slug,
      lat: city.lat,
      lng: city.lng,
      is_active: true,
    });

    if (result) {
      console.log(`  OK: ${city.name} (${city.slug})`);
      added++;
    } else {
      console.log(`  FAIL: ${city.name} (${city.slug})`);
    }
  }

  console.log(`\nDone! Added ${added}, skipped ${skipped}. Total cities: ${existing.length + added}`);
}

main().catch(console.error);
