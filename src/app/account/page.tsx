import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import Link from 'next/link';
import { Heart, MessageSquare, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value!;
  const userId = verifyToken(token)!;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) redirect('/login');

  const [favoriteCount, contactCount, messageCount] = await Promise.all([
    db.favorite.count({ where: { userId } }),
    db.contactRequest.count({ where: { userId } }),
    db.message.count({
      where: {
        conversation: { userId },
        senderType: 'provider',
        isRead: false,
      },
    }),
  ]);

  const stats = [
    { label: '收藏服务者', value: favoriteCount, icon: Heart, href: '/account/favorites', color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: '咨询记录', value: contactCount, icon: Phone, href: '/account/contacts', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '未读消息', value: messageCount, icon: MessageSquare, href: '/account/messages', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900 mb-6">概览</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
            <div className="text-sm text-zinc-500">{s.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
