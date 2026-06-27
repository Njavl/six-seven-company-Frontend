import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

const BACKEND_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://six-seven-company.onrender.com';

const HOP_BY_HOP = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'keep-alive',
]);

function rewriteCookieForInsecureOrigin(cookie: string): string {
  return cookie
    .replace(/;\s*Secure/gi, '')
    .replace(/;\s*SameSite=None/gi, '; SameSite=Lax');
}

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const target = `${BACKEND_URL}/api/${path.join('/')}${req.nextUrl.search}`;

  // Строго типизируем объект заголовков
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key !== 'host' && key !== 'connection') {
      headers[key] = value;
    }
  });

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  let body: ArrayBuffer | undefined = undefined;

  if (hasBody) {
    body = await req.arrayBuffer();
  }

  try {
    // Явно указываем тип ответа AxiosResponse<ArrayBuffer>
    const backendRes: AxiosResponse<ArrayBuffer> = await axios({
      method: req.method,
      url: target,
      headers: headers,
      data: body,
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });

    const NULL_BODY_STATUS = new Set([101, 204, 205, 304]);
    const payload = NULL_BODY_STATUS.has(backendRes.status)
      ? null
      : backendRes.data;

    const res = new NextResponse(payload, {
      status: backendRes.status,
      statusText: backendRes.statusText,
    });

    Object.entries(backendRes.headers).forEach(([key, value]) => {
      if (
        !value ||
        HOP_BY_HOP.has(key.toLowerCase()) ||
        key.toLowerCase() === 'set-cookie'
      )
        return;
      res.headers.set(key, String(value));
    });

    const isSecure = req.nextUrl.protocol === 'https:';
    const setCookieHeader = backendRes.headers['set-cookie'];

    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      for (const cookie of cookies) {
        res.headers.append(
          'set-cookie',
          isSecure ? cookie : rewriteCookieForInsecureOrigin(cookie)
        );
      }
    }

    return res;
  } catch (error: unknown) {
    // Безопасное логирование ошибок типа unknown
    if (error instanceof Error) {
      console.error('Proxy critical failure:', error.message);
    } else {
      console.error('Proxy critical failure with unknown error:', error);
    }

    return NextResponse.json(
      { message: 'Internal Proxy Error' },
      { status: 500 }
    );
  }
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
