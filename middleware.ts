import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page without auth check
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check auth for all other /admin routes
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value;

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const sessionData = await verifySession(session);

    if (!sessionData) {
      // Invalid session, clear cookie and redirect
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
