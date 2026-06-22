// 'use client';
import Link from 'next/link';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>Tasteorama</Link>
        <AuthNavigation variant="header" />
      </div>
    </header>
  );
}