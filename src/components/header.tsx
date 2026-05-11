import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-emerald-700">
          养老本地服务
        </Link>
        <div className="flex items-center gap-4 text-sm text-zinc-600">
          <Link href="/shanghai" className="hover:text-emerald-700 transition-colors">
            上海
          </Link>
          <Link href="/shanghai/hugong" className="hover:text-emerald-700 transition-colors">
            居家护理
          </Link>
          <Link href="/shanghai/peizhen" className="hover:text-emerald-700 transition-colors">
            陪诊服务
          </Link>
        </div>
      </nav>
    </header>
  );
}
