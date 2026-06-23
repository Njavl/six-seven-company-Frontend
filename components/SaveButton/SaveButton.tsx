'use client';

import { useEffect, useState } from 'react';
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
  const setFavorite = useAuthStore((state) => state.setFavorite);
  const inFavorites = useAuthStore(
    (state) => state.user?.favorites?.includes(recipeId) ?? false
  );
  const [isFavorite, setIsFavorite] = useState(
    inFavorites || isFavoriteInitial
  );
  const [isLoading, setIsLoading] = useState(false);

  // The user (and their favorites) loads asynchronously on mount, so sync the
  // saved state to the store once it arrives — otherwise saved recipes stay
  // unmarked on reload. The store is the source of truth for an authed user;
  // `isFavoriteInitial` is only a first-paint hint (see the useState seed).
  useEffect(() => {
    if (isAuthenticated) setIsFavorite(inFavorites);
  }, [isAuthenticated, inFavorites]);

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
      setFavorite(recipeId, !previousFavorite);
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
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
      )}
    </button>
  );
}
