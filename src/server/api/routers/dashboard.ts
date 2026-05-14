import { z } from 'zod';
import { router, protectedProviderProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';

export const dashboardRouter = router({
  updateProfile: protectedProviderProcedure
    .input(
      z.object({
        name: z.string().min(1),
        bio: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        wechatId: z.string().nullable().optional(),
        addressText: z.string().nullable().optional(),
        districtId: z.number().nullable().optional(),
        gender: z.string().nullable().optional(),
        age: z.number().nullable().optional(),
        yearsExperience: z.number().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      return db.serviceProvider.update({
        where: { id: account.providerId },
        data: {
          name: input.name,
          bio: input.bio,
          phone: input.phone,
          wechatId: input.wechatId,
          addressText: input.addressText,
          districtId: input.districtId,
          gender: input.gender,
          age: input.age,
          yearsExperience: input.yearsExperience,
        },
      });
    }),

  updateServiceTypes: protectedProviderProcedure
    .input(
      z.object({
        serviceTypeIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      await db.providerServiceType.deleteMany({ where: { providerId: account.providerId } });
      if (input.serviceTypeIds.length > 0) {
        await db.providerServiceType.createMany({
          data: input.serviceTypeIds.map(stId => ({
            providerId: account.providerId,
            serviceTypeId: stId,
          })),
        });
      }
      return { success: true };
    }),

  addListing: protectedProviderProcedure
    .input(
      z.object({
        serviceTypeId: z.number(),
        title: z.string().min(1),
        description: z.string().nullable().optional(),
        price: z.number().nullable().optional(),
        priceUnit: z.string().nullable().optional(),
        priceNote: z.string().nullable().optional(),
        isNegotiable: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      return db.serviceListing.create({
        data: {
          providerId: account.providerId,
          serviceTypeId: input.serviceTypeId,
          title: input.title,
          description: input.description,
          price: input.price,
          priceUnit: input.priceUnit,
          priceNote: input.priceNote,
          isNegotiable: input.isNegotiable,
        },
      });
    }),

  deleteListing: protectedProviderProcedure
    .input(z.object({ listingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      await db.serviceListing.deleteMany({
        where: { id: input.listingId, providerId: account.providerId },
      });
      return { success: true };
    }),

  getContactRequests: protectedProviderProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      const [items, total] = await Promise.all([
        db.contactRequest.findMany({
          where: { providerId: account.providerId },
          include: { user: { select: { id: true, nickname: true, phone: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        db.contactRequest.count({ where: { providerId: account.providerId } }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  revealContact: protectedProviderProcedure
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      return db.contactRequest.updateMany({
        where: { id: input.requestId, providerId: account.providerId },
        data: { contactInfoRevealed: true },
      });
    }),

  getMyReviews: protectedProviderProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      const [items, total] = await Promise.all([
        db.review.findMany({
          where: { providerId: account.providerId },
          include: { user: { select: { id: true, nickname: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        db.review.count({ where: { providerId: account.providerId } }),
      ]);

      return { items, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  replyToReview: protectedProviderProcedure
    .input(
      z.object({
        reviewId: z.number(),
        reply: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      return db.review.updateMany({
        where: { id: input.reviewId, providerId: account.providerId },
        data: { reply: input.reply, repliedAt: new Date() },
      });
    }),
});
