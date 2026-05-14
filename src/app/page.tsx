import Link from 'next/link';
import { SearchBar } from '@/components/search-bar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WebSiteSchema, OrganizationSchema } from '@/components/schema/web-site';
import { FaqSchema } from '@/components/schema/faq-schema';
import { buildHomepageFaq } from '@/lib/schema-helpers';
import { getAllCities, getDistricts, getServiceTypes, getHotProviders, getCityIdBySlug, getStats } from '@/lib/data';
import { ProviderCard } from '@/components/provider-card';
import { MapPin, Users, ShieldCheck, HeartHandshake, ChevronDown, ChevronUp } from 'lucide-react';
import { HotCitySelector } from '@/components/hot-city-selector';
import { SERVICE_TYPES } from '@/lib/constants';
import { BASE_URL } from '@/lib/env';

export const revalidate = 3600;

export default async function HomePage() {
  const cities = await getAllCities();
  // Use the first city for featured content (will be dynamic once more cities have data)
  const firstCity = cities[0];
  const featuredCityId = firstCity ? await getCityIdBySlug(firstCity.slug) : null;
  const [districts, serviceTypes, hotProviders, stats] = await Promise.all([
    featuredCityId ? getDistricts(featuredCityId) : Promise.resolve([]),
    getServiceTypes(),
    featuredCityId ? getHotProviders(6, featuredCityId) : Promise.resolve([]),
    getStats(),
  ]);

  const defaultCity = firstCity;

  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
      <FaqSchema qaList={buildHomepageFaq(districts.length, stats.providerCount)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: '亲护',
            '@id': `${BASE_URL}/#organization`,
            url: BASE_URL,
            description: '全国养老护工本地服务平台，覆盖31个省市。帮子女在身边找到经过资质核验、有真实评价的居家养老护工。',
            areaServed: { '@type': 'Country', name: '中国' },
            makesOffer: SERVICE_TYPES.map(st => ({
              '@type': 'Service',
              name: st.name,
              description: `专业${st.name}服务`,
            })),
          }),
        }}
      />
      <Header />

      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 via-emerald-50/60 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
              帮您找到身边<span className="text-emerald-700">靠谱的养老护工</span>
            </h1>
            <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
              资质核验 + 真实评价 + 按距离排序。覆盖全国31个省市，搜到附近的好护工。
            </p>
            <SearchBar />
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                资质核验
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-emerald-600" />
                真实评价
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                按区查找
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{stats.providerCount.toLocaleString()}+</div>
              <div className="text-xs text-zinc-500">认证服务者</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{stats.cityCount}</div>
              <div className="text-xs text-zinc-500">覆盖城市</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{stats.reviewCount.toLocaleString()}+</div>
              <div className="text-xs text-zinc-500">真实评价</div>
            </div>
          </div>
        </section>

        {/* City Selector */}
        <HotCitySelector allCities={cities.map(c => ({ name: c.name, slug: c.slug }))} />

        {/* Quick Entry: Districts */}
        {defaultCity && districts.length > 0 && (
          <section className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">
                {defaultCity.name} — 按区域查找养老服务
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {districts.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/${defaultCity.slug}/${d.slug}`}
                    className="flex items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-3 shadow-sm hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="font-medium text-zinc-800">{d.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quick Entry: Service Types */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              按服务类型查找
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {serviceTypes.map((s) => (
                <Link
                  key={s.slug}
                  href={defaultCity ? `/${defaultCity.slug}/${s.slug}` : `/search?type=${s.slug}`}
                  className="bg-zinc-50 rounded-lg p-5 shadow-sm hover:bg-emerald-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-transparent hover:border-emerald-200"
                >
                  <h3 className="font-semibold text-zinc-900 mb-1">{s.name}</h3>
                  <p className="text-sm text-zinc-500 mb-2">{s.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Providers */}
        {hotProviders.length > 0 && (
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900">
                  {defaultCity?.name ?? ''} 推荐服务者
                </h2>
                <Link
                  href={defaultCity ? `/${defaultCity.slug}` : '/'}
                  className="text-sm text-emerald-700 hover:text-emerald-800"
                >
                  查看全部 &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotProviders.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trust Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-emerald-700 to-emerald-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <HeartHandshake className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-4">我们如何保证服务质量？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left">
              <div>
                <h3 className="font-semibold mb-2">严格的资质审核</h3>
                <p className="text-sm text-emerald-100">
                  每个护工的身份信息、职业资格证书、健康证明均经过人工审核，确保证件真实有效。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">真实的用户评价</h3>
                <p className="text-sm text-emerald-100">
                  所有评价来自真实服务后的用户，我们持续追踪服务质量，让好护工被发现。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">精准的本地匹配</h3>
                <p className="text-sm text-emerald-100">
                  基于地理位置的服务匹配，帮您找到离父母最近的养老服务，减少通勤时间。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">
              关于找护工，您可能想知道
            </h2>
            <div className="space-y-6">
              {buildHomepageFaq(districts.length, stats.providerCount).map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-zinc-900 mb-2">
                    Q: {faq.question}
                  </h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    A: {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
