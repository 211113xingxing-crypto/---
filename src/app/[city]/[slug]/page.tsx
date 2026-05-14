import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { FaqSchema } from '@/components/schema/faq-schema';
import { CollectionPageSchema } from '@/components/schema/collection-page';
import { buildDistrictFaq, buildServiceTypeFaq } from '@/lib/schema-helpers';
import { EmptyState } from '@/components/empty-state';
import { ProviderCard } from '@/components/provider-card';
import { SortControls } from '@/components/sort-controls';
import { BASE_URL } from '@/lib/env';
import {
  getCityBySlug,
  getCityIdBySlug,
  getDistrictBySlug,
  getServiceTypeBySlug,
  getProvidersByDistrict,
  getProvidersByServiceType,
  getServiceTypes,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const cityId = await getCityIdBySlug(city);
  if (!cityId) return { title: '城市未找到' };

  const district = await getDistrictBySlug(slug, cityId);
  if (district) {
    return {
      title: `${district.name}养老护工服务 - ${district.name}居家护理、陪诊、日间照料`,
      description: `${district.name}居家养老护工服务。查找${district.name}附近的居家护理、陪诊服务、日间照料、术后康复等养老护理资源。`,
      alternates: { canonical: `${BASE_URL}/${city}/${slug}` },
      openGraph: {
        title: `${district.name}养老护工服务`,
        description: `${district.name}居家养老护工服务。查找${district.name}附近的居家护理、陪诊服务、日间照料、术后康复等养老护理资源。`,
        images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      },
    };
  }

  const serviceType = await getServiceTypeBySlug(slug);
  if (serviceType) {
    const cityData = await getCityBySlug(city);
    const cityName = cityData?.name ?? city;
    return {
      title: `${cityName}${serviceType.name}服务 - ${serviceType.name}服务汇总`,
      description: `${cityName}${serviceType.name}服务。${serviceType.description ?? ''}。查找${cityName}各区持证护工和护理机构。`,
      alternates: { canonical: `${BASE_URL}/${city}/${slug}` },
      openGraph: {
        title: `${cityName}${serviceType.name}服务`,
        description: `${cityName}${serviceType.name}持证护工和护理机构。所有服务者均经过资质核验，附真实评价。`,
        images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      },
    };
  }

  return { title: '页面未找到' };
}

