import { router, publicProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';
import { z } from 'zod';

export const cityRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.city.findUnique({
        where: { slug: input.slug, isActive: true },
        include: {
          districts: {
            where: { level: 'district' },
            orderBy: { name: 'asc' },
          },
          _count: { select: { providers: true } },
        },
      });
    }),

  getDistricts: publicProcedure
    .input(z.object({ citySlug: z.string() }))
    .query(async ({ input }) => {
      const city = await db.city.findUnique({ where: { slug: input.citySlug } });
      if (!city) return [];
      return db.district.findMany({
        where: { cityId: city.id, level: 'district' },
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { providers: true } },
        },
      });
    }),

  getDistrictBySlug: publicProcedure
    .input(z.object({ citySlug: z.string(), districtSlug: z.string() }))
    .query(async ({ input }) => {
      const city = await db.city.findUnique({ where: { slug: input.citySlug } });
      if (!city) return null;
      return db.district.findFirst({
        where: {
          cityId: city.id,
          slug: input.districtSlug,
          level: 'district',
        },
        include: {
          children: {
            orderBy: { name: 'asc' },
            include: { _count: { select: { providers: true } } },
          },
        },
      });
    }),

  getSubDistricts: publicProcedure
    .input(z.object({ citySlug: z.string(), districtSlug: z.string() }))
    .query(async ({ input }) => {
      const city = await db.city.findUnique({ where: { slug: input.citySlug } });
      if (!city) return [];
      const district = await db.district.findFirst({
        where: { cityId: city.id, slug: input.districtSlug, level: 'district' },
      });
      if (!district) return [];
      return db.district.findMany({
        where: { parentId: district.id, level: 'sub_district' },
        orderBy: { name: 'asc' },
        include: { _count: { select: { providers: true } } },
      });
    }),
});
