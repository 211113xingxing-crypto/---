import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FavoritesList } from './favorites-list';

import { BASE_URL } from '@/lib/env';

export const metadata: Metadata = {
  title: '我的收藏 | 亲护',
  description: '查看您收藏的养老服务者和护工，方便随时联系和对比。',
  robots: { index: false },
  alternates: { canonical: `${BASE_URL}/favorites` },
};

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8" id="main-content">
        <Breadcrumbs items={[
          { label: '首页', href: '/' },
          { label: '我的收藏' },
        ]} />
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">我的收藏</h1>
        <FavoritesList />
      </main>
      <Footer />
    </>
  );
}
