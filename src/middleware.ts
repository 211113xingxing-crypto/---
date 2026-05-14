import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin routes: check admin_token ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const token = request.cookies.get('admin_token')?.value;
    if (!token || verifyToken(token) !== 0) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- Provider dashboard routes: check provider_token ---
  if (pathname.startsWith('/dashboard')) {
    // Allow login and register pages without auth
    if (pathname === '/provider/login' || pathname === '/provider/register') {
      return NextResponse.next();
    }

    const token = request.cookies.get('provider_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/provider/login', request.url));
    }
    const userId = verifyToken(token);
    if (userId === null || userId >= 0) {
      // Invalid token or non-provider token (positive userId)
      return NextResponse.redirect(new URL('/provider/login', request.url));
    }
    return NextResponse.next();
  }

  // --- User account routes: check token ---
  if (pathname.startsWith('/account')) {
    // Allow login and register pages without auth
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const userId = verifyToken(token);
    if (userId === null || userId <= 0) {
      // Invalid token or provider token (negative/zero userId)
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/account/:path*'],
};
