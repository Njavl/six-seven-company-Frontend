'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { ROUTES } from '@/lib/constants/routes';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
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
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Logout failed');
    } finally {
      clearUser();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECIPES] });
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
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <use href="#icon-menu" />
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
