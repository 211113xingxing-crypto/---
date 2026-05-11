import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProviderById } from '@/lib/admin-queries';
import { ProviderEditForm } from './form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '编辑服务者 - 后台',
  robots: { index: false },
};

export default async function AdminProviderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = await getProviderById(parseInt(id));
  if (!provider) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/providers" className="text-sm text-emerald-700 hover:underline mb-1 block">
          &larr; 返回服务者列表
        </Link>
        <h1 className="text-2xl font-bold">编辑: {provider.name}</h1>
      </div>

      <ProviderEditForm provider={provider} />

      {/* Verifications section */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 mt-6">
        <h2 className="font-semibold mb-4">资质审核</h2>
        {provider.verifications.length === 0 ? (
          <p className="text-sm text-zinc-400">暂无资质记录</p>
        ) : (
          <div className="space-y-3">
            {provider.verifications.map((v) => (
              <div key={v.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <div className="font-medium text-sm">{getVerifyLabel(v.verifyType)}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {v.verifiedAt ? `审核时间: ${v.verifiedAt.toLocaleString('zh-CN')}` : '待审核'}
                  </div>
                  {v.note && <div className="text-xs text-zinc-500 mt-0.5">{v.note}</div>}
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  v.verifyStatus === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                  v.verifyStatus === 'rejected' ? 'bg-red-50 text-red-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {v.verifyStatus === 'approved' ? '已通过' :
                   v.verifyStatus === 'rejected' ? '已拒绝' : '待审核'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service listings */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 mt-6">
        <h2 className="font-semibold mb-4">服务项目</h2>
        {provider.listings.length === 0 ? (
          <p className="text-sm text-zinc-400">暂无服务项目</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b">
                <th className="pb-2 font-medium">服务名称</th>
                <th className="pb-2 font-medium">类型</th>
                <th className="pb-2 font-medium">价格</th>
                <th className="pb-2 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {provider.listings.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{l.title}</td>
                  <td className="py-2 text-zinc-600">{l.serviceType.name}</td>
                  <td className="py-2 text-zinc-600">
                    {l.price != null ? `¥${l.price}/${l.priceUnit ?? '次'}` : '面议'}
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      l.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-50 text-zinc-400'
                    }`}>
                      {l.isActive ? '上架' : '下架'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function getVerifyLabel(type: string): string {
  const labels: Record<string, string> = {
    id_card: '身份证',
    nurse_cert: '护理资格证',
    health_cert: '健康证',
    background_check: '背景调查',
  };
  return labels[type] ?? type;
}
