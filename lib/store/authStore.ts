import { create } from 'zustand';
import type { User } from '@/types/user';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    setIsLoading: (isLoading: boolean) => void;
    setFavorite: (recipeId: string, value: boolean) => void;
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

    setFavorite: (recipeId, value) =>
        set((state) => {
            if (!state.user) return state;
            const has = state.user.favorites.includes(recipeId);
            if (value === has) return state;
            const favorites = value
                ? [...state.user.favorites, recipeId]
                : state.user.favorites.filter((id) => id !== recipeId);
            return { user: { ...state.user, favorites } };
        }),
}));

export default useAuthStore;