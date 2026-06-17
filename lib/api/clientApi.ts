import type { AuthCredentials, User } from '@/types/user';
import type { RecipeListResponse, SearchRecipesParams } from '@/types/recipe';
import api from './api';

export const getCurrentUser = async () => {
  const { data } = await api.get<User>('/users/current');
  return data;
};

export const refreshSession = async () => {
  try {
    await api.post('/auth/refresh');
    return true;
  } catch {
    return false;
  }
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export async function login(payload: AuthCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
}

type ListParams = {
  page?: number;
  perPage?: number;
};

const buildRecipeParams = (params: SearchRecipesParams) => {
  const query: Record<string, string | number> = {};

  if (params.page) query.page = params.page;
  if (params.perPage) query.perPage = params.perPage;
  if (params.search?.trim()) query.search = params.search.trim();
  if (params.category) query.category = params.category;
  if (params.ingredient) query.ingredient = params.ingredient;

  return query;
};

type Wrapped<T> = {
  status: number;
  message: string;
  data: T;
};

export async function searchRecipes(
  params: SearchRecipesParams = {}
): Promise<RecipeListResponse> {
  const { data } = await api.get<RecipeListResponse>('/recipes/search', {
    params: buildRecipeParams(params),
  });
  return data;
}

export async function getOwnRecipes(
  params: ListParams = {}
): Promise<RecipeListResponse> {
  const { data } = await api.get<Wrapped<RecipeListResponse>>('/recipes/own', {
    params: buildRecipeParams(params),
  });
  return data.data;
}

export async function getFavoriteRecipes(
  params: ListParams = {}
): Promise<RecipeListResponse> {
  const { data } = await api.get<Wrapped<RecipeListResponse>>(
    '/recipes/favorites',
    { params: buildRecipeParams(params) }
  );
  return data.data;
}

export { api };
