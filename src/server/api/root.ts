import { router } from '@/server/trpc/init';
import { cityRouter } from './routers/city';
import { providerRouter } from './routers/provider';
import { reviewRouter } from './routers/review';
import { searchRouter } from './routers/search';
import { favoriteRouter } from './routers/favorite';
import { dashboardRouter } from './routers/dashboard';
import { messageRouter } from './routers/message';
import { accountRouter } from './routers/account';

export const appRouter = router({
  city: cityRouter,
  provider: providerRouter,
  review: reviewRouter,
  search: searchRouter,
  favorite: favoriteRouter,
  dashboard: dashboardRouter,
  message: messageRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
