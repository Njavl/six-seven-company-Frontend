const baseURL =
  (process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'https://six-seven-company.onrender.com') + '/api';

const FETCH_TIMEOUT_MS = 8000;

export function checkSession(cookieHeader: string): Promise<Response> {
  return fetch(`${baseURL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
      Accept: 'application/json',
      TE: 'identity', // Указывает серверу присылать несжатый/прямой ответ
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

export function getCurrentUser(cookieHeader: string): Promise<Response> {
  return fetch(`${baseURL}/users/current`, {
    method: 'GET',
    headers: { Cookie: cookieHeader },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

export function readSetCookies(res: Response): string[] {
  if (typeof res.headers.getSetCookie === 'function') {
    return res.headers.getSetCookie();
  }
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}
