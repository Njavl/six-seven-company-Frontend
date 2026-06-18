'use client';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import NavLinks from '../NavLinks/NavLinks';
import css from './MobileMenu.module.css';
import Link from 'next/link';

interface MobileMenuProps {
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  variant?: 'header' | 'mobile'; 
}

export default function MobileMenu({ onClose, isAuthenticated, onLogout, onOpenLogin, variant }: MobileMenuProps) {
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return createPortal(
    <div className={css.mobileMenuOverlay}>
      <div className={css.mobileMenuHeader}>
      <Link href="/" className={css.logo} onClick={onClose}>Tasteorama</Link>
      <button className={css.closeBtn} onClick={onClose}>
        <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-close" />
          </svg></button>
       </div>
     <nav className={css.menuNav}>
        <NavLinks 
          variant={variant}
          isAuthenticated={isAuthenticated} 
          onLogout={onLogout} 
          onOpenLogin={onOpenLogin} 
          onClose={onClose} 
        />
      </nav>
    </div>,
    document.body
  );
}