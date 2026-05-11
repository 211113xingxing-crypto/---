import Link from 'next/link';
import { SearchBar } from '@/components/search-bar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WebSiteSchema, OrganizationSchema } from '@/components/schema/web-site';
import { getDistricts, getServiceTypes, getHotProviders } from '@/lib/data';
import { ProviderCard } from '@/components/provider-card';
import { MapPin, Users, ShieldCheck, HeartHandshake } from 'lucide-react';

export default async function HomePage() {
  const [districts, serviceTypes, hotProviders] = await Promise.all([
    getDistricts(),
    getServiceTypes(),
    getHotProviders(6),
  ]);
  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              帮您在上海找到身边<span className="text-emerald-700">靠谱的养老护工</span>
            </h1>
            <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
              资质核验 + 真实评价 + 按距离排序。不用再在十几个微信群里打听，直接搜到附近的好护工。
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
        </section>

        {/* Quick Entry: Districts */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              按区域查找养老服务
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {districts.map((d) => (
                <Link
                  key={d.slug}
                  href={`/shanghai/${d.slug}`}
                  className="flex items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-3 hover:border-emerald-300 hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-zinc-800">{d.name}</span>
                  {d.count ? <span className="text-xs text-zinc-400">{d.count}位护工</span> : null}
                </Link>
              ))}
            </div>
          </div>
        </section>

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
                  href={`/shanghai/${s.slug}`}
                  className="bg-zinc-50 rounded-lg p-5 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200"
                >
                  <h3 className="font-semibold text-zinc-900 mb-1">{s.name}</h3>
                  <p className="text-sm text-zinc-500 mb-2">{s.description}</p>
                  {s.count ? <span className="text-xs text-emerald-700 font-medium">{s.count}位服务者</span> : null}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Providers */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">
                推荐服务者
              </h2>
              <Link
                href="/shanghai"
                className="text-sm text-emerald-700 hover:text-emerald-800"
              >
                查看全部 &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotProviders.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 px-4 bg-emerald-700 text-white">
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

        {/* FAQ Section (GEO optimized) */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">
              关于找护工，您可能想知道
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Q: 在上海请一个居家护工要多少钱？
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  A: 上海居家护工的收费标准大致为：半天照护（4-8小时）80-180元/天，全天照护（24小时住家）200-350元/天。具体价格因护工资质、经验、服务内容而异。持有护士执业证书的护工收费通常更高。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Q: 如何判断一个护工是否靠谱？
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  A: 建议重点考察以下几点：①是否有养老护理员资格证书；②是否有健康证；③过往评价如何；④面试时老人的感觉是否舒服。我们平台上的护工都经过资质审核，且有真实用户评价供参考。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Q: 护工和保姆有什么区别？
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  A: 护工具备专业的养老护理知识和技能，能处理老人的健康监测、康复训练、服药管理等医疗相关事务。保姆主要负责家务和日常起居。如果老人有慢性病或需要康复护理，建议选择专业护工。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">
                  Q: 长宁区/静安区/浦东新区哪里能找到好的护工？
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  A: 我们在上海各区都收录了经过认证的护工和护理机构。您可以在首页选择您所在的区域，或使用搜索功能输入&ldquo;区域+服务类型&rdquo;来查找。每个护工都有详细的资质信息和真实评价供您参考。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
