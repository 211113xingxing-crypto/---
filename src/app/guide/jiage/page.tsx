import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqSchema } from '@/components/schema/faq-schema';
import { ContentReviewNote, buildArticleEEAT } from '@/components/content-review-note';
import { BASE_URL } from '@/lib/env';

const sources = [
  '各城市养老服务平台公开报价数据',
  '中国社会保障学会养老服务分会调研报告',
  '国家统计局养老服务行业数据'
];
const eeat = buildArticleEEAT(sources);

export const revalidate = 86400;

export const metadata: Metadata = {
  title: '居家养老护理价格指南 — 亲护',
  description:
    '居家护工价格详细参考：全天住家、日间照料、陪诊、术后康复、医疗护理各项费用。按区域、资质、服务类型对比，帮你合理预算。',
  alternates: { canonical: `${BASE_URL}/guide/jiage` },
};

const faqList = [
  {
    question: '请一个住家护工一个月多少钱？',
    answer:
      '以一线城市为例，24小时住家护工的月费用约5500-9000元，折合180-300元/天。基础照护（做饭、打扫、陪伴）约5500-6500元/月；半自理老人照护约6500-7500元/月；完全不能自理老人照护约7500-9000元/月；专业康复护理约8000-10500元/月。二三线城市通常低20%-30%。以上价格供参考，具体因护工资质和老人情况有所不同。',
  },
  {
    question: '日间护工和住家护工哪个更划算？',
    answer:
      '如果是8小时日间照护，月费用约3000-4500元，比住家护工便宜约40%-50%。但日间护工适合子女晚间能接手的家庭，且老人夜间不需要频繁照护的情况。如果老人夜间需要翻身、起夜、喂药等，住家护工是更合适的选择。按性价比来看，日间护工+子女晚上照顾是最经济的方案。',
  },
  {
    question: '护工价格和区域有关系吗？',
    answer:
      '有关系。以一线城市为例，市中心区价格较高，住家护工约6000-9000元/月。远郊区价格较低，住家护工约4500-6500元/月，通常低20%-30%。这主要受当地收入水平和供需关系影响。',
  },
  {
    question: '中介费一般是多少？',
    answer:
      '通过养老服务机构或中介找护工，中介服务费通常为护工一个月工资（约5000-9000元），一般包含：护工匹配推荐、资质审核、合同签订、试用期不满意免费更换（通常1-3个月内）、后续服务跟踪。直接渠道（熟人介绍、平台直联）无中介费，但缺乏后续保障。',
  },
];

