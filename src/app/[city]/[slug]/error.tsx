'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CitySlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ city?: string }>();
  const city = params?.city ?? '';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center py-20 px-4" id="main-content">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-900 mb-2">页面加载失败</h2>
        <p className="text-zinc-500 mb-6 text-sm">
          数据暂时无法加载，请稍后重试。
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
          >
            重试
          </button>
          <Link href={`/${city}`} className="px-4 py-2 border border-zinc-300 rounded-lg text-sm hover:bg-zinc-50">
            返回城市首页
          </Link>
        </div>
      </div>
    </main>
  );
}
