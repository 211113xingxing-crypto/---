import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/env';

// IndexNow key — a 32+ char hex string. Generate once and reuse.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'f8a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5';

// Serve the key file at /api/indexnow (Bing/Yandex/Seznam fetch this)
export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

// POST to ping search engines about updated URLs
export async function POST(request: Request) {
  const { urlList } = (await request.json().catch(() => ({}))) as { urlList?: string[] };
  const urls = urlList ?? [BASE_URL];

  const engines = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  const results = await Promise.allSettled(
    engines.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: new URL(BASE_URL).hostname,
          key: INDEXNOW_KEY,
          keyLocation: `${BASE_URL}/api/indexnow`,
          urlList: urls,
        }),
      }).then((r) => ({ endpoint, status: r.status }))
    )
  );

  return NextResponse.json({ results });
}
