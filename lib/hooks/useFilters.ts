'use client';

import { useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useFiltersStore from '@/lib/store/filtersStore';

type FilterValues = {
  search: string;
  category: string;
  ingredient: string;
  page: number;
};

function buildUrl(pathname: string, values: FilterValues): string {
  const params = new URLSearchParams();
  if (values.search) params.set('search', values.search);
  if (values.category) params.set('category', values.category);
  if (values.ingredient) params.set('ingredient', values.ingredient);
  if (values.page > 1) params.set('page', String(values.page));

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * Hybrid filter state: Zustand store is the canonical UI state, the URL is a
 * synced mirror. Reads come from the store; every action writes both the store
 * (instant, reactive) and the URL (shareable, reload/back-forward safe).
 */
export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = useFiltersStore((s) => s.search);
  const category = useFiltersStore((s) => s.category);
  const ingredient = useFiltersStore((s) => s.ingredient);
  const page = useFiltersStore((s) => s.page);
  const perPage = useFiltersStore((s) => s.perPage);

  const setFromUrl = useFiltersStore((s) => s.setFromUrl);
  const storeSetSearch = useFiltersStore((s) => s.setSearch);
  const storeSetCategory = useFiltersStore((s) => s.setCategory);
  const storeSetIngredient = useFiltersStore((s) => s.setIngredient);
  const storeSetPage = useFiltersStore((s) => s.setPage);

  // URL -> store: deep links, reloads, browser back/forward.
  useEffect(() => {
    setFromUrl({
      search: searchParams.get('search') ?? '',
      category: searchParams.get('category') ?? '',
      ingredient: searchParams.get('ingredient') ?? '',
      page: Number(searchParams.get('page')) || 1,
    });
  }, [searchParams, setFromUrl]);

  const syncUrl = useCallback(
    (values: FilterValues) => {
      router.push(buildUrl(pathname, values));
    },
    [router, pathname]
  );

  const setSearch = useCallback(
    (value: string) => {
      storeSetSearch(value);
      syncUrl({ search: value, category, ingredient, page: 1 });
    },
    [storeSetSearch, syncUrl, category, ingredient]
  );

  const setCategory = useCallback(
    (value: string) => {
      storeSetCategory(value);
      syncUrl({ search, category: value, ingredient, page: 1 });
    },
    [storeSetCategory, syncUrl, search, ingredient]
  );

  const setIngredient = useCallback(
    (value: string) => {
      storeSetIngredient(value);
      syncUrl({ search, category, ingredient: value, page: 1 });
    },
    [storeSetIngredient, syncUrl, search, category]
  );

  const setPage = useCallback(
    (value: number) => {
      storeSetPage(value);
      syncUrl({ search, category, ingredient, page: value });
    },
    [storeSetPage, syncUrl, search, category, ingredient]
  );

  // Reset clears only the Filters selections (category/ingredient), keeping the
  // free-text search, per the spec ("Reset — скасування всіх обраних фільтрів").
  const resetFilters = useCallback(() => {
    storeSetCategory('');
    storeSetIngredient('');
    syncUrl({ search, category: '', ingredient: '', page: 1 });
  }, [storeSetCategory, storeSetIngredient, syncUrl, search]);

  return {
    search,
    category,
    ingredient,
    page,
    perPage,
    setSearch,
    setCategory,
    setIngredient,
    setPage,
    resetFilters,
  };
}
