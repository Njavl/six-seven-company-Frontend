import type { Metadata } from 'next';
import AddRecipeForm from '@/components/AddRecipeForm/AddRecipeForm';

export const metadata: Metadata = {
  title: 'Add Recipe | Tasteorama',
  description: 'Create and publish your own recipe on Tasteorama.',
  openGraph: {
    title: 'Add Recipe | Tasteorama',
    description: 'Create and publish your own recipe on Tasteorama.',
    type: 'website',
  },
};

export default function AddRecipePage() {
  return <AddRecipeForm />;
}
