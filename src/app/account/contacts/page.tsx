import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AccountContactsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value!;
  const userId = verifyToken(token)!;

  const contacts = await db.contactRequest.findMany({
    where: { userId },
    include: {
      serviceProvider: {
        select: { id: true, name: true, slug: true, phone: true, wechatId: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900 mb-6">咨询记录</h2>
      {contacts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">暂无咨询记录</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {contacts.map((c) => (
              <div key={c.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <Link
                    href={`/provider/${c.serviceProvider.slug}`}
                    className="font-medium text-zinc-900 hover:text-emerald-600 transition-colors"
                  >
                    {c.serviceProvider.name}
                  </Link>
                  <span className="text-xs text-zinc-400">
                    {new Date(c.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="text-sm text-zinc-500">
                  {c.contactType === 'phone' ? '📞 电话咨询' : '💬 微信咨询'}
                </div>
                {c.contactInfoRevealed && c.serviceProvider.phone && (
                  <div className="text-sm text-emerald-600 mt-1">
                    联系电话: {c.serviceProvider.phone}
                    {c.serviceProvider.wechatId && ` · 微信: ${c.serviceProvider.wechatId}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
