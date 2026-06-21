'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFilters } from '@/lib/hooks/useFilters';
import styles from './SearchBox.module.css';

type SearchBoxProps = {
  className?: string;
};

const validationSchema = Yup.object({
  search: Yup.string()
    .trim()
    .min(2, 'Enter at least 2 characters')
    .max(64, 'Search query is too long'),
});

export default function SearchBox({ className = '' }: SearchBoxProps) {
  const { search, setSearch } = useFilters();
  const formik = useFormik({
    initialValues: {
      search,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      setSearch(values.search.trim());
    },
  });

  const hasError = Boolean(formik.touched.search && formik.errors.search);

  return (
    <form
      className={`${styles.form} ${className}`.trim()}
      onSubmit={formik.handleSubmit}
      role="search"
      noValidate
    >
      <label className="visually-hidden" htmlFor="recipe-search">
        Search recipes
      </label>
      <div className={styles.field}>
        <input
          aria-describedby={hasError ? 'recipe-search-error' : undefined}
          aria-invalid={hasError}
          className={`${styles.input} ${hasError ? styles.inputError : ''}`}
          id="recipe-search"
          name="search"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Search recipes"
          type="search"
          value={formik.values.search}
        />
        {hasError && (
          <p className={styles.error} id="recipe-search-error">
            {formik.errors.search}
          </p>
        )}
      </div>
      <button
        className={styles.button}
        disabled={formik.isSubmitting}
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
