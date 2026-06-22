'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik,Form, Field, ErrorMessage, FormikHelpers, } from 'formik';
import toast from 'react-hot-toast';

import { register } from '@/lib/api/clientApi';
import useAuthStore from '@/lib/store/authStore';
import type { RegisterCredentials } from '@/types/user';

import Loader from '../Loader/Loader';
import { registrationSchema } from './validation';
import { ROUTES } from '@/lib/constants/routes';
import styles from './RegistrationForm.module.css';

interface RegisterFormValues extends RegisterCredentials {
  confirmPassword: string;
}

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegistrationForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      const user = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      setUser(user);
      toast.success('Registration successful');
      router.push(ROUTES.HOME);
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <Formik
        initialValues={initialValues}
        validationSchema={registrationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ isSubmitting, isValid, errors, touched }) => (
          <Form className={styles.card}>
            <h1 className={styles.title}>Register</h1>

            <p className={styles.description}>
              Join our community of culinary enthusiasts, save your favorite
              recipes, and share your cooking creations
            </p>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Enter your name
                </label>

                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Max"
                  className={`${styles.input} ${
                    touched.name && errors.name ? styles.inputError : ''
                  }`}
                />

                <ErrorMessage
                  name="name"
                  component="p"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Enter your email address
                </label>

                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@gmail.com"
                  className={`${styles.input} ${
                    touched.email && errors.email ? styles.inputError : ''
                  }`}
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Create a strong password
                </label>

                <div className={styles.passwordWrapper}>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className={`${styles.input} ${
                      touched.password && errors.password
                        ? styles.inputError
                        : ''
                    }`}
                  />

                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <svg width="20" height="20" aria-hidden="true">
                      <use
                        href={`/icons/sprite.svg#icon-${
                          showPassword ? 'eye-off' : 'eye'
                        }`}
                      />
                    </svg>
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Repeat your password
                </label>

                <div className={styles.passwordWrapper}>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showRepeatPassword ? 'text' : 'password'}
                    placeholder="********"
                    className={`${styles.input} ${
                      touched.confirmPassword && errors.confirmPassword
                        ? styles.inputError
                        : ''
                    }`}
                  />

                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowRepeatPassword((prev) => !prev)}
                    aria-label={
                      showRepeatPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    <svg width="20" height="20" aria-hidden="true">
                      <use
                        href={`/icons/sprite.svg#icon-${
                          showRepeatPassword ? 'eye-off' : 'eye'
                        }`}
                      />
                    </svg>
                  </button>
                </div>

                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className={styles.error}
                />
              </div>

              <button
                className={styles.button}
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? <Loader /> : 'Create account'}
              </button>
            </div>

            <p className={styles.loginText}>
              Already have an account?{' '}
              <Link href={ROUTES.LOGIN} className={styles.loginLink}>
                Log in
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </section>
  );
}