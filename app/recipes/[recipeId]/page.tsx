import { Metadata } from 'next';
import { getRecipeById, getIngredients } from '@/lib/api/serverApi';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';
import RecipeNotFound from './not-found';


type Props = {
  params: Promise<{
    recipeId: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { recipeId } = await params;

  try {
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      return {
        title: 'Recipe not found',
        description:
          'The recipe you are looking for does not exist.',
      };
    }

    return {
      title: recipe.title,
      description: recipe.description,
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        images: [
          {
            url: recipe.thumb,
            alt: recipe.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Recipe not found',
      description:
        'The recipe you are looking for does not exist.',
    };
  }
}

export default async function RecipePage({
  params,
}: Props) {
  const { recipeId } = await params;

  try {
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
      return <RecipeNotFound />;
    }

    // Recipe ingredients come back as { id, measure } only — resolve names
    // from the ingredients reference list.
    const ingredients = await getIngredients();
    const nameById = new Map(
      ingredients.map((item) => [item._id, item.name] as const)
    );
    const recipeWithNames = {
      ...recipe,
      ingredients: recipe.ingredients.map((item) => ({
        ...item,
        name: nameById.get(item.id) ?? item.name ?? '',
      })),
    };

    return <RecipeDetails data={recipeWithNames} />;
  } catch {
    return <RecipeNotFound />;
  }
}