'use client';

import { Heart } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';

interface FavoriteButtonProps {
  providerId: number;
  className?: string;
  showLabel?: boolean;
}

export function FavoriteButton({ providerId, className = '', showLabel }: FavoriteButtonProps) {
  const utils = trpc.useUtils();

  const { data: isFavorited, isLoading } = trpc.favorite.check.useQuery(
    { providerId },
    { enabled: true }
  );

  const toggleMutation = trpc.favorite.toggle.useMutation({
    onMutate: async () => {
      // Optimistic update
      await utils.favorite.check.cancel({ providerId });
      return { previous: utils.favorite.check.getData({ providerId }) };
    },
    onError: (_err, _vars, context) => {
      // Rollback
      utils.favorite.check.setData({ providerId }, context?.previous);
    },
    onSettled: () => {
      utils.favorite.check.invalidate({ providerId });
    },
  });

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (toggleMutation.isPending) return;
    toggleMutation.mutate({ providerId });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 transition-colors ${
        isFavorited
          ? 'text-red-500 hover:text-red-600'
          : 'text-zinc-400 hover:text-red-500'
      } ${className}`}
      aria-label={isFavorited ? '取消收藏' : '收藏'}
    >
      <Heart
        className={`w-5 h-5 transition-all ${isFavorited ? 'fill-current scale-110' : ''}`}
      />
      {showLabel && (
        <span className="text-sm">{isFavorited ? '已收藏' : '收藏'}</span>
      )}
    </button>
  );
}
