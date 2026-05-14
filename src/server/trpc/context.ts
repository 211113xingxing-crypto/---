import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { verifyToken } from '@/lib/auth';

function extractCookie(cookieHeader: string, name: string): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1];
}

export async function createContext(opts?: FetchCreateContextFnOptions) {
  let userId: number | null = null;
  let providerAccountId: number | null = null;

  const cookieHeader = opts?.req?.headers.get('cookie') ?? '';

  // Parse user token
  const userToken = extractCookie(cookieHeader, 'token');
  if (userToken) {
    const id = verifyToken(userToken);
    if (id !== null && id > 0) {
      userId = id;
    }
  }

  // Parse provider token
  const providerToken = extractCookie(cookieHeader, 'provider_token');
  if (providerToken) {
    const id = verifyToken(providerToken);
    if (id !== null && id < 0) {
      providerAccountId = -id; // convert negative back to positive account ID
    }
  }

  return {
    req: opts?.req,
    resHeaders: opts?.resHeaders ?? new Headers(),
    userId,
    providerAccountId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
