import { create } from 'zustand';

interface UrlFilters {
  search: string;
  category: string;
  ingredient: string;
  page: number;
}

interface FiltersState extends UrlFilters {
  perPage: number;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setIngredient: (ingredient: string) => void;
  setPage: (page: number) => void;
  setFromUrl: (next: UrlFilters) => void;
  resetFilters: () => void;
}

const useFiltersStore = create<FiltersState>((set, get) => ({
  search: '',
  category: '',
  ingredient: '',
  page: 1,
  perPage: 12,

  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setIngredient: (ingredient) => set({ ingredient, page: 1 }),
  setPage: (page) => set({ page }),

  setFromUrl: (next) => {
    const state = get();
    if (
      state.search === next.search &&
      state.category === next.category &&
      state.ingredient === next.ingredient &&
      state.page === next.page
    ) {
      return;
    }
    set(next);
  },

  resetFilters: () =>
    set({ search: '', category: '', ingredient: '', page: 1 }),
}));

export default useFiltersStore;
