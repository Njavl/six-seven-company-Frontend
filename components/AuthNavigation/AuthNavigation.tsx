'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import Modal from '../Modal/Modal';
import LoginForm from '../LoginForm/LoginForm';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isAuthenticated, user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Logout failed');
    } finally {
      clearUser();
      router.push('/');
    }
  };

  return (
    <nav className={css.nav}>
      {isAuthenticated ? (
        <div className={css.authGroup}>
          <Link href="/current" className={css.navLink}>
            My Profile
          </Link>
          <Link href="/add-recipe" className={css.registerBtn}>
            Add Recipe
          </Link>
          <div className={css.userNav}>
            <div className={css.userAvatar}>
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className={css.userName}>
              <strong>{user?.name || 'User'}</strong>
            </span>
            <span className={css.divider}></span>
            <button
              onClick={handleLogout}
              className={css.logoutButton}
              aria-label="Logout"
            >
              <svg width="24" height="24" aria-hidden="true">
                <use href="/icons/sprite.svg#icon-logout" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className={css.guestGroup}>
          <Link href="/" className={css.navLink}>
            Recipes
          </Link>
          <button
            type="button"
            className={css.linkButton}
            onClick={() => setIsLoginOpen(true)}
          >
            Log in
          </button>
          <Link href="/auth/register" className={css.registerBtn}>
            Register
          </Link>
        </div>
      )}

      {isLoginOpen && (
        <Modal onClose={() => setIsLoginOpen(false)}>
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </Modal>
      )}
    </nav>
  );
}
