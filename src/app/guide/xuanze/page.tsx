import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqSchema } from '@/components/schema/faq-schema';
import { ContentReviewNote, buildArticleEEAT } from '@/components/content-review-note';
import { HowToSchema } from '@/components/schema/how-to-schema';
import { BASE_URL } from '@/lib/env';

const sources = [
  '人力资源和社会保障部《养老护理员国家职业技能标准》',
  '民政部《养老机构等级划分与评定》',
  '中国老年医学学会相关共识'
];
const eeat = buildArticleEEAT(sources);

export const revalidate = 86400;

export const metadata: Metadata = {
  title: '如何选择靠谱护工？5个评估维度帮你判断 — 亲护',
  description:
    '挑选居家养老护工不是只看价格。从资质核验、经验评估、评价判断、面试技巧到试工观察，全流程教你如何选到靠谱、专业、有爱心的护工。',
  alternates: { canonical: `${BASE_URL}/guide/xuanze` },
};

const faqList = [
  {
    question: '护工有养老护理员证书就一定靠谱吗？',
    answer:
      '证书是重要参考但不等于全部。养老护理员证书分初级、中级、高级，由人社部门颁发。持有高级证书说明通过了更严格的理论和实操考核，但证书不能完全代表实际服务态度和责任心。判断护工是否靠谱还需要结合：过往服务家庭的评价、面试时的沟通表现、试工期实际观察。另外注意：证书有真有假，可以要求查看原件并记录证书编号。',
  },
  {
    question: '怎么查护工有没有不良记录？',
    answer:
      '正规途径包括：①要求护工提供无犯罪记录证明（可到户籍地派出所开具）；②通过平台或中介机构，一般都会做背景核查；③联系护工前雇主了解情况（如果护工不愿提供参考资料则需谨慎）；④查询中国裁判文书网、失信被执行人名单等公开信息。选择经过正规机构审核的护工可以省去这些麻烦。',
  },
  {
    question: '护工年龄大的好还是年轻的好？',
    answer:
      '各有优势。45-55岁的护工经验丰富、性格沉稳、对老人有耐心，但体力可能不如年轻人。35-45岁的护工体力好、学习能力强、能操作智能设备（远程与家属沟通），但经验可能不如年长护工。对于需要较大体力（如搬动老人、长时间站立）的工作，年轻护工更有优势。对于需要耐心和情感陪伴的场景，年长护工往往更合适。',
  },
  {
    question: '男护工和女护工怎么选？',
    answer:
      '女护工占绝大多数（约85%），优势是细心、温柔、擅长日常照护和情感陪伴。男护工虽少但有其不可替代的场景：①照顾男性老人（洗澡、如厕等涉及隐私时体验更好）；②需要较大体力的照护（如搬运、搀扶体重较大的老人）；③有些老年男性更喜欢和男护工聊天。选择时应以老人感受为第一优先。',
  },
  {
    question: '试工期间观察什么？',
    answer:
      '试工（通常1-3天）是判断护工是否靠谱的最重要环节。重点观察：①专业操作是否规范（喂饭姿势、翻身技巧、轮椅使用）；②与老人的互动态度（是否耐心、主动交流、尊重老人）；③时间管理（是否按时喂药、按时活动）；④卫生习惯（个人卫生、厨房清洁）；⑤沟通汇报（是否主动向家属汇报老人情况）。如果试工期间发现不对劲，不要犹豫，立即更换。',
  },
];

