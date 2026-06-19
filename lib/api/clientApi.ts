import type { AuthCredentials, User } from '@/types/user';
import api from './api';
import type { Recipe } from '@/types/recipe';


export async function getRecipeById(
  recipeId: string
): Promise<Recipe> {
  const { data } = await api.get<Recipe>(`/recipes/${recipeId}`);
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

export { api };
