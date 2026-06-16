export interface RecipeIngredient {
  id: string;
  measure: string;
}

export interface Recipe {
  _id: string;
  title: string;
  category: string;
  owner: string;
  area?: string;
  instructions: string;
  description: string;
  thumb: string;
  time: string;
  calories: number | null;
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface SearchRecipesParams {
  page?: number;
  perPage?: number;
  category?: string;
  ingredient?: string;
  search?: string;
}

export interface CreateRecipePayload {
  title: string;
  description: string;
  category: string;
  area?: string;
  time: string;
  calories?: number;
  instructions: string;
  ingredients: RecipeIngredient[];
  recipeImg: File;
}
