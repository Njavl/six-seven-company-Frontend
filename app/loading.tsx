import Loader from '@/components/Loader/Loader';

import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.page}>
      <Loader />
    </div>
  );
}
