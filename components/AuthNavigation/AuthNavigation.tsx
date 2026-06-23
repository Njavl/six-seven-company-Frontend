'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { ROUTES } from '@/lib/constants/routes';
import MobileMenu from '../MobileMenu/MobileMenu';
import NavLinks from '../NavLinks/NavLinks';
import css from './AuthNavigation.module.css';

interface AuthNavigationProps {
  variant?: 'header' | 'mobile';
}

export default function AuthNavigation({
  variant = 'header',
}: AuthNavigationProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, clearUser } = useAuthStore();

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
    <>
      <nav className={css.nav}>
        <NavLinks
          variant={variant}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      </nav>

      <button
        type="button"
        className={css.menuOpenBtn}
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" aria-hidden="true">
          <use href="/icons/sprite.svg#icon-menu" />
        </svg>
      </button>

      {isMobileMenuOpen && (
        <MobileMenu
          variant="mobile"
          onClose={() => setIsMobileMenuOpen(false)}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
