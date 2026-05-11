import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createContext(opts?: FetchCreateContextFnOptions) {
  return {
    req: opts?.req,
    resHeaders: opts?.resHeaders ?? new Headers(),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
