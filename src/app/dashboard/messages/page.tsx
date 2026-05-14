'use client';

import { useState } from 'react';
import { ConversationList } from '@/components/chat/conversation-list';
import { ChatWindow } from '@/components/chat/chat-window';

export default function ProviderMessagesPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">消息</h1>
      {activeId ? (
        <ChatWindow
          conversationId={activeId}
          currentRole="provider"
          contactName={contactName}
          onBack={() => setActiveId(null)}
        />
      ) : (
        <ConversationList
          currentRole="provider"
          onSelect={(id, name) => {
            setActiveId(id);
            setContactName(name);
          }}
        />
      )}
    </div>
  );
}
