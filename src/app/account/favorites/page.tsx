import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import Link from 'next/link';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountFavoritesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value!;
  const userId = verifyToken(token)!;

  const favorites = await db.favorite.findMany({
    where: { userId },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
          providerType: true,
          avgRating: true,
          reviewCount: true,
          addressText: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900 mb-6">我的收藏</h2>
      {favorites.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500 mb-4">暂无收藏</p>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            去首页浏览服务者 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => (
            <Link
              key={fav.provider.id}
              href={`/provider/${fav.provider.slug}`}
              className="block bg-white border border-zinc-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-zinc-900">{fav.provider.name}</div>
                  <div className="text-sm text-zinc-500 mt-0.5">
                    {fav.provider.providerType === 'individual' ? '个人护工' : '护理机构'}
                    {fav.provider.addressText && ` · ${fav.provider.addressText}`}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{fav.provider.avgRating.toFixed(1)}</span>
                  <span className="text-zinc-400">({fav.provider.reviewCount})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
