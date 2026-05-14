import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdminProviders, getAdminDistricts } from '@/lib/admin-queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '服务者管理 - 后台',
  robots: { index: false },
};

export default async function AdminProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; district?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1'));
  const limit = 20;
  const search = params.search ?? '';
  const status = params.status ?? 'all';
  const districtSlug = params.district ?? '';

  // Get first active city
  const { db } = await import('@/server/db');
  const city = await db.city.findFirst({ where: { isActive: true }, orderBy: { id: 'asc' } });
  if (!city) return <div className="max-w-6xl mx-auto px-4 py-8">No city found — run seed first</div>;

  const { items, total, totalPages } = await getAdminProviders({
    page,
    limit,
    search,
    status,
    districtSlug,
    cityId: city.id,
  });

  const districts = await getAdminDistricts(city.slug);

  const statusLabels: Record<string, string> = {
    all: '全部状态',
    pending: '待审核',
    active: '已通过',
    suspended: '已停用',
  };
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    suspended: 'bg-red-50 text-red-700',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-sm text-emerald-700 hover:underline mb-1 block">
            &larr; 返回后台
          </Link>
          <h1 className="text-2xl font-bold">服务者管理</h1>
        </div>
        <Link
          href="/admin/providers/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
        >
          添加服务者
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-zinc-200 rounded-lg mb-6">
        <form className="p-4 flex gap-3 flex-wrap items-center">
          <input
            type="text"
            name="search"
            placeholder="搜索名称、电话..."
            defaultValue={search}
            className="px-3 py-1.5 border rounded-md flex-1 max-w-xs text-sm"
          />
          <select name="status" defaultValue={status} className="px-3 py-1.5 border rounded-md text-sm text-zinc-600">
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select name="district" defaultValue={districtSlug} className="px-3 py-1.5 border rounded-md text-sm text-zinc-600">
            <option value="">全部区域</option>
            {districts.map((d) => (
              <option key={d.id} value={d.slug}>{d.name}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-1.5 bg-zinc-100 text-zinc-700 rounded-md text-sm hover:bg-zinc-200">
            筛选
          </button>
          {(search || status !== 'all' || districtSlug) && (
            <a href="/admin/providers" className="text-sm text-zinc-400 hover:text-zinc-600">
              清除筛选
            </a>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b bg-zinc-50">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">名称</th>
              <th className="px-4 py-3 font-medium">类型</th>
              <th className="px-4 py-3 font-medium">区域</th>
              <th className="px-4 py-3 font-medium">评分/评价数</th>
              <th className="px-4 py-3 font-medium">资质</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-zinc-50">
                  <td className="px-4 py-3 text-zinc-400">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    <Link href={`/admin/providers/${p.id}`} className="hover:text-emerald-700">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {p.providerType === 'individual' ? '个人护工' : '护理机构'}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{p.district?.name ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className="text-amber-500 font-medium">{p.avgRating.toFixed(1)}</span>
                    <span className="text-zinc-400 text-xs ml-1">({p._count.reviews}条)</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.verified ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">已认证</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">待审核</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[p.status] ?? 'bg-zinc-50 text-zinc-500'}`}>
                      {statusLabels[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/providers/${p.id}`}
                        className="text-emerald-700 hover:underline text-xs"
                      >
                        编辑
                      </Link>
                      <Link
                        href={`/provider/${p.slug}`}
                        className="text-zinc-500 hover:text-zinc-900 text-xs"
                        target="_blank"
                      >
                        查看
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const url = new URLSearchParams();
            if (search) url.set('search', search);
            if (status !== 'all') url.set('status', status);
            if (districtSlug) url.set('district', districtSlug);
            url.set('page', String(p));
            return (
              <a
                key={p}
                href={`?${url.toString()}`}
                className={`px-3 py-1.5 rounded text-sm ${p === page ? 'bg-emerald-600 text-white' : 'bg-white border text-zinc-600 hover:bg-zinc-50'}`}
              >
                {p}
              </a>
            );
          })}
          <span className="text-sm text-zinc-400 ml-2">共 {total} 条</span>
        </div>
      )}
    </div>
  );
}
