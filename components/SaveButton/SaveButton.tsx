'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/authStore';
import { addFavorite, removeFavorite } from '@/lib/api/clientApi';
import styles from './SaveButton.module.css';

interface SaveButtonProps {
  recipeId: string;
  isFavoriteInitial?: boolean;
}

export default function SaveButton({
  recipeId,
  isFavoriteInitial = false,
}: SaveButtonProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to save recipes.');
      return;
    }

    if (isLoading) return;

    const previousFavorite = isFavorite;
    setIsLoading(true);
    setIsFavorite(!previousFavorite);

    try {
      if (previousFavorite) {
        await removeFavorite(recipeId);
      } else {
        await addFavorite(recipeId);
      }
    } catch {
      setIsFavorite(previousFavorite);
      toast.error('Could not update favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSaveClick}
      disabled={isLoading}
      className={`${styles.iconBtn} ${isFavorite ? styles.saved : ''}`.trim()}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isFavorite ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={styles.icon}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      )}
    </button>
  );
}
