import Link from 'next/link';
import useAuthStore from '@/lib/store/authStore';
import css from '../AuthNavigation/AuthNavigation.module.css'; 

interface NavLinksProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
  onClose?: () => void;
  variant: 'header' | 'mobile';
}

export default function NavLinks({ isAuthenticated, onLogout, onOpenLogin, onClose, 
    variant }: NavLinksProps) {
    const containerClass = variant === 'mobile' ? css.mobileList : css.desktopList;
    const { user } = useAuthStore();
  return (
    <div className={containerClass}>
      {isAuthenticated ? (
        <div className={css.authGroup}>  
          <Link href="/" className={css.navLink} onClick={onClose}>Recipes</Link>
          <Link href="/profile" className={css.navLink} onClick={onClose}>My Profile</Link>
          <Link href="/add-recipe" className={css.addRecipeBtn} onClick={onClose}>Add Recipe</Link>
          <div className={css.userNav}>
            <div className={css.userAvatar}>
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className={css.userName}>
              <strong>{user?.name || 'User'}</strong>
            </span>
            <span className={css.divider}></span>
            <button onClick={() => { onLogout(); onClose?.(); }} className={css.logoutButton}>
                <svg width="24" height="24" aria-hidden="true">
                <use href="/icons/sprite.svg#icon-logout" />
                </svg>
           </button>
          </div>
        </div>
      ) : (
        <div className={css.guestGroup}>
          <Link href="/" className={css.navLink} onClick={onClose}>Recipes</Link>
          <Link href="/auth/login" className={css.linkButton} onClick={onClose}>Log in</Link>
          <Link href="/auth/register" className={css.registerBtn} onClick={onClose}>Register</Link>
        </div>
      )}
    </div>  
  );
}