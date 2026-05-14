import { router, publicProcedure, protectedProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';
import { z } from 'zod';

function mapFavoriteProvider(p: Record<string, unknown>) {
  const provider = p as Record<string, unknown>;
  return {
    id: provider.id as number,
    name: provider.name as string,
    slug: provider.slug as string,
    providerType: provider.providerType as string,
    avgRating: provider.avgRating as number,
    reviewCount: provider.reviewCount as number,
    yearsExperience: provider.yearsExperience as number | null,
    verified: provider.verified as boolean,
    addressText: provider.addressText as string | null,
    bio: provider.bio as string | null,
    district: provider.district as { name: string; slug: string } | null,
    listings: (provider.listings as Array<Record<string, unknown>> ?? []).map(l => ({
      title: l.title as string,
      price: l.price as number | null,
      priceUnit: l.priceUnit as string | null,
      serviceType: l.serviceType as { name: string; slug: string },
    })),
    verifications: (provider.verifications as Array<Record<string, unknown>> ?? []).map(v => ({
      verifyType: v.verifyType as string,
    })),
  };
}

export const favoriteRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const favs = await (db as any).favorite.findMany({
        where: { userId: ctx.userId },
        include: {
          provider: {
            include: {
              district: true,
              listings: {
                include: { serviceType: true },
                where: { isActive: true },
              },
              verifications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return favs.map((f: any) => ({
        ...f,
        provider: mapFavoriteProvider(f.provider),
      }));
    }),

  toggle: protectedProcedure
    .input(z.object({ providerId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await (db as any).favorite.findUnique({
        where: {
          userId_providerId: {
            userId: ctx.userId,
            providerId: input.providerId,
          },
        },
      });
      if (existing) {
        await (db as any).favorite.delete({
          where: {
            userId_providerId: {
              userId: ctx.userId,
              providerId: input.providerId,
            },
          },
        });
        return { favorited: false };
      }
      await (db as any).favorite.create({
        data: { userId: ctx.userId, providerId: input.providerId },
      });
      return { favorited: true };
    }),

  check: publicProcedure
    .input(z.object({ providerId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.userId) return false;
      const fav = await (db as any).favorite.findUnique({
        where: {
          userId_providerId: {
            userId: ctx.userId,
            providerId: input.providerId,
          },
        },
      });
      return !!fav;
    }),
});
