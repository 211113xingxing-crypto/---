import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FavoritesList } from '@/app/favorites/favorites-list';
import { BASE_URL } from '@/lib/env';
import { Heart, ShieldCheck, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '个人中心 — 亲护',
  description: '管理你的收藏、联系记录和个人信息。',
  alternates: { canonical: `${BASE_URL}/profile` },
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8" id="main-content">
        <Breadcrumbs items={[
          { label: '首页', href: '/' },
          { label: '个人中心' },
        ]} />

        <h1 className="text-2xl font-bold text-zinc-900 mb-8">个人中心</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg">
                  用
                </div>
                <div>
                  <p className="font-medium text-zinc-900">用户</p>
                  <p className="text-xs text-zinc-500">微信登录用户</p>
                </div>
              </div>
              <nav className="space-y-1">
                <a href="#favorites" className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-md font-medium">
                  <Heart className="w-4 h-4" />
                  我的收藏
                </a>
                <Link href="/help" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 rounded-md transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  帮助中心
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Favorites section */}
            <section id="favorites" className="bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                我的收藏
              </h2>
              <FavoritesList />
            </section>

            {/* Contact history */}
            <section className="bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                联系记录
              </h2>
              <p className="text-sm text-zinc-500">
                联系请求记录将在发起联系后显示。浏览服务者，点击"联系服务者"即可发起联系。
              </p>
              <Link
                href="/"
                className="inline-block mt-3 px-4 py-2 border border-zinc-200 text-zinc-700 rounded-lg text-sm hover:bg-zinc-50 transition-colors"
              >
                浏览服务者 →
              </Link>
            </section>

            {/* Settings placeholder */}
            <section className="bg-white border border-zinc-200 rounded-lg p-6">
              <h2 className="font-semibold text-zinc-900 mb-4">账户设置</h2>
              <p className="text-sm text-zinc-500">
                如需修改个人信息或删除账户数据，请联系平台客服。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
