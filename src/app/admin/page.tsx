import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdminStats, getPendingVerifications } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '后台管理',
  robots: { index: false },
};

export default async function AdminPage() {
  const stats = await getAdminStats();
  const pendingVerifs = await getPendingVerifications();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">后台管理</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/admin/providers"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-emerald-300 transition-all"
        >
          <div className="text-3xl font-bold text-emerald-700">{stats.totalProviders}</div>
          <div className="text-sm text-zinc-500 mt-1">服务者总数</div>
        </Link>
        <Link
          href="/admin/providers?status=pending"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-amber-300 transition-all"
        >
          <div className="text-3xl font-bold text-amber-600">{stats.pendingProviders}</div>
          <div className="text-sm text-zinc-500 mt-1">待审核服务者</div>
        </Link>
        <Link
          href="/admin/reviews"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-emerald-300 transition-all"
        >
          <div className="text-3xl font-bold text-zinc-700">{stats.totalReviews}</div>
          <div className="text-sm text-zinc-500 mt-1">评价总数</div>
        </Link>
        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-amber-600">{stats.pendingVerifications}</div>
          <div className="text-sm text-zinc-500 mt-1">待审核资质</div>
        </div>
      </div>

      {/* Pending verifications */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-4">待审核资质</h2>
        {pendingVerifs.length === 0 ? (
          <p className="text-sm text-zinc-400">暂无待审核项</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b">
                <th className="pb-3 font-medium">服务者</th>
                <th className="pb-3 font-medium">资质类型</th>
                <th className="pb-3 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {pendingVerifs.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="py-3">
                    <Link
                      href={`/admin/providers/${v.providerId}`}
                      className="text-emerald-700 hover:underline font-medium"
                    >
                      {v.provider.name}
                    </Link>
                  </td>
                  <td className="py-3 text-zinc-600">{v.verifyType}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">
                      待审核
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/providers"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-emerald-300 transition-all"
        >
          <h3 className="font-semibold mb-1">服务者管理</h3>
          <p className="text-sm text-zinc-500">查看、编辑、审核所有服务者</p>
        </Link>
        <Link
          href="/admin/reviews"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-emerald-300 transition-all"
        >
          <h3 className="font-semibold mb-1">评价管理</h3>
          <p className="text-sm text-zinc-500">查看和审核用户评价</p>
        </Link>
        <Link
          href="/admin/providers/new"
          className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-emerald-300 transition-all"
        >
          <h3 className="font-semibold mb-1">添加服务者</h3>
          <p className="text-sm text-zinc-500">手动录入新的护工或机构</p>
        </Link>
      </div>
    </div>
  );
}
