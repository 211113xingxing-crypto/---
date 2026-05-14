import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FaqSchema } from '@/components/schema/faq-schema';
import { ContentReviewNote, buildArticleEEAT } from '@/components/content-review-note';
import { BASE_URL } from '@/lib/env';

const sources = [
  '国家卫健委《老年护理实践指南（试行）》',
  '中国老年医学学会相关共识',
  '中华护理学会老年护理专业委员会指南',
];
const eeat = buildArticleEEAT(sources);

export const revalidate = 86400;

export const metadata: Metadata = {
  title: '老人常见疾病居家护理指南 — 亲护',
  description:
    '老年常见疾病居家护理方法：高血压、糖尿病、脑卒中、阿尔茨海默、冠心病、骨质疏松。涵盖日常监测、用药管理、康复训练、饮食调理及专业护工选择建议。',
  alternates: { canonical: `${BASE_URL}/guide/changjianjibing-huli` },
};

const faqList = [
  {
    question: '高血压老人居家护理需要注意什么？',
    answer:
      '①每日定时测量血压并记录，保持血压在140/90mmHg以下；②严格遵医嘱服药，不可自行停药或增减剂量；③低盐饮食（每日食盐<6g），多吃蔬菜水果，限制高脂食物；④保持情绪稳定，避免激动、紧张；⑤适度运动如散步、太极，每次30分钟左右。建议由护工或家属协助建立血压监测日志，每3个月复查一次。',
  },
  {
    question: '糖尿病老人如何居家管理？',
    answer:
      '①每日监测血糖（空腹和餐后2小时），记录血糖日志；②按时服用降糖药或注射胰岛素，不可擅自调整；③控制饮食：总量控制、定时定量、合理搭配（低碳水、适量蛋白、高纤维）；④注意足部护理，每日检查足部有无破损、水泡、红肿，穿柔软透气的鞋袜；⑤防范低血糖：随身携带糖果，出现头晕、出汗、心慌时立即补充糖分。建议由经过培训的护工协助血糖监测和胰岛素注射。',
  },
  {
    question: '脑卒中后老人居家康复护理要点？',
    answer:
      '①良肢位摆放：预防关节挛缩和畸形，患侧肢体保持功能位；②被动和主动康复训练：从床上关节活动开始，逐步过渡到坐起、站立、行走训练；③吞咽功能训练：如存在吞咽困难，需进行专门的吞咽肌群训练，进食时取半卧位或坐位；④语言训练：与老人多交流，鼓励其表达，配合口型模仿和发音练习；⑤预防并发症：定时翻身（每2小时一次），预防压疮；拍背排痰，预防肺部感染。建议由具有康复护理经验的护工或康复师指导训练。',
  },
  {
    question: '阿尔茨海默病（老年痴呆）老人如何照护？',
    answer:
      '①建立规律的生活作息：固定时间起床、吃饭、活动、睡觉；②安全防护：安装门锁防走失、收纳危险物品（刀具、药品、清洁剂）、夜间留小夜灯；③沟通技巧：使用简短清晰的句子、保持眼神交流、不要争论、多用肢体语言安抚；④认知训练：看老照片、听老歌、做简单拼图、手工活动；⑤应对行为问题：暴躁或焦虑时转移注意力，不要强行纠正其错误认知。建议选择有失智老人照护经验的护工，家属也应学习相关照护知识。',
  },
  {
    question: '冠心病老人居家护理和急救措施？',
    answer:
      '①按时服药：硝酸酯类、抗血小板药、他汀类等，不可随意停药；②控制危险因素：监测血压血脂、控制体重、戒烟限酒；③适度运动：散步、太极等低强度有氧运动，避免剧烈运动和情绪激动；④识别心绞痛：胸痛、胸闷、气短、左肩背放射痛——立即舌下含服硝酸甘油（遵医嘱），休息5分钟不缓解再含一片，最多3次，仍不缓解立即拨打120；⑤常备急救药物：硝酸甘油、速效救心丸等，注意有效期定期更换。护工应了解老人的病史和急救用药位置。',
  },
  {
    question: '骨质疏松老人如何预防跌倒和骨折？',
    answer:
      '①家居安全改造：地面防滑、卫生间安装扶手、走廊保持通畅无杂物、夜间留小夜灯；②补充钙和维生素D：遵医嘱服用钙片和维生素D制剂，多晒太阳；③适度负重运动：散步、慢走、太极，增强骨密度和平衡能力；④正确使用辅助器具：拐杖、助行器、轮椅，确保高度合适；⑤避免危险动作：弯腰搬重物、猛然扭头转身、登高取物。选择有跌倒预防意识的护工，能大幅降低居家养老的安全风险。',
  },
];

