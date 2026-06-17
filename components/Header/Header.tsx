import Link from 'next/link';
import css from './Header.module.css';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>
          Tasteorama
        </Link>

        <nav className={css.nav}>
          <AuthNavigation />
        </nav>

        <button className={css.menuOpenBtn} type="button" aria-label="Open menu">
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-menu" />
          </svg>
        </button>
      </div>
    </header>
  );
}
