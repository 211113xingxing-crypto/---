export function ProviderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-zinc-200 rounded w-32" />
            <div className="h-4 w-4 bg-zinc-200 rounded" />
          </div>
          <div className="h-3 bg-zinc-100 rounded w-24 mt-1.5" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 bg-zinc-200 rounded" />
          <div className="h-4 bg-zinc-200 rounded w-8" />
        </div>
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-3 bg-zinc-100 rounded w-full" />
        <div className="h-3 bg-zinc-100 rounded w-3/4" />
      </div>
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 bg-zinc-100 rounded-full w-16" />
        <div className="h-5 bg-zinc-100 rounded-full w-20" />
        <div className="h-5 bg-zinc-100 rounded-full w-14" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-zinc-100 rounded w-20" />
        <div className="h-3 bg-zinc-100 rounded w-20" />
      </div>
    </div>
  );
}

export function ProviderCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </div>
  );
}
