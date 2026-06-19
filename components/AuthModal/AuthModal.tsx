'use client';

import { useState } from 'react';
import Modal from '../Modal/Modal';
import css from './AuthModal.module.css';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>('login');

  // Добавляем стейты для видимости паролей (false = скрыт, true = показан)
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegisterPass, setShowRegisterPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);

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
              {/* Меняем type в зависимости от стейта */}
              <input 
                type={showLoginPass ? 'text' : 'password'} 
                placeholder="********" 
                className={css.input} 
              />
              <button 
                type="button" 
                className={css.eyeBtn} 
                onClick={() => setShowLoginPass(!showLoginPass)}
              >
                {/* Меняем картинку глаза динамически */}
                <img 
                  src={showLoginPass ? '/icons/eye.svg' : '/icons/eye-off.svg'} 
                  alt="eye" 
                  style={{ width: '20px', height: '20px' }} 
                />
              </button>
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
            <label className={css.label}>Enter your email address</label>
            <input type="email" placeholder="email@gmail.com" className={css.input} />
          </div>
          
          <div className={css.inputGroup}>
            <label className={css.label}>Enter your name</label>
            <input type="text" placeholder="Max" className={css.input} />
          </div>

          <div className={css.inputGroup}>
            <label className={css.label}>Create a strong password</label>
            <div className={css.passwordWrapper}>
              <input 
                type={showRegisterPass ? 'text' : 'password'} 
                placeholder="********" 
                className={css.input} 
              />
              <button 
                type="button" 
                className={css.eyeBtn} 
                onClick={() => setShowRegisterPass(!showRegisterPass)}
              >
                <img 
                  src={showRegisterPass ? '/icons/eye.svg' : '/icons/eye-off.svg'} 
                  alt="eye" 
                  style={{ width: '20px', height: '20px' }} 
                />
              </button>
            </div>
          </div>

          <div className={css.inputGroup}>
            <label className={css.label}>Repeat your password</label>
            <div className={css.passwordWrapper}>
              <input 
                type={showRepeatPass ? 'text' : 'password'} 
                placeholder="********" 
                className={css.input} 
              />
              <button 
                type="button" 
                className={css.eyeBtn} 
                onClick={() => setShowRepeatPass(!showRepeatPass)}
              >
                <img 
                  src={showRepeatPass ? '/icons/eye.svg' : '/icons/eye-off.svg'} 
                  alt="eye" 
                  style={{ width: '20px', height: '20px' }} 
                />
              </button>
            </div>
          </div>

          <button type="submit" className={css.submitBtnregister} onClick={onClose}>
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