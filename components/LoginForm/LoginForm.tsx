'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './LoginForm.module.css';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { login } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';

import { loginSchema } from './validation';
import { AuthCredentials } from '@/types/user';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';
import { ROUTES } from '@/lib/constants/routes';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (
    values: AuthCredentials,
    actions: FormikHelpers<AuthCredentials>
  ) => {
    try {
      const user = await login(values);
      setUser(user);
      toast.success('Welcome back!');
      router.push(ROUTES.HOME);
    } catch {
      toast.error('Login failed');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({ isSubmitting, isValid, errors, touched }) => (
        <Form className={css.loginForm}>
          <h1 className={css.title}>Login</h1>

          <div className={css.formGroup}>
            <label htmlFor="email" className={css.label}>
              Enter your email address
            </label>

            <Field
              className={`${css.input} ${
                touched.email && errors.email
                  ? css.inputError
                  : touched.email && !errors.email
                    ? css.inputSuccess
                    : ''
              }`}
              type="email"
              id="email"
              name="email"
              placeholder="email@gmail.com"
            />

            <ErrorMessage name="email" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password" className={css.label}>
              Enter a password
            </label>
            <div className={css.passwordWrapper}>
              <Field
                className={`${css.input} ${
                  touched.password && errors.password
                    ? css.inputError
                    : touched.password && !errors.password
                      ? css.inputSuccess
                      : ''
                }`}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="********"
              />
              <button
                type="button"
                className={css.eyeBtn}
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <use
                    href={`#icon-${
                      showPassword ? 'hidePassword' : 'showPassword'
                    }`}
                  />
                </svg>
              </button>
            </div>
            <ErrorMessage name="password" component="p" className={css.error} />
          </div>

          <button
            className={css.submitBtn}
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? <Loader /> : 'Login'}
          </button>

          <p className={css.text}>
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.REGISTER} className={css.link}>
              Register
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
