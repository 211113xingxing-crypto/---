'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { WeChatModal } from './wechat-modal';

export function MobileCta({ phone, wechatId }: { phone: string | null; wechatId: string | null }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-4 py-3 z-40 transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex gap-3 max-w-lg mx-auto">
          {phone && (
            <a
              href={`tel:${phone.replace(/\*/g, '')}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              拨打电话
            </a>
          )}
          {wechatId && (
            <WeChatModal wechatId={wechatId}>
              <span className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-emerald-600 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                微信联系
              </span>
            </WeChatModal>
          )}
        </div>
      </div>
    </>
  );
}