export default function GuideXuanzePage() {
  return (
    <>
      <FaqSchema qaList={faqList} />
      <HowToSchema
        name="选择靠谱护工指南"
        description="从资质核验、经验评估、评价判断、面试技巧到试工观察，全流程教你如何选到靠谱、专业、有爱心的护工。"
        steps={[
          { name: '核验资质证书', text: '查看养老护理员证书（初级/中级/高级）、健康证、身份证原件。记录证书编号，拍照留存。核实证书真伪，确认是否在有效期内。' },
          { name: '评估工作经验', text: '了解护工的工作年限和过往服务案例。重点关注是否有照顾类似情况老人（如失能、认知障碍、术后等）的经验。联系前雇主了解实际服务表现。' },
          { name: '查看真实评价', text: '阅读其他家庭的评价和评分，特别关注带有"真实服务"标记的评价。综合看正面和负面评价，了解护工的优缺点。' },
          { name: '面试沟通评估', text: '面试时观察护工的沟通态度、专业知识掌握程度和责任心。准备具体问题：应急处理、日常工作安排、与老人的互动方式等。' },
          { name: '试工观察判断', text: '安排1-3天试工期，重点观察：专业技能操作是否规范、与老人互动态度是否耐心、时间管理是否有序、卫生习惯是否良好、是否主动汇报沟通。发现问题立即更换。' },
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
              { '@type': 'ListItem', position: 3, name: '如何选择护工' },
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
            headline: '如何选择靠谱护工？5个评估维度帮你判断',
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
          { label: '如何选择护工' },
        ]} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-4">
          如何选择靠谱护工？5个维度帮你做出正确决定
        </h1>
        <p className="text-zinc-500 mb-2">
          更新于 2026年5月 · 参考国家卫健委《关于加强老年护理服务工作的通知》
        </p>
        <p className="text-zinc-500 mb-8">
          选护工不能只看价格——资质、经验、评价、性格，每个维度都关系到老人的安全和幸福感
        </p>

        {/* 维度1: 资质核验 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            一、资质核验：看清护工的真实水平
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            资质证书是护工专业性的硬指标。以下是挑选护工时必须核查的证书清单：
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">证书名称</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">颁发机构</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">重要程度</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">核查方式</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">身份证</td>
                  <td className="border border-zinc-200 p-3">公安部门</td>
                  <td className="border border-zinc-200 p-3"><span className="text-red-500">必须</span></td>
                  <td className="border border-zinc-200 p-3">查看原件、拍照留存</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">养老护理员证书</td>
                  <td className="border border-zinc-200 p-3">人社部门/职业技能鉴定中心</td>
                  <td className="border border-zinc-200 p-3"><span className="text-red-500">必须</span></td>
                  <td className="border border-zinc-200 p-3">查看原件、记录编号，可在人社部官网查询</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">健康证</td>
                  <td className="border border-zinc-200 p-3">疾控中心/指定医院</td>
                  <td className="border border-zinc-200 p-3"><span className="text-red-500">必须</span></td>
                  <td className="border border-zinc-200 p-3">查看原件，确认在有效期内（通常一年）</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">无犯罪记录证明</td>
                  <td className="border border-zinc-200 p-3">户籍地派出所</td>
                  <td className="border border-zinc-200 p-3"><span className="text-amber-600">建议</span></td>
                  <td className="border border-zinc-200 p-3">正规中介会统一做背景核查</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">护士执业证书</td>
                  <td className="border border-zinc-200 p-3">卫健委</td>
                  <td className="border border-zinc-200 p-3"><span className="text-green-600">加分项</span></td>
                  <td className="border border-zinc-200 p-3">需要医疗护理时必须持此证</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">急救证</td>
                  <td className="border border-zinc-200 p-3">红十字会</td>
                  <td className="border border-zinc-200 p-3"><span className="text-green-600">加分项</span></td>
                  <td className="border border-zinc-200 p-3">有急救知识的护工更让人放心</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 维度2: 经验评估 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            二、经验评估：找对适合你家老人的护工
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            经验不是越长越好，关键是经验的"匹配度"——护工之前照顾的老人情况是否与你家老人相似。
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-700 leading-relaxed">
            <li>
              <strong>一般自理老人：</strong>1-3年经验的初级护工即可胜任，价格最实惠。
            </li>
            <li>
              <strong>慢性病老人（高血压/糖尿病等）：</strong>需要3年以上经验，有慢性病管理经验的中级护工。
            </li>
            <li>
              <strong>术后恢复期老人：</strong>最好找有医院护理背景、有骨科/外科康复经验的护工（5年以上经验较稳妥）。
            </li>
            <li>
              <strong>失能/半失能老人：</strong>需要5年以上经验，有重症护理经验的高级护工。这类护工对翻身、压疮预防、管道护理等操作非常熟练。
            </li>
            <li>
              <strong>认知障碍老人（阿尔茨海默等）：</strong>需要专门照顾过认知障碍老人的护工，这需要特殊的耐心和沟通技巧，普通经验不足以应对。
            </li>
          </ul>
        </section>

        {/* 维度3: 评价判断 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            三、评价判断：从他人的经历中获取真实信息
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            评价是最好的"试金石"。看评价时关注以下几点：
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-700 leading-relaxed">
            <li>
              <strong>看是否有"真实服务"标记：</strong>
              带有此标记的评价说明评价人确实通过平台联系过该护工，可信度更高。
            </li>
            <li>
              <strong>看重评价的细节：</strong>
              "很好"、"不错"等笼统评价参考价值低；"每天按时提醒吃药、每周带老人散步三次"等具体描述才是高质量评价。
            </li>
            <li>
              <strong>看差评怎么说的：</strong>
              零差评不一定好（可能是新护工）。少量差评反而真实，关键看差评说的是什么——迟到早退可能是态度问题，饭菜口味是个人偏好。
            </li>
            <li>
              <strong>看评价时间线：</strong>
              如果最近3个月没有新评价，可能是护工已不再接单或服务质量下降。
            </li>
          </ul>
        </section>

        {/* 维度4: 面试技巧 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            四、面试技巧：10分钟判断护工是否合适
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            面试不需要太正式，但要有准备。以下是面试护工的实用框架：
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">开场寒暄（2分钟）</h3>
              <p className="text-zinc-600 text-sm">
                观察第一印象：是否准时、着装整洁、态度亲切。让护工简单自我介绍一下，观察表达能力和性格。
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">专业能力考察（4分钟）</h3>
              <p className="text-zinc-600 text-sm">
                问具体场景问题："老人突然发烧38度你怎么处理？""怎么预防长期卧床老人的压疮？""老人不愿意吃饭怎么办？"——专业的护工会给出有步骤的答案，而非笼统的回答。
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">情境模拟（2分钟）</h3>
              <p className="text-zinc-600 text-sm">
                如果有老人在场，观察护工如何与老人互动。专业的护工会主动蹲下或弯腰与坐着的老人平视交流，语气温和但有引导力。
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">谈工资和条件（2分钟）</h3>
              <p className="text-zinc-600 text-sm">
                直接谈薪资、休息日、节假日安排。不要不好意思——好的护工反而欣赏直接透明的雇主。注意观察对方谈条件时的态度，过于计较或过于随意都可能是隐患。
              </p>
            </div>
          </div>
        </section>

        {/* 维度5: 试工观察 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            五、试工观察：3天验证你的判断
          </h2>
          <p className="text-zinc-600 mb-4 leading-relaxed">
            试工期是验证判断的关键，以下是一份试工观察清单：
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">观察维度</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">合格标准</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">警示信号</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">操作规范性</td>
                  <td className="border border-zinc-200 p-3">操作前洗手、动作轻柔有步骤</td>
                  <td className="border border-zinc-200 p-3">动作粗暴、不洗手、操作混乱</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">与老人互动</td>
                  <td className="border border-zinc-200 p-3">主动交流、耐心倾听、尊重老人</td>
                  <td className="border border-zinc-200 p-3">冷漠、不耐烦、粗暴拒绝老人要求</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">时间管理</td>
                  <td className="border border-zinc-200 p-3">按时做事、不拖延、不偷懒</td>
                  <td className="border border-zinc-200 p-3">长时间玩手机、频繁请假</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">沟通汇报</td>
                  <td className="border border-zinc-200 p-3">主动汇报老人情况、及时告知异常</td>
                  <td className="border border-zinc-200 p-3">什么都不说、问才答、敷衍</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">卫生习惯</td>
                  <td className="border border-zinc-200 p-3">个人整洁、保持环境清洁</td>
                  <td className="border border-zinc-200 p-3">脏乱、不注意老人卫生</td>
                </tr>
              </tbody>
            </table>
          </div>
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
            <Link href="/guide/jiage" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">价格参考指南</h3>
              <p className="text-xs text-zinc-500">了解各类养老服务市场价格</p>
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
            开始找经过资质认证的护工
          </h2>
          <p className="text-zinc-600 mb-4">
            浏览各城市护工，查看真实评价、资质证书和服务价格
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              选择城市
            </Link>
            <Link
              href="/guide/zhaohugong"
              className="inline-block bg-white text-emerald-700 border border-emerald-600 px-6 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              查看找护工指南
            </Link>
          </div>
        </section>
        <ContentReviewNote sources={sources} updatedAt="2026年5月14日" />
      </article>
    </>
  );
}
