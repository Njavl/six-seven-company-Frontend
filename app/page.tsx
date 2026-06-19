import type { Metadata } from 'next';
import Image from 'next/image';
import SearchBox from '@/components/SearchBox/SearchBox';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Recipes | Tasteorama',
  description: 'Search recipes and discover new flavors with Tasteorama.',
  openGraph: {
    title: 'Recipes | Tasteorama',
    description: 'Search recipes and discover new flavors with Tasteorama.',
  },
};

export default function MainPage() {
  return (
    <>
      <section className={styles.hero}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.heroImage}
          fill
          priority
          quality={100}
          sizes="100vw"
          src="/images/home/banner-desktop@2x.jpg"
        />
        <div className={styles.heroInner}>
          <h1 className={styles.title}>Plan, Cook, and Share Your Flavors</h1>
          <SearchBox className={styles.searchBox} />
        </div>
      </section>

      <section className={styles.recipesSection}>
        <div className={styles.recipesInner}>
          <h2 className={styles.recipesTitle}>Recipes</h2>
          <p className={styles.recipesLoading}>Loading recipes…</p>
        </div>
      </section>
    </>
  );
}
