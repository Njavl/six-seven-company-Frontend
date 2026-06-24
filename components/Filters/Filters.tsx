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
import Dropdown from './Dropdown';
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

  const categoryOptions = categories.map(item => ({
    value: item.name,
    label: item.name,
  }));
  const ingredientOptions = ingredients.map(item => ({
    value: item.name,
    label: item.name,
  }));

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
        aria-label="Open filters"
      >
        Filters
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <use href="#icon-filter" />
        </svg>
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
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <use href="#icon-exit" />
            </svg>
          </button>
        </div>

        <button className={styles.reset} type="button" onClick={handleReset}>
          Reset filters
        </button>

        <div className={styles.field}>
          <Dropdown
            value={category}
            placeholder="Category"
            options={categoryOptions}
            onChange={setCategory}
          />
        </div>

        <div className={styles.field}>
          <Dropdown
            value={ingredient}
            placeholder="Ingredient"
            options={ingredientOptions}
            onChange={setIngredient}
          />
        </div>
      </div>
    </div>
  );
}
