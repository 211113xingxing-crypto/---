'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export function ReviewReplyForm({ reviewId }: { reviewId: number }) {
  const router = useRouter();
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/trpc/dashboard.replyToReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, reply: reply.trim() }),
      });
      if (!res.ok) throw new Error('回复失败');
      setReply('');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '回复失败');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        placeholder="回复此评价..."
        required
      />
      <button
        type="submit"
        disabled={sending}
        className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <Send className="w-4 h-4" />
        {sending ? '发送中' : '回复'}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </form>
  );
}
