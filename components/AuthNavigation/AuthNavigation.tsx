'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { ROUTES } from '@/lib/constants/routes';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();

  const { isAuthenticated, user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Logout failed');
    } finally {
      clearUser();
      router.push(ROUTES.HOME);
    }
  };

  return (
    <nav className={css.nav}>
      {isAuthenticated ? (
        <div className={css.authGroup}>
          <Link href={`${ROUTES.PROFILE}/own`} className={css.navLink}>
            My Profile
          </Link>
          <Link href={ROUTES.ADD_RECIPE} className={css.registerBtn}>
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
          <Link href={ROUTES.HOME} className={css.navLink}>
            Recipes
          </Link>
          <Link href={ROUTES.LOGIN} className={css.navLink}>
            Log in
          </Link>
          <Link href={ROUTES.REGISTER} className={css.registerBtn}>
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
