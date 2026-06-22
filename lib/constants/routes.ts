export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  ADD_RECIPE: '/add-recipe',
  RECIPE: (id: string) => `/recipes/${id}`,
};
