import { ProviderCardSkeletonGrid } from '@/components/provider-card-skeleton';

export default function SearchLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-12 bg-zinc-100 rounded-lg max-w-2xl mx-auto animate-pulse" />
      </div>
      <div className="h-7 bg-zinc-200 rounded w-48 mb-1 animate-pulse" />
      <div className="h-4 bg-zinc-100 rounded w-32 mb-6 animate-pulse" />
      <ProviderCardSkeletonGrid count={6} />
    </main>
  );
}
