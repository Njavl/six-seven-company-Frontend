'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  // Appends the active-page underline to any nav item (text links or buttons).
  const withActive = (base: string, active: boolean) =>
    active ? `${base} ${css.navLinkActive}` : base;

  return (
    <div className={containerClass}>
      {isAuthenticated ? (
        <div className={css.authGroup}>
          <Link
            href={ROUTES.HOME}
            className={withActive(css.navLink, pathname === ROUTES.HOME)}
            onClick={onClose}
          >
            Recipes
          </Link>
          <Link
            href={`${ROUTES.PROFILE}/own`}
            className={withActive(
              css.navLink,
              pathname.startsWith(ROUTES.PROFILE)
            )}
            onClick={onClose}
          >
            My Profile
          </Link>
          <Link
            href={ROUTES.ADD_RECIPE}
            className={withActive(
              css.addRecipeBtn,
              pathname.startsWith(ROUTES.ADD_RECIPE)
            )}
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
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <use href="#icon-logOut" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className={css.guestGroup}>
          <Link
            href={ROUTES.HOME}
            className={withActive(css.navLink, pathname === ROUTES.HOME)}
            onClick={onClose}
          >
            Recipes
          </Link>
          <Link
            href={ROUTES.LOGIN}
            className={withActive(
              css.linkButton,
              pathname.startsWith(ROUTES.LOGIN)
            )}
            onClick={onClose}
          >
            Log in
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className={withActive(
              css.registerBtn,
              pathname.startsWith(ROUTES.REGISTER)
            )}
            onClick={onClose}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
