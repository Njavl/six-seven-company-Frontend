const baseURL =
  (process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'https://six-seven-company.onrender.com') + '/api';

export function checkSession(cookieHeader: string): Promise<Response> {
  return fetch(`${baseURL}/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
  });
}

export function getCurrentUser(cookieHeader: string): Promise<Response> {
  return fetch(`${baseURL}/users/current`, {
    method: 'GET',
    headers: { Cookie: cookieHeader },
  });
}

// Reads all Set-Cookie headers from a fetch Response (Edge supports getSetCookie()).
export function readSetCookies(res: Response): string[] {
  if (typeof res.headers.getSetCookie === 'function') {
    return res.headers.getSetCookie();
  }
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}
