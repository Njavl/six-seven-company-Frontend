import api from './api';
import type { AuthCredentials, RegisterCredentials, User } from '@/types/user';
import type {
  Recipe,
  RecipeListResponse,
  SearchRecipesParams,
  CreateRecipePayload,
} from '@/types/recipe';
import type { Category } from '@/types/category';
import type { Ingredient } from '@/types/ingredient';

export async function getRecipeById(recipeId: string): Promise<Recipe> {
  const { data } = await api.get<Recipe>(`/recipes/${recipeId}`);
  return data;
}

export async function createRecipe(
  payload: CreateRecipePayload
): Promise<Recipe> {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('category', payload.category);
  formData.append('time', payload.time);
  formData.append('instructions', payload.instructions);
  if (payload.area) formData.append('area', payload.area);
  if (payload.calories != null) {
    formData.append('calories', String(payload.calories));
  }
  formData.append(
    'ingredients',
    JSON.stringify(
      payload.ingredients.map(({ id, measure }) => ({ id, measure }))
    )
  );
  formData.append('recipeImg', payload.recipeImg);

  const { data } = await api.post<Recipe>('/recipes', formData);
  return data;
}

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

export async function register(payload: RegisterCredentials): Promise<User> {
  const { data } = await api.post<User>('/auth/register', payload);
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

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories');
  return data;
};

export const getIngredients = async (): Promise<Ingredient[]> => {
  const { data } = await api.get<Ingredient[]>('/ingredients');
  return data;
};

export async function addFavorite(recipeId: string): Promise<Recipe> {
  const { data } = await api.post<Wrapped<Recipe>>(
    `/recipes/${recipeId}/favorite`
  );
  return data.data;
}

export async function removeFavorite(recipeId: string): Promise<void> {
  await api.delete(`/recipes/${recipeId}/favorite`);
}

export { api };
