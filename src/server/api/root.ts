import { router } from '@/server/trpc/init';
import { cityRouter } from './routers/city';
import { providerRouter } from './routers/provider';
import { reviewRouter } from './routers/review';
import { searchRouter } from './routers/search';

export const appRouter = router({
  city: cityRouter,
  provider: providerRouter,
  review: reviewRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
