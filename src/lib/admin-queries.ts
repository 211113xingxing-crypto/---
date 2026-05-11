import { db } from '@/server/db';

export async function getAdminStats() {
  const [totalProviders, pendingVerifications, totalReviews, pendingProviders] =
    await Promise.all([
      db.serviceProvider.count(),
      db.verification.count({ where: { verifyStatus: 'pending' } }),
      db.review.count(),
      db.serviceProvider.count({ where: { status: 'pending' } }),
    ]);

  return { totalProviders, pendingVerifications, totalReviews, pendingProviders };
}

export async function getAdminProviders(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  districtSlug?: string;
  cityId: number;
}) {
  const { page, limit, search, status, districtSlug, cityId } = params;
  const where: Record<string, unknown> = { cityId };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ];
  }
  if (status && status !== 'all') {
    where.status = status;
  }
  if (districtSlug) {
    const district = await db.district.findFirst({
      where: { cityId, slug: districtSlug },
      select: { id: true },
    });
    if (district) where.districtId = district.id;
  }

  const [items, total] = await Promise.all([
    db.serviceProvider.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        district: true,
        verifications: { select: { verifyType: true, verifyStatus: true } },
        _count: { select: { reviews: true } },
      },
    }),
    db.serviceProvider.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getAdminDistricts(citySlug: string) {
  const city = await db.city.findUnique({ where: { slug: citySlug } });
  if (!city) return [];
  return db.district.findMany({
    where: { cityId: city.id, level: 'district' },
    orderBy: { name: 'asc' },
  });
}

export async function getPendingVerifications() {
  return db.verification.findMany({
    where: { verifyStatus: 'pending' },
    include: {
      provider: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { providerId: 'asc' },
  });
}

export async function getAdminReviews(params: {
  page: number;
  limit: number;
  flagged?: boolean;
}) {
  const { page, limit } = params;
  const where: Record<string, unknown> = {};
  // If flagged filter needed, could check content length or specific criteria

  const [items, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        provider: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, nickname: true } },
      },
    }),
    db.review.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProviderById(id: number) {
  return db.serviceProvider.findUnique({
    where: { id },
    include: {
      district: true,
      city: true,
      listings: { include: { serviceType: true } },
      verifications: true,
    },
  });
}
