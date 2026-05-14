'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ReviewActions({ reviewId }: { reviewId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState<'delete' | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAction(action: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'delete' ? undefined : JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch {
      alert('操作失败');
    } finally {
      setLoading(false);
      setConfirming(null);
    }
  }

  if (confirming === 'delete') {
    return (
      <div className="flex gap-1">
        <button
          onClick={() => handleAction('delete')}
          disabled={loading}
          className="text-red-600 hover:underline text-xs disabled:opacity-50"
        >
          {loading ? '删除中...' : '确认'}
        </button>
        <button
          onClick={() => setConfirming(null)}
          className="text-zinc-400 hover:text-zinc-600 text-xs"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction('approve')}
        disabled={loading}
        className="text-emerald-600 hover:text-emerald-800 text-xs disabled:opacity-50"
      >
        标记真实
      </button>
      <button
        onClick={() => handleAction('unverify')}
        disabled={loading}
        className="text-amber-500 hover:text-amber-700 text-xs disabled:opacity-50"
      >
        取消标记
      </button>
      <button
        onClick={() => setConfirming('delete')}
        disabled={loading}
        className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
      >
        删除
      </button>
    </div>
  );
}
