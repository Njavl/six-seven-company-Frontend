'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getFavoriteRecipes,
  getOwnRecipes,
  searchRecipes,
} from '@/lib/api/clientApi';
import { useFilters } from '@/lib/hooks/useFilters';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import type { RecipeListResponse } from '@/types/recipe';
import RecipeCard from '../RecipeCard/RecipeCard';
import Pagination from '../Pagination/Pagination';
import Loader from '../Loader/Loader';
import styles from './RecipesList.module.css';
import EmptySearch from '../EmptySearch/EmptySearch';

type Source = 'search' | 'own' | 'favorites';

type RecipesListProps = {
  source?: Source;
  perPage?: number;
};

const fetchers: Record<
  Source,
  (params: {
    page: number;
    perPage: number;
    search?: string;
    category?: string;
    ingredient?: string;
  }) => Promise<RecipeListResponse>
> = {
  search: searchRecipes,
  own: getOwnRecipes,
  favorites: getFavoriteRecipes,
};

const emptyText: Record<Source, string> = {
  search: 'No recipes found. Try a different search or filters.',
  own: 'You have not created any recipes yet.',
  favorites: 'You have not saved any recipes yet.',
};

export default function RecipesList({
  source = 'search',
  perPage = 12,
}: RecipesListProps) {
  const filters = useFilters();
  const isSearch = source === 'search';
  const search = isSearch ? filters.search : '';
  const category = isSearch ? filters.category : '';
  const ingredient = isSearch ? filters.ingredient : '';

  // For search, page lives in the URL/store (useFilters resets it to 1 on filter
  // changes). Profile lists (own/favorites) have no filters, so they keep a local
  // page that resets when the tab (source) switches.
  const [localPage, setLocalPage] = useState(1);
  useEffect(() => {
    setLocalPage(1);
  }, [source]);

  const page = isSearch ? filters.page : localPage;
  const handlePageChange = isSearch ? filters.setPage : setLocalPage;

  const { data, isPending, isError } = useQuery({
    queryKey: [
      QUERY_KEYS.RECIPES,
      source,
      { search, category, ingredient, perPage, page },
    ],
    queryFn: () =>
      fetchers[source]({ page, perPage, search, category, ingredient }),
  });

  if (isPending) {
    return (
      <div className={styles.status}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <p className={styles.status} role="alert">
        Could not load recipes. Please try again.
      </p>
    );
  }

  const recipes = data.recipes;

  // Profile tabs (own/favorites) show a recipe count; search shows it via Filters.
  const countLabel =
    source !== 'search' ? (
      <p className={styles.count}>{data.total} recipes</p>
    ) : null;

  if (recipes.length === 0) {
    return (
      <div className={styles.wrapper}>
        {countLabel}
        <p className={styles.status}>{emptyText[source]}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {countLabel}
      <ul className={styles.grid}>
        {recipes.map(recipe => (
          <li key={recipe._id}>
            <RecipeCard
              id={recipe._id}
              title={recipe.title}
              thumb={recipe.thumb}
              time={recipe.time}
              description={recipe.description}
              calories={recipe.calories}
              isFavorite={source === 'favorites'}
              showDelete={source === 'own'}
            />
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
