import { router, publicProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';
import { z } from 'zod';

export const reviewRouter = router({
  listByProvider: publicProcedure
    .input(
      z.object({
        providerSlug: z.string(),
        page: z.number().default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const provider = await db.serviceProvider.findUnique({
        where: { slug: input.providerSlug },
        select: { id: true },
      });
      if (!provider) return { items: [], total: 0, ratingDistribution: {} };

      const [items, total, ratingDist] = await Promise.all([
        db.review.findMany({
          where: { providerId: provider.id },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          include: {
            user: { select: { nickname: true, avatarUrl: true } },
          },
        }),
        db.review.count({ where: { providerId: provider.id } }),
        db.review.groupBy({
          by: ['rating'],
          where: { providerId: provider.id },
          _count: { rating: true },
        }),
      ]);

      const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratingDist.forEach((r) => {
        ratingDistribution[r.rating] = r._count.rating;
      });

      return { items, total, ratingDistribution };
    }),

  create: publicProcedure
    .input(
      z.object({
        providerSlug: z.string(),
        rating: z.number().min(1).max(5),
        content: z.string().optional(),
        tags: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ input }) => {
      const provider = await db.serviceProvider.findUnique({
        where: { slug: input.providerSlug },
        select: { id: true },
      });
      if (!provider) throw new Error('Provider not found');

      const review = await db.review.create({
        data: {
          providerId: provider.id,
          userId: 1, // TODO: replace with real user auth
          rating: input.rating,
          content: input.content,
          tags: input.tags,
        },
      });

      // Update aggregate rating
      const agg = await db.review.aggregate({
        where: { providerId: provider.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await db.serviceProvider.update({
        where: { id: provider.id },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewCount: agg._count.rating,
        },
      });

      return review;
    }),
});
