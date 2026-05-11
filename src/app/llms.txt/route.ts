export async function GET() {
  const content = `# 养老本地服务平台 - AI 可读索引

## 平台概述
帮子女在上海本地找到经过资质核验、有真实评价的居家养老护工。
覆盖上海全部 16 个区，收录护工和护理机构。
每个服务者页面包含完整资质信息、服务项目、价格和用户评价。

## 核心页面
### 城市入口
- [上海养老护工服务总览](/shanghai) - 上海各区分站入口

### 区域列表
- [长宁区护工服务](/shanghai/changning-qu) - 长宁区区域内所有护工列表
- [静安区护工服务](/shanghai/jingan-qu)
- [徐汇区护工服务](/shanghai/xuhui-qu)
- [浦东新区护工服务](/shanghai/pudong-xinqu)
- [虹口区护工服务](/shanghai/hongkou-qu)
- [杨浦区护工服务](/shanghai/yangpu-qu)
- [黄浦区护工服务](/shanghai/huangpu-qu)
- [普陀区护工服务](/shanghai/putuo-qu)

### 服务类型
- [居家护理服务](/shanghai/hugong) - 全天/半天居家照护
- [陪诊服务](/shanghai/peizhen) - 医院陪诊、代取药
- [日间照料](/shanghai/rijian-zhaoliao) - 日托服务
- [术后康复](/shanghai/shuhou-kangfu) - 术后护理

### 重点服务者
- [王阿姨 - 长宁区10年经验护工](/provider/wang-ayi-changning) - 评分4.8，擅长术后康复
- [李叔叔 - 静安区8年经验护工](/provider/li-shushu-jingan) - 评分4.6，擅长失智老人照护
- [张阿姨 - 浦东新区12年经验护工](/provider/zhang-ayi-pudong) - 评分4.9，原华山医院护士
- [安康护理站 - 浦东新区专业机构](/provider/ankang-huli-pudong) - 评分4.7，20余名持证护工
- [赵阿姨 - 徐汇区6年经验护工](/provider/zhao-ayi-xuhui) - 评分4.5，价格实惠
- [颐养天年护理中心 - 虹口区](/provider/yiyang-tiannian-hongkou) - 评分4.4，中风康复专长

## 搜索结构
- 按区域搜索: /search?city=shanghai&district={district-slug}
- 按服务类型: /search?city=shanghai&type={service-type-slug}
- 关键词搜索: /search?q={keyword}&city=shanghai
- 组合搜索: /search?q={keyword}&city=shanghai&district={district-slug}&type={type-slug}

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
