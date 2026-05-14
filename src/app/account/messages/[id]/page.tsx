'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { ChatWindow } from '@/components/chat/chat-window';

export default function AccountMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const conversationId = parseInt(id);
  const [contactName, setContactName] = useState('对话');

  useEffect(() => {
    fetch('/api/trpc/message.getConversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then(r => r.json())
      .then(data => {
        const convs = data.result?.data;
        if (Array.isArray(convs)) {
          const conv = convs.find((c: { id: number }) => c.id === conversationId);
          if (conv?.provider?.name) setContactName(conv.provider.name);
        }
      })
      .catch(() => {});
  }, [conversationId]);

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900 mb-6">消息</h2>
      <ChatWindow
        conversationId={conversationId}
        currentRole="user"
        contactName={contactName}
        onBack={() => router.push('/account/messages')}
      />
    </div>
  );
}
