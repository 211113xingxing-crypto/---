import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-zinc-200 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">页面未找到</h2>
          <p className="text-zinc-500 mb-6">您访问的页面可能已被移除或地址有误。</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
              返回首页
            </Link>
            <Link href="/shanghai" className="px-4 py-2 border border-zinc-300 rounded-lg text-sm hover:bg-zinc-50">
              浏览上海服务
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
