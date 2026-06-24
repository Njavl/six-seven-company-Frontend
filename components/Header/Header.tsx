import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import AuthNavigation from '../AuthNavigation/AuthNavigation';
import css from './Header.module.css';

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href={ROUTES.HOME} className={css.logo}>
          <svg
            className={css.logoIcon}
            width="32"
            height="30"
            fill="currentColor"
            aria-hidden="true"
          >
            <use href="#icon-logo" />
          </svg>
          Tasteorama
        </Link>
        <AuthNavigation variant="header" />
      </div>
    </header>
  );
}
