import { z } from 'zod';
import { router, protectedProcedure, protectedProviderProcedure } from '@/server/trpc/init';
import { db } from '@/server/db';

export const messageRouter = router({
  getConversations: protectedProcedure
    .query(async ({ ctx }) => {
      return db.conversation.findMany({
        where: { userId: ctx.userId! },
        include: { provider: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
      });
    }),

  getProviderConversations: protectedProviderProcedure
    .query(async ({ ctx }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) return [];

      return db.conversation.findMany({
        where: { providerId: account.providerId },
        include: { user: { select: { id: true, nickname: true, avatarUrl: true } } },
        orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
      });
    }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      return db.message.findMany({
        where: { conversationId: input.conversationId },
        orderBy: { createdAt: 'asc' },
      });
    }),

  getProviderMessages: protectedProviderProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) return [];

      // Verify ownership
      const conv = await db.conversation.findUnique({ where: { id: input.conversationId } });
      if (!conv || conv.providerId !== account.providerId) return [];

      return db.message.findMany({
        where: { conversationId: input.conversationId },
        orderBy: { createdAt: 'asc' },
      });
    }),

  send: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conv = await db.conversation.findUnique({ where: { id: input.conversationId } });
      if (!conv || conv.userId !== ctx.userId) throw new Error('Conversation not found');

      await db.message.create({
        data: {
          conversationId: input.conversationId,
          senderId: ctx.userId!,
          senderType: 'user',
          content: input.content,
        },
      });

      await db.conversation.update({
        where: { id: input.conversationId },
        data: { lastMessage: input.content.slice(0, 500), lastMessageAt: new Date() },
      });

      return { success: true };
    }),

  sendAsProvider: protectedProviderProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) throw new Error('Account not found');

      const conv = await db.conversation.findUnique({ where: { id: input.conversationId } });
      if (!conv || conv.providerId !== account.providerId) throw new Error('Conversation not found');

      await db.message.create({
        data: {
          conversationId: input.conversationId,
          senderId: account.id,
          senderType: 'provider',
          content: input.content,
        },
      });

      await db.conversation.update({
        where: { id: input.conversationId },
        data: { lastMessage: input.content.slice(0, 500), lastMessageAt: new Date() },
      });

      return { success: true };
    }),

  markRead: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      await db.message.updateMany({
        where: { conversationId: input.conversationId, senderType: 'provider', isRead: false },
        data: { isRead: true },
      });
      return { success: true };
    }),

  markReadAsProvider: protectedProviderProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const account = await db.providerAccount.findUnique({ where: { id: ctx.providerAccountId } });
      if (!account) return { success: false };

      const conv = await db.conversation.findUnique({ where: { id: input.conversationId } });
      if (!conv || conv.providerId !== account.providerId) return { success: false };

      await db.message.updateMany({
        where: { conversationId: input.conversationId, senderType: 'user', isRead: false },
        data: { isRead: true },
      });
      return { success: true };
    }),
});