export default function GuidePricePage() {
  return (
    <>
      <FaqSchema qaList={faqList} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首页', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: '养老服务', item: BASE_URL },
              { '@type': 'ListItem', position: 3, name: '价格指南' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: '居家养老护理价格指南',
            datePublished: '2025-01-01',
            dateModified: '2026-05-14',
            author: { '@type': 'Organization', name: '亲护' },
            publisher: { '@type': 'Organization', name: '亲护', url: BASE_URL },
            ...eeat,
          }),
        }}
      />

      <article className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: '首页', href: '/' },
          { label: '价格指南' },
        ]} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-4">
          居家养老护理价格指南
        </h1>
        <p className="text-zinc-500 mb-2">
          更新于 2026年5月 · 覆盖全国31个城市 · 数据来源于各城市养老服务平台公开报价
        </p>
        <p className="text-zinc-500 mb-8">
          覆盖5大服务类型 · 市区/郊区价格对比 · 影响价格的关键因素
        </p>

        {/* 价格一览表 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            居家养老服务价格一览
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">服务类型</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">计价方式</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">价格区间</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">月费参考</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">全天住家照护</td>
                  <td className="border border-zinc-200 p-3">按天</td>
                  <td className="border border-zinc-200 p-3">180-300元/天</td>
                  <td className="border border-zinc-200 p-3">5,500-9,000元</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">日间照护（8小时）</td>
                  <td className="border border-zinc-200 p-3">按天</td>
                  <td className="border border-zinc-200 p-3">100-150元/天</td>
                  <td className="border border-zinc-200 p-3">3,000-4,500元</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">半天照护（4小时）</td>
                  <td className="border border-zinc-200 p-3">按天</td>
                  <td className="border border-zinc-200 p-3">70-100元/天</td>
                  <td className="border border-zinc-200 p-3">2,100-3,000元</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">陪诊服务</td>
                  <td className="border border-zinc-200 p-3">按次</td>
                  <td className="border border-zinc-200 p-3">130-200元/次</td>
                  <td className="border border-zinc-200 p-3">按需</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">术后/康复护理</td>
                  <td className="border border-zinc-200 p-3">按天</td>
                  <td className="border border-zinc-200 p-3">240-350元/天</td>
                  <td className="border border-zinc-200 p-3">7,200-10,500元</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">医疗级护理（护士）</td>
                  <td className="border border-zinc-200 p-3">按天/按次</td>
                  <td className="border border-zinc-200 p-3">300-500元/天</td>
                  <td className="border border-zinc-200 p-3">9,000-15,000元</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 按资质分 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            按护工资质的价格差异
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">资质等级</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">证书要求</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">经验年限</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">住家月费</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3">初级护工</td>
                  <td className="border border-zinc-200 p-3">初级养老护理员证、健康证</td>
                  <td className="border border-zinc-200 p-3">1-3年</td>
                  <td className="border border-zinc-200 p-3">5,500-6,500元</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3">中级护工</td>
                  <td className="border border-zinc-200 p-3">中级养老护理员证、健康证</td>
                  <td className="border border-zinc-200 p-3">3-7年</td>
                  <td className="border border-zinc-200 p-3">6,500-7,500元</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3">高级护工</td>
                  <td className="border border-zinc-200 p-3">高级养老护理员证、健康证</td>
                  <td className="border border-zinc-200 p-3">7年以上</td>
                  <td className="border border-zinc-200 p-3">7,500-9,000元</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3">护士级</td>
                  <td className="border border-zinc-200 p-3">护士执业证书 + 养老护理员证</td>
                  <td className="border border-zinc-200 p-3">不限</td>
                  <td className="border border-zinc-200 p-3">9,000-15,000元</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 市区vs郊区 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            市区 vs 郊区价格对比
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            以24小时住家护工（中级资质）为基准，对比不同区域的价格差异：
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">区域</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">代表区</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">月费区间</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">特点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">市中心</td>
                  <td className="border border-zinc-200 p-3">黄浦、静安、徐汇、长宁</td>
                  <td className="border border-zinc-200 p-3">6,500-9,000元</td>
                  <td className="border border-zinc-200 p-3">价格最高，护工供给充足</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">近郊</td>
                  <td className="border border-zinc-200 p-3">闵行、宝山、嘉定、浦东外环</td>
                  <td className="border border-zinc-200 p-3">5,500-7,500元</td>
                  <td className="border border-zinc-200 p-3">性价比高，适合大多数家庭</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">远郊</td>
                  <td className="border border-zinc-200 p-3">松江、青浦、奉贤、崇明</td>
                  <td className="border border-zinc-200 p-3">4,500-6,500元</td>
                  <td className="border border-zinc-200 p-3">价格最低，但护工选择相对少</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 影响因素 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            影响护工价格的5个关键因素
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-700 leading-relaxed">
            <li>
              <strong>老人自理能力：</strong>完全自理 vs 半自理 vs 完全不能自理，价格差异可达50%。卧床、需要翻身拍背、鼻饲等重度护理需求价格最高。
            </li>
            <li>
              <strong>护工资质和经验：</strong>高级证书比初级证书贵30%-50%，有医院工作背景的护工更贵。
            </li>
            <li>
              <strong>服务区域：</strong>市中心比郊区贵20%-30%，交通便利程度也影响价格。
            </li>
            <li>
              <strong>是否包吃住：</strong>住家护工通常由雇主提供食宿，这部分隐性成本约1500-2000元/月。
            </li>
            <li>
              <strong>节假日和休息：</strong>法定节假日是否双倍工资、每月休几天，需在合同中明确。
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">常见问题</h2>
          {faqList.map((faq, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                Q{i + 1}: {faq.question}
              </h3>
              <p className="text-zinc-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* 相关指南 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">相关指南</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/guide/zhaohugong" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">找护工完整指南</h3>
              <p className="text-xs text-zinc-500">四步找到靠谱居家养老护工</p>
            </Link>
            <Link href="/guide/xuanze" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">选择靠谱护工</h3>
              <p className="text-xs text-zinc-500">5个维度评估护工是否靠谱</p>
            </Link>
            <Link href="/guide/yanglao-zhengce" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">养老政策解读</h3>
              <p className="text-xs text-zinc-500">了解可享受的养老福利政策</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-50 rounded-xl p-6 text-center mb-10">
          <h2 className="text-lg font-bold text-zinc-900 mb-2">
            按你的预算找护工
          </h2>
          <p className="text-zinc-600 mb-4">
            浏览不同区域和价格区间的护工，查看真实评价和详细资质
          </p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            浏览全部城市 →
          </Link>
        </section>
        <ContentReviewNote sources={sources} updatedAt="2026年5月14日" />
      </article>
    </>
  );
}