export default async function CitySlugPage({ params, searchParams }: PageProps) {
  const { city, slug } = await params;
  const { sort } = await searchParams;
  const cityId = await getCityIdBySlug(city);
  if (!cityId) notFound();

  const cityData = (await getCityBySlug(city))!;

  const [districtData, serviceTypeData] = await Promise.all([
    getProvidersByDistrict(slug, cityId, sort),
    getProvidersByServiceType(slug, cityId, sort),
  ]);

  if (!districtData && !serviceTypeData) notFound();

  const allServiceTypes = await getServiceTypes();
  const isDistrict = !!districtData;
  const name = isDistrict ? districtData!.district.name : serviceTypeData!.serviceType.name;

  const breadcrumbItems = [
    { label: '首页', href: BASE_URL },
    { label: cityData.name, href: `${BASE_URL}/${city}` },
    { label: name, href: `${BASE_URL}/${city}/${slug}` },
  ];

  if (isDistrict) {
    const { district, providers, subDistricts } = districtData!;

    return (
      <>
        <BreadcrumbSchema items={breadcrumbItems} />
        <FaqSchema qaList={buildDistrictFaq(district.name, providers)} />
        <CollectionPageSchema
          name={`${district.name}养老护工服务`}
          description={`${district.name}及周边持证养老护工列表。所有服务者均经过资质核验，附真实用户评价。`}
          url={`${BASE_URL}/${city}/${slug}`}
          items={providers.slice(0, 30).map(p => ({
            name: p.name,
            url: `${BASE_URL}/provider/${p.slug}`,
            description: `${p.providerType === 'individual' ? '个人护工' : '护理机构'}，评分${p.avgRating.toFixed(1)}`,
          }))}
        />
        <Header citySlug={city} cityName={cityData.name} />

        <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
          <Breadcrumbs items={breadcrumbItems} />

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            {district.name}养老护工服务
          </h1>
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-5 mb-6">
            <p className="text-zinc-800 leading-relaxed">
              <strong>{district.name}养老护工服务</strong> — 当前收录
              <em className="text-emerald-700 font-semibold"> {providers.length} </em>位
              经过<mark className="bg-emerald-100 px-1 rounded">身份证+资格证+健康证</mark>三重核验的持证护工，
              覆盖{allServiceTypes.length}种服务类型。
              {subDistricts.length > 0 && <>含{subDistricts.map(sd => sd.name).join('、')}等{subDistricts.length}个细分区域。</>}
              所有护工均附真实用户评价，帮您在{district.name}找到靠谱养老服务。
            </p>
          </div>

          {subDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {subDistricts.map((sd) => (
                <Link
                  key={sd.slug}
                  href={`/${city}/${sd.slug}`}
                  className="px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-sm hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                >
                  {sd.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {allServiceTypes.map((s) => (
              <Link
                key={s.slug}
                href={`/${city}/${slug}/${s.slug}`}
                className="px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-sm hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                {s.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zinc-900">{district.name}服务者列表</h2>
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
              title="该区域暂无服务者"
              message="数据正在扩展中，请先浏览其他区域或服务类型。"
              suggestions={[
                { label: `返回${cityData.name}首页`, href: `/${city}` },
                ...allServiceTypes.slice(0, 3).map((s) => ({
                  label: `${district.name}${s.name}`,
                  href: `/${city}/${slug}/${s.slug}`,
                })),
              ]}
            />
          )}

          <section className="mt-16 border-t pt-12">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              关于{district.name}养老护工的常见问题
            </h2>
            <div className="space-y-5">
              {buildDistrictFaq(district.name, providers).map((faq, i) => (
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

  // Service type page
  if (!isDistrict && serviceTypeData) {
    const { serviceType, providers } = serviceTypeData;

    return (
      <>
        <BreadcrumbSchema items={breadcrumbItems} />
        <FaqSchema qaList={buildServiceTypeFaq(cityData.name, serviceType.name)} />
        <CollectionPageSchema
          name={`${cityData.name}${serviceType.name}服务`}
          description={`${cityData.name}${serviceType.name}持证护工及服务机构列表。所有服务者均经过资质核验，附真实用户评价。`}
          url={`${BASE_URL}/${city}/${slug}`}
          items={providers.slice(0, 30).map(p => ({
            name: p.name,
            url: `${BASE_URL}/provider/${p.slug}`,
            description: `${p.providerType === 'individual' ? '个人护工' : '护理机构'}，评分${p.avgRating.toFixed(1)}`,
          }))}
        />
        <Header citySlug={city} cityName={cityData.name} />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            {cityData.name}{serviceType.name}服务
          </h1>
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-5 mb-4">
            <p className="text-zinc-800 leading-relaxed">
              <strong>{cityData.name}{serviceType.name}服务</strong> — 当前收录
              <em className="text-emerald-700 font-semibold"> {providers.length} </em>位
              持证{serviceType.name}护工和服务机构。
              {serviceType.description && <>{serviceType.description}。</>}
              所有服务者均经过<mark className="bg-emerald-100 px-1 rounded">身份证+资格证+健康证</mark>三重核验，附真实用户评价。
            </p>
          </div>
          <div className="flex items-center justify-between mb-4">
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
              title={`${cityData.name}暂无${serviceType.name}服务者`}
              message="数据正在扩展中，请先浏览其他服务类型。"
              suggestions={[
                { label: `返回${cityData.name}首页`, href: `/${city}` },
              ]}
            />
          )}

          <section className="mt-16 border-t pt-12">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              关于{cityData.name}{serviceType.name}的常见问题
            </h2>
            <div className="space-y-5">
              {buildServiceTypeFaq(cityData.name, serviceType.name).map((faq, i) => (
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

  notFound();
}
