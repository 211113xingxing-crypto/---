import { ProviderCardSkeletonGrid } from '@/components/provider-card-skeleton';

export default function CitySlugLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8" id="main-content">
      <div className="h-4 bg-zinc-100 rounded w-40 mb-6 animate-pulse" />
      <div className="h-9 bg-zinc-200 rounded w-72 mb-2 animate-pulse" />
      <div className="h-5 bg-zinc-100 rounded w-full max-w-2xl mb-4 animate-pulse" />
      <div className="h-4 bg-zinc-100 rounded w-32 mb-8 animate-pulse" />
      <div className="h-7 bg-zinc-200 rounded w-40 mb-4 animate-pulse" />
      <ProviderCardSkeletonGrid count={9} />
    </main>
  );
}
