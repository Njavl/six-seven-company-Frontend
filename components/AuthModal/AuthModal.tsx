'use client';

import { useState } from 'react';
import Modal from '../Modal/Modal';
import css from './AuthModal.module.css';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>('login');

 return (
  <Modal onClose={onClose}>
    {view === 'login' ? (
      <div className={css.loginBox}>
        <p className={css.title}>Login</p>
        
        <form className={css.form} onSubmit={(e) => e.preventDefault()}>
          <div className={css.inputGroup}>
            <label className={css.label}>Enter your email address</label>
            <input type="email" placeholder="email@gmail.com" className={css.input} />
          </div>

          <div className={css.inputGroup}>
            <label className={css.label}>Create a strong password</label>
            <div className={css.passwordWrapper}>
              <input type="password" placeholder="********" className={css.input} />
              <button type="button" className={css.eyeBtn}>👁️</button>
            </div>
          </div>

          <button type="submit" className={css.submitBtn} onClick={onClose}>
            Login
          </button>
        </form>

        <p className={css.footerText}>
          Don’t have an account?{' '}
          <button type="button" className={css.switchBtn} onClick={() => setView('register')}>
            Register
          </button>
        </p>
      </div>
    ) : (
      <div className={css.registerBox}>
        <p className={css.titleRegister}>Register</p>
        <p className={css.subtitleRegister}>
          Join our community of culinary enthusiasts, save your favorite recipes, and share your cooking creations
        </p>
        
        <form className={css.form} onSubmit={(e) => e.preventDefault()}>
          <div className={css.inputGroup}>
            <label className={css.label}>Enter your name</label>
            <input type="text" placeholder="Max" className={css.input} />
          </div>

          <div className={css.inputGroup}>
            <label className={css.label}>Enter your email address</label>
            <input type="email" placeholder="email@gmail.com" className={css.input} />
          </div>

          <div className={css.inputGroup}>
            <label className={css.label}>Create a strong password</label>
            <div className={css.passwordWrapper}>
              <input type="password" placeholder="********" className={css.input} />
              <button type="button" className={css.eyeBtn}></button>
            </div>
          </div>

          <div className={css.inputGroup}>
            <label className={css.label}>Repeat your password</label>
            <div className={css.passwordWrapper}>
              <input type="password" placeholder="********" className={css.input} />
              <button type="button" className={css.eyeBtn}></button>
            </div>
          </div>

          <button type="submit" className={css.submitBtn} onClick={onClose}>
            Create account
          </button>
        </form>

        <p className={css.footerText}>
          Already have an account?{' '}
          <button type="button" className={css.switchBtn} onClick={() => setView('login')}>
            Log in
          </button>
        </p>
      </div>
    )}
  </Modal>
);
}