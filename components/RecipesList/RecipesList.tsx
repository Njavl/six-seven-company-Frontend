'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getFavoriteRecipes,
  getOwnRecipes,
  searchRecipes,
} from '@/lib/api/clientApi';
import { useFilters } from '@/lib/hooks/useFilters';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import type { RecipeListResponse } from '@/types/recipe';
import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import Loader from '../Loader/Loader';
import styles from './RecipesList.module.css';

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

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEYS.RECIPES,
      source,
      { search, category, ingredient, perPage },
    ],
    queryFn: ({ pageParam }) =>
      fetchers[source]({
        page: pageParam,
        perPage,
        search,
        category,
        ingredient,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
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

  const recipes = data.pages.flatMap(page => page.recipes);

  if (recipes.length === 0) {
    return <p className={styles.status}>{emptyText[source]}</p>;
  }

  return (
    <div className={styles.wrapper}>
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
            />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <LoadMoreBtn
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        />
      )}
    </div>
  );
}
