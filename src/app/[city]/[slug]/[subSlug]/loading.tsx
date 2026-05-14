import { ProviderCardSkeletonGrid } from '@/components/provider-card-skeleton';

export default function CityDistrictServiceLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="h-4 bg-zinc-100 rounded w-48 mb-6 animate-pulse" />
      <div className="h-9 bg-zinc-200 rounded w-80 mb-2 animate-pulse" />
      <div className="h-5 bg-zinc-100 rounded w-full max-w-3xl mb-8 animate-pulse" />
      <ProviderCardSkeletonGrid count={6} />
    </main>
  );
}
