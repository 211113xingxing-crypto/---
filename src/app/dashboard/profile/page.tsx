import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { ProfileForm } from './form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('provider_token')?.value!;
  const accountId = -verifyToken(token)!;

  const account = await db.providerAccount.findUnique({
    where: { id: accountId },
    include: { provider: true },
  });
  if (!account) redirect('/provider/login');

  const { provider } = account;
  const districts = await db.district.findMany({
    where: { cityId: provider.cityId, level: 'district' },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">编辑资料</h1>
      <ProfileForm provider={provider} districts={districts} />
    </div>
  );
}
