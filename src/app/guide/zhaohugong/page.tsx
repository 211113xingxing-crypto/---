import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqSchema } from '@/components/schema/faq-schema';
import { ContentReviewNote, buildArticleEEAT } from '@/components/content-review-note';
import { HowToSchema } from '@/components/schema/how-to-schema';
import { BASE_URL } from '@/lib/env';

const sources = [
  '民政部《关于推进养老服务发展的意见》',
  '国家卫健委《老年护理实践指南（试行）》',
  '中国社会福利与养老服务协会行业标准'
];
const eeat = buildArticleEEAT(sources);

export const revalidate = 86400;

export const metadata: Metadata = {
  title: '找护工完整指南｜靠谱居家养老护工怎么找？ — 亲护',
  description:
    '找护工最全指南：从明确需求、选择渠道、面试筛选到签约注意事项，四步找到靠谱居家养老护工。覆盖价格参考、资质要求、常见问题。',
  alternates: { canonical: `${BASE_URL}/guide/zhaohugong` },
};

const faqList = [
  {
    question: '找一个靠谱的居家护工要多少钱？',
    answer:
      '居家护工价格主要按服务模式分：全天24小时住家照护约180-300元/天（5500-9000元/月），日间8小时照护约100-150元/天（3000-4500元/月），陪诊服务约130-200元/次。一线城市价格较高，二三线城市通常低20%-30%。价格因护工资质、经验、服务内容不同有差异。持有高级证书或护士执业证书的护工价格通常高30%-50%。',
  },
  {
    question: '找护工应该通过中介还是直接找人？',
    answer:
      '各有优劣。通过专业养老服务机构（中介）的优势是：有资质审核、背景核查、可换人、有合同保障；缺点是有中介费。直接找个人护工的优势是：价格较低、沟通直接；缺点是缺乏保障、出问题无处投诉。建议优先选择有正规资质的机构或平台，尤其是失能、术后康复等专业需求较高的场景。',
  },
  {
    question: '护工需要什么资质证书？',
    answer:
      '正规护工应持有：①身份证（基本身份核验）；②养老护理员证书（初级/中级/高级，人社部颁发）；③健康证（证明无传染病）；④背景核查报告（无犯罪记录）。从事医疗护理的还应持有护士执业证书，康复类需持有康复治疗师证书。面试时可要求出示原件。',
  },
  {
    question: '怎么判断护工好不好？',
    answer:
      '从五个方面评估：①看资质证书是否齐全、真实；②看工作经验，是否有类似老人的照护经验；③看评价口碑，尤其是有"真实服务"标记的评价；④面试时观察沟通态度和专业知识的掌握程度；⑤试工期（建议1-3天）观察实际服务表现。一个好的护工不仅技术过硬，更重要的是有耐心和爱心。',
  },
  {
    question: '护工一般服务哪些内容？',
    answer:
      '居家护工的服务范围包括：日常生活照护（喂饭、洗澡、翻身、穿衣、如厕）、家务料理（做饭、打扫、洗衣）、健康监测（测血压、测血糖、提醒用药）、陪伴服务（聊天、散步、读报）、康复训练（肢体功能训练、语言训练）。医疗类服务（换药、注射、导管护理）需要护士执业证书。',
  },
];

