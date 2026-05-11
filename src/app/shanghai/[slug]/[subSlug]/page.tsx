import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { ProviderCard } from '@/components/provider-card';
import { mockServiceTypes, mockProviders } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ slug: string; subSlug: string }>;
}

const districtNames: Record<string, string> = {
  'changning-qu': '长宁区',
  'jingan-qu': '静安区',
  'xuhui-qu': '徐汇区',
  'pudong-xinqu': '浦东新区',
  'hongkou-qu': '虹口区',
  'yangpu-qu': '杨浦区',
  'huangpu-qu': '黄浦区',
  'putuo-qu': '普陀区',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const districtName = districtNames[slug];
  const serviceType = mockServiceTypes.find((s) => s.slug === subSlug);
  if (!districtName || !serviceType) return { title: '页面未找到' };

  return {
    title: `${districtName}${serviceType.name}服务 - 本地${serviceType.name}`,
    description: `${districtName}${serviceType.name}服务。查找${districtName}附近的${serviceType.name}护工和服务机构，附真实评价和资质信息。`,
    alternates: { canonical: `https://elder.navi-resources.com/shanghai/${slug}/${subSlug}` },
  };
}

export default async function DistrictServicePage({ params }: PageProps) {
  const { slug, subSlug } = await params;
  const districtName = districtNames[slug];
  const serviceType = mockServiceTypes.find((s) => s.slug === subSlug);
  if (!districtName || !serviceType) notFound();

  const providers = mockProviders.filter(
    (p) =>
      p.district?.slug === slug &&
      p.serviceTypes.some((st) => st.serviceType.slug === subSlug)
  );

  const breadcrumbItems = [
    { name: '首页', url: 'https://elder.navi-resources.com' },
    { name: '上海', url: 'https://elder.navi-resources.com/shanghai' },
    { name: districtName, url: `https://elder.navi-resources.com/shanghai/${slug}` },
    { name: serviceType.name, url: `https://elder.navi-resources.com/shanghai/${slug}/${subSlug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/shanghai" className="hover:text-emerald-700">上海</Link>
          <span className="mx-2">/</span>
          <Link href={`/shanghai/${slug}`} className="hover:text-emerald-700">{districtName}</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900">{serviceType.name}</span>
        </nav>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          {districtName}{serviceType.name}服务
        </h1>
        <p className="text-zinc-600 mb-8 max-w-3xl">
          查找{districtName}附近的{serviceType.name}护工和服务机构。所有服务者均经过资质核验，附带真实用户评价。
        </p>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500 mb-4">
              {districtName}暂无收录的{serviceType.name}服务者
            </p>
            <Link href={`/shanghai/${subSlug}`} className="text-emerald-700 hover:underline text-sm">
              查看全上海{serviceType.name}服务者 &rarr;
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
