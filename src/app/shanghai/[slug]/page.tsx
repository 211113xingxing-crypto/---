import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb';
import { ProviderCard } from '@/components/provider-card';
import { getDistrictBySlug, getServiceTypeBySlug, getProvidersByDistrict, getProvidersByServiceType, getServiceTypes } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const district = await getDistrictBySlug(slug);
  if (district) {
    return {
      title: `${district.name}养老护工服务 - 居家护理、陪诊、日间照料`,
      description: `${district.name}居家养老护工服务。查找${district.name}附近的居家护理、陪诊服务、日间照料、术后康复等养老护理资源。所有护工均经过资质核验，附带真实用户评价。`,
      alternates: { canonical: `https://www.eldercare.local/shanghai/${slug}` },
    };
  }

  const serviceType = await getServiceTypeBySlug(slug);
  if (serviceType) {
    return {
      title: `${serviceType.name} - 上海${serviceType.name}服务汇总`,
      description: `上海${serviceType.name}服务。${serviceType.description}。查找上海各区持证护工和护理机构，附真实用户评价和资质信息。`,
      alternates: { canonical: `https://www.eldercare.local/shanghai/${slug}` },
    };
  }

  return { title: '页面未找到' };
}

export default async function ShanghaiSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const districtData = await getProvidersByDistrict(slug);
  const serviceTypeData = await getProvidersByServiceType(slug);

  // Neither district nor service type matched
  if (!districtData && !serviceTypeData) notFound();

  const allServiceTypes = await getServiceTypes();
  const isDistrict = !!districtData;
  const name = isDistrict ? districtData!.district.name : serviceTypeData!.serviceType.name;

  const breadcrumbItems = [
    { name: '首页', url: 'https://www.eldercare.local' },
    { name: '上海', url: 'https://www.eldercare.local/shanghai' },
    { name, url: `https://www.eldercare.local/shanghai/${slug}` },
  ];

  // District page
  if (isDistrict) {
    const { district, providers, subDistricts } = districtData!;

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
            <span className="text-zinc-900">{district.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            {district.name}养老护工服务
          </h1>
          <p className="text-zinc-600 mb-2 max-w-3xl">
            {district.name}居家养老护理资源。找到{district.name}附近的居家护理、陪诊服务、日间照料、术后康复护工和机构。所有服务者均通过资质审核，附带真实用户评价。
          </p>
          <p className="text-sm text-zinc-400 mb-6">
            当前已收录 {providers.length} 位服务者
          </p>

          {subDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {subDistricts.map((sd) => (
                <Link
                  key={sd.slug}
                  href={`/shanghai/${sd.slug}`}
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
                href={`/shanghai/${slug}/${s.slug}`}
                className="px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-sm hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                {s.name}
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-bold text-zinc-900 mb-4">{district.name}服务者列表</h2>
          {providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 py-8 text-center">该区域暂无服务者，我们正在扩展中。</p>
          )}

          {/* GEO FAQ */}
          <section className="mt-16 border-t pt-12">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              关于{district.name}养老护工的常见问题
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Q: {district.name}有哪些口碑好的护工？
                </h3>
                <p className="text-sm text-zinc-600">
                  A: {district.name}{providers.length > 0
                    ? `有${providers.map(p => p.name).join('、')}等${providers.length}位经过资质认证的护工和护理机构。建议根据老人的具体需求筛选后查看详细评价。`
                    : '暂无收录服务者，我们正在扩展中。'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Q: {district.name}请护工一般多少钱？
                </h3>
                <p className="text-sm text-zinc-600">
                  A: {district.name}居家护工的价格大致为半天照护80-150元/天，全天照护150-300元/天。具体费用取决于护工资历、经验和具体服务内容。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Q: 如何判断{district.name}的护工是否靠谱？
                </h3>
                <p className="text-sm text-zinc-600">
                  A: 建议查看护工的资质证书、过往评价、服务年限。我们平台的护工都经过资质审核和背景核查。
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // Service type page
  if (!isDistrict && serviceTypeData) {
    const { serviceType, providers } = serviceTypeData;

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
            <span className="text-zinc-900">{serviceType.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            上海{serviceType.name}服务
          </h1>
          <p className="text-zinc-600 mb-8 max-w-3xl">
            {serviceType.description}。已收录 {providers.length} 位上海{serviceType.name}服务者。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>

          {/* GEO FAQ */}
          <section className="mt-16 border-t pt-12">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              关于上海{serviceType.name}的常见问题
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Q: {serviceType.name}一般怎么收费？
                </h3>
                <p className="text-sm text-zinc-600">
                  A: 上海{serviceType.name}的价格因服务内容、时长和护工资历而异。具体费用请查看各服务者的价格信息或直接联系咨询。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-1">
                  Q: {serviceType.name}需要护工有什么资质？
                </h3>
                <p className="text-sm text-zinc-600">
                  A: 建议选择持有养老护理员职业资格证书、健康证的护工。我们平台上的服务者均经过资质审核。
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  notFound();
}
