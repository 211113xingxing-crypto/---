import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BASE_URL } from '@/lib/env';
import { FaqSchema } from '@/components/schema/faq-schema';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: '帮助中心 — 亲护',
  description:
    '亲护帮助中心：包含找护工流程、价格说明、资质认证、评价系统、联系服务者、政策福利等常见问题解答。',
  alternates: { canonical: `${BASE_URL}/help` },
  openGraph: {
    title: '帮助中心 — 亲护',
    description: '找护工流程、价格说明、资质认证、评价系统、联系服务者、政策福利等常见问题解答。',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  qaList: Array<{ question: string; answer: string }>;
}

const helpSections: HelpSection[] = [
  {
    id: 'find-provider',
    title: '如何找护工',
    icon: '🔍',
    qaList: [
      {
        question: '如何在平台上找到合适的护工？',
        answer: '在首页选择你所在的城市，然后可以按区域或服务类型筛选。每位护工的页面展示了详细的服务项目、价格、资质证书和真实用户评价。你可以对比多位护工后再做选择。也可以使用搜索功能，输入关键词（如"住家护工"、"康复护理"等）快速查找。',
      },
      {
        question: '平台上护工的资质可信吗？',
        answer: '平台对所有服务者进行资质审核，包括身份证验证、资格证书核验和健康证检查。通过审核的服务者页面会显示"已认证"标识。我们建议优先选择认证服务者。每个服务者页面列出了具体的认证类型，可以点击查看详情。',
      },
      {
        question: '平台上同时有个人护工和机构，怎么选？',
        answer: '个人护工价格相对灵活，沟通直接，适合需求明确、愿意自行管理的家庭。护理机构提供团队化服务，有备选人员、服务监督和合同保障，适合需要多重服务或对稳定性要求高的家庭。建议对比两者的价格、服务内容和评价后决定。',
      },
    ],
  },
  {
    id: 'pricing',
    title: '价格与收费',
    icon: '💰',
    qaList: [
      {
        question: '平台上标的价格是最终价格吗？',
        answer: '平台展示的是服务者提供的参考价格，实际费用可能因服务时长、内容复杂度、老人身体状况等因素有所调整。建议在联系服务者时确认最终报价，并在正式服务前签订书面协议，明确费用构成。平台不向用户收取任何中介费。',
      },
      {
        question: '护工费用可以用医保报销吗？',
        answer: '目前大部分地区的医保不直接报销居家护工费用。但在长期护理保险（长护险）试点城市（如上海、广州、成都等49个城市），经评估为失能的参保人员可享受护工服务费用报销，每月额度约1500-3000元。建议咨询当地医保局确认。',
      },
      {
        question: '不满意可以退款或更换吗？',
        answer: '通过平台直接联系的服务者，具体退换条款需与服务者协商并在合同中约定。通过护理机构签约的，机构通常会提供1-3个月的试用期，试用期内不满意可免费更换。建议在签订合同时明确试用期和更换条款。',
      },
    ],
  },
  {
    id: 'reviews',
    title: '评价与信任',
    icon: '⭐',
    qaList: [
      {
        question: '平台上的评价可信吗？',
        answer: '平台评价来自真实服务后的用户反馈。只有通过平台验证、确实与服务者有服务关系的用户才能提交评价。平台会对评价内容进行审核，过滤虚假和恶意评价。每一条评价标注了评价时间和使用的服务类型。',
      },
      {
        question: '评分是怎么计算的？',
        answer: '服务者的综合评分是所有评价分数的平均值，满分5.0分。评分基于多个维度：服务态度、专业技能、沟通能力和整体满意度。如果一位服务者只有少量评价，评分可能不够稳定，建议同时查看评价的具体内容。',
      },
      {
        question: '可以匿名提交评价吗？',
        answer: '提交评价需要登录账户以验证真实性，但评价展示时用户昵称可以部分隐藏（如"张**"），保护评价者隐私。评价内容对所有访问者可见，帮助更多人做出选择。',
      },
    ],
  },
  {
    id: 'contact',
    title: '联系与安全',
    icon: '🛡️',
    qaList: [
      {
        question: '如何联系护工？',
        answer: '在服务者页面点击"联系服务者"按钮，填写联系请求即可。系统会通知服务者，他们会通过平台私信或你预留的联系方式与你取得联系。为保护双方隐私，平台不直接公开展示服务者的电话号码。',
      },
      {
        question: '联系服务者需要提供什么信息？',
        answer: '联系请求需要提供：你的姓名、联系电话、老人的大致需求（服务类型、能否自理、是否有特殊疾病等）。这些信息只发送给该服务者，不会被公开。建议不要在一次联系中向过多服务者发送请求，以免重复沟通。',
      },
      {
        question: '平台如何保护我的个人信息？',
        answer: '你的个人信息（姓名、电话、地址等）在联系请求中仅发送给你指定的服务者。平台不会将你的信息出售或分享给第三方。联系信息在传输和存储过程中均经过加密处理。你可以随时在个人设置中修改或删除个人数据。',
      },
    ],
  },
  {
    id: 'policy',
    title: '政策与福利',
    icon: '📋',
    qaList: [
      {
        question: '请护工可以享受哪些政策补贴？',
        answer: '目前可能享受的政策包括：①长期护理保险（长护险）— 49个试点城市，失能评定后每月报销1500-3000元护理费；②居家养老服务补贴 — 经济困难或失能老人可申请200-1000元/月；③高龄津贴 — 各地标准不同，80岁以上老人一般每月50-500元。建议拨打12349咨询当地政策。',
      },
      {
        question: '如何为老人申请失能评定？',
        answer: '一般流程：①向所在社区或街道提出申请；②由指定的第三方评估机构上门评定（使用巴氏量表等工具评估日常生活能力）；③评定结果公示；④发放失能等级证明。评定免费或由医保支付。长期护理保险参保人员优先评定。评定结果一般有效期为1-2年，需定期复核。',
      },
    ],
  },
  {
    id: 'account',
    title: '账户与收藏',
    icon: '👤',
    qaList: [
      {
        question: '收藏功能怎么用？',
        answer: '浏览服务者时，点击心形图标即可收藏。收藏后的服务者会出现在"我的收藏"页面，方便你随时对比和回顾。取消收藏只需再次点击心形图标。你可以在页面顶部导航栏点击心形图标进入收藏列表。',
      },
      {
        question: '需要注册账户吗？',
        answer: '浏览服务者信息不需要注册。但使用收藏功能、提交评价、联系服务者等操作需要登录账户。登录后你可以管理个人信息、查看联系历史、管理收藏列表。',
      },
    ],
  },
];

