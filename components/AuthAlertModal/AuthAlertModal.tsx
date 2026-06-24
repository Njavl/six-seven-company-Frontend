'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './AuthAlertModal.module.css';

interface AuthAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthAlertModal({
  isOpen,
  onClose,
}: AuthAlertModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.25 5.25L12 12M12 12L5.25 18.75M12 12L18.75 18.75M12 12L18.75 5.25"
              stroke="black"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className={styles.title}>Error while saving</h2>
        <p className={styles.description}>
          To save this recipe, you need to authorize first
        </p>
        <div className={styles.buttons}>
          <Link href="/auth/login" className={styles.btnLogin}>
            Log in
          </Link>
          <Link href="/auth/register" className={styles.btnRegister}>
            Register
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
