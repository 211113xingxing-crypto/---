import Link from 'next/link';
import { Heart, User } from 'lucide-react';
import { MobileNav } from './mobile-nav';

export function Header({ citySlug, cityName }: { citySlug?: string; cityName?: string }) {
  const cityPath = citySlug ? `/${citySlug}` : null;

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-emerald-700 tracking-tight">
          亲护
        </Link>
        <div className="hidden md:flex items-center gap-5 text-sm text-zinc-600">
          {cityName && cityPath ? (
            <Link href={cityPath} className="hover:text-emerald-700 transition-colors">
              {cityName}
            </Link>
          ) : (
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              首页
            </Link>
          )}
          {cityPath && (
            <>
              <Link href={`${cityPath}/hugong`} className="hover:text-emerald-700 transition-colors">
                居家护理
              </Link>
              <Link href={`${cityPath}/yanglaoyuan`} className="hover:text-emerald-700 transition-colors">
                养老院
              </Link>
              <Link href={`${cityPath}/peizhen`} className="hover:text-emerald-700 transition-colors">
                陪诊服务
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/favorites"
            className="text-zinc-400 hover:text-red-500 transition-colors"
            aria-label="我的收藏"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <Link
            href="/profile"
            className="text-zinc-400 hover:text-emerald-600 transition-colors"
            aria-label="个人中心"
          >
            <User className="w-5 h-5" />
          </Link>
          <MobileNav citySlug={citySlug} cityName={cityName} />
        </div>
      </nav>
    </header>
  );
}