const allFaqs = helpSections.flatMap(s => s.qaList);

export default function HelpPage() {
  return (
    <>
      <FaqSchema qaList={allFaqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '首页', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: '帮助中心' },
            ],
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: '首页', href: '/' },
          { label: '帮助中心' },
        ]} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">帮助中心</h1>
        <p className="text-zinc-500 mb-8">
          关于找护工、价格、评价、联系、政策等方面的问题，都在这里
        </p>

        {/* Quick nav */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-10">
          {helpSections.map(section => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-center p-3 bg-white border border-zinc-200 rounded-lg hover:border-emerald-300 transition-all text-sm"
            >
              <div className="text-xl mb-1" aria-hidden="true">{section.icon}</div>
              <div className="text-zinc-600">{section.title}</div>
            </a>
          ))}
        </div>

        {/* FAQ sections */}
        <div className="space-y-8">
          {helpSections.map(section => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white border border-zinc-200 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-zinc-900 mb-4">
                {section.icon} {section.title}
              </h2>
              <div className="space-y-4">
                {section.qaList.map((faq, i) => (
                  <details key={i} className="group">
                    <summary className="cursor-pointer text-zinc-800 font-medium hover:text-emerald-700 transition-colors py-2 list-none">
                      <span className="mr-2 text-emerald-500 group-open:hidden">+</span>
                      <span className="mr-2 text-emerald-500 hidden group-open:inline">−</span>
                      {faq.question}
                    </summary>
                    <p className="text-zinc-600 text-sm leading-relaxed mt-2 ml-6 pl-3 border-l-2 border-emerald-200">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-emerald-50 rounded-xl p-6 text-center mt-10">
          <h2 className="text-lg font-bold text-zinc-900 mb-2">
            还有其他问题？
          </h2>
          <p className="text-zinc-600 mb-4">
            浏览各城市护工和机构，查看详细指南文章，或直接联系服务者咨询
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/"
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              浏览城市 →
            </Link>
            <Link
              href="/guide/zhaohugong"
              className="inline-block bg-white border border-zinc-200 text-zinc-700 px-6 py-2 rounded-lg hover:border-emerald-300 transition-colors"
            >
              找护工指南
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
