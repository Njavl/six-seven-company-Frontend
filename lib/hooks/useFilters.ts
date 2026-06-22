'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') ?? '';
  const selectedIngredient = searchParams.get('ingredient') ?? '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('category');
    params.delete('ingredient');
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return {
    selectedCategory,
    selectedIngredient,
    updateFilter,
    resetFilters,
  };
};