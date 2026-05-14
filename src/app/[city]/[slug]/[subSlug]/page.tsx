import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { FaqSchema } from '@/components/schema/faq-schema';
import { buildSubSlugFaq } from '@/lib/schema-helpers';
import { EmptyState } from '@/components/empty-state';
import { ProviderCard } from '@/components/provider-card';
import { BASE_URL } from '@/lib/env';
import {
  getCityBySlug,
  getCityIdBySlug,
  getDistrictBySlug,
  getServiceTypeBySlug,
  searchProviders,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ city: string; slug: string; subSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug, subSlug } = await params;
  const cityId = await getCityIdBySlug(city);
  if (!cityId) return { title: '城市未找到' };

  const district = await getDistrictBySlug(slug, cityId);
  const serviceType = await getServiceTypeBySlug(subSlug);
  if (!district || !serviceType) return { title: '页面未找到' };

  return {
    title: `${district.name}${serviceType.name}服务 - ${district.name}本地${serviceType.name}`,
    description: `${district.name}${serviceType.name}服务。查找${district.name}附近的${serviceType.name}护工和服务机构，附真实评价和资质信息。`,
    alternates: { canonical: `${BASE_URL}/${city}/${slug}/${subSlug}` },
    openGraph: {
      title: `${district.name}${serviceType.name}服务`,
      description: `${district.name}${serviceType.name}服务。查找${district.name}附近的${serviceType.name}护工和服务机构，附真实评价和资质信息。`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function CityDistrictServicePage({ params }: PageProps) {
  const { city, slug, subSlug } = await params;
  const cityId = await getCityIdBySlug(city);
  if (!cityId) notFound();

  const cityData = (await getCityBySlug(city))!;
  const district = await getDistrictBySlug(slug, cityId);
  const serviceType = await getServiceTypeBySlug(subSlug);
  if (!district || !serviceType) notFound();

  const { providers } = await searchProviders({
    districtSlug: slug,
    serviceTypeSlug: subSlug,
    cityId,
  });

  const breadcrumbItems = [
    { label: '首页', href: BASE_URL },
    { label: cityData.name, href: `${BASE_URL}/${city}` },
    { label: district.name, href: `${BASE_URL}/${city}/${slug}` },
    { label: serviceType.name, href: `${BASE_URL}/${city}/${slug}/${subSlug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <FaqSchema qaList={buildSubSlugFaq(district.name, serviceType.name)} />
      <Header citySlug={city} cityName={cityData.name} />

      <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          {district.name}{serviceType.name}服务
        </h1>
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-5 mb-6">
          <p className="text-zinc-800 leading-relaxed">
            <strong>{district.name}{serviceType.name}服务</strong> — 当前收录
            <em className="text-emerald-700 font-semibold"> {providers.length} </em>位
            在{district.name}附近提供{serviceType.name}的
            <mark className="bg-emerald-100 px-1 rounded">持证护工和服务机构</mark>。
            所有服务者均经过身份证+资格证+健康证三重核验，附真实用户评价。
          </p>
        </div>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`${district.name}暂无收录的${serviceType.name}服务者`}
            message={`可以查看${cityData.name}其他区域的${serviceType.name}或浏览全部服务类型。`}
            suggestions={[
              { label: `${cityData.name}全部${serviceType.name}`, href: `/${city}/${subSlug}` },
              { label: `返回${district.name}`, href: `/${city}/${slug}` },
            ]}
          />
        )}

        <section className="mt-16 border-t pt-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">
            关于{district.name}{serviceType.name}的常见问题
          </h2>
          <div className="space-y-5">
            {buildSubSlugFaq(district.name, serviceType.name).map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Q: {faq.question}
                </h3>
                <p className="text-sm text-zinc-600">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer citySlug={city} cityName={cityData.name} />
    </>
  );
}
