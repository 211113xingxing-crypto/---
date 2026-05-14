import { BASE_URL } from '@/lib/env';

interface ProviderSchemaProps {
  provider: {
    name: string;
    slug: string;
    providerType: string;
    bio: string | null;
    avgRating: number;
    reviewCount: number;
    phone: string | null;
    addressText: string | null;
    latitude: number;
    longitude: number;
    district: { name: string } | null;
    city: { name: string } | null;
    listings: Array<{
      title: string;
      description: string | null;
      price: number | null;
      priceUnit: string | null;
      serviceType: { name: string };
    }>;
    verifications: Array<{ verifyType: string }>;
  };
}

function getVerifyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    id_card: '身份证',
    nurse_cert: '养老护理员职业资格证',
    health_cert: '健康证',
    background_check: '背景调查',
  };
  return labels[type] ?? type;
}

export function ProviderSchema({ provider }: ProviderSchemaProps) {
  const variant = provider.providerType === 'individual' ? 'Person' : 'LocalBusiness';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': variant,
    name: provider.name,
    url: `${BASE_URL}/provider/${provider.slug}`,
    description:
      provider.bio ||
      `${provider.name}，${provider.providerType === 'individual' ? '个人养老护工' : '专业养老护理机构'}。评分${provider.avgRating.toFixed(1)}，${provider.reviewCount}条评价。`,
    image: `${BASE_URL}/api/og/provider/${provider.slug}`,
    dateModified: '2026-05-12',
    areaServed: {
      '@type': provider.city?.name ? 'City' : 'Country',
      name: provider.city?.name ?? '中国',
      ...(provider.city?.name
        ? {
            containedInPlace: {
              '@type': 'Country',
              name: '中国',
            },
          }
        : {}),
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: provider.city?.name ?? '',
      addressRegion: provider.district?.name ?? '',
      addressCountry: 'CN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: provider.latitude,
      longitude: provider.longitude,
    },
    ...(provider.phone
      ? { telephone: provider.phone }
      : {}),
  };

  if (provider.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: provider.avgRating.toFixed(1),
      reviewCount: provider.reviewCount,
      bestRating: '5',
    };
  }

  if (provider.listings.length > 0) {
    const services = provider.listings.map((l) => ({
      '@type': 'Service' as const,
      name: l.title,
      description: l.description ?? `${l.serviceType.name}服务`,
      ...(l.price
        ? {
            offers: {
              '@type': 'Offer' as const,
              price: l.price,
              priceCurrency: 'CNY',
              ...(l.priceUnit ? { unitText: l.priceUnit } : {}),
            },
          }
        : {}),
      areaServed: {
        '@type': 'City' as const,
        name: provider.city?.name ?? '',
      },
    }));

    schema.makesOffer = services;
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${provider.name}服务目录`,
      itemListElement: services,
    };
  }

  if (provider.verifications.length > 0) {
    schema.hasCredential = provider.verifications.map((v) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: getVerifyTypeLabel(v.verifyType),
      recognizedBy: {
        '@type': 'Organization',
        name: '人力资源和社会保障局',
      },
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
