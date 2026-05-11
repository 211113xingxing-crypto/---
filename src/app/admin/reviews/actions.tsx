'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ReviewActions({ reviewId }: { reviewId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch {
      alert('删除失败');
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 hover:underline text-xs disabled:opacity-50"
        >
          {deleting ? '删除中...' : '确认'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-zinc-400 hover:text-zinc-600 text-xs"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-red-500 hover:text-red-700 text-xs"
    >
      删除
    </button>
  );
}
