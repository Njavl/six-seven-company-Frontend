import axios, { type AxiosResponse } from 'axios';

const baseURL =
  (process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'https://six-seven-company.onrender.com') + '/api';

const serverApi = axios.create({
  baseURL,
  withCredentials: true,
});

export async function checkSession(
  cookieHeader: string
): Promise<AxiosResponse> {
  return serverApi.post('/auth/refresh', null, {
    headers: { Cookie: cookieHeader },
  });
}

export default serverApi;
