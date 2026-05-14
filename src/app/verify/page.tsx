import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { FaqSchema } from '@/components/schema/faq-schema';
import { WebSiteSchema } from '@/components/schema/web-site';
import { BASE_URL } from '@/lib/env';
import { ShieldCheck, FileCheck, UserCheck, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: '资质审核体系 — 亲护',
  description:
    '了解亲护的护工资质审核流程：身份证核验、养老护理员资格证、健康证、背景调查四重审核，确保每一位护工都经过严格认证。',
  alternates: { canonical: `${BASE_URL}/verify` },
};

const faqList = [
  {
    question: '平台上护工的资质审核流程是怎样的？',
    answer:
      '平台对每一位注册护工执行四重资质审核：①身份证实名核验；②养老护理员职业资格证书验证；③健康证有效性核验；④背景调查。所有证书需要提交原件照片，经平台人工比对审核。通过审核的护工获得"已认证"标识。',
  },
  {
    question: '护工的资格证书由哪些机构颁发？',
    answer:
      '养老护理员职业资格证书由人力资源和社会保障局（人社局）颁发。护士执业证书由国家卫生健康委员会（卫健委）颁发。所有证书均可通过官方渠道验证真伪。',
  },
  {
    question: '用户评价是否真实可信？',
    answer:
      '平台评价系统中带有"真实服务"标记的评价，代表该评价来自与护工有实际服务关系的用户。平台持续监测评价真实性，防范虚假评价。用户评价一经发布不可由护工自行修改或删除。',
  },
  {
    question: '如果对护工不满意怎么办？',
    answer:
      '平台鼓励用户通过评价系统如实反馈服务体验。如果遇到严重的服务质量问题，可通过平台联系客服处理。建议在签约时明确试用期条款和更换机制。',
  },
  {
    question: '平台如何确保护工信息的准确性？',
    answer:
      '护工的个人信息（姓名、资质、经验年限等）均需在注册时提交相应证明文件。平台定期进行信息复核，并要求护工在资质证书到期前更新。用户发现信息不符可通过评价或客服渠道反馈。',
  },
];

export default function VerifyPage() {
  const breadcrumbItems = [
    { label: '首页', href: BASE_URL },
    { label: '资质审核体系' },
  ];

  return (
    <>
      <FaqSchema qaList={faqList} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '资质审核体系 — 亲护',
            description:
              '了解亲护的护工资质审核流程：身份证核验、养老护理员资格证、健康证、背景调查四重审核。',
            url: `${BASE_URL}/verify`,
            isPartOf: {
              '@type': 'WebSite',
              name: '亲护',
              url: BASE_URL,
            },
          }),
        }}
      />

      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8" id="main-content">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">资质审核体系</h1>
        <p className="text-zinc-600 mb-8 max-w-2xl">
          每一位护工在平台展示前都需通过四重审核，确保信息真实、资质有效。
        </p>

        {/* Four audit steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: ShieldCheck,
              title: '第一重：身份证核验',
              desc: '通过公安系统接口验证身份证信息真实性，确保护工身份真实。平台留存身份证照片备查。',
            },
            {
              icon: FileCheck,
              title: '第二重：资格证核验',
              desc: '核验养老护理员职业资格证书（人社部颁发），确认证书等级和有效期。持护士执业证书者可提供更高等级的医疗护理服务。',
            },
            {
              icon: UserCheck,
              title: '第三重：健康证核验',
              desc: '要求护工提供有效期内的健康证明，确保无传染病、能胜任护理工作。健康证需定期更新。',
            },
            {
              icon: Star,
              title: '第四重：背景调查',
              desc: '通过第三方机构进行背景核查，确认无犯罪记录和重大不良从业记录。此项为平台推荐等级。',
            },
          ].map((step, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-lg p-6 flex gap-4">
              <step.icon className="w-10 h-10 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust commitment */}
        <section className="bg-emerald-50 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">平台承诺</h2>
          <ul className="space-y-3 text-sm text-zinc-700">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              所有展示的护工均已完成至少身份证+资格证+健康证三重核验。
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              评价真实有效，平台不干预评价内容，护工不可自行删除评价。
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              资质信息定期复核，证书到期前提醒更新，过期证书自动标记。
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              用户隐私受保护，联系方式仅在双方确认后通过平台交换。
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-6">关于资质审核的常见问题</h2>
          <div className="space-y-5">
            {faqList.map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Q: {faq.question}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
