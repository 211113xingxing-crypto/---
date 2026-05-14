'use client';

import { useState } from 'react';
import { Share2, Link, Check, X } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

export function ShareButton({ title, url, className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleWechatShare() {
    // On WeChat, the share is handled by the WeChat JS-SDK
    // For non-WeChat, show instructions
    setIsOpen(false);
    if (typeof window !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent)) {
      // WeChat environment — try native share
      if (navigator.share) {
        navigator.share({ title, url }).catch(() => {});
      }
    } else {
      // Show copy confirmation
      handleCopyLink();
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors ${className}`}
        aria-label="分享"
      >
        <Share2 className="w-4 h-4" />
        <span>分享</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-zinc-900 mb-1">分享此页面</h3>
            <p className="text-sm text-zinc-500 mb-5 truncate">{title}</p>

            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors text-sm"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Link className="w-5 h-5 text-zinc-600" />
                )}
                <span>{copied ? '链接已复制' : '复制链接'}</span>
              </button>
              <button
                onClick={handleWechatShare}
                className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.238 4.725c-2.486 0-4.513 2.056-4.513 4.585 0 2.53 2.027 4.586 4.513 4.586.344 0 .664-.052.974-.143a.736.736 0 01.595.082l1.304.763a.233.233 0 00.12.04c.12 0 .212-.095.212-.212 0-.05-.02-.098-.035-.147l-.268-1.014a.656.656 0 01.158-.581C19.357 17.56 20.149 16.26 20.149 15c0-2.53-2.027-4.585-4.513-4.585zm-2.164 2.86c.443 0 .802.368.802.823a.813.813 0 01-.802.823.813.813 0 01-.802-.823c0-.455.359-.823.802-.823zm4.329 0c.443 0 .802.368.802.823a.813.813 0 01-.802.823.813.813 0 01-.802-.823c0-.455.359-.823.802-.823z" />
                </svg>
                <span>微信分享</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
