import { router, publicProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';
import { z } from 'zod';

export const searchRouter = router({
  search: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        citySlug: z.string(),
        districtSlug: z.string().optional(),
        serviceType: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().min(1).max(50).default(12),
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
          where: { cityId: city.id, slug: input.districtSlug },
        });
        if (district) {
          const subIds = (
            await db.district.findMany({
              where: { parentId: district.id },
              select: { id: true },
            })
          ).map((d) => d.id);
          where.districtId = { in: [district.id, ...subIds] };
        }
      }

      if (input.serviceType) {
        where.serviceTypes = {
          some: { serviceType: { slug: input.serviceType } },
        };
      }

      if (input.q) {
        where.OR = [
          { name: { contains: input.q, mode: 'insensitive' } },
          { bio: { contains: input.q, mode: 'insensitive' } },
        ];
      }

      const [items, total] = await Promise.all([
        db.serviceProvider.findMany({
          where,
          orderBy: { avgRating: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          include: {
            district: true,
            listings: {
              include: { serviceType: true },
              where: { isActive: true },
            },
          },
        }),
        db.serviceProvider.count({ where }),
      ]);

      return { items, total };
    }),
});
