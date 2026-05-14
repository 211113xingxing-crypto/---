'use client';

import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';
import { ProviderCard } from '@/components/provider-card';
import { ProviderCardSkeletonGrid } from '@/components/provider-card-skeleton';

export function FavoritesList() {
  const { data: favorites, isLoading, error } = trpc.favorite.list.useQuery();

  if (isLoading) {
    return <ProviderCardSkeletonGrid count={4} />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Heart className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-zinc-800 mb-2">请先登录</h2>
        <p className="text-zinc-500 text-sm mb-6">登录后即可查看收藏的服务者</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-zinc-800 mb-2">暂无收藏</h2>
        <p className="text-zinc-500 text-sm mb-6">
          浏览服务者时，点击心形图标即可收藏
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          浏览服务者
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((f: any) => (
        <div key={f.id} className="relative">
          <ProviderCard provider={f.provider} />
        </div>
      ))}
    </div>
  );
}
