# Tasteorama — Frontend

Next.js 15 (App Router) фронтенд для застосунку рецептів Tasteorama. Бекенд —
окремий репозиторій (REST API на Express, деплой на Render).

## Стек

Next.js 15 · React 19 · TypeScript · TanStack Query · Zustand · axios ·
Formik + Yup · CSS Modules · react-hot-toast.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Змінні оточення

За замовчуванням застосунок працює через вбудований проксі Next.js
(`app/api/[...path]/route.ts`), щоб cookie-сесія коректно ставилась **на домен
фронтенду** — інакше серверний `middleware.ts` не побачить cookie і
перенаправлятиме на `/auth/login` (типовий баг на деплої). Тому:

- **`NEXT_PUBLIC_API_URL` — залишати ПОРОЖНІМ** (і локально, і на деплої). Тоді
  axios звертається до відносного `/api`, і всі запити йдуть через свій проксі.
- **`API_URL`** = базова адреса бекенду (наприклад
  `https://six-seven-company.onrender.com`). Її використовує проксі та
  `serverApi` для звернення сервер-до-сервера.

> ⚠️ Якщо виставити `NEXT_PUBLIC_API_URL` на адресу бекенду, axios б'є в бекенд
> **напряму**, минаючи проксі. Cookie тоді ставляться на домен бекенду, клієнт
> «залогінений», але `middleware.ts` на фронті cookie не бачить → `/profile`
> кидає назад на логін. На деплої цю змінну треба **прибрати** і зробити
> redeploy (`NEXT_PUBLIC_*` вшивається у бандл на етапі білду).

## Структура

- `app/` — маршрути (App Router)
- `components/` — компоненти (`Component/Component.tsx` + `.module.css`)
- `lib/api/` — запити до бекенду (`clientApi`, `serverApi`)
- `lib/store/` — Zustand-стори (`authStore`, `filtersStore`)
- `types/` — типи сутностей

## Розподіл роботи

Дивись [FRONTEND-PLAN.md](./FRONTEND-PLAN.md) — задачі на 12 студентів і правила
роботи зі спільними файлами.
