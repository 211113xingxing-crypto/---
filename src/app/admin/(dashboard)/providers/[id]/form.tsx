'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Provider = NonNullable<Awaited<ReturnType<typeof import('@/lib/admin-queries').getProviderById>>>;

export function ProviderEditForm({ provider }: { provider: Provider }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: provider.name,
    slug: provider.slug,
    providerType: provider.providerType,
    phone: provider.phone ?? '',
    wechatId: provider.wechatId ?? '',
    bio: provider.bio ?? '',
    yearsExperience: provider.yearsExperience?.toString() ?? '',
    gender: provider.gender ?? '',
    age: provider.age?.toString() ?? '',
    addressText: provider.addressText ?? '',
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/providers/${provider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : null,
          age: form.age ? parseInt(form.age) : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? '保存失败');
      }
      setMessage('保存成功');
      router.refresh();
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleAction(action: string) {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/providers/${provider.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? '操作失败');
      }
      setMessage('操作成功');
      router.refresh();
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : '操作失败');
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
          <input
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">类型</label>
          <select
            value={form.providerType}
            onChange={(e) => updateField('providerType', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          >
            <option value="individual">个人护工</option>
            <option value="agency">护理机构</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">性别</label>
          <select
            value={form.gender}
            onChange={(e) => updateField('gender', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          >
            <option value="">不限</option>
            <option value="女">女</option>
            <option value="男">男</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">年龄</label>
          <input
            value={form.age}
            onChange={(e) => updateField('age', e.target.value)}
            type="number"
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">从业年限</label>
          <input
            value={form.yearsExperience}
            onChange={(e) => updateField('yearsExperience', e.target.value)}
            type="number"
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">电话</label>
          <input
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">微信号</label>
          <input
            value={form.wechatId}
            onChange={(e) => updateField('wechatId', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">地址</label>
          <input
            value={form.addressText}
            onChange={(e) => updateField('addressText', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">区域</label>
          <div className="text-sm py-1.5">{provider.district?.name ?? '-'}</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">评分</label>
          <div className="text-sm py-1.5">{provider.avgRating.toFixed(1)} ({provider.reviewCount} 条)</div>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">状态</label>
          <div className="text-sm py-1.5">{provider.status}</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-zinc-500 block mb-1">简介</label>
        <textarea
          value={form.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={3}
          className="w-full px-3 py-1.5 border rounded-md text-sm"
        />
      </div>

      {/* Save + Status actions */}
      <div className="flex gap-2 flex-wrap border-t pt-4 items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存修改'}
        </button>
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
          <span className={`text-sm ${message.includes('成功') ? 'text-emerald-600' : 'text-red-500'}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
