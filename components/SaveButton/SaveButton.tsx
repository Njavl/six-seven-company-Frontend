'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/authStore';
import { addFavorite, removeFavorite } from '@/lib/api/clientApi';
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
