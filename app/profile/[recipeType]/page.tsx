'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileNavigation from '@/components/ProfileNavigation/ProfileNavigation';
import RecipesList from '@/components/RecipesList/RecipesList';
import useAuthStore from '@/lib/store/authStore';
import styles from './page.module.css';

const validTypes = ['own', 'favorites'] as const;
type RecipeType = (typeof validTypes)[number];

export default function ProfilePage() {
  const { recipeType } = useParams<{ recipeType: string }>();
  const router = useRouter();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (!validTypes.includes(recipeType as RecipeType)) {
    notFound();
  }

  if (isLoading || !isAuthenticated) {
    return <p className={styles.status}>Loading…</p>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h1 className={styles.title}>My profile</h1>
        <ProfileNavigation />
        <RecipesList source={recipeType as RecipeType} />
      </div>
    </section>
  );
}