export default function GuideZhaoHuGongPage() {
  return (
    <>
      <FaqSchema qaList={faqList} />
      <HowToSchema
        name="找护工完整指南"
        description="从明确需求、选择渠道、面试筛选到签约注意事项，四步找到靠谱居家养老护工。"
        steps={[
          { name: '明确照护需求', text: '梳理老人自理能力、医疗需求、服务模式（住家/日间/按次）、特殊需求，确定需要的服务类型和护工资质要求。' },
          { name: '选择寻人渠道', text: '对比专业养老平台、养老服务机构/中介、熟人介绍、社区养老中心四种渠道的优缺点，选择最适合的寻人方式。' },
          { name: '面试与筛选', text: '面试时必问5个问题：工作经验、证书原件、紧急处理能力、日常工作安排、前任雇主参考资料。核验证书真实性，评估沟通态度。' },
          { name: '签约与试工', text: '签订服务协议明确服务内容、薪资、休息安排；约定1-3天试工期观察护工表现；建立日常沟通机制；确认保险保障。' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首页', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: '养老服务', item: BASE_URL },
              { '@type': 'ListItem', position: 3, name: '找护工指南' },
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
            headline: '找护工完整指南：四步找到靠谱的居家养老护工',
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
          { label: '找护工指南' },
        ]} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-4">
          找护工完整指南：四步找到靠谱的居家养老护工
        </h1>

        <p className="text-zinc-500 mb-2">
          更新于 2026年5月 · 覆盖全国31个城市 · 居家护理 / 陪诊 / 日间照料 / 术后康复
        </p>
        <p className="text-zinc-500 mb-8">
          更新于 2026年 · 覆盖全国31个城市 · 居家护理/陪诊/日间照料/术后康复
        </p>

        {/* 第一步 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            第一步：明确你的照护需求
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            在开始找护工之前，先梳理清楚老人的具体情况和需要的服务类型，这样才能精准匹配。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">需求维度</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">选项</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">对应的服务类型</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">服务模式</td>
                  <td className="border border-zinc-200 p-3">24小时住家 / 日间8小时 / 按次上门</td>
                  <td className="border border-zinc-200 p-3">
                    <Link href="/search?type=hugong" className="text-emerald-700 hover:underline">居家护工</Link>
                    {' / '}
                    <Link href="/search?type=rijian-zhaoliao" className="text-emerald-700 hover:underline">日间照料</Link>
                  </td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">老人自理能力</td>
                  <td className="border border-zinc-200 p-3">完全自理 / 半自理 / 完全不能自理</td>
                  <td className="border border-zinc-200 p-3">不同级别对应不同护工资质要求</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">医疗需求</td>
                  <td className="border border-zinc-200 p-3">无特殊 / 慢性病管理 / 术后康复 / 失能护理</td>
                  <td className="border border-zinc-200 p-3">
                    <Link href="/search?type=shuhou-kangfu" className="text-emerald-700 hover:underline">术后康复</Link>
                    {' / 医疗级护理'}
                  </td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">特殊需求</td>
                  <td className="border border-zinc-200 p-3">认知障碍 / 帕金森 / 糖尿病 / 中风后遗症</td>
                  <td className="border border-zinc-200 p-3">需匹配有相关经验的护工</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 第二步 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            第二步：选择寻人渠道
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            不同渠道适合不同需求场景，以下是找护工的主要渠道对比：
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">渠道</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">优点</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">缺点</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">适合场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">专业养老平台</td>
                  <td className="border border-zinc-200 p-3">资质核验、评价透明、可比较</td>
                  <td className="border border-zinc-200 p-3">新兴平台数量尚少</td>
                  <td className="border border-zinc-200 p-3">大多数家庭，重视服务质量和安全</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">养老服务机构/中介</td>
                  <td className="border border-zinc-200 p-3">护工储备多、可换人、有合同</td>
                  <td className="border border-zinc-200 p-3">中介费较高（通常一个月工资）</td>
                  <td className="border border-zinc-200 p-3">需要快速匹配、专业护理需求</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">熟人介绍</td>
                  <td className="border border-zinc-200 p-3">信任度高、沟通顺畅</td>
                  <td className="border border-zinc-200 p-3">选择范围窄、无备选</td>
                  <td className="border border-zinc-200 p-3">有可靠人脉推荐的情况</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">社区养老中心</td>
                  <td className="border border-zinc-200 p-3">政府背书、价格透明</td>
                  <td className="border border-zinc-200 p-3">服务范围有限，需排队</td>
                  <td className="border border-zinc-200 p-3">基础日间照料、社区助老服务</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 第三步 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            第三步：面试与筛选
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            面试是找到好护工的关键环节。以下是面试时必问的5个问题：
          </p>
          <ol className="list-decimal list-inside space-y-3 text-zinc-700 leading-relaxed">
            <li className="pl-2">
              <strong>您做护工多少年了？之前照顾过什么样的老人？</strong>
              <br />
              <span className="text-zinc-500 text-sm">
                了解经验年限和过往案例。重点关注是否有照顾类似情况老人（如失能、认知障碍、术后等）的经验。
              </span>
            </li>
            <li className="pl-2">
              <strong>您有哪些证书？可以看看原件吗？</strong>
              <br />
              <span className="text-zinc-500 text-sm">
                核验养老护理员证书等级、健康证、是否有护士执业证书或康复治疗师证书。拍照留存。
              </span>
            </li>
            <li className="pl-2">
              <strong>如果老人出现紧急情况，您会怎么处理？</strong>
              <br />
              <span className="text-zinc-500 text-sm">
                考察应急处理能力和急救知识。好的护工会说"先判断情况，拨打120，同时通知家属，在等待期间进行基本急救"。
              </span>
            </li>
            <li className="pl-2">
              <strong>您平时怎么安排一天的工作？</strong>
              <br />
              <span className="text-zinc-500 text-sm">
                有经验的护工会给出具体的时间表：几点起床、吃饭、吃药、活动、午休等，说明有条理。
              </span>
            </li>
            <li className="pl-2">
              <strong>之前服务的家庭为什么结束了？可以联系他们了解一下吗？</strong>
              <br />
              <span className="text-zinc-500 text-sm">
                参考资料检查很重要。如果护工不愿意提供参考资料，需要谨慎考虑。
              </span>
            </li>
          </ol>
        </section>

        {/* 第四步 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            第四步：签约与试工
          </h2>
          <ul className="list-disc list-inside space-y-3 text-zinc-700 leading-relaxed">
            <li>
              <strong>签订服务协议：</strong>明确服务内容、工作时间和休息安排、薪资标准和支付方式、双方权利义务。通过机构找的护工，合同由机构提供。
            </li>
            <li>
              <strong>约定试用期：</strong>建议1-3天试工期，观察护工与老人的互动、工作态度、专业技能。试工期不满意可以无偿更换。
            </li>
            <li>
              <strong>明确沟通机制：</strong>建立日常沟通渠道（微信群最常用），护工每天汇报老人情况，家属及时反馈意见。
            </li>
            <li>
              <strong>购买保险：</strong>确认护工是否有意外险和职业责任险。如果没有，建议家属为护工购买一份（年费约200-500元）。
            </li>
          </ul>
        </section>

        {/* 价格参考 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            居家护工价格参考（2025年）
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">服务类型</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">价格区间</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">适合人群</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">全天24小时住家</td>
                  <td className="border border-zinc-200 p-3">180-300元/天（5500-9000元/月）</td>
                  <td className="border border-zinc-200 p-3">半自理/不能自理老人</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">日间8小时照护</td>
                  <td className="border border-zinc-200 p-3">100-150元/天（3000-4500元/月）</td>
                  <td className="border border-zinc-200 p-3">子女晚间可接手的家庭</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">陪诊服务</td>
                  <td className="border border-zinc-200 p-3">130-200元/次（2-4小时）</td>
                  <td className="border border-zinc-200 p-3">需要陪同就医的老人</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">术后/康复护理</td>
                  <td className="border border-zinc-200 p-3">240-350元/天</td>
                  <td className="border border-zinc-200 p-3">中风、骨折等术后恢复期老人</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">医疗级护理（护士上门）</td>
                  <td className="border border-zinc-200 p-3">300-500元/天</td>
                  <td className="border border-zinc-200 p-3">需要换药、注射、导管护理的老人</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-zinc-400 text-xs mt-2">
            * 以上价格为一线城市参考价，各城市和区域有差异，二三线城市通常低20%-30%。具体价格以实际沟通为准。
            详见 <Link href="/guide/jiage" className="text-emerald-700 hover:underline">居家护理价格详细指南</Link>。
          </p>
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
            <Link href="/guide/jiage" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">价格参考指南</h3>
              <p className="text-xs text-zinc-500">了解各类养老服务市场价格</p>
            </Link>
            <Link href="/guide/xuanze" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">选择靠谱护工</h3>
              <p className="text-xs text-zinc-500">5个维度评估护工是否靠谱</p>
            </Link>
            <Link href="/guide/changjianjibing-huli" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">常见疾病护理</h3>
              <p className="text-xs text-zinc-500">老年常见疾病的居家护理方法</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-50 rounded-xl p-6 text-center mb-10">
          <h2 className="text-lg font-bold text-zinc-900 mb-2">
            马上开始找护工
          </h2>
          <p className="text-zinc-600 mb-4">
            按区域、服务类型、价格筛选，查看真实评价和资质信息
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/search?type=hugong"
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              浏览居家护工
            </Link>
            <Link
              href="/"
              className="inline-block bg-white text-emerald-700 border border-emerald-600 px-6 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              按城市查找
            </Link>
          </div>
        </section>
        <ContentReviewNote sources={sources} updatedAt="2026年5月14日" />
      </article>
    </>
  );
}
