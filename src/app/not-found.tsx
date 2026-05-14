import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/search-bar';
import { Search, MapPin } from 'lucide-react';
import { BASE_URL } from '@/lib/env';

export const metadata: Metadata = {
  title: '页面未找到 - 亲护',
  description: '您访问的页面可能已被移除或地址有误。试试搜索养老服务或浏览城市列表。',
  robots: { index: false },
  alternates: { canonical: `${BASE_URL}/not-found` },
};

const POPULAR_CITIES = [
  { name: '上海', slug: 'shanghai' },
  { name: '北京', slug: 'beijing' },
  { name: '广州', slug: 'guangzhou' },
  { name: '深圳', slug: 'shenzhen' },
  { name: '杭州', slug: 'hangzhou' },
  { name: '成都', slug: 'chengdu' },
  { name: '苏州', slug: 'suzhou' },
  { name: '武汉', slug: 'wuhan' },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4" id="main-content">
        <div className="text-center max-w-lg">
          <h1 className="text-6xl font-bold text-zinc-200 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">页面未找到</h2>
          <p className="text-zinc-500 mb-6">您访问的页面可能已被移除或地址有误。试试搜索您要找的服务：</p>

          <div className="mb-8">
            <SearchBar placeholder="输入区域或服务类型搜索..." />
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-zinc-700 mb-3 flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4" />
              热门城市
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-sm hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors">
              返回首页
            </Link>
            <Link href="/guide/zhaohugong" className="px-4 py-2 border border-zinc-300 rounded-lg text-sm hover:bg-zinc-50 transition-colors">
              找护工指南
            </Link>
            <Link href="/help" className="px-4 py-2 border border-zinc-300 rounded-lg text-sm hover:bg-zinc-50 transition-colors">
              帮助中心
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
