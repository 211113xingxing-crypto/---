import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  try {
    const city = await db.city.findUnique({ where: { slug: 'shanghai' } });
    if (!city) {
      return NextResponse.json({ data: [] });
    }
    const districts = await db.district.findMany({
      where: { cityId: city.id },
      orderBy: [{ level: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ data: districts });
  } catch (e: unknown) {
    return NextResponse.json({ error: 'Failed to fetch districts' }, { status: 500 });
  }
}
