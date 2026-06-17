import api from './api';
import type {
  AuthCredentials,
  RegisterCredentials,
  User,
} from '@/types/user';

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

export async function register(
  payload: RegisterCredentials
): Promise<User> {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
}

export { api };