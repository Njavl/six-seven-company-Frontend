'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCategories, getIngredients } from '@/lib/api/clientApi';
import { useFilters } from '@/lib/hooks/useFilters';

import css from './Filters.module.css';

export default function Filters() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    selectedCategory,
    selectedIngredient,
    updateFilter,
    resetFilters,
  } = useFilters();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  });

  const handleResetFilters = () => {
    resetFilters();
    setIsOpen(false);
  };

  return (
    <section className={css.filters}>
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

        <button
          className={css.resetButton}
          type="button"
          onClick={handleResetFilters}
        >
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