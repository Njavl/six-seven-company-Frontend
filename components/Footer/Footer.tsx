'use client';

import Link from 'next/link';

import useAuthStore from '@/lib/store/authStore';
import { ROUTES } from '@/lib/constants/routes';
import css from './Footer.module.css';

export default function Footer() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <Link href={ROUTES.HOME} className={css.logo}>
          Tasteorama
        </Link>

        <p className={css.copyright}>
          &#169; 2025 Tasteorama. All rights reserved.
        </p>

        <nav className={css.nav}>
          <Link href={ROUTES.HOME}>Recipes</Link>
          <Link href={isAuthenticated ? `${ROUTES.PROFILE}/own` : ROUTES.LOGIN}>
            {isAuthenticated ? 'My Profile' : 'Log in'}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
