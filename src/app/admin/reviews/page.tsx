import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdminReviews } from '@/lib/admin-queries';
import { ReviewActions } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '评价管理 - 后台',
  robots: { index: false },
};

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1'));
  const limit = 20;

  const { items, total, totalPages } = await getAdminReviews({ page, limit });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline mb-1 block">
          &larr; 返回后台
        </Link>
        <h1 className="text-2xl font-bold">评价管理</h1>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b bg-zinc-50">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">服务者</th>
              <th className="px-4 py-3 font-medium">用户</th>
              <th className="px-4 py-3 font-medium">评分</th>
              <th className="px-4 py-3 font-medium">内容</th>
              <th className="px-4 py-3 font-medium">时间</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                  暂无评价
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-zinc-50">
                  <td className="px-4 py-3 text-zinc-400">{r.id}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/provider/${r.provider.slug}`}
                      className="text-emerald-700 hover:underline font-medium"
                    >
                      {r.provider.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {r.user?.nickname ?? `用户#${r.userId}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-amber-500 font-medium">{r.rating}</span>
                    <span className="text-zinc-300">/5</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-700 max-w-xs truncate">
                    {r.content ?? <span className="text-zinc-300">无文字</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {r.createdAt.toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3">
                    <ReviewActions reviewId={r.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}`}
              className={`px-3 py-1.5 rounded text-sm ${p === page ? 'bg-emerald-600 text-white' : 'bg-white border text-zinc-600 hover:bg-zinc-50'}`}
            >
              {p}
            </a>
          ))}
          <span className="text-sm text-zinc-400 ml-2">共 {total} 条</span>
        </div>
      )}
    </div>
  );
}
