'use client';

import { useEffect, useState, useCallback } from 'react';
import { MessageBubble } from './message-bubble';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  senderType: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Props {
  conversationId: number;
  currentRole: 'user' | 'provider';
  onBack?: () => void;
  contactName?: string;
}

export function ChatWindow({ conversationId, currentRole, onBack, contactName }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const fetchEndpoint = currentRole === 'provider'
    ? 'message.getProviderMessages'
    : 'message.getMessages';

  const sendEndpoint = currentRole === 'provider'
    ? 'message.sendAsProvider'
    : 'message.send';

  const markReadEndpoint = currentRole === 'provider'
    ? 'message.markReadAsProvider'
    : 'message.markRead';

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/trpc/${fetchEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });
      const data = await res.json();
      const msgs = data.result?.data;
      if (Array.isArray(msgs)) setMessages(msgs);
    } catch {
      // silently fail
    }
  }, [conversationId, fetchEndpoint]);

  // Initial load
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Short polling: every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Mark as read
  useEffect(() => {
    fetch(`/api/trpc/${markReadEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId }),
    }).catch(() => {});
  }, [conversationId, markReadEndpoint]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/trpc/${sendEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, content: input.trim() }),
      });
      setInput('');
      fetchMessages();
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white border border-zinc-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-zinc-400 hover:text-zinc-600 transition-colors md:hidden">
            ←
          </button>
        )}
        <div className="font-semibold text-zinc-900 text-sm">{contactName ?? '对话'}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-50">
        {messages.length === 0 && (
          <p className="text-center text-zinc-400 text-sm mt-8">暂无消息，发送第一条消息吧</p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            senderType={msg.senderType as 'user' | 'provider'}
            content={msg.content}
            time={new Date(msg.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          />
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-zinc-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="输入消息..."
          required
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex items-center gap-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
