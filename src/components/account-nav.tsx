'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Heart, MessageSquare, Phone, LogOut } from 'lucide-react';

const navItems = [
  { href: '/account', label: '概览', icon: User },
  { href: '/account/favorites', label: '收藏', icon: Heart },
  { href: '/account/messages', label: '消息', icon: MessageSquare },
  { href: '/account/contacts', label: '咨询记录', icon: Phone },
];

export function AccountNav() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <nav className="hidden md:block w-48 flex-shrink-0">
      <div className="bg-white border border-zinc-200 rounded-xl p-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </nav>
  );
}
