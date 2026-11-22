import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_ROLE,
  isAdminRole,
  isExpertRole,
} from '@/lib/auth-session';

function redirectToSignIn(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/signin';
  url.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectToAccount(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/account';
  url.search = '';
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(AUTH_COOKIE_ACCESS)?.value;
  const role = request.cookies.get(AUTH_COOKIE_ROLE)?.value;
  const isAuthed = Boolean(access && role);

  const needsAuth =
    pathname.startsWith('/account') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/expert');

  if (needsAuth && !isAuthed) {
    return redirectToSignIn(request);
  }

  if (pathname.startsWith('/admin') && !isAdminRole(role)) {
    return isAuthed ? redirectToAccount(request) : redirectToSignIn(request);
  }

  if (pathname.startsWith('/expert') && !isExpertRole(role)) {
    return isAuthed ? redirectToAccount(request) : redirectToSignIn(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*', '/expert/:path*'],
};
