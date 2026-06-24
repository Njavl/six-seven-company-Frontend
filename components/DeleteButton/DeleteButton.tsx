'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteRecipe } from '@/lib/api/clientApi';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import styles from './DeleteButton.module.css';

interface DeleteButtonProps {
  recipeId: string;
}

export default function DeleteButton({ recipeId }: DeleteButtonProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await deleteRecipe(recipeId);
      // Refresh the lists so the deleted recipe drops off "My recipes".
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECIPES] });
      toast.success('Recipe deleted');
    } catch {
      toast.error('Could not delete recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isLoading}
      className={styles.deleteBtn}
      aria-label="Delete recipe"
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <svg
          className={styles.icon}
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <use href="#icon-delete" />
        </svg>
      )}
    </button>
  );
}
