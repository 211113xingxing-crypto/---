import { NextResponse } from 'next/server';
import type { CityPreference } from '@/lib/city-detection';
import { matchIPCity } from '@/lib/city-detection';

export async function GET() {
  let result: CityPreference | null = null;

  try {
    const res = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      result = matchIPCity(data.city);
    }
  } catch {
    // IP API unavailable — fall back to default
  }

  if (!result) {
    result = { slug: 'shanghai', name: '上海市' };
  }

  return NextResponse.json(result);
}
