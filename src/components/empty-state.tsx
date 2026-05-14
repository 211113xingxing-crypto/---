import Link from 'next/link';
import { Search } from 'lucide-react';

interface Suggestion {
  label: string;
  href: string;
}

interface EmptyStateProps {
  title: string;
  message: string;
  suggestions?: Suggestion[];
}

export function EmptyState({ title, message, suggestions }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-zinc-300" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-800 mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">{message}</p>
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm hover:border-emerald-300 hover:bg-emerald-50 transition-all"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
