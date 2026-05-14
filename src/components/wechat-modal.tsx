'use client';

import { useState, useCallback, useEffect } from 'react';
import { MessageCircle, X, Copy, Check } from 'lucide-react';

export function WeChatModal({ wechatId, children }: { wechatId: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onKeyDown]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
      const el = document.getElementById('wechat-id-text');
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer">{children}</span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          微信联系
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl transform transition-all duration-200 motion-reduce:transition-none"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="微信联系"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-zinc-900">微信联系</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-zinc-500 mb-4">添加以下微信号联系服务者：</p>

            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 mb-4 text-center">
              <span id="wechat-id-text" className="text-lg font-mono font-medium text-zinc-900 select-all">
                {wechatId}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制微信号
                </>
              )}
            </button>

            <p className="text-xs text-zinc-400 mt-3 text-center">
              请打开微信，搜索此微信号添加好友
            </p>
          </div>
        </div>
      )}
    </>
  );
}
