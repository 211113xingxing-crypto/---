'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export function ContactActions({ requestId, revealed }: { requestId: number; revealed: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReveal() {
    setLoading(true);
    try {
      const res = await fetch('/api/trpc/dashboard.revealContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      if (res.ok) router.refresh();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  if (revealed) {
    return (
      <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1">
        <EyeOff className="w-3 h-3" /> 已公开
      </span>
    );
  }

  return (
    <button
      onClick={handleReveal}
      disabled={loading}
      className="text-xs px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-1"
    >
      <Eye className="w-3 h-3" />
      {loading ? '处理中...' : '公开联系方式'}
    </button>
  );
}
