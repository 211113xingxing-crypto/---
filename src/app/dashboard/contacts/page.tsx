import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { ContactActions } from './actions';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('provider_token')?.value!;
  const accountId = -verifyToken(token)!;

  const account = await db.providerAccount.findUnique({
    where: { id: accountId },
    include: { provider: true },
  });
  if (!account) redirect('/provider/login');

  const contacts = await db.contactRequest.findMany({
    where: { providerId: account.providerId },
    include: { user: { select: { id: true, nickname: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">咨询管理</h1>
      {contacts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">暂无咨询记录</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {contacts.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-zinc-900">
                    {c.user?.nickname ?? `用户${c.user?.id ?? '未知'}`}
                  </div>
                  <div className="text-sm text-zinc-500 mt-0.5">
                    {c.contactType === 'phone' ? '电话咨询' : '微信咨询'} · {new Date(c.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                  {c.contactInfoRevealed && c.user?.phone && (
                    <div className="text-sm text-emerald-600 mt-1">电话: {c.user.phone}</div>
                  )}
                </div>
                <ContactActions requestId={c.id} revealed={c.contactInfoRevealed} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
