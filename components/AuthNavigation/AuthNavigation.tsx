'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import Modal from '../Modal/Modal';
import LoginForm from '../LoginForm/LoginForm';
import MobileMenu from '../MobileMenu/MobileMenu';
import NavLinks from '../NavLinks/NavLinks';
import css from './AuthNavigation.module.css';

interface AuthNavigationProps {
  variant?: 'header' | 'mobile';
}

export default function AuthNavigation({ variant = 'header' }: AuthNavigationProps) {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, clearUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    clearUser();
    router.push('/');
  };

  return (
    <>
      <nav className={css.nav}>
        <NavLinks 
          variant={variant} 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
          onOpenLogin={() => setIsLoginOpen(true)} 
        />
      </nav>

      <button 
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
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}
      {isLoginOpen && (
        <Modal onClose={() => setIsLoginOpen(false)}>
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </Modal>
      )}
    </>
  );
}