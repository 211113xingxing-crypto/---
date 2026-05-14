'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ServiceProvider } from '@/generated/prisma/client';
import { Save } from 'lucide-react';

interface Props {
  provider: ServiceProvider;
  districts: { id: number; name: string }[];
}

export function ProfileForm({ provider, districts }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name'),
      bio: form.get('bio') || null,
      phone: form.get('phone') || null,
      wechatId: form.get('wechatId') || null,
      addressText: form.get('addressText') || null,
      districtId: form.get('districtId') ? parseInt(form.get('districtId') as string) : null,
      gender: form.get('gender') || null,
      age: form.get('age') ? parseInt(form.get('age') as string) : null,
      yearsExperience: form.get('yearsExperience') ? parseInt(form.get('yearsExperience') as string) : null,
    };

    try {
      const res = await fetch('/api/trpc/dashboard.updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '保存失败');
      setMessage('保存成功');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4 max-w-2xl">
      {message && (
        <p className="text-emerald-600 text-sm bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">{message}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>
      )}

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1">姓名/机构名称</label>
        <input
          type="text"
          name="name"
          defaultValue={provider.name}
          className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">手机号</label>
          <input
            type="tel"
            name="phone"
            defaultValue={provider.phone ?? ''}
            className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1">微信号</label>
          <input
            type="text"
            name="wechatId"
            defaultValue={provider.wechatId ?? ''}
            className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="选填"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1">服务区域</label>
        <select
          name="districtId"
          defaultValue={provider.districtId ?? ''}
          className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">未选择</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1">详细地址</label>
        <input
          type="text"
          name="addressText"
          defaultValue={provider.addressText ?? ''}
          className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="选填"
        />
      </div>

      {provider.providerType === 'individual' && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700 block mb-1">性别</label>
            <select
              name="gender"
              defaultValue={provider.gender ?? ''}
              className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 block mb-1">年龄</label>
            <input
              type="number"
              name="age"
              defaultValue={provider.age ?? ''}
              className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="选填"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700 block mb-1">从业年限</label>
            <input
              type="number"
              name="yearsExperience"
              defaultValue={provider.yearsExperience ?? ''}
              className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="选填"
            />
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1">个人/机构简介</label>
        <textarea
          name="bio"
          defaultValue={provider.bio ?? ''}
          rows={4}
          className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          placeholder="介绍您的服务经验和专长"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <Save className="w-4 h-4" />
        {saving ? '保存中...' : '保存'}
      </button>
    </form>
  );
}
