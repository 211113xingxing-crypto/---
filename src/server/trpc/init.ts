import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const protectedProcedure = t.procedure.use(authMiddleware);

const providerAuthMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.providerAccountId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, providerAccountId: ctx.providerAccountId } });
});

export const protectedProviderProcedure = t.procedure.use(providerAuthMiddleware);
export const middleware = t.middleware;
