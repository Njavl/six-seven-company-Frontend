import Link from 'next/link';
import styles from './not-found.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found | Tastorama',
  description: 'The page you are looking for does not exist.',
  openGraph: {
    title: 'Page not found | Tastorama',
    description: 'The page you are looking for does not exist.',
  },
};

export default async function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>
        The page you&apos;re looking for may have been moved or removed.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.btnPrimary}>
          Go home
        </Link>
      </div>
    </div>
  );
}
