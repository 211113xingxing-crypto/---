'use client';

import { useState } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';

interface ContactModalProps {
  providerId: number;
  providerName: string;
  contactTypes: Array<'phone' | 'wechat' | 'message'>;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ providerId, providerName, contactTypes, isOpen, onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleContact(type: 'phone' | 'wechat' | 'message') {
    setError('');
    try {
      const res = await fetch('/api/trpc/provider.contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, contactType: type }),
      });
      if (!res.ok) throw new Error('请求失败，请稍后重试');
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '请求失败');
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">📩</div>
            <h3 className="font-semibold text-zinc-900 mb-2">联系请求已发送</h3>
            <p className="text-sm text-zinc-500">
              {providerName}将尽快与您联系。请留意您的电话或微信消息。
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
            >
              关闭
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-zinc-900 mb-1">联系 {providerName}</h3>
            <p className="text-sm text-zinc-500 mb-5">
              选择联系方式，服务者将收到通知。为保护隐私，联系方式不会直接公开。
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <div className="space-y-3">
              {contactTypes.includes('phone') && (
                <button
                  onClick={() => handleContact('phone')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                >
                  <Phone className="w-5 h-5" />
                  <div className="text-left">
                    <div>电话联系</div>
                    <div className="text-xs text-emerald-500 font-normal">服务者将收到您的联系请求</div>
                  </div>
                </button>
              )}
              {contactTypes.includes('wechat') && (
                <button
                  onClick={() => handleContact('wechat')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div>微信联系</div>
                    <div className="text-xs text-green-500 font-normal">服务者将收到微信联系请求</div>
                  </div>
                </button>
              )}
              {contactTypes.includes('message') && (
                <button
                  onClick={() => handleContact('message')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div>发送消息</div>
                    <div className="text-xs text-blue-500 font-normal">通过平台留言联系服务者</div>
                  </div>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function useContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
}
