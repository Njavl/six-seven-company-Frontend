'use client';

import useFiltersStore from '@/lib/store/filtersStore';

interface RecipesHeadingProps {
  className?: string;
}

export default function RecipesHeading({ className }: RecipesHeadingProps) {
  const search = useFiltersStore(s => s.search);
  const query = search.trim();

  return (
    <h2 className={className}>
      {query ? `Search Results for "${query}"` : 'Recipes'}
    </h2>
  );
}
