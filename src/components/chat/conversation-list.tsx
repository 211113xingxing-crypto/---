'use client';

import { useEffect, useState } from 'react';

interface Conversation {
  id: number;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  user?: { id: number; nickname?: string | null; avatarUrl?: string | null };
  provider?: { id: number; name?: string; avatarUrl?: string | null };
}

interface Props {
  currentRole: 'user' | 'provider';
  activeId?: number;
  onSelect: (id: number, name: string) => void;
}

export function ConversationList({ currentRole, activeId, onSelect }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const endpoint = currentRole === 'provider'
    ? 'message.getProviderConversations'
    : 'message.getConversations';

  async function fetchConversations() {
    try {
      const res = await fetch(`/api/trpc/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      const items = data.result?.data;
      if (Array.isArray(items)) setConversations(items);
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [endpoint]);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-100">
        <h2 className="font-semibold text-zinc-900">消息</h2>
      </div>
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-sm text-zinc-400">暂无会话</div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {conversations.map((conv) => {
            const name = currentRole === 'provider'
              ? (conv.user?.nickname ?? `用户${conv.user?.id}`)
              : (conv.provider?.name ?? '服务者');
            const isActive = conv.id === activeId;

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id, name)}
                className={`w-full text-left p-4 hover:bg-zinc-50 transition-colors ${
                  isActive ? 'bg-emerald-50 border-l-2 border-emerald-500' : ''
                }`}
              >
                <div className="font-medium text-zinc-900 text-sm">{name}</div>
                {conv.lastMessage && (
                  <div className="text-xs text-zinc-500 mt-0.5 truncate">{conv.lastMessage}</div>
                )}
                {conv.lastMessageAt && (
                  <div className="text-xs text-zinc-400 mt-1">
                    {new Date(conv.lastMessageAt).toLocaleDateString('zh-CN')}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
