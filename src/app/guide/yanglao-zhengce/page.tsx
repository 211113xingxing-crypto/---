import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqSchema } from '@/components/schema/faq-schema';
import { ContentReviewNote, buildArticleEEAT } from '@/components/content-review-note';
import { BASE_URL } from '@/lib/env';

const sources = [
  '国务院《"十四五"国家老龄事业发展和养老服务体系规划》',
  '民政部养老服务相关政策文件',
  '国家医保局长期护理保险试点政策汇总'
];
const eeat = buildArticleEEAT(sources);

export const revalidate = 86400;

export const metadata: Metadata = {
  title: '中国养老政策解读指南 — 亲护',
  description:
    '中国现行养老政策体系解读：长期护理保险试点、居家养老服务补贴、医养结合政策、养老机构补贴、养老服务人才政策。帮助家庭了解可享受的养老福利政策。',
  alternates: { canonical: `${BASE_URL}/guide/yanglao-zhengce` },
};

const faqList = [
  {
    question: '什么是长期护理保险（长护险）？我家老人能享受吗？',
    answer:
      '长期护理保险是为失能、半失能人员提供护理保障的社会保险制度。截至2026年，全国已有49个试点城市开展长护险。参保对象主要为城镇职工基本医疗保险参保人员，部分地区扩展至城乡居民。失能评定标准：依据巴氏量表评分，重度失能（≤40分）可享受最高等级待遇。待遇形式包括居家上门护理、机构护理、现金补贴等。每月报销额度约1500-3000元，具体以当地政策为准。建议咨询当地医保局或社区养老服务中心确认。',
  },
  {
    question: '居家养老服务补贴怎么申请？',
    answer:
      '居家养老服务补贴（养老服务券/护理补贴）的申请条件一般为：①本地户籍且年满60周岁；②经济困难（低保、低收入、特困供养等）或经评估为失能/半失能；③在社区居家养老（未入住养老机构）。申请流程：前往户籍所在街道/社区事务受理中心→提交身份证、户口本、收入证明、失能评估报告→社区审核公示→发放养老服务券或直接打入社保卡。补贴标准各地不同，一般200-1000元/月。各地政策差异较大，建议先拨打12349民政服务热线咨询。',
  },
  {
    question: '"医养结合"是什么意思？对我们家庭有什么好处？',
    answer:
      '医养结合是将医疗服务与养老服务相结合的模式，解决"养老的不懂医、医疗的不养老"的问题。主要形态包括：①养老机构内设医务室/护理站（常见模式）；②医院开设养老护理床位；③社区卫生服务中心与社区养老驿站签约合作；④家庭医生签约+上门护理服务。好处：老人不需要在医院和养老机构之间反复转院，慢性病管理、康复护理在养老场景中完成，减少家庭奔波和医疗费用。2026年国家卫健委要求90%以上的社区卫生服务中心开展医养结合服务。',
  },
  {
    question: '社会资本开办养老机构有什么扶持政策？',
    answer:
      '国家对养老机构有多种扶持政策：①建设补贴：新建养老机构每床补贴1-3万元（各地不同），租赁改造补贴减半；②运营补贴：按入住老人数每月补贴100-500元/床，失能老人补贴更高；③税费减免：免征增值税、企业所得税减按15%征收、免征房产税和城镇土地使用税；④用地优惠：养老用地出让起价按基准地价的70%确定；⑤用水用电用气按居民价格执行。申请渠道：向当地民政部门和发改委申报。值得注意的是，各地补贴标准差异较大，实际到账可能滞后。',
  },
  {
    question: '养老护理员有什么职业发展政策？',
    answer:
      '国家正在大力培养养老服务人才：①职业技能等级认定：养老护理员分五级（初级工→高级技师），每级有对应的薪资指导标准；②培训补贴：参加养老护理员培训取得证书，可享受1500-3000元培训补贴（各地标准不同）；③入职奖励：部分地区对高校毕业生入职养老服务机构给予一次性奖励（如北京5000-20000元）；④积分落户加分：北京、上海等城市将养老护理员纳入紧缺职业目录，给予积分落户加分。这些政策正逐步提升养老护理行业的专业化和待遇水平，吸引更多人从事养老护理工作。',
  },
  {
    question: '农村养老和城市养老政策有什么不同？',
    answer:
      '农村养老服务面临更多挑战，但也有针对性的政策安排：①城乡居民养老保险：农村老人月领取养老金约100-500元（缴费档次和年限决定）；②农村幸福院/互助养老：政府补贴建设村级养老服务站，提供日间照料和助餐服务；③特困供养：无子女、无劳动能力、无生活来源的"三无"老人可享受全额供养（含住、吃、穿、医、葬）；④低保兜底：家庭人均收入低于当地低保标准的部分人口可享受最低生活保障。农村养老仍是社会保障的短板，建议有条件的家庭尽早为老人规划养老方案，包括商业养老保险和居家养老服务储备。',
  },
];

