'use client';

import Link from 'next/link';

import useAuthStore from '@/lib/store/authStore';
import css from './Footer.module.css';

export default function Footer() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>
          Tasteorama
        </Link>

        <p className={css.copyright}>
          &#169; 2025 Tasteorama. All rights reserved.
        </p>

        <nav className={css.nav}>
          <Link href="/">Recipes</Link>
          <Link href={isAuthenticated ? '/profile/own' : '/auth/login'}>
            {isAuthenticated ? 'My Profile' : 'Log in'}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
