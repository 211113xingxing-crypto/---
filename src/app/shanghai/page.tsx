import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { getDistricts, getServiceTypes, getAllProviders } from '@/lib/data';
import { ProviderCard } from '@/components/provider-card';

export const metadata: Metadata = {
  title: '上海养老护工服务 - 各区居家护理、陪诊、日间照料资源汇总',
  description:
    '上海养老护工服务汇总。覆盖长宁区、静安区、徐汇区、浦东新区、虹口区、杨浦区、黄浦区、普陀区等各区居家护理、陪诊服务、日间照料、术后康复养老服务资源。',
  alternates: { canonical: 'https://www.eldercare.local/shanghai' },
};

const breadcrumbItems = [
  { name: '首页', url: 'https://www.eldercare.local' },
  { name: '上海', url: 'https://www.eldercare.local/shanghai' },
];

export default async function ShanghaiPage() {
  const [districts, serviceTypes, providers] = await Promise.all([
    getDistricts(),
    getServiceTypes(),
    getAllProviders(),
  ]);
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">首页</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900">上海</span>
        </nav>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          上海养老护工服务
        </h1>
        <p className="text-zinc-600 mb-8 max-w-3xl">
          覆盖上海16个区的居家养老护理资源。无论您在长宁、静安、徐汇还是浦东，都能找到经过资质核验、有真实评价的养老服务。从居家护理到陪诊就医，从日间照料到术后康复，帮您一站式找到合适的养老服务。
        </p>

        {/* Districts Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">按区域查找</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {districts.map((d) => (
              <Link
                key={d.slug}
                href={`/shanghai/${d.slug}`}
                className="bg-white border border-zinc-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <div className="font-semibold text-zinc-900">{d.name}</div>
                {d.count ? <div className="text-sm text-zinc-500 mt-1">{d.count}位护工</div> : null}
              </Link>
            ))}
          </div>
        </section>

        {/* Service Types */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">按服务类型查找</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceTypes.map((s) => (
              <Link
                key={s.slug}
                href={`/shanghai/${s.slug}`}
                className="bg-white border border-zinc-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <div className="font-semibold text-zinc-900">{s.name}</div>
                <div className="text-sm text-zinc-500 mt-1">{s.description}</div>
                {s.count ? <div className="text-xs text-emerald-700 mt-2">{s.count}位服务者</div> : null}
              </Link>
            ))}
          </div>
        </section>

        {/* All providers */}
        <section>
          <h2 className="text-xl font-bold text-zinc-900 mb-4">
            上海全部服务者
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
