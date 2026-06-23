'use client';
import Link from 'next/link';
import useAuthStore from '@/lib/store/authStore';
import { ROUTES } from '@/lib/constants/routes';
import css from '../AuthNavigation/AuthNavigation.module.css';

interface NavLinksProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onClose?: () => void;
  variant: 'header' | 'mobile';
}

export default function NavLinks({
  isAuthenticated,
  onLogout,
  onClose,
  variant,
}: NavLinksProps) {
  const containerClass =
    variant === 'mobile' ? css.mobileList : css.desktopList;
  const { user } = useAuthStore();

  return (
    <div className={containerClass}>
      {isAuthenticated ? (
        <div className={css.authGroup}>
          <Link href={ROUTES.HOME} className={css.navLink} onClick={onClose}>
            Recipes
          </Link>
          <Link
            href={`${ROUTES.PROFILE}/own`}
            className={css.navLink}
            onClick={onClose}
          >
            My Profile
          </Link>
          <Link
            href={ROUTES.ADD_RECIPE}
            className={css.addRecipeBtn}
            onClick={onClose}
          >
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
              type="button"
              onClick={() => {
                onLogout();
                onClose?.();
              }}
              className={css.logoutButton}
              aria-label="Log out"
            >
              <svg width="24" height="24" aria-hidden="true">
                <use href="/icons/sprite.svg#icon-logout" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className={css.guestGroup}>
          <Link href={ROUTES.HOME} className={css.navLink} onClick={onClose}>
            Recipes
          </Link>
          <Link
            href={ROUTES.LOGIN}
            className={css.linkButton}
            onClick={onClose}
          >
            Log in
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className={css.registerBtn}
            onClick={onClose}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
