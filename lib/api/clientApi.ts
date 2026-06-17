import type { User } from '@/types/user';
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

export { api };
