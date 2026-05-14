'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface District {
  id: number;
  name: string;
  slug: string;
  level: string;
}

interface ServiceType {
  id: number;
  name: string;
  slug: string;
}

export function NewProviderForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  useEffect(() => {
    fetch('/api/trpc/provider.getServiceTypes')
      .then(r => r.json())
      .then(d => {
        if (d.result?.data) {
          setServiceTypes(Array.isArray(d.result.data) ? d.result.data : d.result.data.json ?? []);
        }
      })
      .catch(() => {});
    fetch('/api/admin/districts')
      .then(r => r.json())
      .then(d => setDistricts(d.data ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {
      providerType: form.get('providerType'),
      name: form.get('name'),
      slug: form.get('slug'),
      phone: form.get('phone') || null,
      wechatId: form.get('wechatId') || null,
      bio: form.get('bio') || null,
      yearsExperience: form.get('yearsExperience') ? parseInt(form.get('yearsExperience') as string) : null,
      gender: form.get('gender') || null,
      age: form.get('age') ? parseInt(form.get('age') as string) : null,
      districtId: form.get('districtId') ? parseInt(form.get('districtId') as string) : null,
      latitude: parseFloat(form.get('latitude') as string) || 0,
      longitude: parseFloat(form.get('longitude') as string) || 0,
      addressText: form.get('addressText') || null,
      serviceTypeIds: form.getAll('serviceTypeIds').map(Number),
      verified: form.get('verified') === 'on',
    };

    try {
      const res = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? '创建失败');
      }
      const data = await res.json();
      router.push(`/admin/providers/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '创建失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">类型</label>
          <select name="providerType" required className="w-full px-3 py-1.5 border rounded-md text-sm">
            <option value="individual">个人护工</option>
            <option value="agency">护理机构</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">姓名/机构名</label>
          <input name="name" required className="w-full px-3 py-1.5 border rounded-md text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Slug (URL标识)</label>
          <input name="slug" required className="w-full px-3 py-1.5 border rounded-md text-sm font-mono" placeholder="zhang-ayi-pudong" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">电话</label>
          <input name="phone" className="w-full px-3 py-1.5 border rounded-md text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">微信号</label>
          <input name="wechatId" className="w-full px-3 py-1.5 border rounded-md text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">区域</label>
          <select name="districtId" className="w-full px-3 py-1.5 border rounded-md text-sm">
            <option value="">选择区域</option>
            {districts.filter(d => d.level === 'district').map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">性别</label>
          <select name="gender" className="w-full px-3 py-1.5 border rounded-md text-sm">
            <option value="">不限</option>
            <option value="女">女</option>
            <option value="男">男</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">年龄</label>
          <input name="age" type="number" className="w-full px-3 py-1.5 border rounded-md text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">从业年限</label>
          <input name="yearsExperience" type="number" className="w-full px-3 py-1.5 border rounded-md text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">纬度</label>
          <input name="latitude" type="number" step="any" className="w-full px-3 py-1.5 border rounded-md text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">经度</label>
          <input name="longitude" type="number" step="any" className="w-full px-3 py-1.5 border rounded-md text-sm" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">地址</label>
        <input name="addressText" className="w-full px-3 py-1.5 border rounded-md text-sm" placeholder="例如：XX市XX区XX街道" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">简介</label>
        <textarea name="bio" rows={3} className="w-full px-3 py-1.5 border rounded-md text-sm" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">服务类型</label>
        <div className="flex flex-wrap gap-3 mt-1">
          {serviceTypes.map(st => (
            <label key={st.id} className="flex items-center gap-1 text-sm">
              <input type="checkbox" name="serviceTypeIds" value={st.id} />
              {st.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" name="verified" />
          直接通过认证
        </label>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? '创建中...' : '创建服务者'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
        >
          取消
        </button>
      </div>
    </form>
  );
}
