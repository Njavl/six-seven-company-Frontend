import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: true,
            isLoading: false,
        }),

    clearUser: () =>
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        }),

    setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;