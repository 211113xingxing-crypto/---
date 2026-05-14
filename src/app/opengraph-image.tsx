import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = '亲护 - 帮您找到身边靠谱的居家养老服务';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
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
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 24 }}>亲护</div>
        <div style={{ fontSize: 32, opacity: 0.85, marginBottom: 40 }}>
          帮您找到身边靠谱的居家养老服务
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 24, opacity: 0.7 }}>
          <span>资质核验</span>
          <span>真实评价</span>
          <span>全国31省市</span>
        </div>
        <div style={{ position: 'absolute', bottom: 40, fontSize: 20, opacity: 0.5 }}>
          elder.navi-resources.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
