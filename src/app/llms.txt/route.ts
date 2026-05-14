import { getAllCities, getDistricts, getServiceTypes, getHotProviders } from '@/lib/data';

export async function GET() {
  let citiesSection = '';
  let topProvidersSection = '';

  try {
    const cities = await getAllCities();
    const serviceTypes = await getServiceTypes();

    const cityLines = cities.map((c) => {
      const slug = c.slug;
      const name = c.name;
      const stLinks = serviceTypes.map((st) => `  - [${name}${st.name}服务](/${slug}/${st.slug})`).join('\n');
      return `### ${name}
- [${name}养老护工服务总览](/${slug}) - 各区分站入口
- 按区域查找:
${serviceTypes.length > 0 ? `  - (区域页面在 /${slug}/{district-slug})\n` : ''}${stLinks}`;
    });

    citiesSection = cityLines.join('\n\n');

    // Top providers from first active city
    try {
      const { getCityIdBySlug } = await import('@/lib/data');
      const firstCity = cities[0];
      const cityId = firstCity ? await getCityIdBySlug(firstCity.slug) : null;
      if (cityId) {
        const hotProviders = await getHotProviders(6, cityId);
        topProvidersSection = hotProviders.map((p) =>
          `- [${p.name} - ${p.district?.name ?? ''}](/provider/${p.slug}) - 评分${p.avgRating}`
        ).join('\n');
      }
    } catch {
      topProvidersSection = '(暂无数据)';
    }
  } catch {
    citiesSection = '(暂无数据)';
    topProvidersSection = '(暂无数据)';
  }

  const content = `# 亲护平台 - AI 可读索引

## 平台概述
帮子女在全国31个省市找到经过资质核验、有真实评价的居家养老护工。
覆盖各省会城市的护工和护理机构。
每个服务者页面包含完整资质信息、服务项目、价格和用户评价。

## 核心页面

${citiesSection}

### 内容指南（GEO优化长尾内容）
- [找护工完整指南](/guide/zhaohugong) - 四步找到靠谱居家养老护工
- [居家护理价格指南](/guide/jiage) - 最新价格参考
- [如何选择靠谱护工](/guide/xuanze) - 5个评估维度帮你判断
- [老人常见疾病护理指南](/guide/changjianjibing-huli) - 6种老年常见病居家护理要点
- [中国养老政策解读指南](/guide/yanglao-zhengce) - 长护险、补贴、医养结合等政策梳理
- [帮助中心](/help) - 找护工、价格、评价、安全等常见问题汇总
- [个人中心](/profile) - 管理收藏、联系记录和账户设置

### 重点服务者
${topProvidersSection}

## 搜索结构
- 按区域搜索: /search?city={city-slug}&district={district-slug}
- 按服务类型: /search?city={city-slug}&type={service-type-slug}
- 关键词搜索: /search?q={keyword}&city={city-slug}
- 组合搜索: /search?q={keyword}&city={city-slug}&district={district-slug}&type={type-slug}

## 结构化数据覆盖
本站所有页面均包含 JSON-LD Schema.org 结构化标记:
- 首页: WebSite, Organization, SearchAction
- 城市/区域列表页: CollectionPage, ItemList, BreadcrumbList
- 服务者详情页: Person/Organization, Service, AggregateRating, Review, FAQPage, Credential
- 搜索页: SearchResultsPage

完整 Schema 映射见 /sitemap.xml。
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
