import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/search-bar';
import { ProviderCard } from '@/components/provider-card';
import { EmptyState } from '@/components/empty-state';
import { SortControls } from '@/components/sort-controls';
import { searchProviders, getCityIdBySlug } from '@/lib/data';

import { BASE_URL } from '@/lib/env';

export const metadata: Metadata = {
  title: '搜索养老服务',
  description: '搜索本地养老护工、陪诊、日间照料、术后康复服务。按区域和服务类型筛选，找到最合适的养老服务。',
  robots: { index: false },
  alternates: { canonical: `${BASE_URL}/search` },
};

interface PageProps {
  searchParams: Promise<{ q?: string; city?: string; type?: string; district?: string; sort?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? '';
  const districtSlug = params.district ?? '';
  const serviceTypeSlug = params.type ?? '';
  const citySlug = params.city ?? '';

  const cityId = await getCityIdBySlug(citySlug);

  const { providers: results, total } = cityId
    ? await searchProviders({
        q: query || undefined,
        districtSlug: districtSlug || undefined,
        serviceTypeSlug: serviceTypeSlug || undefined,
        cityId,
        sort: params.sort,
      })
    : { providers: [], total: 0 };

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
        <div className="mb-8">
          <SearchBar />
        </div>

        {query && (
          <div className="mb-4">
            <h1 className="text-xl font-bold text-zinc-900">
              搜索：&ldquo;{query}&rdquo;
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              找到 {total} 个相关服务者
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-4">
            <SortControls />
          </div>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="未找到匹配的服务者"
            message={query ? `未找到与"${query}"相关的服务者，请尝试其他关键词或浏览全部服务者。` : '暂无符合条件的服务者。'}
            suggestions={[
              { label: '浏览全部服务者', href: `/${citySlug}` },
              { label: '返回首页', href: '/' },
            ]}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
