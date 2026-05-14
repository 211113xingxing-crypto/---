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

export async function PUT(
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
    const {
      name,
      slug,
      providerType,
      phone,
      wechatId,
      bio,
      yearsExperience,
      gender,
      age,
      districtId,
      latitude,
      longitude,
      addressText,
      verified,
    } = body;

    const updated = await db.serviceProvider.update({
      where: { id: providerId },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(providerType !== undefined && { providerType }),
        ...(phone !== undefined && { phone }),
        ...(wechatId !== undefined && { wechatId }),
        ...(bio !== undefined && { bio }),
        ...(yearsExperience !== undefined && { yearsExperience }),
        ...(gender !== undefined && { gender }),
        ...(age !== undefined && { age }),
        ...(districtId !== undefined && { districtId }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(addressText !== undefined && { addressText }),
        ...(verified !== undefined && { verified }),
      },
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
