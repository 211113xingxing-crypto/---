'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ServiceProvider, ServiceListing, ServiceType } from '@/generated/prisma/client';
import { Plus, Trash2, Save } from 'lucide-react';

type ListingWithType = ServiceListing & { serviceType: ServiceType };

interface Props {
  provider: ServiceProvider;
  listings: ListingWithType[];
  selectedTypeIds: number[];
  serviceTypes: ServiceType[];
}

export function ServiceForm({ provider, listings, selectedTypeIds, serviceTypes }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [typeIds, setTypeIds] = useState<number[]>(selectedTypeIds);
  const [editingListing, setEditingListing] = useState<Partial<ListingWithType> | null>(null);

  async function handleAddListing(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body = {
      serviceTypeId: parseInt(form.get('serviceTypeId') as string),
      title: form.get('title'),
      description: form.get('description') || null,
      price: form.get('price') ? parseInt(form.get('price') as string) : null,
      priceUnit: form.get('priceUnit') || null,
      priceNote: form.get('priceNote') || null,
      isNegotiable: form.get('isNegotiable') === 'on',
    };

    try {
      const res = await fetch('/api/trpc/dashboard.addListing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '添加失败');
      setMessage('服务项目已添加');
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '添加失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteListing(listingId: number) {
    if (!confirm('确认删除此服务项目？')) return;
    try {
      const res = await fetch('/api/trpc/dashboard.deleteListing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      if (!res.ok) throw new Error('删除失败');
      router.refresh();
    } catch {
      setError('删除失败');
    }
  }

  async function handleSaveTypeIds() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/trpc/dashboard.updateServiceTypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceTypeIds: typeIds }),
      });
      if (!res.ok) throw new Error('保存失败');
      setMessage('服务类型已更新');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  const availableTypes = serviceTypes.filter(st => !listings.some(l => l.serviceTypeId === st.id));

  return (
    <div className="space-y-6 max-w-2xl">
      {message && (
        <p className="text-emerald-600 text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">{message}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>
      )}

      {/* Service type tags */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">服务类型</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {serviceTypes.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setTypeIds(prev =>
                  prev.includes(st.id) ? prev.filter(id => id !== st.id) : [...prev, st.id]
                );
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                typeIds.includes(st.id)
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-zinc-50 text-zinc-500 border border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleSaveTypeIds}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
      </div>

      {/* Current listings */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">现有服务项目</h2>
        {listings.length === 0 ? (
          <p className="text-sm text-zinc-500">暂无服务项目</p>
        ) : (
          <div className="space-y-3">
            {listings.map((l) => (
              <div key={l.id} className="flex items-start justify-between p-4 border border-zinc-100 rounded-lg">
                <div>
                  <div className="font-medium text-zinc-900">{l.title}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{l.serviceType.name}</div>
                  {l.price != null && (
                    <div className="text-sm text-emerald-600 font-medium mt-1">
                      ¥{l.price}{l.priceUnit ? ` / ${l.priceUnit}` : ''}
                      {l.isNegotiable && <span className="text-zinc-400 ml-1">（可议价）</span>}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteListing(l.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                  aria-label="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new listing */}
      {availableTypes.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">添加服务项目</h2>
          <form onSubmit={handleAddListing} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">服务类型</label>
              <select
                name="serviceTypeId"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">请选择</option>
                {availableTypes.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">服务标题</label>
              <input
                type="text"
                name="title"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="如：住家护理、日间照料等"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">描述（选填）</label>
              <textarea
                name="description"
                rows={2}
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-1">价格（元）</label>
                <input
                  type="number"
                  name="price"
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="选填"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 block mb-1">单位</label>
                <select
                  name="priceUnit"
                  className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">请选择</option>
                  <option value="小时">小时</option>
                  <option value="天">天</option>
                  <option value="月">月</option>
                  <option value="次">次</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                  <input type="checkbox" name="isNegotiable" className="rounded" />
                  可议价
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {saving ? '添加中...' : '添加'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
