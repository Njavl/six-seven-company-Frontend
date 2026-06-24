'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/authStore';
import { addFavorite, removeFavorite } from '@/lib/api/clientApi';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import AuthAlertModal from '@/components/AuthAlertModal/AuthAlertModal';
import styles from './SaveButton.module.css';

interface SaveButtonProps {
  recipeId: string;
  isFavoriteInitial?: boolean;
  onAuthRequired?: () => void;
  variant?: 'icon' | 'wide';
  className?: string;
}

export default function SaveButton({
  recipeId,
  isFavoriteInitial = false,
  onAuthRequired,
  variant = 'icon',
  className,
}: SaveButtonProps) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const setFavorite = useAuthStore(state => state.setFavorite);
  const inFavorites = useAuthStore(
    state => state.user?.favorites?.includes(recipeId) ?? false
  );
  const [isFavorite, setIsFavorite] = useState(
    inFavorites || isFavoriteInitial
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setIsFavorite(inFavorites);
  }, [isAuthenticated, inFavorites]);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        setIsAuthModalOpen(true);
      }
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
      // Refresh recipe lists (search / own / favorites) so an un-saved card
      // drops off the Saved tab immediately instead of after a manual reload.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECIPES] });
      toast.success(
        previousFavorite ? 'Removed from saved' : 'Saved to favorites'
      );
    } catch {
      setIsFavorite(previousFavorite);
      toast.error('Could not update favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isWide = variant === 'wide';

  const bookmark = (
    <svg
      className={styles.icon}
      fill={isFavorite ? 'currentColor' : 'none'}
      stroke="currentColor"
      aria-hidden="true"
    >
      <use href="#icon-save" />
    </svg>
  );

  return (
    <>
      <button
        type="button"
        onClick={handleSaveClick}
        disabled={isLoading}
        className={
          isWide
            ? (className ?? styles.button)
            : `${styles.iconBtn} ${isFavorite ? styles.saved : ''}`.trim()
        }
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isFavorite}
      >
        {isLoading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <>
            {isWide && <span>{isFavorite ? 'Saved' : 'Save'}</span>}
            {bookmark}
          </>
        )}
      </button>

      {!onAuthRequired && (
        <AuthAlertModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}
