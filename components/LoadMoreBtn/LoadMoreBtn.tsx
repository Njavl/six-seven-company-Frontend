'use client';

import styles from './LoadMoreBtn.module.css';

type LoadMoreBtnProps = {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function LoadMoreBtn({
  onClick,
  isLoading = false,
  disabled = false,
}: LoadMoreBtnProps) {
  return (
    <button
      className={styles.button}
      disabled={disabled || isLoading}
      onClick={onClick}
      type="button"
    >
      {isLoading ? 'Loading…' : 'Load More'}
    </button>
  );
}
