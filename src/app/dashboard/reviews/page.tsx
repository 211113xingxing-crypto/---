import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { ReviewReplyForm } from './reply-form';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('provider_token')?.value!;
  const accountId = -verifyToken(token)!;

  const account = await db.providerAccount.findUnique({
    where: { id: accountId },
    include: { provider: true },
  });
  if (!account) redirect('/provider/login');

  const reviews = await db.review.findMany({
    where: { providerId: account.providerId },
    include: { user: { select: { id: true, nickname: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">评价管理</h1>
      {reviews.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">暂无评价</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-zinc-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-zinc-900">
                  {r.user?.nickname ?? `用户${r.userId}`}
                </span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-xs text-zinc-400">
                  {new Date(r.createdAt).toLocaleDateString('zh-CN')}
                </span>
                {r.isVerifiedBooking && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded">真实服务</span>
                )}
              </div>
              {r.content && <p className="text-sm text-zinc-700 mb-3">{r.content}</p>}
              {r.tags.length > 0 && (
                <div className="flex gap-1 mb-3">
                  {r.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
              {r.reply ? (
                <div className="bg-emerald-50 rounded-lg p-3 mt-2">
                  <div className="text-xs text-emerald-600 font-medium mb-0.5">我的回复</div>
                  <p className="text-sm text-zinc-700">{r.reply}</p>
                </div>
              ) : (
                <ReviewReplyForm reviewId={r.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
