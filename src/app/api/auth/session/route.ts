import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  AUTH_COOKIE_ROLE,
} from '@/lib/auth-session';
import { API_BASE_URL } from '@/lib/config';

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

async function verifyAccessToken(access: string): Promise<{ role: string } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/users/profile/`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { role?: string };
    if (!data.role) return null;
    return { role: String(data.role).toLowerCase() };
  } catch {
    return null;
  }
}

/** Establish httpOnly session cookies after Django JWT login. Role is verified server-side. */
export async function POST(request: Request) {
  let body: { access?: string; refresh?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON body.' }, { status: 400 });
  }

  const access = body.access?.trim();
  const refresh = body.refresh?.trim();
  if (!access || !refresh) {
    return NextResponse.json({ detail: 'access and refresh are required.' }, { status: 400 });
  }

  const verified = await verifyAccessToken(access);
  if (!verified) {
    return NextResponse.json({ detail: 'Invalid or expired access token.' }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(AUTH_COOKIE_ACCESS, access, { ...cookieBase, maxAge: 60 * 60 });
  jar.set(AUTH_COOKIE_REFRESH, refresh, { ...cookieBase, maxAge: 60 * 60 * 24 });
  jar.set(AUTH_COOKIE_ROLE, verified.role, { ...cookieBase, maxAge: 60 * 60 * 24 });

  return NextResponse.json({ ok: true, role: verified.role });
}

/** Clear session cookies on logout. */
export async function DELETE() {
  const jar = await cookies();
  jar.set(AUTH_COOKIE_ACCESS, '', { ...cookieBase, maxAge: 0 });
  jar.set(AUTH_COOKIE_REFRESH, '', { ...cookieBase, maxAge: 0 });
  jar.set(AUTH_COOKIE_ROLE, '', { ...cookieBase, maxAge: 0 });
  return NextResponse.json({ ok: true });
}

/** Lightweight session probe for client hydration (no token leakage). */
export async function GET() {
  const jar = await cookies();
  const access = jar.get(AUTH_COOKIE_ACCESS)?.value;
  const role = jar.get(AUTH_COOKIE_ROLE)?.value;
  if (!access || !role) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({ authenticated: true, role });
}
