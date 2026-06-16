import { AuthCredentials, User } from '@/types/user';
import api from './api';

export async function login(payload: AuthCredentials): Promise<User>{
    const { data } = await api.post<User>(
        '/auth/login',
        payload
    );
    return data;
}


