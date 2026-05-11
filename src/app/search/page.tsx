import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/search-bar';
import { ProviderCard } from '@/components/provider-card';
import { searchProviders } from '@/lib/data';

export const metadata: Metadata = {
  title: '搜索养老服务',
  description: '搜索上海本地养老护工、陪诊、日间照料、术后康复服务。按区域和服务类型筛选，找到最合适的养老服务。',
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ q?: string; city?: string; type?: string; district?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? '';
  const districtSlug = params.district ?? '';
  const serviceTypeSlug = params.type ?? '';

  const { providers: results, total } = await searchProviders({
    q: query || undefined,
    districtSlug: districtSlug || undefined,
    serviceTypeSlug: serviceTypeSlug || undefined,
  });

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        {query && (
          <div className="mb-6">
            <h1 className="text-xl font-bold text-zinc-900">
              搜索：&ldquo;{query}&rdquo;
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              找到 {total} 个相关服务者
            </p>
          </div>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-500 mb-4">未找到匹配的服务者</p>
            <p className="text-sm text-zinc-400">
              试试其他关键词，或浏览{' '}
              <Link href="/shanghai" className="text-emerald-700 hover:underline">
                上海全部服务者
              </Link>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
