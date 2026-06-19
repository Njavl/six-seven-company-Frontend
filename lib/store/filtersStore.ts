import { create } from 'zustand';

interface FiltersState {
    search: string;
    category: string;
    ingredient: string;
    page: number;
    perPage: number;
    setSearch: (search: string) => void;
    setCategory: (category: string) => void;
    setIngredient: (ingredient: string) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
}

const useFiltersStore = create<FiltersState>((set) => ({
    search: '',
    category: '',
    ingredient: '',
    page: 1,
    perPage: 12,

    setSearch: (search) => set({ search, page: 1 }),
    setCategory: (category) => set({ category, page: 1 }),
    setIngredient: (ingredient) => set({ ingredient, page: 1 }),
    setPage: (page) => set({ page }),

    resetFilters: () =>
        set({
            search: '',
            category: '',
            ingredient: '',
            page: 1,
            perPage: 12,
        }),
}));

export default useFiltersStore;