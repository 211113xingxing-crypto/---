import { ProviderCardSkeletonGrid } from '@/components/provider-card-skeleton';

export default function HomeLoading() {
  return (
    <main id="main-content">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center animate-pulse">
          <div className="h-10 bg-zinc-200 rounded w-96 mx-auto mb-4" />
          <div className="h-6 bg-zinc-100 rounded w-80 mx-auto mb-8" />
          <div className="h-12 bg-zinc-200 rounded-lg max-w-2xl mx-auto" />
        </div>
      </section>

      {/* City grid skeleton */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="h-7 bg-zinc-200 rounded w-24 mb-6 animate-pulse" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="h-10 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* District skeleton */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-7 bg-zinc-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Provider cards skeleton */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-7 bg-zinc-200 rounded w-40 mb-6 animate-pulse" />
          <ProviderCardSkeletonGrid count={6} />
        </div>
      </section>
    </main>
  );
}
