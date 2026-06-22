import axios, { type AxiosResponse } from 'axios';
import type { Recipe } from '@/types/recipe';
import type { Ingredient } from '@/types/ingredient';

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

export async function getRecipeById(recipeId: string): Promise<Recipe> {
  const { data } = await serverApi.get<Recipe>(`/recipes/${recipeId}`);
  return data;
}

export async function getIngredients(): Promise<Ingredient[]> {
  const { data } = await serverApi.get<Ingredient[]>('/ingredients');
  return data;
}

export default serverApi;
