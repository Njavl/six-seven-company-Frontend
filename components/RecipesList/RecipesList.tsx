'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  getFavoriteRecipes,
  getOwnRecipes,
  searchRecipes,
} from '@/lib/api/clientApi';
import { useFilters } from '@/lib/hooks/useFilters';
import type { Recipe, RecipeListResponse } from '@/types/recipe';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
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
    queryKey: ['recipes', source, { search, category, ingredient, perPage }],
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
    return <p className={styles.status}>Loading recipes…</p>;
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
            <RecipePreviewCard recipe={recipe} />
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

function RecipePreviewCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        {recipe.thumb && (
          <Image
            alt={recipe.title}
            className={styles.thumbImage}
            fill
            sizes="(min-width: 1440px) 320px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
            src={recipe.thumb}
          />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.cardTitle}>{recipe.title}</h3>
          {recipe.time && (
            <span className={styles.badge}>
              <svg className={styles.badgeIcon} aria-hidden="true">
                <use href="/icons/sprite.svg#icon-clock" />
              </svg>
              {recipe.time}
            </span>
          )}
        </div>
        <p className={styles.description}>{recipe.description}</p>
        {recipe.calories != null && (
          <p className={styles.calories}>~{recipe.calories} cals</p>
        )}
        <div className={styles.actions}>
          <Link className={styles.learnMore} href={`/recipes/${recipe._id}`}>
            Learn more
          </Link>
          <button
            aria-label="Save recipe"
            className={styles.save}
            type="button"
          >
            <svg className={styles.saveIcon} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bookmark" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
