export default function ProviderDetailLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="h-4 bg-zinc-100 rounded w-40 mb-6 animate-pulse" />

      {/* Header card */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-6 animate-pulse">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 bg-zinc-200 rounded w-48" />
              <div className="h-5 bg-zinc-100 rounded-full w-16" />
            </div>
            <div className="h-4 bg-zinc-100 rounded w-64 mt-1" />
          </div>
          <div className="text-center">
            <div className="h-9 bg-zinc-200 rounded w-16" />
            <div className="h-3 bg-zinc-100 rounded w-12 mt-1 mx-auto" />
          </div>
        </div>
        <div className="h-4 bg-zinc-100 rounded w-40 mt-4" />
        <div className="flex gap-3 mt-5">
          <div className="h-10 bg-zinc-200 rounded-lg w-28" />
          <div className="h-10 bg-zinc-100 rounded-lg w-28" />
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-zinc-200 rounded w-24 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-zinc-100 rounded w-full" />
              <div className="h-4 bg-zinc-100 rounded w-5/6" />
              <div className="h-4 bg-zinc-100 rounded w-4/6" />
            </div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-zinc-200 rounded w-32 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between py-3 border-b last:border-0">
                <div>
                  <div className="h-5 bg-zinc-100 rounded w-40" />
                  <div className="h-3 bg-zinc-100 rounded w-24 mt-1" />
                </div>
                <div className="h-5 bg-zinc-100 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="bg-white border border-zinc-200 rounded-lg p-5 animate-pulse">
            <div className="h-5 bg-zinc-200 rounded w-20 mb-3" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 bg-zinc-100 rounded w-32 mt-2" />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
