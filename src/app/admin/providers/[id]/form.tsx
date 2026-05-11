'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Provider = NonNullable<Awaited<ReturnType<typeof import('@/lib/admin-queries').getProviderById>>>;

export function ProviderEditForm({ provider }: { provider: Provider }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleAction(action: string, data?: Record<string, unknown>) {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/providers/${provider.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed');
      }
      setMessage('保存成功');
      router.refresh();
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  const statusActions = [
    { label: '通过审核', action: 'activate', className: 'bg-emerald-600 hover:bg-emerald-700', visible: provider.status !== 'active' },
    { label: '停用', action: 'suspend', className: 'bg-red-500 hover:bg-red-600', visible: provider.status === 'active' },
    { label: '重新激活', action: 'activate', className: 'bg-emerald-600 hover:bg-emerald-700', visible: provider.status === 'suspended' },
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">名称</label>
          <div className="font-medium">{provider.name}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Slug</label>
          <div className="font-mono text-sm">{provider.slug}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">类型</label>
          <div>{provider.providerType === 'individual' ? '个人护工' : '护理机构'}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">区域</label>
          <div>{provider.district?.name ?? '-'}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">电话</label>
          <div>{provider.phone ?? '-'}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">微信号</label>
          <div>{provider.wechatId ?? '-'}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">评分</label>
          <div>{provider.avgRating.toFixed(1)} ({provider.reviewCount} 条评价)</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">当前状态</label>
          <div>{provider.status}</div>
        </div>
      </div>

      {provider.bio && (
        <div className="mb-6">
          <label className="text-xs text-zinc-500 block mb-1">简介</label>
          <p className="text-sm text-zinc-700 whitespace-pre-wrap">{provider.bio}</p>
        </div>
      )}

      {/* Status actions */}
      <div className="flex gap-2 flex-wrap border-t pt-4">
        {statusActions.filter(a => a.visible).map((a) => (
          <button
            key={a.action}
            onClick={() => handleAction(a.action)}
            disabled={saving}
            className={`px-4 py-2 text-white text-sm rounded-lg disabled:opacity-50 ${a.className}`}
          >
            {a.label}
          </button>
        ))}
        {message && (
          <span className={`text-sm self-center ${message.includes('成功') ? 'text-emerald-600' : 'text-red-500'}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
