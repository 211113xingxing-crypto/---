import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { hashPassword } from '@/lib/password';
import type { ProviderType } from '@/generated/prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      phone,
      password,
      name,
      providerType,
      cityId,
      districtId,
      addressText,
      bio,
      gender,
      age,
      yearsExperience,
      serviceTypeIds,
    } = body;

    // Validate required fields
    if (!phone || !password || !name || !providerType || !cityId) {
      return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 });
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式不正确' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 });
    }

    if (!['individual', 'agency'].includes(providerType)) {
      return NextResponse.json({ error: '服务者类型无效' }, { status: 400 });
    }

    // Check phone uniqueness in ProviderAccount
    const existingAccount = await db.providerAccount.findUnique({ where: { phone } });
    if (existingAccount) {
      return NextResponse.json({ error: '该手机号已注册' }, { status: 409 });
    }

    // Generate slug from name
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Create ServiceProvider + ProviderAccount in a transaction
    const result = await db.$transaction(async (tx) => {
      const provider = await tx.serviceProvider.create({
        data: {
          name,
          slug,
          phone,
          providerType: providerType as ProviderType,
          cityId,
          districtId: districtId || null,
          addressText: addressText || null,
          bio: bio || null,
          gender: gender || null,
          age: age || null,
          yearsExperience: yearsExperience || null,
          status: 'pending',
          latitude: 0,
          longitude: 0,
        },
      });

      const passwordHash = hashPassword(password);
      await tx.providerAccount.create({
        data: {
          phone,
          passwordHash,
          providerId: provider.id,
        },
      });

      // Link service types if provided
      if (serviceTypeIds && Array.isArray(serviceTypeIds) && serviceTypeIds.length > 0) {
        await tx.providerServiceType.createMany({
          data: serviceTypeIds.map((stId: number) => ({
            providerId: provider.id,
            serviceTypeId: stId,
          })),
        });
      }

      return provider;
    });

    return NextResponse.json({
      success: true,
      message: '入驻申请已提交，请等待审核',
      providerId: result.id,
    });
  } catch {
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}
