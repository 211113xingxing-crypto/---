import { router, publicProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';
import { z } from 'zod';

export const providerRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.serviceProvider.findUnique({
        where: { slug: input.slug, status: 'active' },
        include: {
          district: true,
          city: true,
          listings: {
            include: { serviceType: true },
            where: { isActive: true },
          },
          verifications: {
            where: { verifyStatus: 'approved' },
          },
          photos: { orderBy: { sortOrder: 'asc' } },
          serviceTypes: {
            include: { serviceType: true },
          },
          _count: { select: { reviews: true } },
        },
      });
    }),

  listByDistrict: publicProcedure
    .input(
      z.object({
        citySlug: z.string(),
        districtSlug: z.string().optional(),
        subDistrictSlug: z.string().optional(),
        serviceType: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().min(1).max(50).default(12),
        sort: z.enum(['rating', 'distance', 'experience']).default('rating'),
      })
    )
    .query(async ({ input }) => {
      const city = await db.city.findUnique({ where: { slug: input.citySlug } });
      if (!city) return { items: [], total: 0 };

      const where: Record<string, unknown> = {
        cityId: city.id,
        status: 'active',
      };

      if (input.districtSlug) {
        const district = await db.district.findFirst({
          where: { cityId: city.id, slug: input.districtSlug, level: 'district' },
        });
        if (district) {
          if (input.subDistrictSlug) {
            const sub = await db.district.findFirst({
              where: { parentId: district.id, slug: input.subDistrictSlug, level: 'sub_district' },
            });
            if (sub) where.districtId = sub.id;
          } else {
            const subIds = (
              await db.district.findMany({
                where: { parentId: district.id },
                select: { id: true },
              })
            ).map((d) => d.id);
            where.districtId = { in: [district.id, ...subIds] };
          }
        }
      }

      if (input.serviceType) {
        where.serviceTypes = {
          some: { serviceType: { slug: input.serviceType } },
        };
      }

      const orderBy: Record<string, string> =
        input.sort === 'rating'
          ? { avgRating: 'desc' }
          : input.sort === 'experience'
            ? { yearsExperience: 'desc' }
            : { avgRating: 'desc' };

      const [items, total] = await Promise.all([
        db.serviceProvider.findMany({
          where,
          orderBy,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          include: {
            district: true,
            listings: {
              include: { serviceType: true },
              where: { isActive: true },
            },
            verifications: {
              where: { verifyStatus: 'approved' },
              select: { verifyType: true },
            },
          },
        }),
        db.serviceProvider.count({ where }),
      ]);

      return { items, total };
    }),

  getNearby: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        radiusKm: z.number().default(5),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const providers = await db.$queryRawUnsafe<
        Array<{
          id: number;
          name: string;
          slug: string;
          avg_rating: number;
          distance_km: number;
        }>
      >(
        `SELECT id, name, slug, avg_rating,
                ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) / 1000 AS distance_km
         FROM service_provider
         WHERE status = 'active'
           AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3 * 1000)
         ORDER BY distance_km
         LIMIT $4`,
        input.lat,
        input.lng,
        input.radiusKm,
        input.limit
      );
      return providers;
    }),

  getHotProviders: publicProcedure
    .input(z.object({ citySlug: z.string(), limit: z.number().default(6) }))
    .query(async ({ input }) => {
      const city = await db.city.findUnique({ where: { slug: input.citySlug } });
      if (!city) return [];
      return db.serviceProvider.findMany({
        where: { cityId: city.id, status: 'active', verified: true },
        orderBy: { avgRating: 'desc' },
        take: input.limit,
        include: {
          district: true,
          listings: {
            include: { serviceType: true },
            where: { isActive: true },
          },
        },
      });
    }),

  getServiceTypes: publicProcedure
    .query(async () => {
      return db.serviceType.findMany({ orderBy: { name: 'asc' } });
    }),
});
