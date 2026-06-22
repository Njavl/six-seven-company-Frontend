'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories, getIngredients } from '@/lib/api/clientApi';
import { useFilters } from '@/lib/hooks/useFilters';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import styles from './Filters.module.css';

export default function Filters() {
  const { category, ingredient, setCategory, setIngredient, resetFilters } =
    useFilters();

  const { data: categories = [] } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: [QUERY_KEYS.INGREDIENTS],
    queryFn: getIngredients,
    staleTime: Infinity,
  });

  const hasActiveFilters = Boolean(category || ingredient);

  return (
    <div className={styles.filters}>
      <label className={styles.field}>
        <span className="visually-hidden">Category</span>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          {categories.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className="visually-hidden">Ingredient</span>
        <select
          className={styles.select}
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
        >
          <option value="">Ingredient</option>
          {ingredients.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      {hasActiveFilters && (
        <button className={styles.reset} type="button" onClick={resetFilters}>
          Reset filters
        </button>
      )}
    </div>
  );
}
