import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoutButton } from '@/components/admin-logout';
import { AdminMobileNav } from '@/components/admin-mobile-nav';

export const metadata: Metadata = {
  title: { template: '%s | 安养后台', default: '后台管理' },
  robots: { index: false },
};

const navLinks = [
  { href: '/admin', label: '概览' },
  { href: '/admin/providers', label: '服务者管理' },
  { href: '/admin/providers/new', label: '添加服务者' },
  { href: '/admin/reviews', label: '评价管理' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-56 bg-white border-r border-zinc-200 flex-col shrink-0">
        <div className="p-4 border-b border-zinc-100">
          <Link href="/admin" className="text-lg font-bold text-emerald-700">
            安养后台
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2 rounded-md text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-100">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile nav */}
      <AdminMobileNav links={navLinks} />

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
