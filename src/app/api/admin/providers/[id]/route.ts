import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const providerId = parseInt(id);
  if (isNaN(providerId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'activate':
        await db.serviceProvider.update({
          where: { id: providerId },
          data: { status: 'active', verified: true },
        });
        break;
      case 'suspend':
        await db.serviceProvider.update({
          where: { id: providerId },
          data: { status: 'suspended' },
        });
        break;
      case 'verify':
        await db.serviceProvider.update({
          where: { id: providerId },
          data: { verified: true, status: 'active' },
        });
        break;
      case 'unverify':
        await db.serviceProvider.update({
          where: { id: providerId },
          data: { verified: false },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
