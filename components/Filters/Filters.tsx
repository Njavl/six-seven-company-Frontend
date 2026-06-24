'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getCategories,
  getIngredients,
  searchRecipes,
} from '@/lib/api/clientApi';
import { useFilters } from '@/lib/hooks/useFilters';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import styles from './Filters.module.css';

export default function Filters() {
  const {
    search,
    category,
    ingredient,
    setCategory,
    setIngredient,
    resetFilters,
  } = useFilters();
  const [isOpen, setIsOpen] = useState(false);

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

  const { data: countData } = useQuery({
    queryKey: [QUERY_KEYS.RECIPES, 'count', { search, category, ingredient }],
    queryFn: () => searchRecipes({ search, category, ingredient, perPage: 1 }),
  });
  const total = countData?.total ?? 0;

  const hasActiveFilters = Boolean(category || ingredient);

  const handleReset = () => {
    resetFilters();
    setIsOpen(false);
  };

  return (
    <div className={styles.filters}>
      <p className={styles.count}>{total} recipes</p>

      <button
        className={styles.mobileButton}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Filters
      </button>

      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`${styles.controls} ${isOpen ? styles.controlsOpen : ''}`}>
        <div className={styles.mobileHeader}>
          <p className={styles.mobileTitle}>Filters</p>
          <button
            className={styles.closeButton}
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

        {hasActiveFilters && (
          <button className={styles.reset} type="button" onClick={handleReset}>
            Reset filters
          </button>
        )}

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
      </div>
    </div>
  );
}
