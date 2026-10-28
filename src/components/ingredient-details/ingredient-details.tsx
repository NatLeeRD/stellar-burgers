import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector((state) =>
    state.ingredients.ingredients.find((ingredient) => ingredient._id === id)
  );
  const isLoading = useSelector((state) => state.ingredients.isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
