import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('provider_token')?.value;

  if (!token) redirect('/provider/login');

  const userId = verifyToken(token);
  if (userId === null || userId >= 0) redirect('/provider/login');

  const accountId = -userId;

  const account = await db.providerAccount.findUnique({
    where: { id: accountId },
    include: { provider: true },
  });

  if (!account) redirect('/provider/login');

  const { provider } = account;

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Desktop sidebar */}
      <DashboardSidebar
        providerName={provider.name}
        providerStatus={provider.status}
      />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
