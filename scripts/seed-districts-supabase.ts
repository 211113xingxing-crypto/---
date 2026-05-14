// Seed districts via Supabase REST API
// Run: npx tsx scripts/seed-districts-supabase.ts
//
// Covers all 31 provincial capitals. Cities that already have districts are
// skipped automatically by the ON CONFLICT clause.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const keyCityDistricts: Record<string, { name: string; slug: string; lat: number; lng: number }[]> = {
  // ===== 直辖市 =====
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
  tianjin: [
    { name: '和平区', slug: 'heping-qu', lat: 39.1172, lng: 117.2146 },
    { name: '河东区', slug: 'hedong-qu', lat: 39.1283, lng: 117.2516 },
    { name: '河西区', slug: 'hexi-qu', lat: 39.1096, lng: 117.2233 },
    { name: '南开区', slug: 'nankai-qu', lat: 39.1382, lng: 117.1502 },
    { name: '河北区', slug: 'hebei-qu', lat: 39.1480, lng: 117.1967 },
    { name: '红桥区', slug: 'hongqiao-qu', lat: 39.1673, lng: 117.1516 },
    { name: '滨海新区', slug: 'binhai-xinqu', lat: 39.0033, lng: 117.6505 },
    { name: '西青区', slug: 'xiqing-qu', lat: 39.1416, lng: 117.0088 },
  ],
  chongqing: [
    { name: '渝中区', slug: 'yuzhong-qu', lat: 29.5531, lng: 106.5686 },
    { name: '江北区', slug: 'jiangbei-qu', lat: 29.6066, lng: 106.5743 },
    { name: '沙坪坝区', slug: 'shapingba-qu', lat: 29.5410, lng: 106.4570 },
    { name: '九龙坡区', slug: 'jiulongpo-qu', lat: 29.5023, lng: 106.5114 },
    { name: '南岸区', slug: 'nanan-qu', lat: 29.5217, lng: 106.5632 },
    { name: '渝北区', slug: 'yubei-qu', lat: 29.7181, lng: 106.6307 },
    { name: '巴南区', slug: 'banan-qu', lat: 29.4026, lng: 106.5408 },
    { name: '大渡口区', slug: 'dadukou-qu', lat: 29.4840, lng: 106.4823 },
  ],

  // ===== 华东 =====
  nanjing: [
    { name: '玄武区', slug: 'xuanwu-qu', lat: 32.0486, lng: 118.7978 },
    { name: '秦淮区', slug: 'qinhuai-qu', lat: 32.0391, lng: 118.7941 },
    { name: '建邺区', slug: 'jianye-qu', lat: 32.0031, lng: 118.7318 },
    { name: '鼓楼区', slug: 'gulou-qu', lat: 32.0664, lng: 118.7698 },
    { name: '栖霞区', slug: 'qixia-qu', lat: 32.0963, lng: 118.8803 },
    { name: '雨花台区', slug: 'yuhuatai-qu', lat: 31.9923, lng: 118.7791 },
    { name: '江宁区', slug: 'jiangning-qu', lat: 31.9527, lng: 118.8400 },
    { name: '浦口区', slug: 'pukou-qu', lat: 32.0591, lng: 118.6279 },
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
  hefei: [
    { name: '蜀山区', slug: 'shushan-qu', lat: 31.8516, lng: 117.2605 },
    { name: '包河区', slug: 'baohe-qu', lat: 31.7934, lng: 117.3093 },
    { name: '庐阳区', slug: 'luyang-qu', lat: 31.8787, lng: 117.2648 },
    { name: '瑶海区', slug: 'yaohai-qu', lat: 31.8581, lng: 117.3092 },
    { name: '滨湖新区', slug: 'binhu-xinqu', lat: 31.7382, lng: 117.2835 },
  ],
  fuzhou: [
    { name: '鼓楼区', slug: 'gulou-qu', lat: 26.0823, lng: 119.3035 },
    { name: '台江区', slug: 'taijiang-qu', lat: 26.0622, lng: 119.3140 },
    { name: '仓山区', slug: 'cangshan-qu', lat: 26.0387, lng: 119.3202 },
    { name: '晋安区', slug: 'jinan-qu', lat: 26.0820, lng: 119.3286 },
    { name: '马尾区', slug: 'mawei-qu', lat: 25.9957, lng: 119.4590 },
    { name: '长乐区', slug: 'changle-qu', lat: 25.9628, lng: 119.5234 },
  ],
  nanchang: [
    { name: '东湖区', slug: 'donghu-qu', lat: 28.6858, lng: 115.8990 },
    { name: '西湖区', slug: 'xihu-qu', lat: 28.6568, lng: 115.8772 },
    { name: '青云谱区', slug: 'qingyunpu-qu', lat: 28.6210, lng: 115.9252 },
    { name: '青山湖区', slug: 'qingshanhu-qu', lat: 28.6822, lng: 115.9622 },
    { name: '红谷滩区', slug: 'honggutan-qu', lat: 28.7027, lng: 115.8540 },
    { name: '新建区', slug: 'xinjian-qu', lat: 28.6929, lng: 115.8153 },
  ],
  jinan: [
    { name: '历下区', slug: 'lixia-qu', lat: 36.6664, lng: 117.0764 },
    { name: '市中区', slug: 'shizhong-qu', lat: 36.6512, lng: 116.9974 },
    { name: '槐荫区', slug: 'huaiyin-qu', lat: 36.6515, lng: 116.9015 },
    { name: '天桥区', slug: 'tianqiao-qu', lat: 36.6785, lng: 116.9875 },
    { name: '历城区', slug: 'licheng-qu', lat: 36.6802, lng: 117.0655 },
    { name: '长清区', slug: 'changqing-qu', lat: 36.5537, lng: 116.7518 },
  ],

  // ===== 东北 =====
  shenyang: [
    { name: '和平区', slug: 'heping-qu', lat: 41.7897, lng: 123.4205 },
    { name: '沈河区', slug: 'shenhe-qu', lat: 41.7960, lng: 123.4587 },
    { name: '皇姑区', slug: 'huanggu-qu', lat: 41.8246, lng: 123.4253 },
    { name: '大东区', slug: 'dadong-qu', lat: 41.8052, lng: 123.4696 },
    { name: '铁西区', slug: 'tiexi-qu', lat: 41.8028, lng: 123.3767 },
    { name: '浑南区', slug: 'hunnan-qu', lat: 41.7149, lng: 123.4497 },
    { name: '于洪区', slug: 'yuhong-qu', lat: 41.7940, lng: 123.3081 },
  ],
  haerbin: [
    { name: '道里区', slug: 'daoli-qu', lat: 45.7558, lng: 126.6169 },
    { name: '南岗区', slug: 'nangang-qu', lat: 45.7597, lng: 126.6688 },
    { name: '道外区', slug: 'daowai-qu', lat: 45.7920, lng: 126.6492 },
    { name: '香坊区', slug: 'xiangfang-qu', lat: 45.7080, lng: 126.6628 },
    { name: '松北区', slug: 'songbei-qu', lat: 45.8081, lng: 126.5634 },
    { name: '平房区', slug: 'pingfang-qu', lat: 45.5973, lng: 126.6293 },
  ],
  changchun: [
    { name: '南关区', slug: 'nanguan-qu', lat: 43.8640, lng: 125.3503 },
    { name: '朝阳区', slug: 'chaoyang-qu', lat: 43.8335, lng: 125.2883 },
    { name: '宽城区', slug: 'kuancheng-qu', lat: 43.9436, lng: 125.3278 },
    { name: '二道区', slug: 'erdao-qu', lat: 43.8660, lng: 125.3742 },
    { name: '绿园区', slug: 'lvyuan-qu', lat: 43.8805, lng: 125.2558 },
    { name: '净月区', slug: 'jingyue-qu', lat: 43.7755, lng: 125.3880 },
  ],

  // ===== 华中 =====
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
  zhengzhou: [
    { name: '金水区', slug: 'jinshui-qu', lat: 34.7802, lng: 113.6856 },
    { name: '二七区', slug: 'erqi-qu', lat: 34.7240, lng: 113.6403 },
    { name: '中原区', slug: 'zhongyuan-qu', lat: 34.7484, lng: 113.6124 },
    { name: '管城回族区', slug: 'guancheng-qu', lat: 34.7536, lng: 113.6774 },
    { name: '惠济区', slug: 'huiji-qu', lat: 34.8675, lng: 113.6168 },
    { name: '郑东新区', slug: 'zhengdong-xinqu', lat: 34.7672, lng: 113.7392 },
  ],
  changsha: [
    { name: '芙蓉区', slug: 'furong-qu', lat: 28.1939, lng: 113.0325 },
    { name: '天心区', slug: 'tianxin-qu', lat: 28.1142, lng: 112.9898 },
    { name: '岳麓区', slug: 'yuelu-qu', lat: 28.2352, lng: 112.9314 },
    { name: '开福区', slug: 'kaifu-qu', lat: 28.2564, lng: 112.9859 },
    { name: '雨花区', slug: 'yuhua-qu', lat: 28.1354, lng: 113.0357 },
    { name: '望城区', slug: 'wangcheng-qu', lat: 28.3612, lng: 112.8179 },
  ],

  // ===== 华北 =====
  shijiazhuang: [
    { name: '长安区', slug: 'changan-qu', lat: 38.0365, lng: 114.5391 },
    { name: '桥西区', slug: 'qiaoxi-qu', lat: 38.0428, lng: 114.4611 },
    { name: '新华区', slug: 'xinhua-qu', lat: 38.0511, lng: 114.4632 },
    { name: '裕华区', slug: 'yuhua-qu', lat: 38.0062, lng: 114.5314 },
    { name: '正定新区', slug: 'zhengding-xinqu', lat: 38.1464, lng: 114.5710 },
  ],
  taiyuan: [
    { name: '迎泽区', slug: 'yingze-qu', lat: 37.8633, lng: 112.5635 },
    { name: '杏花岭区', slug: 'xinghualing-qu', lat: 37.8940, lng: 112.5705 },
    { name: '万柏林区', slug: 'wanbailin-qu', lat: 37.8592, lng: 112.5156 },
    { name: '小店区', slug: 'xiaodian-qu', lat: 37.7360, lng: 112.5658 },
    { name: '尖草坪区', slug: 'jiancaoping-qu', lat: 37.9402, lng: 112.4869 },
    { name: '晋源区', slug: 'jinyuan-qu', lat: 37.7323, lng: 112.4778 },
  ],
  huhehaote: [
    { name: '新城区', slug: 'xincheng-qu', lat: 40.8584, lng: 111.6635 },
    { name: '回民区', slug: 'huimin-qu', lat: 40.8084, lng: 111.6236 },
    { name: '玉泉区', slug: 'yuquan-qu', lat: 40.7539, lng: 111.6742 },
    { name: '赛罕区', slug: 'saihan-qu', lat: 40.7920, lng: 111.7016 },
  ],

  // ===== 华南 =====
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
  nanning: [
    { name: '青秀区', slug: 'qingxiu-qu', lat: 22.7858, lng: 108.4950 },
    { name: '兴宁区', slug: 'xingning-qu', lat: 22.8544, lng: 108.3687 },
    { name: '西乡塘区', slug: 'xixiangtang-qu', lat: 22.8338, lng: 108.3119 },
    { name: '江南区', slug: 'jiangnan-qu', lat: 22.7950, lng: 108.2731 },
    { name: '良庆区', slug: 'liangqing-qu', lat: 22.7593, lng: 108.3940 },
    { name: '邕宁区', slug: 'yongning-qu', lat: 22.7583, lng: 108.4874 },
  ],
  haikou: [
    { name: '龙华区', slug: 'longhua-qu', lat: 20.0307, lng: 110.3285 },
    { name: '美兰区', slug: 'meilan-qu', lat: 20.0286, lng: 110.3666 },
    { name: '琼山区', slug: 'qiongshan-qu', lat: 20.0042, lng: 110.3540 },
    { name: '秀英区', slug: 'xiuying-qu', lat: 20.0075, lng: 110.2936 },
  ],

  // ===== 西南 =====
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
  kunming: [
    { name: '五华区', slug: 'wuhua-qu', lat: 25.0436, lng: 102.7069 },
    { name: '盘龙区', slug: 'panlong-qu', lat: 25.0406, lng: 102.7518 },
    { name: '官渡区', slug: 'guandu-qu', lat: 25.0153, lng: 102.7437 },
    { name: '西山区', slug: 'xishan-qu', lat: 25.0379, lng: 102.6644 },
    { name: '呈贡区', slug: 'chenggong-qu', lat: 24.8855, lng: 102.8215 },
  ],
  guiyang: [
    { name: '南明区', slug: 'nanming-qu', lat: 26.5682, lng: 106.7144 },
    { name: '云岩区', slug: 'yunyan-qu', lat: 26.6048, lng: 106.7244 },
    { name: '花溪区', slug: 'huaxi-qu', lat: 26.4098, lng: 106.6702 },
    { name: '观山湖区', slug: 'guanshanhu-qu', lat: 26.6477, lng: 106.6225 },
    { name: '白云区', slug: 'baiyun-qu', lat: 26.6783, lng: 106.6230 },
    { name: '乌当区', slug: 'wudang-qu', lat: 26.6301, lng: 106.7506 },
  ],
  lasa: [
    { name: '城关区', slug: 'chengguan-qu', lat: 29.6548, lng: 91.1409 },
    { name: '堆龙德庆区', slug: 'duilongdeqing-qu', lat: 29.6460, lng: 91.0033 },
    { name: '达孜区', slug: 'dazi-qu', lat: 29.6694, lng: 91.3499 },
  ],

  // ===== 西北 =====
  xian: [
    { name: '碑林区', slug: 'beilin-qu', lat: 34.2568, lng: 108.9405 },
    { name: '莲湖区', slug: 'lianhu-qu', lat: 34.2653, lng: 108.9436 },
    { name: '新城区', slug: 'xincheng-qu', lat: 34.2667, lng: 108.9606 },
    { name: '雁塔区', slug: 'yanta-qu', lat: 34.2141, lng: 108.9487 },
    { name: '未央区', slug: 'weiyang-qu', lat: 34.2931, lng: 108.9468 },
    { name: '灞桥区', slug: 'baqiao-qu', lat: 34.2730, lng: 109.0649 },
    { name: '长安区', slug: 'changan-qu', lat: 34.1571, lng: 108.9070 },
  ],
  lanzhou: [
    { name: '城关区', slug: 'chengguan-qu', lat: 36.0571, lng: 103.8253 },
    { name: '七里河区', slug: 'qilihe-qu', lat: 36.0661, lng: 103.7858 },
    { name: '西固区', slug: 'xigu-qu', lat: 36.0883, lng: 103.6279 },
    { name: '安宁区', slug: 'anning-qu', lat: 36.1040, lng: 103.7190 },
    { name: '红古区', slug: 'honggu-qu', lat: 36.3456, lng: 102.8593 },
  ],
  xining: [
    { name: '城中区', slug: 'chengzhong-qu', lat: 36.6233, lng: 101.7846 },
    { name: '城东区', slug: 'chengdong-qu', lat: 36.5997, lng: 101.8037 },
    { name: '城西区', slug: 'chengxi-qu', lat: 36.6283, lng: 101.7658 },
    { name: '城北区', slug: 'chengbei-qu', lat: 36.6502, lng: 101.7662 },
    { name: '湟中区', slug: 'huangzhong-qu', lat: 36.5008, lng: 101.5716 },
  ],
  yinchuan: [
    { name: '兴庆区', slug: 'xingqing-qu', lat: 38.4736, lng: 106.2886 },
    { name: '西夏区', slug: 'xixia-qu', lat: 38.4919, lng: 106.1560 },
    { name: '金凤区', slug: 'jinfeng-qu', lat: 38.4744, lng: 106.2425 },
    { name: '贺兰区', slug: 'helan-qu', lat: 38.5546, lng: 106.3498 },
  ],
  wulumuqi: [
    { name: '天山区', slug: 'tianshan-qu', lat: 43.7943, lng: 87.6318 },
    { name: '沙依巴克区', slug: 'shayibake-qu', lat: 43.8010, lng: 87.5982 },
    { name: '新市区', slug: 'xinshiqu', lat: 43.8438, lng: 87.5742 },
    { name: '水磨沟区', slug: 'shuimogou-qu', lat: 43.8325, lng: 87.6424 },
    { name: '头屯河区', slug: 'toutunhe-qu', lat: 43.8769, lng: 87.4281 },
    { name: '米东区', slug: 'midong-qu', lat: 43.9733, lng: 87.6557 },
  ],
};

async function main() {
  let total = 0;
  for (const [citySlug, districts] of Object.entries(keyCityDistricts)) {
    const { data: city, error: cityErr } = await supabase
      .from('city')
      .select('id, name')
      .eq('slug', citySlug)
      .single();

    if (cityErr || !city) {
      console.log(`SKIP ${citySlug}: ${cityErr?.message ?? 'not found'}`);
      continue;
    }

    for (const d of districts) {
      const { error } = await supabase.from('district').upsert({
        city_id: city.id,
        name: d.name,
        slug: d.slug,
        level: 'district',
        lat: d.lat,
        lng: d.lng,
      }, { onConflict: 'city_id,slug' });

      if (error) {
        console.log(`  ERR ${d.name}: ${error.message}`);
      }
    }
    total += districts.length;
    console.log(`  OK ${city.name}: ${districts.length} districts`);
  }
  console.log(`\nTotal: ${total} districts upserted across ${Object.keys(keyCityDistricts).length} cities`);
}

main().catch((e) => { console.error(e); process.exit(1); });
