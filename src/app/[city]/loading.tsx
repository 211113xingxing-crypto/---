import { ProviderCardSkeletonGrid } from '@/components/provider-card-skeleton';

export default function CityLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-zinc-100 rounded w-32 mb-6 animate-pulse" />

      {/* Title skeleton */}
      <div className="h-9 bg-zinc-200 rounded w-64 mb-2 animate-pulse" />
      <div className="h-5 bg-zinc-100 rounded w-full max-w-3xl mb-8 animate-pulse" />

      {/* District pills skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 w-20 bg-zinc-100 rounded-full animate-pulse" />
        ))}
      </div>

      {/* Service type pills skeleton */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-zinc-100 rounded-full animate-pulse" />
        ))}
      </div>

      <div className="h-7 bg-zinc-200 rounded w-40 mb-4 animate-pulse" />
      <ProviderCardSkeletonGrid count={9} />
    </main>
  );
}
