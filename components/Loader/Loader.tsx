import styles from './Loader.module.css';

interface LoaderProps {
  variant?: 'page' | 'button';
}

export default function Loader({ variant = 'page' }: LoaderProps) {
  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.spinner} ${
          variant === 'button' ? styles.button : ''
        }`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
