import type { Metadata } from 'next';
import Link from 'next/link';
import { NewProviderForm } from './form';

export const metadata: Metadata = {
  title: '添加服务者 - 后台',
  robots: { index: false },
};

export default function NewProviderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/providers" className="text-sm text-emerald-700 hover:underline mb-1 block">
          &larr; 返回服务者列表
        </Link>
        <h1 className="text-2xl font-bold">添加服务者</h1>
      </div>
      <NewProviderForm />
    </div>
  );
}
