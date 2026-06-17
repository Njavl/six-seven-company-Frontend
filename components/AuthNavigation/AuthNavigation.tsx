'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();

  const { isAuthenticated, user, clearUser } = useAuthStore();
  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      clearUser();
      router.push('/login');
    }
  };

  return (
    <nav className={css.nav}>
      {isAuthenticated ? (
        <div className={css.authGroup}>
          <Link href="/current" className={css.navLink}>My Profile</Link>
          <Link href="/recipes" className={css.registerBtn}>Add Recipe</Link>
          <div className={css.userNav}>
            <div className={css.userAvatar}>
             {user?.name 
               ? user.name.charAt(0).toUpperCase() 
               : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className={css.userName}>
            <strong>{user?.name || 'User'}</strong></span>
            <span className={css.divider}></span>
            <button onClick={handleLogout} className={css.logoutButton}aria-label="Logout">
            <img src="/button-logout.svg" alt="logout" />
            </button>
          </div>
        </div>
      ) : (
          
        <div className={css.guestGroup}>
           <Link href="/" className={css.navLink}>Recipes</Link>
           <Link href="/login" className={css.navLink}>Log in</Link>
           <Link href="/register" className={css.registerBtn}>Register</Link>
        </div>
      )}
    </nav>
  );
}