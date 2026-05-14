'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Heart, Stethoscope, Clock, Building2, HeartHandshake, Smile } from 'lucide-react';
import { SERVICE_TYPES } from '@/lib/constants';

const iconMap: Record<string, typeof Heart> = {
  hugong: Heart,
  peizhen: Stethoscope,
  'rijian-zhaoliao': Clock,
  'shuhou-kangfu': Heart,
  'xinli-weijie': Smile,
  yanglaoyuan: Building2,
  'linzhong-guanhuai': HeartHandshake,
};

interface MobileNavProps {
  citySlug?: string;
  cityName?: string;
}

export function MobileNav({ citySlug, cityName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const cityPath = citySlug ? `/${citySlug}` : null;
  const serviceLink = (slug: string) => cityPath ? `${cityPath}/${slug}` : `/search?type=${slug}`;

  // Close on Escape, trap focus
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key === 'Tab' && drawerRef.current) {
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus first link after animation
      setTimeout(() => {
        const first = drawerRef.current?.querySelector<HTMLElement>('a');
        first?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onKeyDown]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
      pathname === href || pathname.startsWith(href + '/')
        ? 'text-emerald-700 bg-emerald-50 font-medium'
        : 'text-zinc-700 hover:bg-zinc-50'
    }`;

  return (
    <>
      {/* Hamburger trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="md:hidden p-2.5 -mr-2 text-zinc-600 hover:text-zinc-900"
        aria-label="打开菜单"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out motion-reduce:transition-none md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-200">
          <span className="font-bold text-emerald-700">亲护</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900"
            aria-label="关闭菜单"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
          <Link href="/" className={linkClass('/')}>
            <Home className="w-4 h-4" />
            首页
          </Link>

          {cityName && (
            <Link href={cityPath ?? '/'} className={linkClass(cityPath ?? '/')}>
              <Home className="w-4 h-4" />
              {cityName}养老服务
            </Link>
          )}

          {cityPath && (
          <div className="pt-3 pb-1">
            <p className="px-4 text-xs text-zinc-400 uppercase tracking-wide mb-1">服务类型</p>
          </div>
          )}

          {SERVICE_TYPES.map((s) => {
            const Icon = iconMap[s.slug] ?? Heart;
            return (
              <Link key={s.slug} href={serviceLink(s.slug)} className={linkClass(cityPath ? `${cityPath}/${s.slug}` : '')}>
                <Icon className="w-4 h-4" />
                {s.name}
              </Link>
            );
          })}

          <div className="pt-3 pb-1">
            <p className="px-4 text-xs text-zinc-400 uppercase tracking-wide mb-1">实用指南</p>
          </div>

          <Link href="/guide/zhaohugong" className={linkClass('/guide/zhaohugong')}>
            找护工指南
          </Link>
          <Link href="/guide/jiage" className={linkClass('/guide/jiage')}>
            价格参考
          </Link>
          <Link href="/guide/xuanze" className={linkClass('/guide/xuanze')}>
            如何选择护工
          </Link>
        </nav>
      </div>
    </>
  );
}
