import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { db } from '@/server/db';
import { ProviderChatClient } from './client';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProviderMessageDetailPage({ params }: Props) {
  const { id } = await params;
  const conversationId = parseInt(id);

  const cookieStore = await cookies();
  const token = cookieStore.get('provider_token')?.value!;
  const accountId = -verifyToken(token)!;

  const account = await db.providerAccount.findUnique({ where: { id: accountId } });
  if (!account) redirect('/provider/login');

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: { user: { select: { id: true, nickname: true } } },
  });

  if (!conversation || conversation.providerId !== account.providerId) redirect('/dashboard/messages');

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">消息</h1>
      <ProviderChatClient
        conversationId={conversationId}
        contactName={conversation.user?.nickname ?? `用户${conversation.userId}`}
      />
    </div>
  );
}
