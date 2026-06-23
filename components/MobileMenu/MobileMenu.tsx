'use client';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import NavLinks from '../NavLinks/NavLinks';
import css from './MobileMenu.module.css';

interface MobileMenuProps {
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  variant: 'mobile' | 'header';
}

export default function MobileMenu({
  onClose,
  isAuthenticated,
  onLogout,
  variant,
}: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className={css.mobileMenuOverlay} role="dialog" aria-modal="true">
      <div className={css.mobileMenuHeader}>
        <Link href={ROUTES.HOME} className={css.logo} onClick={onClose}>
          Tasteorama
        </Link>
        <button
          type="button"
          className={css.closeBtn}
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-close" />
          </svg>
        </button>
      </div>
      <nav className={css.menuNav}>
        <NavLinks
          variant={variant}
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          onClose={onClose}
        />
      </nav>
    </div>,
    document.body
  );
}
