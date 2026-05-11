import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const city = await db.city.findUnique({ where: { slug: 'shanghai' } });
    if (!city) {
      return NextResponse.json({ error: 'City not found — run seed first' }, { status: 400 });
    }

    const provider = await db.serviceProvider.create({
      data: {
        providerType: body.providerType ?? 'individual',
        name: body.name,
        slug: body.slug,
        phone: body.phone,
        wechatId: body.wechatId,
        bio: body.bio,
        yearsExperience: body.yearsExperience,
        gender: body.gender,
        age: body.age,
        districtId: body.districtId,
        cityId: city.id,
        latitude: body.latitude ?? 0,
        longitude: body.longitude ?? 0,
        addressText: body.addressText,
        status: body.verified ? 'active' : 'pending',
        verified: body.verified ?? false,
      },
    });

    // Link service types if provided
    if (Array.isArray(body.serviceTypeIds) && body.serviceTypeIds.length > 0) {
      await db.providerServiceType.createMany({
        data: body.serviceTypeIds.map((stId: number) => ({
          providerId: provider.id,
          serviceTypeId: stId,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ id: provider.id, slug: provider.slug }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
