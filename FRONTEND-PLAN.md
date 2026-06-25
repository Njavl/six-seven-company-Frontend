# Tasteorama Frontend — план работ на 12 студентов

Next.js 15 (App Router) + TypeScript + CSS Modules. Бекенд — окремий репозиторій

## Стек

Next.js 15 · React 19 · TypeScript · TanStack Query · Zustand · axios ·
Formik + Yup · react-hot-toast · CSS Modules · modern-normalize · next/image.

## ⚠️ Головне правило

У PR — **тільки свої файли**. Спільну основу нижче
**ніхто не переписує**.

## Що вже готове (власник — тимлід, не чіпати)

| Файл | Що це |
|---|---|
| `app/globals.css` | дизайн-токени з макета (кольори/типографіка/радіуси/тіні) + утиліти |
| `app/layout.tsx` | root layout: **modern-normalize** + `globals.css`, провайдери, шрифт Montserrat, Header/Footer, Toaster |
| `components/TanStackProvider/` | провайдер React Query (готовий) |
| `components/AuthProvider/` | оболонка провайдера (бутстрап допише S1) |
| `lib/api/api.ts` | **підключений axios** (`baseURL`, `withCredentials`) |
| `types/*.ts` | `User`, `Recipe`, `Category`, `Ingredient` (спільний контракт) |
| `design/TOKENS.md` | довідник дизайн-токенів |
| конфіги | next/tsconfig/eslint/prettier/.env.example |

Головна сторінка та всі компоненти — **порожні заглушки** (`return null`), без
розмітки і стилів. Кожен студент має готовий слот-папку свого компонента.

## Спільний файл запитів — `lib/api/clientApi.ts`

**Запити пише кожен сам.** Це єдиний спільний файл, у якому працюють разом. Свою
функцію додаєш окремим PR, тимлід мерджить. `axios` уже готовий — береш `api` і
пишеш функцію:

```ts
import api from './api';

export async function login(payload: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
}
```

Орієнтовний розподіл запитів за задачами (хто яку функцію додає) — у колонці
«запити» нижче.

## Розподіл на 12 (вирівняний за обсягом)

Складність: **S** — мала, **M** — середня, **L** — велика, **XL** — дуже велика.

| # | Задача | Складність | Файли (свої) | Запити в clientApi |
|---|---|---|---|---|
| S1 | **State + AuthProvider** | M | `lib/store/authStore.ts`, `lib/store/filtersStore.ts`, дописати `AuthProvider` | `getCurrentUser` |
| S2 | **App glue + захист** | S | `middleware.ts`, `lib/constants.ts`, `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`, `Loader` | — |
| S3 | **Header** | M | `components/Header/` | `logout` |
| S4 | **Footer + Modal** | M | `components/Footer/`, `components/Modal/`, `components/AuthModal/` | — |
| S5 | **Register** | M | `components/RegistrationForm/`, `app/auth/register/page.tsx` | `register` |
| S6 | **Login** | S | `components/LoginForm/`, `app/auth/login/page.tsx` | `login` |
| S7 | **Home + SearchBox** | M | `app/page.tsx`, `components/SearchBox/` | — |
| S8 | **Filters** | M | `components/Filters/` | `getCategories`, `getIngredients` |
| S9 | **RecipesList + Profile** | L | `components/RecipesList/`, `components/LoadMoreBtn/`, `app/profile/[recipeType]/page.tsx`, `components/ProfileNavigation/` | `searchRecipes`, `getOwnRecipes`, `getFavoriteRecipes` |
| S10 | **RecipeCard + SaveButton + Pagination** | L | `components/RecipeCard/`, `components/SaveButton/`, `components/Pagination/` | `addFavorite`, `removeFavorite` |
| S11 | **Recipe details** | L | `components/RecipeDetails/`, `app/recipes/[recipeId]/page.tsx`, `app/recipes/[recipeId]/not-found.tsx` | `getRecipeById` |
| S12 | **Add recipe** | XL | `components/AddRecipeForm/`, `app/add-recipe/page.tsx` | `createRecipe` |

