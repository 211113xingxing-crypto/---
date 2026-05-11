import Link from 'next/link';
import { Star, ShieldCheck, Phone, MapPin } from 'lucide-react';

interface ProviderCardProps {
  provider: {
    id: number;
    name: string;
    slug: string;
    providerType: string;
    avgRating: number;
    reviewCount: number;
    yearsExperience: number | null;
    verified: boolean;
    addressText: string | null;
    bio: string | null;
    district: { name: string; slug: string } | null;
    listings: Array<{
      title: string;
      price: number | null;
      priceUnit: string | null;
      serviceType: { name: string; slug: string };
    }>;
    verifications: Array<{ verifyType: string }>;
  };
}

function priceLabel(price: number, unit: string | null): string {
  switch (unit) {
    case 'hour':
      return `${price}元/小时`;
    case 'day':
      return `${price}元/天`;
    case 'month':
      return `${price}元/月`;
    case 'per_visit':
      return `${price}元/次`;
    default:
      return `${price}元`;
  }
}

function providerTypeLabel(type: string): string {
  return type === 'individual' ? '个人护工' : '护理机构';
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const ratingDisplay = provider.avgRating > 0 ? provider.avgRating.toFixed(1) : '新入驻';

  return (
    <Link
      href={`/provider/${provider.slug}`}
      className="block bg-white rounded-lg border border-zinc-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-900">{provider.name}</h3>
            {provider.verified && (
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-label="已认证" />
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {providerTypeLabel(provider.providerType)}
            {provider.yearsExperience && ` · ${provider.yearsExperience}年经验`}
          </p>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium text-zinc-900 text-sm">{ratingDisplay}</span>
          {provider.reviewCount > 0 && (
            <span className="text-xs text-zinc-400">({provider.reviewCount})</span>
          )}
        </div>
      </div>

      {provider.bio && (
        <p className="text-sm text-zinc-600 line-clamp-2 mb-3">{provider.bio}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {provider.listings.slice(0, 3).map((listing, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full"
          >
            {listing.serviceType.name}
            {listing.price && (
              <span className="text-emerald-500">
                {priceLabel(listing.price, listing.priceUnit)}
              </span>
            )}
          </span>
        ))}
        {provider.listings.length > 3 && (
          <span className="text-xs text-zinc-400 py-0.5">
            +{provider.listings.length - 3}项
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {provider.district?.name ?? provider.addressText ?? '上海市'}
        </span>
        <span className="flex items-center gap-1 text-emerald-600">
          <Phone className="w-3 h-3" />
          查看联系方式
        </span>
      </div>
    </Link>
  );
}
