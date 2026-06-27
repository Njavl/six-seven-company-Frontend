import axios from 'axios';

// Клиентский axios ВСЕГДА ходит через встроенный проксі (/api → app/api/[...path]),
// а не напрямую в бэкенд. Это критично для куки-сессии: проксі ставит куки на домен
// фронтенда, и серверный middleware их видит. Если бить в бэкенд напрямую
// (через NEXT_PUBLIC_API_URL), куки осядут на чужом домене и /profile будет
// выкидывать на /auth/login даже у залогиненного пользователя.
const baseURL = '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Эндпоинты аутентификации сами возвращают 401, когда сессии нет
// (гость грузит сайт → /auth/refresh → 401). Для них НЕ запускаем рефреш и
// НЕ редиректим — иначе получаем бесконечный цикл refresh → /auth/login → refresh.
const AUTH_PATHS = [
  '/auth/refresh',
  '/auth/login',
  '/auth/register',
  '/auth/logout',
];

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isAuthPath = AUTH_PATHS.some(path =>
      (originalRequest?.url ?? '').includes(path)
    );

    // Защита: если сам запрос к эндпоинту рецептов или профиля вернул 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthPath
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Делаем рефреш через чистый axios. Имя домена брать не нужно,
        // Next.js сам поймет относительный путь /api/...
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });

        isRefreshing = false;
        processQueue(null, 'success');

        // Повторяем исходный запрос, который упал (например, /favorite)
        return api(originalRequest);
      } catch (refreshError) {
        // Если упал САМ рефреш (вернул 401/500/etc), очищаем очередь и принудительно разлогиниваем
        isRefreshing = false;
        processQueue(refreshError, null);

        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
