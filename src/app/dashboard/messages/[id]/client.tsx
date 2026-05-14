'use client';

import { useRouter } from 'next/navigation';
import { ChatWindow } from '@/components/chat/chat-window';

export function ProviderChatClient({ conversationId, contactName }: { conversationId: number; contactName: string }) {
  const router = useRouter();

  return (
    <ChatWindow
      conversationId={conversationId}
      currentRole="provider"
      contactName={contactName}
      onBack={() => router.push('/dashboard/messages')}
    />
  );
}