Великі задачі (S9, S10, S11, S12) збалансовані тим, що дрібні згруповані
(S4 = Footer+Modal, S2 = glue+сервісні сторінки). S12 (Add recipe) — найважча
одиночна, тому без довісків.

## 🔥 Терміновість і проміжний дедлайн

**Проміжний дедлайн:** якнайшвидше зробити **головну сторінку + Hero-секцію** (S7).
Тому весь критичний шлях до неї (нижче) — найвищий пріоритет.

**Термінові задачі-блокери** (від них залежать інші, стартують першими; мерджимо
мінімально робочу версію якнайшвидше, далі допилюємо):

| Блокер | Кого розблоковує |
|---|---|
| **S1 — сторы** (auth + filters) | Header, форми, SaveButton, SearchBox, Filters, RecipesList |
| **S2 — `lib/constants.ts`** (ROUTES, QUERY_KEYS) | майже всі (посилання, ключі запитів) |
| **`searchRecipes`** у clientApi (пише S9) | Home, Filters, RecipesList |
| **`getCategories`/`getIngredients`** (пише S8) | Filters, Add recipe |
| **S10 — RecipeCard + SaveButton** | RecipesList |
| **S4 — Modal + AuthModal** | SaveButton (гостьова модалка), Footer |

## Порядок виконання (хвилі: старт → фініш)

**Хвиля 0 — фундамент (старт ОДРАЗУ, паралельно):** S1 (сторы), S2 (constants +
Loader + сервісні сторінки).
*Кінець хвилі:* є сторы, типи, константи, axios — далі можна писати все.

**Хвиля 1 — будівельні блоки (щойно готова Хвиля 0):** S10 (RecipeCard +
SaveButton), S4 (Modal + AuthModal + Footer), S8 (Filters + `getCategories`/
`getIngredients`), S3 (Header), S5/S6 (форми), + S9 додає `searchRecipes`.

**Хвиля 2 — композиція (залежить від Хвилі 1):** S9 (RecipesList — потрібен
RecipeCard від S10), **S7 (Home + Hero — ЦІЛЬ ДЕДЛАЙНУ; потрібні SearchBox +
Filters + RecipesList)**.

**Хвиля 3 — сторінки контенту (фініш):** S11 (Recipe details — потрібен
SaveButton), S9 (Profile — потрібен RecipesList), S12 (Add recipe — потрібні
`getCategories`/`getIngredients`), Pagination (додаткове).

**Початкові точки:** S1, S2. **Кінцеві точки:** S12, S11, Pagination.

**Критичний шлях до Hero/головної (тримати в пріоритеті):**
`S1 (filtersStore)` → `searchRecipes` (clientApi) → `S10 RecipeCard` →
`S9 RecipesList` → `S7 Home + Hero`.

## Карта залежностей (точки дотику)

- `SaveButton` (S10) ← використовують RecipeCard (S10), RecipeDetails (S11)
- `Modal`/`AuthModal` (S4) ← Footer (S4), SaveButton (S10)
- `RecipesList` (S9) ← Home (S7), Profile (S9)
- `filtersStore` (S1) ← SearchBox (S7), Filters (S8), RecipesList (S9)
- `authStore` (S1) ← Header (S3), форми (S5, S6), SaveButton (S10)

Домовтесь про **пропси** пограничних компонентів (SaveButton, RecipesList, Modal)
на старті — це єдині місця перетину.

## Конвенції

- Server Components за замовчуванням; `'use client'` лише де потрібні хуки/події.
- CSS Modules, класи `camelCase`. Глобальне — лише `app/globals.css`.
- Кольори/шрифт/радіуси/тіні — **тільки через CSS-змінні** з `globals.css`
  (див. `design/TOKENS.md`). Точні відступи блоку — з Figma Dev Mode.
- Зображення — `next/image`. Помилки/успіх — `react-hot-toast`.
- `npm run lint` перед PR.

## Git-процес

Гілка `feature/<задача>` від `main` → коміт **тільки своїх файлів** → PR → ревʼю
тимліда → мердж. Функцію в `clientApi.ts` — окремим маленьким PR.

## Запуск

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL = адреса бекенду
npm run dev
```
