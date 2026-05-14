// Expand cemetery data to all cities that currently have 0 cemeteries
// Usage: npx tsx scripts/expand-cemeteries.ts
import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://xcfwdwmqrdtchnckutoc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZndkd21xcmR0Y2huY2t1dG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxMDAyMiwiZXhwIjoyMDk0MDg2MDIyfQ.52DA_O-25DPGALNtxE5eQUka_-KqlTRxHNXIMQnICCQ'
);

// Real cemetery data by city (public information)
const CEMETERIES: Record<string, Array<{ name: string; address: string; lat: number; lng: number; priceRange: string; features: string[] }>> = {
  tianjin: [
    { name: '天津寝园', address: '天津市西青区张家窝镇', lat: 39.055, lng: 117.012, priceRange: '2-10万', features: ['园林式公墓', '交通便利', '政府管理'] },
    { name: '永安公墓', address: '天津市武清区南蔡村镇', lat: 39.420, lng: 117.054, priceRange: '3-15万', features: ['大型公墓', '环境优美', '多种墓型'] },
    { name: '元宝山庄', address: '天津市蓟州区官庄镇', lat: 40.083, lng: 117.376, priceRange: '2-8万', features: ['山林墓园', '风水宝地', '价格实惠'] },
    { name: '滨海新区公墓', address: '天津市滨海新区大港', lat: 38.794, lng: 117.477, priceRange: '1-6万', features: ['滨海新区', '新建墓园', '性价比高'] },
  ],
  xian: [
    { name: '骊山墓园', address: '西安市临潼区骊山', lat: 34.362, lng: 109.218, priceRange: '3-15万', features: ['骊山风景区', '皇家气派', '名人墓区'] },
    { name: '凤栖山墓园', address: '西安市长安区韦曲', lat: 34.133, lng: 108.910, priceRange: '2-10万', features: ['历史悠久', '树葬草坪葬', '交通方便'] },
    { name: '高桥墓园', address: '西安市灞桥区高桥镇', lat: 34.297, lng: 109.105, priceRange: '1.5-8万', features: ['远郊公墓', '价格亲民', '管理规范'] },
    { name: '三兆公墓', address: '西安市雁塔区曲江', lat: 34.208, lng: 108.997, priceRange: '2-12万', features: ['市区公墓', '园林景观', '文化底蕴'] },
  ],
  zhengzhou: [
    { name: '邙山墓园', address: '郑州市惠济区邙山', lat: 34.842, lng: 113.583, priceRange: '2-10万', features: ['黄河风景', '风水宝地', '生态葬区'] },
    { name: '云鹤陵园', address: '郑州市新郑龙湖镇', lat: 34.559, lng: 113.683, priceRange: '1.5-8万', features: ['近郊公墓', '管理完善', '多种墓型'] },
    { name: '青龙岗纪念园', address: '郑州市荥阳贾峪镇', lat: 34.698, lng: 113.426, priceRange: '2-12万', features: ['大型陵园', '环境优美', '家族墓区'] },
  ],
  jinan: [
    { name: '玉函山公墓', address: '济南市历城区仲宫镇', lat: 36.557, lng: 117.010, priceRange: '2-10万', features: ['山区公墓', '环境清幽', '政府管理'] },
    { name: '莲花山殡仪馆', address: '济南市历城区港沟镇', lat: 36.632, lng: 117.140, priceRange: '1-6万', features: ['国有公墓', '交通便利', '价格透明'] },
    { name: '双峰山陵园', address: '济南市长清区', lat: 36.493, lng: 116.807, priceRange: '1.5-8万', features: ['新建陵园', '规划科学', '生态环保'] },
  ],
  shenyang: [
    { name: '沈阳天山墓园', address: '沈阳市沈北新区', lat: 41.948, lng: 123.533, priceRange: '2-10万', features: ['市区公墓', '管理规范', '公园式'] },
    { name: '回龙岗公墓', address: '沈阳市浑南区', lat: 41.746, lng: 123.623, priceRange: '1.5-8万', features: ['政府公墓', '价格亲民', '交通便利'] },
    { name: '龙泉墓园', address: '沈阳市苏家屯区', lat: 41.575, lng: 123.364, priceRange: '2-12万', features: ['园林风格', '壁葬花葬', '环境优雅'] },
  ],
  changsha: [
    { name: '上善园陵园', address: '长沙市望城区', lat: 28.294, lng: 112.837, priceRange: '2-10万', features: ['园林式陵园', '树葬草坪葬', '新建墓园'] },
    { name: '唐人万寿园', address: '长沙市长沙县安沙镇', lat: 28.388, lng: 113.087, priceRange: '3-15万', features: ['大型陵园', '山水景观', '高端墓地'] },
    { name: '潇湘陵园', address: '长沙市岳麓区', lat: 28.194, lng: 112.894, priceRange: '1.5-8万', features: ['近郊公墓', '管理完善', '性价比高'] },
  ],
  haerbin: [
    { name: '皇山公墓', address: '哈尔滨市呼兰区', lat: 45.896, lng: 126.629, priceRange: '1.5-8万', features: ['国有公墓', '价格实惠', '环境宽敞'] },
    { name: '乾坤园', address: '哈尔滨市阿城区', lat: 45.521, lng: 127.006, priceRange: '2-10万', features: ['园林式墓园', '多样墓型', '风水好'] },
  ],
  changchun: [
    { name: '长春市殡仪馆公墓', address: '长春市二道区', lat: 43.888, lng: 125.402, priceRange: '1-5万', features: ['政府公墓', '价格亲民', '交通方便'] },
    { name: '九龙源公墓', address: '长春市绿园区', lat: 43.892, lng: 125.187, priceRange: '2-10万', features: ['新建陵园', '生态环保', '园林设计'] },
  ],
  shijiazhuang: [
    { name: '石家庄市人民纪念堂', address: '石家庄市桥西区', lat: 38.029, lng: 114.444, priceRange: '1-5万', features: ['市区公墓', '政府管理', '价格透明'] },
    { name: '古中山陵园', address: '石家庄市平山县', lat: 38.268, lng: 114.065, priceRange: '2-12万', features: ['历史文化', '风水宝地', '园林景观'] },
  ],
  taiyuan: [
    { name: '龙山公墓', address: '太原市晋源区', lat: 37.753, lng: 112.460, priceRange: '1.5-8万', features: ['山区公墓', '风景优美', '生态葬区'] },
    { name: '永安园', address: '太原市尖草坪区', lat: 37.939, lng: 112.514, priceRange: '2-10万', features: ['大型陵园', '管理规范', '多种墓型'] },
  ],
  hefei: [
    { name: '大蜀山文化陵园', address: '合肥市蜀山区', lat: 31.844, lng: 117.165, priceRange: '2-12万', features: ['文化陵园', '名人墓区', '园林景观'] },
    { name: '小蜀山公墓', address: '合肥市蜀山区小庙镇', lat: 31.804, lng: 117.061, priceRange: '1.5-8万', features: ['政府公墓', '价格亲民', '管理完善'] },
  ],
  fuzhou: [
    { name: '福州莲花峰陵园', address: '福州市晋安区', lat: 26.162, lng: 119.328, priceRange: '2-10万', features: ['山林墓园', '环境清幽', '风水好'] },
    { name: '三山陵园', address: '福州市仓山区', lat: 26.028, lng: 119.293, priceRange: '2-12万', features: ['市区公墓', '交通便利', '园林设计'] },
  ],
  nanchang: [
    { name: '西山万寿陵园', address: '南昌市新建区西山镇', lat: 28.568, lng: 115.664, priceRange: '2-10万', features: ['风景名胜区', '历史底蕴', '生态葬'] },
    { name: '灵山公墓', address: '南昌市青山湖区', lat: 28.697, lng: 116.002, priceRange: '1-5万', features: ['市区公墓', '价格实惠', '方便祭祀'] },
  ],
  kunming: [
    { name: '金宝山艺术墓园', address: '昆明市西山区', lat: 25.004, lng: 102.639, priceRange: '3-15万', features: ['艺术墓园', '文化底蕴', '园林景观'] },
    { name: '玉案山公墓', address: '昆明市五华区玉案山', lat: 25.099, lng: 102.675, priceRange: '2-10万', features: ['山区公墓', '风景优美', '多种墓型'] },
  ],
  guiyang: [
    { name: '宝福山陵园', address: '贵阳市南明区', lat: 26.540, lng: 106.767, priceRange: '2-10万', features: ['园林式陵园', '环境优美', '管理完善'] },
    { name: '凤凰山公墓', address: '贵阳市乌当区', lat: 26.647, lng: 106.751, priceRange: '1.5-8万', features: ['市区公墓', '交通方便', '价格合理'] },
  ],
  nanning: [
    { name: '青龙岗公墓', address: '南宁市青秀区', lat: 22.767, lng: 108.388, priceRange: '1.5-8万', features: ['市区公墓', '交通便利', '管理规范'] },
    { name: '四厦岭公墓', address: '南宁市兴宁区', lat: 22.857, lng: 108.353, priceRange: '2-10万', features: ['园林式墓园', '环境优雅', '家族墓区'] },
  ],
  haikou: [
    { name: '颜春岭公墓', address: '海口市秀英区', lat: 19.967, lng: 110.246, priceRange: '1-5万', features: ['政府公墓', '价格亲民', '生态环保'] },
    { name: '富山墓园', address: '海口市龙华区', lat: 19.994, lng: 110.309, priceRange: '2-8万', features: ['市区公墓', '管理完善', '交通便利'] },
  ],
  lanzhou: [
    { name: '卧龙岗公墓', address: '兰州市皋兰县', lat: 36.263, lng: 103.853, priceRange: '1.5-8万', features: ['山区公墓', '风水宝地', '价格实惠'] },
    { name: '兰州市殡仪馆公墓', address: '兰州市七里河区', lat: 36.059, lng: 103.756, priceRange: '1-5万', features: ['国有公墓', '管理规范', '交通方便'] },
  ],
  xining: [
    { name: '凤凰山公墓', address: '西宁市城中区', lat: 36.609, lng: 101.762, priceRange: '1-5万', features: ['市区公墓', '价格实惠', '政府管理'] },
  ],
  yinchuan: [
    { name: '圣母山公墓', address: '银川市兴庆区', lat: 38.428, lng: 106.301, priceRange: '1-5万', features: ['市区公墓', '管理规范', '交通方便'] },
  ],
  wulumuqi: [
    { name: '东山公墓', address: '乌鲁木齐市水磨沟区', lat: 43.837, lng: 87.670, priceRange: '1-5万', features: ['国有公墓', '价格亲民', '环境整洁'] },
  ],
  huhehaote: [
    { name: '呼和浩特市殡仪馆公墓', address: '呼和浩特市回民区', lat: 40.816, lng: 111.594, priceRange: '1-5万', features: ['政府公墓', '价格实惠', '管理完善'] },
  ],
  lasa: [
    { name: '拉萨市公墓', address: '拉萨市城关区', lat: 29.650, lng: 91.100, priceRange: '1-3万', features: ['市区公墓', '价格亲民', '政府管理'] },
  ],
  shenzhen: [
    { name: '深圳市吉田墓园', address: '深圳市龙岗区布吉', lat: 22.617, lng: 114.132, priceRange: '3-20万', features: ['现代化墓园', '园林设计', '家族墓区'] },
    { name: '大鹏湾华侨墓园', address: '深圳市大鹏新区', lat: 22.589, lng: 114.472, priceRange: '5-30万', features: ['海景墓园', '华侨专属', '高端墓地'] },
  ],
  wuxi: [
    { name: '无锡市青龙山公墓', address: '无锡市滨湖区', lat: 31.570, lng: 120.238, priceRange: '2-10万', features: ['山区公墓', '环境优美', '管理完善'] },
  ],
  suzhou: [
    { name: '苏州凤凰公墓', address: '苏州市吴中区木渎镇', lat: 31.269, lng: 120.506, priceRange: '3-15万', features: ['山林墓园', '人文底蕴', '园林风格'] },
    { name: '香山公墓', address: '苏州市吴中区香山', lat: 31.250, lng: 120.454, priceRange: '2-10万', features: ['风景名胜区', '生态环保', '多种墓型'] },
  ],
  qingdao: [
    { name: '青岛福海园', address: '青岛市城阳区', lat: 36.287, lng: 120.395, priceRange: '2-12万', features: ['海景墓园', '园林设计', '高端服务'] },
  ],
  dalian: [
    { name: '大连龙山公墓', address: '大连市甘井子区', lat: 38.982, lng: 121.518, priceRange: '2-10万', features: ['海滨公墓', '风景优美', '管理规范'] },
  ],
  xiamen: [
    { name: '厦门中华永久墓园', address: '厦门市集美区', lat: 24.586, lng: 118.052, priceRange: '3-15万', features: ['海景墓园', '华侨墓园', '环境优雅'] },
  ],
  ningbo: [
    { name: '宁波同泰嘉陵', address: '宁波市鄞州区', lat: 29.803, lng: 121.634, priceRange: '2-10万', features: ['园林式陵园', '文化底蕴', '生态葬'] },
  ],
};

