'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { WeChatModal } from '@/components/wechat-modal';
import { ContactModal } from '@/components/contact-modal';

interface ProviderCtaProps {
  providerId: number;
  providerName: string;
  phone: string | null;
  wechatId: string | null;
}

export function ProviderCta({ providerId, providerName, phone, wechatId }: ProviderCtaProps) {
  const [contactOpen, setContactOpen] = useState(false);

  const contactTypes: Array<'phone' | 'wechat' | 'message'> = [];
  if (phone) contactTypes.push('phone');
  if (wechatId) contactTypes.push('wechat');
  contactTypes.push('message');

  return (
    <>
      <div className="flex gap-3 mt-5">
        {(phone || true) && (
          <button
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            联系服务者
          </button>
        )}
        {wechatId && (
          <WeChatModal wechatId={wechatId} />
        )}
      </div>

      <ContactModal
        providerId={providerId}
        providerName={providerName}
        contactTypes={contactTypes}
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
