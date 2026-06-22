'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import styles from './ProfileNavigation.module.css';

const tabs = [
  { type: 'own', label: 'My recipes' },
  { type: 'favorites', label: 'Saved recipes' },
] as const;

export default function ProfileNavigation() {
  const params = useParams<{ recipeType: string }>();
  const active = params.recipeType;

  return (
    <nav className={styles.nav}>
      {tabs.map(tab => (
        <Link
          key={tab.type}
          aria-current={active === tab.type ? 'page' : undefined}
          className={`${styles.tab} ${active === tab.type ? styles.tabActive : ''}`.trim()}
          href={`${ROUTES.PROFILE}/${tab.type}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
