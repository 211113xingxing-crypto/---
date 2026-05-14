import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { FaqSchema } from '@/components/schema/faq-schema';
import { CollectionPageSchema } from '@/components/schema/collection-page';
import { buildCityFaq } from '@/lib/schema-helpers';
import { EmptyState } from '@/components/empty-state';
import { getCityBySlug, getCityIdBySlug, getDistricts, getServiceTypes, getAllProviders, getProvinceBySlug, getProvinceCityStats } from '@/lib/data';
import { ProviderCard } from '@/components/provider-card';
import { SortControls } from '@/components/sort-controls';
import { BASE_URL } from '@/lib/env';

interface PageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;

  const province = getProvinceBySlug(city);
  if (province) {
    return {
      title: `${province.name}养老服务机构 - 各城市养老院、护工、康复资源汇总`,
      description: `${province.name}养老服务机构汇总。查找${province.name}各城市养老院、居家护理、陪诊服务、日间照料、术后康复等养老服务资源。`,
      alternates: { canonical: `${BASE_URL}/${city}` },
      openGraph: {
        title: `${province.name}养老服务机构`,
        description: `${province.name}养老服务机构汇总。查找${province.name}各城市养老院、居家护理、陪诊服务、日间照料、术后康复等养老服务资源。`,
        images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      },
    };
  }

  const cityData = await getCityBySlug(city);
  if (!cityData) return { title: '城市未找到' };

  return {
    title: `${cityData.name}养老护工服务 - 各区居家护理、陪诊、日间照料资源汇总`,
    description: `${cityData.name}养老护工服务汇总。查找${cityData.name}各区居家护理、陪诊服务、日间照料、术后康复等养老服务资源，所有护工均经过资质核验，附带真实用户评价。`,
    alternates: { canonical: `${BASE_URL}/${city}` },
    openGraph: {
      title: `${cityData.name}养老护工服务`,
      description: `${cityData.name}各区居家护理、陪诊、日间照料资源汇总。所有护工均经过资质核验，附真实评价。`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const { city } = await params;
  const { sort } = await searchParams;

  // Province landing page
  const province = getProvinceBySlug(city);
  if (province) {
    const cityStats = await getProvinceCityStats(province);
    const totalProviders = cityStats.reduce((sum, c) => sum + c.providerCount, 0);

    const breadcrumbItems = [
      { label: '首页', href: BASE_URL },
      { label: province.name, href: `${BASE_URL}/${city}` },
    ];

    return (
      <>
        <BreadcrumbSchema items={breadcrumbItems} />
        <Header citySlug={city} cityName={province.name} />

        <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
          <Breadcrumbs items={breadcrumbItems} />

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            {province.name}养老服务机构
          </h1>
          <p className="text-zinc-600 mb-8 max-w-3xl">
            {province.name}辖内共有 {cityStats.length} 个城市收录了养老服务资源。
            当前共 {totalProviders} 家养老院、护理院及居家护理机构。
            点击下方城市查看各区养老院、护工、陪诊、日间照料及术后康复服务。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityStats.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="font-semibold text-lg text-zinc-900">{c.name}</div>
                <div className="text-sm text-zinc-500 mt-1">
                  {c.providerCount > 0
                    ? `${c.providerCount} 家养老服务机构`
                    : '数据收集中'}
                </div>
              </Link>
            ))}
          </div>
        </main>

        <Footer citySlug={city} cityName={province.name} />
      </>
    );
  }

  // City page (existing)
  const cityId = await getCityIdBySlug(city);
  if (!cityId) notFound();

  const cityData = (await getCityBySlug(city))!;
  const [districts, serviceTypes, providers] = await Promise.all([
    getDistricts(cityId),
    getServiceTypes(),
    getAllProviders(cityId, sort),
  ]);

  const breadcrumbItems = [
    { label: '首页', href: BASE_URL },
    { label: cityData.name, href: `${BASE_URL}/${city}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <FaqSchema qaList={buildCityFaq(cityData.name, providers.length, districts.length)} />
      <CollectionPageSchema
        name={`${cityData.name}养老护工服务`}
        description={`${cityData.name}各区持证养老护工、护理机构列表。覆盖居家护理、陪诊、日间照料、术后康复等${serviceTypes.length}种服务类型。`}
        url={`${BASE_URL}/${city}`}
        items={providers.slice(0, 50).map(p => ({
          name: p.name,
          url: `${BASE_URL}/provider/${p.slug}`,
          description: p.bio?.slice(0, 160) ?? `${p.providerType === 'individual' ? '个人护工' : '护理机构'}，评分${p.avgRating.toFixed(1)}`,
        }))}
      />
      <Header citySlug={city} cityName={cityData.name} />

      <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          {cityData.name}养老护工服务
        </h1>
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-5 mb-6">
          <p className="text-zinc-800 leading-relaxed">
            <strong>{cityData.name}养老护工服务平台</strong> — 当前收录
            <em className="text-emerald-700 font-semibold"> {providers.length} </em>位
            经过<mark className="bg-emerald-100 px-1 rounded">身份证+资格证+健康证</mark>三重资质核验的持证护工，
            覆盖<em className="text-emerald-700 font-semibold"> {districts.length} </em>个区域、
            <em className="text-emerald-700 font-semibold"> {serviceTypes.length} </em>种服务类型。
            所有护工均附真实用户评价，帮您在{cityData.name}快速找到靠谱的养老服务。
          </p>
        </div>

        {districts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">按区域查找</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {districts.map((d) => (
                <Link
                  key={d.slug}
                  href={`/${city}/${d.slug}`}
                  className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="font-semibold text-zinc-900">{d.name}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">按服务类型查找</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceTypes.map((s) => (
              <Link
                key={s.slug}
                href={`/${city}/${s.slug}`}
                className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="font-semibold text-zinc-900">{s.name}</div>
                <div className="text-sm text-zinc-500 mt-1">{s.description}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zinc-900">
              {cityData.name}全部服务者
            </h2>
            <SortControls />
          </div>
          {providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`${cityData.name}暂无收录服务者`}
              message="数据正在扩展中，请先浏览其他城市或服务类型。"
              suggestions={[
                { label: '浏览全部城市', href: '/' },
                { label: '浏览服务类型', href: `/${city}/hugong` },
              ]}
            />
          )}
        </section>

        <section className="mt-16 border-t pt-12">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">
            关于{cityData.name}养老护工的常见问题
          </h2>
          <div className="space-y-5">
            {buildCityFaq(cityData.name, providers.length, districts.length).map((faq, i) => (
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
