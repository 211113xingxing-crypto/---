'use client';

import { useState } from 'react';
import { ConversationList } from '@/components/chat/conversation-list';
import { ChatWindow } from '@/components/chat/chat-window';

export default function AccountMessagesPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-900 mb-6">消息</h2>
      {activeId ? (
        <ChatWindow
          conversationId={activeId}
          currentRole="user"
          contactName={contactName}
          onBack={() => setActiveId(null)}
        />
      ) : (
        <ConversationList
          currentRole="user"
          onSelect={(id, name) => {
            setActiveId(id);
            setContactName(name);
          }}
        />
      )}
    </div>
  );
}
