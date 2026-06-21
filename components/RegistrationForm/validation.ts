import * as Yup from 'yup';

export const registrationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(16, 'Name must be at most 16 characters')
    .required('Name is required'),

  email: Yup.string()
    .trim()
    .email('Invalid email format')
    .max(128, 'Email must be at most 128 characters')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please repeat your password'),
});