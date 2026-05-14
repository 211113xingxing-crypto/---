'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Briefcase,
  MessageSquare,
  Star,
  Phone,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  providerName: string;
  providerStatus: string;
}

const navItems = [
  { href: '/dashboard', label: '概览', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: '编辑资料', icon: User },
  { href: '/dashboard/services', label: '服务管理', icon: Briefcase },
  { href: '/dashboard/messages', label: '消息', icon: MessageSquare },
  { href: '/dashboard/contacts', label: '咨询管理', icon: Phone },
  { href: '/dashboard/reviews', label: '评价管理', icon: Star },
];

const statusLabel: Record<string, string> = {
  pending: '审核中',
  active: '已认证',
  suspended: '已停用',
};

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  suspended: 'bg-red-100 text-red-700',
};

export function DashboardSidebar({ providerName, providerStatus }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/provider/logout', { method: 'POST' });
    window.location.href = '/provider/login';
  }

  const sidebarContent = (
    <div className="w-64 min-h-screen bg-white border-r border-zinc-200 flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-zinc-100">
        <div className="font-bold text-zinc-900 text-lg">安养后台</div>
        <div className="text-sm text-zinc-500 mt-0.5 truncate">{providerName}</div>
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1.5 ${statusColor[providerStatus] ?? 'bg-zinc-100 text-zinc-500'}`}>
          {statusLabel[providerStatus] ?? providerStatus}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
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
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-zinc-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-white border border-zinc-200 rounded-lg shadow-sm"
        aria-label="打开菜单"
      >
        <Menu className="w-5 h-5 text-zinc-600" />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-white border border-zinc-200"
              aria-label="关闭菜单"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
