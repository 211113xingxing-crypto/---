import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { Users, MessageSquare, Star, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('provider_token')?.value!;
  const accountId = -verifyToken(token)!;

  const account = await db.providerAccount.findUnique({
    where: { id: accountId },
    include: { provider: true },
  });
  if (!account) redirect('/provider/login');

  const { provider } = account;

  // Fetch stats
  const [contactCount, reviewCount, unreadMessageCount] = await Promise.all([
    db.contactRequest.count({ where: { providerId: provider.id } }),
    db.review.count({ where: { providerId: provider.id } }),
    db.message.count({
      where: {
        conversation: { providerId: provider.id },
        senderType: 'user',
        isRead: false,
      },
    }),
  ]);

  const stats = [
    { label: '总咨询数', value: contactCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '评价数', value: reviewCount, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '未读消息', value: unreadMessageCount, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '评分', value: provider.avgRating.toFixed(1), icon: Eye, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">
        欢迎回来，{provider.name}
      </h1>
      <p className="text-zinc-500 text-sm mb-8">
        {provider.status === 'pending'
          ? '您的账户正在审核中，审核通过后将公开展示'
          : provider.status === 'suspended'
          ? '您的账户已被停用，请联系客服'
          : '管理您的服务信息、咨询和评价'}
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-zinc-200 rounded-xl p-5">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
            <div className="text-sm text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a
            href="/dashboard/profile"
            className="p-4 border border-zinc-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all text-center text-sm font-medium text-zinc-700"
          >
            编辑个人资料
          </a>
          <a
            href="/dashboard/services"
            className="p-4 border border-zinc-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all text-center text-sm font-medium text-zinc-700"
          >
            管理服务项目
          </a>
          <a
            href="/dashboard/messages"
            className="p-4 border border-zinc-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all text-center text-sm font-medium text-zinc-700"
          >
            查看消息
          </a>
          <a
            href={`/provider/${provider.slug}`}
            target="_blank"
            className="p-4 border border-zinc-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all text-center text-sm font-medium text-zinc-700"
          >
            查看公开页面 ↗
          </a>
        </div>
      </div>
    </div>
  );
}
