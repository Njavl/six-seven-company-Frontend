'use client';

import Link from 'next/link';
import { useState } from 'react';

import useAuthStore from '@/lib/store/authStore';
import { ROUTES } from '@/lib/constants/routes';
import AuthAlertModal from '@/components/AuthAlertModal/AuthAlertModal';
import css from './Footer.module.css';

export default function Footer() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <Link href={ROUTES.HOME} className={css.logo}>
          <svg
            className={css.logoIcon}
            width="28"
            height="26"
            fill="currentColor"
            aria-hidden="true"
          >
            <use href="#icon-logo" />
          </svg>
          Tasteorama
        </Link>

        <p className={css.copyright}>
          &#169; 2025 Tasteorama. All rights reserved.
        </p>

        <nav className={css.nav}>
          <Link href={ROUTES.HOME}>Recipes</Link>
          {isAuthenticated ? (
            <Link href={`${ROUTES.PROFILE}/own`}>My Profile</Link>
          ) : (
            <button
              type="button"
              className={css.navBtn}
              onClick={() => setIsAuthModalOpen(true)}
            >
              Account
            </button>
          )}
        </nav>
      </div>

      <AuthAlertModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="You are not signed in"
        description="Log in or create an account to continue"
      />
    </footer>
  );
}