export default function GuideDiseaseCarePage() {
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
              { '@type': 'ListItem', position: 3, name: '疾病护理指南' },
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
            headline: '老人常见疾病居家护理指南',
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
          { label: '疾病护理指南' },
        ]} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-4">
          老人常见疾病居家护理指南
        </h1>
        <p className="text-zinc-500 mb-2">
          更新于 2026年5月 · 覆盖6种老年常见疾病 · 参考国家卫健委《老年护理实践指南》及中国老年医学学会相关共识
        </p>
        <p className="text-zinc-500 mb-8">
          涵盖高血压、糖尿病、脑卒中、阿尔茨海默、冠心病、骨质疏松的居家护理要点
        </p>

        {/* 高血压 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            一、高血压 — 老年最常见的慢性病
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            我国60岁以上老年人高血压患病率超过50%。居家护理的核心是长期血压监测和规律用药。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">居家护理重点</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>每日早晚各测一次血压，记录在笔记本或手机App中</li>
              <li>血压计选择：上臂式电子血压计，每年校准一次</li>
              <li>服药依从性：使用药盒分装，设定闹钟提醒</li>
              <li>饮食：每日食盐&lt;6g（约一个啤酒瓶盖），多吃芹菜、香菇、海带等降压食物</li>
              <li>定期复查：每3个月检查血压、血脂、肾功能</li>
            </ul>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>警惕信号：</strong>如出现剧烈头痛、恶心呕吐、视物模糊、肢体麻木，血压≥180/110mmHg，应立即就医。
            </p>
          </div>
        </section>

        {/* 糖尿病 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            二、糖尿病 — 需要精细化管理的代谢病
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            老年糖尿病患病率约20%-25%，居家管理的核心是血糖监测、饮食控制和并发症预防。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">居家护理重点</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>血糖监测频率：口服药者每周至少测2天（空腹+餐后）；胰岛素使用者每天测</li>
              <li>饮食原则：定时定量，每餐主食不超过75g（约一小碗米饭）</li>
              <li>足部护理：每日温水洗脚（水温不超过37℃），仔细擦干趾缝，涂抹润肤霜</li>
              <li>低血糖应急：随身携带糖果或含糖饮料，血糖&lt;3.9mmol/L时立即补充15g糖</li>
              <li>糖化血红蛋白每3个月测一次，目标&lt;7.0%（个体化调整）</li>
            </ul>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>警惕信号：</strong>极度口渴、多尿、体重骤降可能是血糖失控的信号；伤口愈合缓慢、足部麻木或变色需立即就医。
            </p>
          </div>
        </section>

        {/* 脑卒中 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            三、脑卒中 — 康复训练决定恢复质量
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            脑卒中后3-6个月是黄金康复期。居家护理涵盖康复训练、并发症预防、情绪支持和生活方式调整。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">居家康复分期</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li><strong>卧床期（1-4周）：</strong>良肢位摆放、被动关节活动、翻身训练</li>
              <li><strong>坐位期（1-2月）：</strong>床上坐起、床边坐立、平衡训练</li>
              <li><strong>站立期（2-3月）：</strong>辅助站立、重心转移、原地踏步</li>
              <li><strong>行走期（3-6月）：</strong>平行杠内行走→助行器行走→独立行走</li>
            </ul>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>警惕信号：</strong>再次出现面部歪斜、一侧肢体无力、言语不清——可能是卒中复发的FAST信号，立即拨打120。
            </p>
          </div>
        </section>

        {/* 阿尔茨海默 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            四、阿尔茨海默病 — 需要耐心与专业技巧的长期照护
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            中国约有1000万阿尔茨海默病患者。居家照护的核心是安全防护、认知刺激和行为管理。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">照护策略</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li><strong>环境安全：</strong>安装防走失门锁（密码锁或高位锁），收纳刀具、药品、清洁剂</li>
              <li><strong>认知刺激：</strong>每天安排1-2项活动（拼图、折纸、听音乐、翻老照片）</li>
              <li><strong>定向能力：</strong>在家中放置大字号日历、时钟，经常告知老人"现在是几月几日星期几"</li>
              <li><strong>日落综合征应对：</strong>下午4-6点易出现焦虑、烦躁，可提前开灯、播放舒缓音乐</li>
              <li><strong>饮食管理：</strong>切小块、防噎食、补充维生素B族和Omega-3脂肪酸</li>
            </ul>
          </div>
        </section>

        {/* 冠心病 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            五、冠心病 — 重在长期控制和急救准备
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            冠心病是老年人最常见的心血管疾病。居家管理重点是控制危险因素、识别心绞痛、准备急救方案。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">日常管理与急救</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>按时服用抗血小板药（阿司匹林等）、他汀类降脂药、硝酸酯类药物</li>
              <li>适度有氧运动（散步20-30分钟/天），避免晨起立即活动（血压高峰期）</li>
              <li>低脂低盐饮食，戒烟限酒，控制体重</li>
              <li>急救准备：硝酸甘油随身携带；教护工和家属识别心绞痛症状</li>
              <li>每6个月复查心电图、血脂、心脏超声</li>
            </ul>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4">
            <p className="text-sm text-red-800">
              <strong>急救口诀：</strong>胸痛胸闷，立即含服硝酸甘油；5分钟不缓解，再含一片；含3次不缓解，立即拨打120。切勿步行或自驾就医，保持静卧等待急救车。
            </p>
          </div>
        </section>

        {/* 骨质疏松 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            六、骨质疏松 — "沉默杀手"的居家预防
          </h2>
          <p className="text-zinc-600 mb-3 leading-relaxed">
            65岁以上老年人骨质疏松患病率约32%，女性更高。跌倒导致的髋部骨折是老年人失能甚至死亡的重要原因。
          </p>
          <div className="bg-zinc-50 rounded-lg p-5 mb-4">
            <h3 className="font-medium text-zinc-900 mb-2">防跌倒家居检查清单</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600">
              <li>地面：移除所有松动的地垫，地面保持干燥防滑</li>
              <li>走廊：宽度≥80cm，无杂物堆放，夜间有小夜灯</li>
              <li>卫生间：马桶旁和淋浴区安装L型扶手，放置防滑垫</li>
              <li>卧室：床高适中（坐时双脚着地），床头有台灯开关</li>
              <li>鞋子：穿防滑、合脚、有后帮的鞋，不穿一次性拖鞋</li>
              <li>辅助器具：拐杖高度=手腕横纹到地面的垂直距离</li>
            </ul>
          </div>
        </section>

        {/* 如何选择专业护工 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            如何为患病老人选择专业护工
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { condition: '高血压/糖尿病', cert: '有慢病管理经验，能协助监测血压血糖、督促服药' },
              { condition: '脑卒中后康复', cert: '具备康复护理经验或接受过康复培训，了解偏瘫护理知识' },
              { condition: '阿尔茨海默病', cert: '有失智老人照护经验，性格耐心温和，善于沟通安抚' },
              { condition: '冠心病', cert: '了解心血管急救知识，能识别心绞痛并正确使用硝酸甘油' },
              { condition: '骨质疏松', cert: '有防跌倒意识，了解辅助器具使用，细心谨慎' },
              { condition: '多重慢性病', cert: '优先选择有医院或护理院工作经验的护工，综合管理能力强' },
            ].map(item => (
              <div key={item.condition} className="bg-white border border-zinc-200 rounded-lg p-4">
                <h3 className="font-medium text-zinc-900 mb-1">{item.condition}</h3>
                <p className="text-sm text-zinc-600">{item.cert}</p>
              </div>
            ))}
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
            找到有疾病护理经验的护工
          </h2>
          <p className="text-zinc-600 mb-4">
            浏览各城市护工列表，查看资质证书和真实评价，找到匹配老人病情需求的专业护工
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