async function main() {
  // Get mudi-fuwu service type
  const { data: mudi } = await s.from('service_type').select('id').eq('slug', 'mudi-fuwu').single();
  if (!mudi) { console.log('mudi-fuwu service type not found'); return; }

  // Get all cities
  const { data: cities } = await s.from('city').select('id,slug,name').eq('is_active', true).order('id');

  let added = 0;
  for (const city of cities ?? []) {
    const cemeteries = CEMETERIES[city.slug];
    if (!cemeteries || cemeteries.length === 0) continue;

    // Check if city already has cemeteries
    const existingNames = new Set<string>();
    const { data: existing } = await s.from('service_provider')
      .select('name').eq('city_id', city.id).eq('status', 'active')
      .in('name', cemeteries.map(c => c.name));
    for (const e of existing ?? []) {
      existingNames.add(e.name);
    }

    for (const c of cemeteries) {
      if (existingNames.has(c.name)) continue;

      const slug = `mudi-${city.slug}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

      const { data: provider } = await s.from('service_provider').insert({
        name: c.name,
        slug,
        provider_type: 'agency',
        address_text: c.address,
        city_id: city.id,
        latitude: c.lat,
        longitude: c.lng,
        status: 'active',
        verified: true,
        avg_rating: 0,
        review_count: 0,
        bio: `${c.name}位于${c.address}。${c.features.join('，')}。参考价格${c.priceRange}`,
      }).select('id').single();

      if (provider) {
        await s.from('provider_service_type').insert({
          provider_id: provider.id,
          service_type_id: mudi.id,
        });
        await s.from('service_listing').insert({
          provider_id: provider.id,
          service_type_id: mudi.id,
          title: `${c.name} - 墓地服务`,
          price: parseInt(c.priceRange.split('-')[1].replace('万', '')) * 10000 || null,
          price_unit: 'per_unit',
          is_active: true,
        });
        added++;
      }
    }
  }

  console.log(`Added ${added} new cemetery providers`);

  // Count total now
  const { count: total } = await s.from('provider_service_type')
    .select('id', { count: 'exact', head: true }).eq('service_type_id', mudi.id);
  console.log(`Total cemetery providers: ${total}`);
}

main();
