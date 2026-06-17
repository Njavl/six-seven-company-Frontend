import type { Category } from '@/types/category';
import type { Ingredient } from '@/types/ingredient';
import type { AuthCredentials, User } from '@/types/user';
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

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories');
  return data;
};

export const getIngredients = async (): Promise<Ingredient[]> => {
  const { data } = await api.get<Ingredient[]>('/ingredients');
  return data;
};

export { api };