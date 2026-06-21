'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getCategories, getIngredients } from '@/lib/api/clientApi';

import css from './Filters.module.css';

type FiltersProps = {
  total?: number;
};

export default function Filters({ total = 0 }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = searchParams.get('category') ?? '';
  const selectedIngredient = searchParams.get('ingredient') ?? '';

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  });

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
    router.push(pathname);
    setIsOpen(false);
  };

  return (
    <section className={css.filters}>
      <p className={css.count}>{total} recipes</p>

      <button
        className={css.mobileButton}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Filters
      </button>

      <div className={`${css.controls} ${isOpen ? css.controlsOpen : ''}`}>
        <div className={css.mobileHeader}>
          <p className={css.mobileTitle}>Filters</p>

          <button
            className={css.closeButton}
            type="button"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <button className={css.resetButton} type="button" onClick={resetFilters}>
          Reset filters
        </button>

        <select
          className={css.select}
          value={selectedCategory}
          onChange={event => updateFilter('category', event.target.value)}
        >
          <option value="">Category</option>

          {categories.map(category => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className={css.select}
          value={selectedIngredient}
          onChange={event => updateFilter('ingredient', event.target.value)}
        >
          <option value="">Ingredient</option>

          {ingredients.map(ingredient => (
            <option key={ingredient._id} value={ingredient.name}>
              {ingredient.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}