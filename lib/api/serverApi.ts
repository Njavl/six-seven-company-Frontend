import axios from 'axios';
import type { Recipe } from '@/types/recipe';
import type { Ingredient } from '@/types/ingredient';

// Axios instance for **Server Components** (Node runtime). Do NOT import this from
// `middleware.ts` — middleware runs in the Edge runtime and must use the
// fetch-based helpers in `edgeAuth.ts` instead (axios crashes on Edge).
const baseURL =
  (process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'https://six-seven-company.onrender.com') + '/api';

const serverApi = axios.create({
  baseURL,
  withCredentials: true,
});

export async function getRecipeById(recipeId: string): Promise<Recipe> {
  const { data } = await serverApi.get<Recipe>(`/recipes/${recipeId}`);
  return data;
}

export async function getIngredients(): Promise<Ingredient[]> {
  const { data } = await serverApi.get<Ingredient[]>('/ingredients');
  return data;
}

export default serverApi;
