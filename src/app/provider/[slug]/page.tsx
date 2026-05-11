import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { ProviderSchema } from '@/components/schema/provider-schema';
import { getProviderBySlug, getReviews } from '@/lib/data';
import { Star, ShieldCheck, Phone, MapPin, Clock, Award, MessageCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: '服务者未找到' };

  const serviceNames = provider.listings.map((l) => l.serviceType.name).join('、');
  const districtName = provider.district?.name ?? '上海';

  return {
    title: `${provider.name} - ${districtName}${serviceNames} | 评分${provider.avgRating}`,
    description: `${provider.name}，${provider.yearsExperience ? `${provider.yearsExperience}年经验，` : ''}评分${provider.avgRating}（${provider.reviewCount}条评价）。提供${serviceNames}。服务${districtName}。${provider.phone ? `电话：${provider.phone}` : ''}`,
    openGraph: {
      title: `${provider.name} | 养老本地服务`,
      description: provider.bio?.slice(0, 160) ?? '',
      type: 'profile',
    },
    alternates: { canonical: `https://www.eldercare.local/provider/${provider.slug}` },
  };
}

function priceDisplay(price: number, unit: string | null): string {
  switch (unit) {
    case 'hour': return `${price}元/小时`;
    case 'day': return `${price}元/天`;
    case 'month': return `${price}元/月`;
    case 'per_visit': return `${price}元/次`;
    default: return `${price}元`;
  }
}

function verifyLabel(type: string): string {
  const m: Record<string, string> = {
    id_card: '身份证认证',
    nurse_cert: '养老护理员资格证',
    health_cert: '健康证',
    background_check: '背景调查通过',
  };
  return m[type] ?? type;
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const reviews = await getReviews(provider.id);
  const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDist[r.rating] = (ratingDist[r.rating] ?? 0) + 1;
    }
  }

  const breadcrumbItems = [
    { name: '首页', url: 'https://www.eldercare.local' },
    { name: '上海', url: 'https://www.eldercare.local/shanghai' },
    ...(provider.district
      ? [{ name: provider.district.name, url: `https://www.eldercare.local/shanghai/${provider.district.slug}` }]
      : []),
    { name: provider.name, url: `https://www.eldercare.local/provider/${provider.slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ProviderSchema provider={provider} />
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/shanghai" className="hover:text-emerald-700">上海</Link>
          {provider.district && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/shanghai/${provider.district.slug}`} className="hover:text-emerald-700">
                {provider.district.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-zinc-900">{provider.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-zinc-900">{provider.name}</h1>
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    已认证
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-sm">
                {provider.providerType === 'individual' ? '个人护工' : '护理机构'}
                {provider.gender && ` · ${provider.gender}`}
                {provider.age && ` · ${provider.age}岁`}
                {provider.yearsExperience && ` · ${provider.yearsExperience}年经验`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="flex items-center gap-1 text-3xl font-bold text-zinc-900">
                  {provider.avgRating.toFixed(1)}
                  <Star className="w-6 h-6 text-amber-500 fill-current" />
                </div>
                <p className="text-xs text-zinc-400">{provider.reviewCount}条评价</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-zinc-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-zinc-400" />
              {provider.addressText}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mt-5">
            {provider.phone && (
              <a
                href={`tel:${provider.phone.replace(/\*/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                拨打电话
              </a>
            )}
            {provider.wechatId && (
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors">
                <MessageCircle className="w-4 h-4" />
                微信联系
              </button>
            )}
          </div>
        </div>

        {/* Bio & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            {provider.bio && (
              <section className="bg-white border border-zinc-200 rounded-lg p-6">
                <h2 className="font-semibold text-zinc-900 mb-3">个人介绍</h2>
                <p className="text-zinc-600 text-sm leading-relaxed">{provider.bio}</p>
              </section>
            )}

            {/* Service Listings */}
            <section className="bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="font-semibold text-zinc-900 mb-4">服务项目与价格</h2>
              <div className="divide-y divide-zinc-100">
                {provider.listings.map((listing, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-zinc-900 text-sm">{listing.title}</h3>
                        {listing.description && (
                          <p className="text-xs text-zinc-500 mt-0.5">{listing.description}</p>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded">
                          {listing.serviceType.name}
                        </span>
                      </div>
                      <div className="text-right">
                        {listing.price ? (
                          <span className="font-semibold text-emerald-700 text-sm">
                            {priceDisplay(listing.price, listing.priceUnit)}
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-400">价格面议</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="font-semibold text-zinc-900 mb-4">
                用户评价 ({reviews.length})
              </h2>

              {/* Rating summary */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                <div className="text-center">
                  <div className="text-4xl font-bold text-zinc-900">{provider.avgRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(provider.avgRating) ? 'text-amber-500 fill-current' : 'text-zinc-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDist[rating] ?? 0;
                    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-zinc-500">{rating}</span>
                        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-5 text-zinc-400 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-5 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-zinc-900">
                          {review.user.nickname}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= review.rating ? 'text-amber-500 fill-current' : 'text-zinc-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">{review.content}</p>
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {review.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {review.isVerifiedBooking && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                            真实服务
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ for GEO */}
            <section className="bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="font-semibold text-zinc-900 mb-4">常见问题</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-900">
                    Q: {provider.name}的服务区域是哪里？
                  </h3>
                  <p className="text-sm text-zinc-600 mt-1">
                    A: {provider.name}主要在{provider.addressText}提供服务
                    {provider.district ? `，覆盖${provider.district.name}及周边区域` : ''}。
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-900">
                    Q: {provider.name}有哪些资质证书？
                  </h3>
                  <p className="text-sm text-zinc-600 mt-1">
                    A: {provider.verifications.length > 0
                      ? `持有${provider.verifications.map(v => verifyLabel(v.verifyType)).join('、')}。`
                      : '资质信息请联系确认。'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-900">
                    Q: {provider.name}的收费标准是怎样的？
                  </h3>
                  <p className="text-sm text-zinc-600 mt-1">
                    A: {provider.listings.map(l =>
                      `${l.title}${l.price ? `${priceDisplay(l.price, l.priceUnit)}` : '价格面议'}`
                    ).join('；')}。建议直接联系确认最新价格和档期。
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Credentials */}
            <div className="bg-white border border-zinc-200 rounded-lg p-5">
              <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                资质认证
              </h3>
              <ul className="space-y-2">
                {provider.verifications.length > 0 ? (
                  provider.verifications.map((v, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      {verifyLabel(v.verifyType)}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-zinc-400">暂无认证信息</li>
                )}
              </ul>
            </div>

            {/* Service Types */}
            <div className="bg-white border border-zinc-200 rounded-lg p-5">
              <h3 className="font-semibold text-zinc-900 mb-3">服务类型</h3>
              <div className="flex flex-wrap gap-2">
                {provider.serviceTypes.map((st, i) => (
                  <Link
                    key={i}
                    href={`/shanghai/${st.serviceType.slug}`}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {st.serviceType.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white border border-zinc-200 rounded-lg p-5">
              <h3 className="font-semibold text-zinc-900 mb-3">基本信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span>服务年限：{provider.yearsExperience ?? '未填写'}年</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>{provider.addressText}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <Star className="w-4 h-4 text-zinc-400" />
                  <span>评分 {provider.avgRating.toFixed(1)} / 5</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
