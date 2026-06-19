'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AuthModal from '../AuthModal/AuthModal';
import css from './Footer.module.css';

export default function Footer() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = false;

  const handleAccountClick = () => {
    if (isLoggedIn) {
      router.push('/profile');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <footer className={css.footer}>
        <div className={css.container}>
          <Link href="/" className={css.logo}>
            Tasteorama
          </Link>

          <p className={css.copyright}>
            &#169; 2025 CookingCompanion. All rights reserved.
          </p>

          <nav className={css.nav}>
            <Link href="/recipes">
              Recipes
            </Link>

            {!isModalOpen && (
              <button
                type="button"
                onClick={handleAccountClick}
                className={css.accountBtn}
              >
                Account
              </button>
            )}
          </nav>
        </div>
      </footer>

      {isModalOpen && (
        <AuthModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}