import Link from 'next/link';
import css from './Header.module.css';
import AuthNavigation from '../AuthNavigation/AuthNavigation';

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.headerLogo}>
          <img src="/logo.svg" alt="Tasteorama Logo" className={css.logoIcon} /></Link>
        <nav className={css.nav}>
          {/* <Link href="/recipes" className={css.navLink}>Recipes</Link> */}
          {/* <Link href="/login" className={css.navLink}>Log in</Link>
          <Link href="/register" className={css.registerBtn}>Register</Link> */}
        <AuthNavigation />
        </nav>
      </div>

      <button className={css.menuOpenBtn} type="button">
        <svg className={css.menuOpenImg} width="24" height="24">
            <use href="/burger-menu.svg"></use>
        </svg>
      </button>
    </header>
  );
};
