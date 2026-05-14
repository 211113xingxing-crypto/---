import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { ServiceForm } from './form';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('provider_token')?.value!;
  const accountId = -verifyToken(token)!;

  const account = await db.providerAccount.findUnique({
    where: { id: accountId },
    include: { provider: { include: { listings: { include: { serviceType: true } }, serviceTypes: { include: { serviceType: true } } } } },
  });
  if (!account) redirect('/provider/login');

  const serviceTypes = await db.serviceType.findMany({ orderBy: { id: 'asc' } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">服务管理</h1>
      <ServiceForm
        provider={account.provider}
        listings={account.provider.listings}
        selectedTypeIds={account.provider.serviceTypes.map(st => st.serviceTypeId)}
        serviceTypes={serviceTypes}
      />
    </div>
  );
}
