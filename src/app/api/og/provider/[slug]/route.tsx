import { ImageResponse } from 'next/og';
import { getProviderBySlug } from '@/lib/data';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) {
    return new Response('Not found', { status: 404 });
  }

  const serviceNames = provider.listings.slice(0, 3).map(l => l.serviceType.name).join(' · ');
  const ratingText = provider.avgRating > 0 ? `${provider.avgRating.toFixed(1)} 分` : '新入驻';
  const districtText = provider.district?.name ?? provider.addressText ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 80,
        }}
      >
        {/* Verified badge */}
        {provider.verified && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 9999,
              padding: '8px 24px',
              marginBottom: 32,
              fontSize: 22,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            已认证
          </div>
        )}

        {/* Name */}
        <div style={{ fontSize: 56, fontWeight: 700, marginBottom: 16, textAlign: 'center', maxWidth: 1000 }}>
          {provider.name}
        </div>

        {/* Rating + Experience */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 32, opacity: 0.9, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#fbbf24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {ratingText}
            {provider.reviewCount > 0 && <span style={{ fontSize: 24, opacity: 0.7 }}>({provider.reviewCount}条评价)</span>}
          </div>
          {provider.yearsExperience && (
            <div>{provider.yearsExperience}年经验</div>
          )}
        </div>

        {/* Services */}
        {serviceNames && (
          <div
            style={{
              fontSize: 24,
              opacity: 0.85,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 9999,
              padding: '10px 32px',
              marginBottom: 24,
            }}
          >
            {serviceNames}
          </div>
        )}

        {/* Location */}
        {districtText && (
          <div style={{ fontSize: 22, opacity: 0.7, marginBottom: 40 }}>
            {districtText}
          </div>
        )}

        {/* Brand */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 22,
            opacity: 0.6,
          }}
        >
          亲护 · elder.navi-resources.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
