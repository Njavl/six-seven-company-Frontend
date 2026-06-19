import { NextRequest, NextResponse } from 'next/server';

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

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('connection');

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const backendRes = await fetch(target, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
    cache: 'no-store',
  });

  const NULL_BODY_STATUS = new Set([101, 204, 205, 304]);
  const payload = NULL_BODY_STATUS.has(backendRes.status)
    ? null
    : await backendRes.arrayBuffer();
  const res = new NextResponse(payload, {
    status: backendRes.status,
    statusText: backendRes.statusText,
  });

  backendRes.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key) || key === 'set-cookie') return;
    res.headers.set(key, value);
  });

  const isSecure = req.nextUrl.protocol === 'https:';
  const cookies = backendRes.headers.getSetCookie();
  for (const cookie of cookies) {
    res.headers.append(
      'set-cookie',
      isSecure ? cookie : rewriteCookieForInsecureOrigin(cookie)
    );
  }

  return res;
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
