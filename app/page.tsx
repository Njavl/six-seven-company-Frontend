import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import SearchBox from '@/components/SearchBox/SearchBox';
import Filters from '@/components/Filters/Filters';
import RecipesList from '@/components/RecipesList/RecipesList';
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
          <Suspense fallback={null}>
            <SearchBox className={styles.searchBox} />
          </Suspense>
        </div>
      </section>

      <section className={styles.recipesSection}>
        <div className={styles.recipesInner}>
          <h2 className={styles.recipesTitle}>Recipes</h2>
          <Suspense fallback={null}>
            <Filters />
            <RecipesList source="search" />
          </Suspense>
        </div>
      </section>
    </>
  );
}
