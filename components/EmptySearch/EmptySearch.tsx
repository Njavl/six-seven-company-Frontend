import styles from './EmptySearch.module.css';

interface EmptySearchProps {
  onReset: () => void;
}

export default function EmptySearch({ onReset }: EmptySearchProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>
        We&apos;re sorry! We were not able to find a match.
      </p>
      <button type="button" className={styles.resetBtn} onClick={onReset}>
        Reset search and filters
      </button>
    </div>
  );
}
