'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import styles from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.description}>
        An unexpected error occurred. Please try again.
      </p>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={reset}>
          Try again
        </button>
        <Link href={ROUTES.HOME} className={styles.btnSecondary}>
          Go home
        </Link>
      </div>
    </div>
  );
}
