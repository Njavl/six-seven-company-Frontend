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

Змінна оточення: `NEXT_PUBLIC_API_URL` — базова адреса бекенду (без `/api`).

## Структура

- `app/` — маршрути (App Router)
- `components/` — компоненти (`Component/Component.tsx` + `.module.css`)
- `lib/api/` — запити до бекенду (`clientApi`, `serverApi`)
- `lib/store/` — Zustand-стори (`authStore`, `filtersStore`)
- `types/` — типи сутностей

## Розподіл роботи

Дивись [FRONTEND-PLAN.md](./FRONTEND-PLAN.md) — задачі на 12 студентів і правила
роботи зі спільними файлами.
