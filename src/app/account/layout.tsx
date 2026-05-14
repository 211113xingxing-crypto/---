import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { AccountNav } from '@/components/account-nav';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false } };

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  const userId = verifyToken(token);
  if (userId === null || userId <= 0) redirect('/login');

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, nickname: true, phone: true },
  });

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">个人中心</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {user.nickname ?? `用户${user.id}`}
            </p>
          </div>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
            ← 返回首页
          </Link>
        </div>

        <div className="flex gap-6">
          <AccountNav />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
