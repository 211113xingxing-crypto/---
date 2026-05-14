'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortOption {
  label: string;
  value: string;
}

const SORT_OPTIONS: SortOption[] = [
  { label: '综合排序', value: 'rating' },
  { label: '评价最多', value: 'reviews' },
  { label: '经验最长', value: 'experience' },
  { label: '价格从低到高', value: 'price_asc' },
];

export function SortControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? 'rating';

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'rating') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2 mb-4 overflow-x-auto">
      <span className="text-sm text-zinc-400 mr-1">排序：</span>
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSort(option.value)}
          className={`px-3 py-2.5 min-h-[44px] rounded-full text-sm border transition-all ${
            currentSort === option.value
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-zinc-600 border-zinc-200 hover:border-emerald-300'
          }`}
          aria-pressed={currentSort === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
