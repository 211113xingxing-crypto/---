// One-off script: seed districts for 5 key cities
// Run: npx tsx scripts/seed-districts.ts

import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/eldercare';
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

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

async function main() {
  let total = 0;
  for (const [citySlug, districts] of Object.entries(keyCityDistricts)) {
    const city = await db.city.findUnique({ where: { slug: citySlug } });
    if (!city) { console.log(`SKIP ${citySlug}: not found`); continue; }
    for (const d of districts) {
      await db.district.upsert({
        where: { cityId_slug: { cityId: city.id, slug: d.slug } },
        update: {},
        create: { ...d, level: 'district', cityId: city.id },
      });
    }
    total += districts.length;
    console.log(`  ✓ ${city.name}: ${districts.length} districts`);
  }
  console.log(`\nTotal: ${total} districts inserted`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
