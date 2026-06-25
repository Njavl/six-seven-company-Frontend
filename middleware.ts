import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import {
  checkSession,
  getCurrentUser,
  readSetCookies,
} from '@/lib/api/edgeAuth';

const privateRoutes = ['/add-recipe', '/profile'];
const publicRoutes = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  try {
    return await runMiddleware(request);
  } catch {
    // Any unexpected failure (e.g. an Edge-runtime incompatibility or a hung
    // backend) must never 500 the page — fail open and let the request through.
    // The profile page still client-redirects unauthenticated users to login.
    return NextResponse.next();
  }
}

async function runMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const res = await checkSession(request.headers.get('cookie') ?? '');
        const cookieArray = res.ok ? readSetCookies(res) : [];

        if (cookieArray.length) {
          const response = isPublicRoute
            ? NextResponse.redirect(new URL('/', request.url))
            : NextResponse.next();

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
            };
            if (parsed.accessToken) {
              response.cookies.set('accessToken', parsed.accessToken, options);
            }
            if (parsed.refreshToken) {
              response.cookies.set(
                'refreshToken',
                parsed.refreshToken,
                options
              );
            }
          }

          return response;
        }
      } catch {
        // Refresh failed (e.g. expired session) — treat as unauthenticated.
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (isPublicRoute) {
    let valid = false;
    try {
      const res = await getCurrentUser(request.headers.get('cookie') ?? '');
      valid = res.ok;
    } catch {
      // Network error reaching the backend — treat the session as invalid.
      valid = false;
    }

    if (valid) {
      // Valid session: logged-in users shouldn't see the auth pages.
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Stale/invalid token: clear it so it stops blocking the auth pages.
    const response = NextResponse.next();
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    response.cookies.delete('sessionId');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/add-recipe/:path*',
    '/profile/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