export default function GuidePolicyPage() {
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
              { '@type': 'ListItem', position: 3, name: '养老政策指南' },
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
            headline: '中国养老政策解读指南',
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
          { label: '养老政策指南' },
        ]} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-4">
          中国养老政策解读指南
        </h1>
        <p className="text-zinc-500 mb-2">
          更新于 2026年5月 · 基于国务院、民政部、卫健委等公开政策文件整理
        </p>
        <p className="text-zinc-500 mb-8">
          涵盖长护险、居家养老补贴、医养结合、机构扶持、人才政策、农村养老6大板块
        </p>

        {/* 长期护理保险 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            一、长期护理保险制度 — 养老护理的经济保障
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            长期护理保险（长护险）被称为社保"第六险"，专门为失能、半失能人员提供护理费用保障。这是缓解家庭护理经济压力最直接的政策工具。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">长护险要点</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>试点城市：49个，包括北京、上海、广州、成都、青岛、南通等</li>
              <li>参保对象：职工医保参保人为主，部分城市扩展至城乡居民</li>
              <li>筹资方式：医保统筹基金划转 + 个人缴费 + 财政补贴</li>
              <li>失能评定：由第三方评估机构按巴氏量表评定等级</li>
              <li>服务形式：居家上门护理（占70%以上）、机构护理、社区日间照料</li>
              <li>待遇水平：居家护理约1500-3000元/月，机构护理略高</li>
            </ul>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">城市</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">缴费标准</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">居家护理待遇</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">上海</td>
                  <td className="border border-zinc-200 p-3">个人90元/年</td>
                  <td className="border border-zinc-200 p-3">每周3-7次上门服务</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">北京（石景山）</td>
                  <td className="border border-zinc-200 p-3">个人90元/年</td>
                  <td className="border border-zinc-200 p-3">每月最高报销约2000元</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">广州</td>
                  <td className="border border-zinc-200 p-3">个人约90元/年</td>
                  <td className="border border-zinc-200 p-3">生活照料+医疗护理，最高3000元/月</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">成都</td>
                  <td className="border border-zinc-200 p-3">个人25元/年</td>
                  <td className="border border-zinc-200 p-3">等级3级最高约1800元/月</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">青岛</td>
                  <td className="border border-zinc-200 p-3">个人30元/年</td>
                  <td className="border border-zinc-200 p-3">每周3-5小时居家服务</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-400 mt-2">注：以上数据基于公开政策文件，具体以当地最新政策为准。</p>
        </section>

        {/* 居家养老补贴 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            二、居家养老服务补贴 — 直接减轻家庭负担
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            各地政府对经济困难或失能老人提供居家养老服务补贴，以服务券、现金或直接服务的形式发放。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">申请要点</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>申请条件：一般要求本地户籍、年满60周岁、经济困难或经评估失能</li>
              <li>申请地点：户籍所在街道/社区事务受理中心</li>
              <li>所需材料：身份证、户口本、收入证明/低保证、失能评估报告</li>
              <li>补贴标准：各地不同，一般200-1000元/月</li>
              <li>咨询电话：12349（民政服务热线）、12333（人社服务热线）</li>
            </ul>
          </div>
        </section>

        {/* 医养结合 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            三、医养结合 — 打通医疗护理与养老服务
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            2015年起国家推行医养结合，目标是将医疗资源下沉到养老服务和社区家庭中。截至2025年底，全国医养结合机构已超过8000家。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">模式一：养内设医</h3>
              <p className="text-sm text-zinc-600">养老机构内设医务室或护理站，配备执业医师和护士，提供常见病诊疗、慢病管理、康复护理。</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">模式二：医内设养</h3>
              <p className="text-sm text-zinc-600">二级以下医院开设养老护理床位，接收失能、半失能老人，提供医疗+护理+生活照料一体服务。</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">模式三：签约合作</h3>
              <p className="text-sm text-zinc-600">社区卫生服务中心与养老驿站签约，医生定期巡诊，绿色通道转诊，家庭医生签约服务。</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-2">模式四：上门服务</h3>
              <p className="text-sm text-zinc-600">医护人员上门提供换药、插管、注射、采血等医疗护理服务，适合行动不便老人。</p>
            </div>
          </div>
        </section>

        {/* 养老机构扶持 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            四、养老机构扶持政策
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            政府通过建设和运营补贴、税费减免、土地优惠等方式，鼓励社会力量投资养老服务业。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-zinc-200 p-3 text-left font-medium">政策类型</th>
                  <th className="border border-zinc-200 p-3 text-left font-medium">内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">建设补贴</td>
                  <td className="border border-zinc-200 p-3">新建每床1-3万元；租赁改造每床0.5-1.5万元</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">运营补贴</td>
                  <td className="border border-zinc-200 p-3">按入住老人100-500元/月/床，失能老人上浮30%-50%</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">税费减免</td>
                  <td className="border border-zinc-200 p-3">免征增值税、减征企业所得税、免征房产税和城镇土地使用税</td>
                </tr>
                <tr className="bg-zinc-50">
                  <td className="border border-zinc-200 p-3 font-medium">用地优惠</td>
                  <td className="border border-zinc-200 p-3">养老用地出让底价按基准地价70%；鼓励利用闲置厂房和商业设施</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 p-3 font-medium">水电气价格</td>
                  <td className="border border-zinc-200 p-3">养老机构用水、用电、用气、用热按居民生活类价格执行</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 养老服务人才 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            五、养老服务人才政策 — 提升行业专业化
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            养老护理员是国家认定的紧缺职业。政策从培养、认证、补贴到职业发展给予全方位支持。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5">
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li><strong>资格认证：</strong>养老护理员职业技能等级分5级（初级工→中级工→高级工→技师→高级技师），全国通用</li>
              <li><strong>培训补贴：</strong>参加培训取得证书可享受1500-3000元补贴</li>
              <li><strong>入职奖励：</strong>部分地区对高校毕业生入职养老服务机构给予5000-20000元一次性奖励</li>
              <li><strong>积分落户：</strong>北京、上海等城市将养老护理员列入紧缺职业，积分落户加分</li>
              <li><strong>技能竞赛：</strong>全国养老护理职业技能大赛每年举办，获奖者可破格晋升</li>
            </ul>
          </div>
        </section>

        {/* 农村养老 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            六、农村养老 — 特殊国情下的挑战与对策
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            农村老龄化率高于城市，但养老服务资源明显不足。近年来国家加大农村养老服务体系建设力度。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5">
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li><strong>农村幸福院：</strong>政府补贴建设的村级养老服务站，提供日间照料、助餐、休闲活动</li>
              <li><strong>互助养老：</strong>"邻里互助"模式，低龄健康老人帮助高龄失能老人，积累服务时间未来兑换</li>
              <li><strong>特困供养：</strong>"三无"老人（无子女、无劳动能力、无生活来源）享受政府全额供养</li>
              <li><strong>城乡居民养老保险：</strong>年满60岁按月领取，金额取决于缴费年限和缴费档次</li>
              <li><strong>农村低保：</strong>家庭人均收入低于当地标准的可申请，2026年全国平均约600元/月</li>
            </ul>
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
            <Link href="/guide/jiage" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">价格参考指南</h3>
              <p className="text-xs text-zinc-500">了解各类养老服务市场价格</p>
            </Link>
            <Link href="/guide/changjianjibing-huli" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">常见疾病护理</h3>
              <p className="text-xs text-zinc-500">老年常见疾病的居家护理方法</p>
            </Link>
            <Link href="/guide/zhaohugong" className="block p-4 border border-zinc-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <h3 className="font-medium text-sm text-zinc-900 mb-1">找护工完整指南</h3>
              <p className="text-xs text-zinc-500">四步找到靠谱居家养老护工</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-50 rounded-xl p-6 text-center mb-10">
          <h2 className="text-lg font-bold text-zinc-900 mb-2">
            找到资质齐全的养老服务机构
          </h2>
          <p className="text-zinc-600 mb-4">
            浏览各城市认证护工和养老机构，查看资质证书和真实评价
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
