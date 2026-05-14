import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-sm text-zinc-500 mb-6" aria-label="面包屑导航">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && (
            <ChevronRight className="w-3 h-3 inline mx-1.5 text-zinc-300" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-emerald-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900 font-medium" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
