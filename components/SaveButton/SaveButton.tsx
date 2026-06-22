'use client';

import { useState } from 'react';
import styles from './SaveButton.module.css';

interface SaveButtonProps {
  recipeId: string;
  isFavoriteInitial?: boolean;
  isLoggedIn?: boolean;
}

export default function SaveButton({
  recipeId,
  isFavoriteInitial = false,
  isLoggedIn = false,
}: SaveButtonProps) {


  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('Будь ласка, авторизуйтесь, щоб додавати рецепти в обране.');
      return;
    }

    if (isLoading) return;

const previousFavorite = isFavorite; 

setIsLoading(true);
setIsFavorite(!previousFavorite); 

try {
  console.log(
    previousFavorite 
      ? `Рецепт ${recipeId} видалено з обраного` 
      : `Рецепт ${recipeId} додано в обране`
  );
} catch (error) {
  console.error('Не вдалося оновити статус обраного:', error);
  setIsFavorite(previousFavorite); 
  alert('Не вдалося зберегти. Спробуйте пізніше.');
} finally {
  setIsLoading(false);
}
  };
  
  return (
    <button
      onClick={handleSaveClick}
      disabled={isLoading}
      className={`${styles.iconBtn} ${isFavorite ? styles.saved : ''}`.trim()}
      aria-label={isFavorite ? 'Видалити з улюблених' : 'Додати до улюблених'}
    >
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <svg
            className="spinner"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isFavorite ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={styles.icon}
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