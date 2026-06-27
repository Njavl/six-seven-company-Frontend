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
    // В случае непредвиденных сетевых сбоев пропускаем запрос дальше,
    // чтобы не ломать приложение ошибкой 500
    return NextResponse.next();
  }
}

async function runMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route: string) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route: string) =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      try {
        const res = await checkSession(request.headers.get('cookie') ?? '');

        // Если бэкенд вернул 401/403 (сессия полностью невалидна)
        if (!res.ok) {
          const response = isPrivateRoute
            ? NextResponse.redirect(new URL('/auth/login', request.url))
            : NextResponse.next();

          // Жестко стираем просроченные токены прямо здесь
          response.cookies.delete('accessToken');
          response.cookies.delete('refreshToken');
          response.cookies.delete('sessionId');
          return response;
        }

        const cookieArray = readSetCookies(res);

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
      } catch (e) {
        console.error('Middleware session refresh failed:', e);
        const response = isPrivateRoute
          ? NextResponse.redirect(new URL('/auth/login', request.url))
          : NextResponse.next();

        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        response.cookies.delete('sessionId');
        return response;
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
      valid = false;
    }

    if (valid) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const response = NextResponse.next();
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    response.cookies.delete('sessionId');
    return response;
  }

  return NextResponse.next();
}

// Конфигурация матчера: Middleware будет отрабатывать только на приватных роутах
export const config = {
  matcher: ['/add-recipe/:path*', '/profile/:path*'],
};
