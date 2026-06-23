'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  type FormikHelpers,
} from 'formik';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  createRecipe,
  getCategories,
  getIngredients,
} from '@/lib/api/clientApi';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { ROUTES } from '@/lib/constants/routes';
import Loader from '../Loader/Loader';
import { addRecipeSchema } from './validation';
import styles from './AddRecipeForm.module.css';

interface SelectedIngredient {
  id: string;
  name: string;
  measure: string;
}

interface FormValues {
  title: string;
  description: string;
  time: string;
  calories: string;
  category: string;
  instructions: string;
  ingredients: SelectedIngredient[];
  image: File | null;
}

const initialValues: FormValues = {
  title: '',
  description: '',
  time: '',
  calories: '',
  category: '',
  instructions: '',
  ingredients: [],
  image: null,
};

function CameraIcon() {
  return (
    <svg
      className={styles.cameraIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2l.9-1.5A1.5 1.5 0 0 1 8.9 3.8h6.2a1.5 1.5 0 0 1 1.3.7L17.3 6h1.2A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export default function AddRecipeForm() {
  const router = useRouter();

  const { data: categories = [] } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });
  const { data: ingredients = [] } = useQuery({
    queryKey: [QUERY_KEYS.INGREDIENTS],
    queryFn: getIngredients,
  });

  const [draftId, setDraftId] = useState('');
  const [draftMeasure, setDraftMeasure] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    if (!values.image) return;
    try {
      const recipe = await createRecipe({
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        time: values.time.trim(),
        calories: values.calories === '' ? undefined : Number(values.calories),
        instructions: values.instructions.trim(),
        ingredients: values.ingredients.map(({ id, measure, name }) => ({
          id,
          measure,
          name,
        })),
        recipeImg: values.image,
      });
      toast.success('Recipe published!');
      router.push(ROUTES.RECIPE(recipe._id));
    } catch {
      toast.error('Could not publish recipe. Please try again.');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Add Recipe</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={addRecipeSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form className={styles.layout}>
              {/* General Information */}
              <section className={`${styles.block} ${styles.general}`}>
                <h2 className={styles.blockTitle}>General Information</h2>

                <div className={styles.field}>
                  <label htmlFor="title" className={styles.label}>
                    Recipe Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter the name of your recipe"
                    className={`${styles.input} ${
                      touched.title && errors.title ? styles.inputError : ''
                    }`}
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className={styles.error}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="description" className={styles.label}>
                    Recipe Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Enter a brief description of your recipe"
                    className={`${styles.textarea} ${
                      touched.description && errors.description
                        ? styles.inputError
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="p"
                    className={styles.error}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="time" className={styles.label}>
                    Cooking time in minutes
                  </label>
                  <Field
                    id="time"
                    name="time"
                    type="text"
                    inputMode="numeric"
                    placeholder="10"
                    className={`${styles.input} ${
                      touched.time && errors.time ? styles.inputError : ''
                    }`}
                  />
                  <ErrorMessage
                    name="time"
                    component="p"
                    className={styles.error}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="calories" className={styles.label}>
                      Calories
                    </label>
                    <Field
                      id="calories"
                      name="calories"
                      type="text"
                      inputMode="numeric"
                      placeholder="150"
                      className={`${styles.input} ${
                        touched.calories && errors.calories
                          ? styles.inputError
                          : ''
                      }`}
                    />
                    <ErrorMessage
                      name="calories"
                      component="p"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="category" className={styles.label}>
                      Category
                    </label>
                    <Field
                      as="select"
                      id="category"
                      name="category"
                      className={`${styles.select} ${
                        touched.category && errors.category
                          ? styles.inputError
                          : ''
                      }`}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="p"
                      className={styles.error}
                    />
                  </div>
                </div>
              </section>

              {/* Ingredients */}
              <section className={`${styles.block} ${styles.ingredients}`}>
                <h2 className={styles.blockTitle}>Ingredients</h2>

                <FieldArray name="ingredients">
                  {arrayHelpers => {
                    const addIngredient = () => {
                      const ingredient = ingredients.find(
                        item => item._id === draftId
                      );
                      if (!ingredient || !draftMeasure.trim()) {
                        toast.error('Select an ingredient and its amount.');
                        return;
                      }
                      arrayHelpers.push({
                        id: ingredient._id,
                        name: ingredient.name,
                        measure: draftMeasure.trim(),
                      });
                      setDraftId('');
                      setDraftMeasure('');
                    };

                    return (
                      <>
                        <div className={styles.ingredientControls}>
                          <div className={styles.field}>
                            <label
                              htmlFor="ingredientName"
                              className={styles.label}
                            >
                              Name
                            </label>
                            <select
                              id="ingredientName"
                              value={draftId}
                              onChange={event => setDraftId(event.target.value)}
                              className={styles.select}
                            >
                              <option value="" disabled>
                                Select an ingredient
                              </option>
                              {ingredients.map(ingredient => (
                                <option
                                  key={ingredient._id}
                                  value={ingredient._id}
                                >
                                  {ingredient.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className={styles.amountField}>
                            <label
                              htmlFor="ingredientMeasure"
                              className={styles.label}
                            >
                              Amount
                            </label>
                            <input
                              id="ingredientMeasure"
                              type="text"
                              value={draftMeasure}
                              maxLength={32}
                              onChange={event =>
                                setDraftMeasure(event.target.value)
                              }
                              placeholder="100g"
                              className={styles.input}
                            />
                            <button
                              type="button"
                              onClick={addIngredient}
                              className={styles.addButton}
                            >
                              Add new Ingredient
                            </button>
                          </div>
                        </div>

                        {values.ingredients.length > 0 && (
                          <ul className={styles.ingredientList}>
                            <li className={styles.ingredientHead}>
                              <span>Name:</span>
                              <span>Amount:</span>
                              <span />
                            </li>
                            {values.ingredients.map((ingredient, index) => (
                              <li
                                key={`${ingredient.id}-${index}`}
                                className={styles.ingredientRow}
                              >
                                <span>{ingredient.name}</span>
                                <span>{ingredient.measure}</span>
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                  className={styles.removeButton}
                                  aria-label={`Remove ${ingredient.name}`}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    aria-hidden="true"
                                  >
                                    <use href="/icons/sprite.svg#icon-trash" />
                                  </svg>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        {typeof errors.ingredients === 'string' &&
                          touched.ingredients && (
                            <p className={styles.error}>{errors.ingredients}</p>
                          )}
                      </>
                    );
                  }}
                </FieldArray>
              </section>

              {/* Instructions */}
              <section className={`${styles.block} ${styles.instructions}`}>
                <h2 className={styles.blockTitle}>Instructions</h2>
                <div className={styles.field}>
                  <Field
                    as="textarea"
                    id="instructions"
                    name="instructions"
                    rows={5}
                    placeholder="Enter a text"
                    className={`${styles.textarea} ${
                      touched.instructions && errors.instructions
                        ? styles.inputError
                        : ''
                    }`}
                  />
                  <ErrorMessage
                    name="instructions"
                    component="p"
                    className={styles.error}
                  />
                </div>
              </section>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader /> : 'Publish Recipe'}
              </button>

              {/* Upload Photo */}
              <aside className={styles.photoColumn}>
                <h2 className={styles.blockTitle}>Upload Photo</h2>
                <label className={styles.dropzone}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={event => {
                      const file = event.currentTarget.files?.[0];
                      if (!file) return;
                      setFieldValue('image', file);
                      if (preview) URL.revokeObjectURL(preview);
                      setPreview(URL.createObjectURL(file));
                    }}
                  />
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Recipe preview"
                      fill
                      unoptimized
                      sizes="(max-width: 1440px) 100vw, 384px"
                      className={styles.previewImage}
                    />
                  ) : (
                    <CameraIcon />
                  )}
                </label>
                <ErrorMessage
                  name="image"
                  component="p"
                  className={styles.error}
                />
              </aside>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
