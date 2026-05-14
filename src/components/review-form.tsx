'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { trpc } from '@/lib/trpc/client';

const TAG_OPTIONS = ['细心负责', '专业', '耐心', '态度好', '有经验', '会做饭', '有爱心', '可靠', '沟通好', '24小时尽心'];

interface Props {
  providerSlug: string;
}

export function ReviewForm({ providerSlug }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const utils = trpc.useUtils();

  const createMutation = trpc.review.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      utils.review.listByProvider.invalidate({ providerSlug });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('请选择评分');
      return;
    }
    setError('');
    createMutation.mutate({
      providerSlug,
      rating,
      content: content.trim() || undefined,
      tags,
    });
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <p className="text-emerald-700 font-medium">评价提交成功，感谢你的分享！</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setRating(0);
            setContent('');
            setTags([]);
          }}
          className="mt-3 text-sm text-emerald-600 hover:underline"
        >
          再写一条评价
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-lg p-6">
      <h3 className="font-semibold text-zinc-900 mb-4">写评价</h3>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-4" role="radiogroup" aria-label="评分">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1"
            aria-label={`${star}星`}
          >
            <Star
              className={`w-9 h-9 transition-colors ${
                (hoverRating || rating) >= star
                  ? 'text-amber-500 fill-current'
                  : 'text-zinc-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-zinc-400">
          {rating > 0 ? `${rating} 分` : '点击评分'}
        </span>
      </div>

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="分享你的服务体验，帮助其他家庭做出更好的选择..."
        rows={4}
        className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 my-3">
        {TAG_OPTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              tags.includes(tag)
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        <Send className="w-4 h-4" />
        {createMutation.isPending ? '提交中...' : '提交评价'}
      </button>
    </form>
  );
}
