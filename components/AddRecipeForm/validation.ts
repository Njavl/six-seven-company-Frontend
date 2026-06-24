import * as Yup from 'yup';

export const addRecipeSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(64, 'Title must be at most 64 characters')
    .required('Title is required'),

  description: Yup.string()
    .trim()
    .max(200, 'Description must be at most 200 characters')
    .required('Description is required'),

  time: Yup.string()
    .trim()
    .matches(/^\d+$/, 'Cooking time must be a number')
    .test('range', 'Cooking time must be between 1 and 360 minutes', value => {
      if (!value) return false;
      const minutes = Number(value);
      return minutes >= 1 && minutes <= 360;
    })
    .required('Cooking time is required'),

  calories: Yup.number()
    .transform((value, original) => (original === '' ? null : value))
    .nullable()
    .typeError('Calories must be a number')
    .integer('Calories must be a whole number')
    .min(1, 'Calories must be at least 1')
    .max(10000, 'Calories must be at most 10000'),

  category: Yup.string().required('Category is required'),

  instructions: Yup.string()
    .trim()
    .max(1200, 'Instructions must be at most 1200 characters')
    .required('Instructions are required'),

  ingredients: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required(),
        name: Yup.string().required(),
        measure: Yup.string()
          .trim()
          .min(1)
          .max(32)
          .matches(/^[^-]/, 'Amount cannot be negative')
          .required(),
      })
    )
    .min(1, 'Add at least one ingredient'),

  image: Yup.mixed<File>().required('Recipe photo is required'),
});
