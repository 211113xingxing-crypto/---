import { z } from 'zod';
import { router, protectedProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';

export const accountRouter = router({
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return db.user.findUnique({
        where: { id: ctx.userId! },
        select: { id: true, nickname: true, phone: true, avatarUrl: true },
      });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        nickname: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.user.update({
        where: { id: ctx.userId! },
        data: { nickname: input.nickname },
      });
    }),

  getFavorites: protectedProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const [items, total] = await Promise.all([
        db.favorite.findMany({
          where: { userId: ctx.userId! },
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                slug: true,
                avatarUrl: true,
                providerType: true,
                avgRating: true,
                reviewCount: true,
                addressText: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        db.favorite.count({ where: { userId: ctx.userId! } }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  getContactHistory: protectedProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const [items, total] = await Promise.all([
        db.contactRequest.findMany({
          where: { userId: ctx.userId! },
          include: {
            serviceProvider: {
              select: { id: true, name: true, slug: true, avatarUrl: true, phone: true, wechatId: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        db.contactRequest.count({ where: { userId: ctx.userId! } }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),
});
