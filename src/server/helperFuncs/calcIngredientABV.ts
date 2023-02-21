import { Ingredieint } from '@prisma/client';
import calcIngredientWeight from './calcIngredientWeight';

const caclIngredientABV = (ing: Ingredieint, amount: number) => {
  return (ing.abvLevel / 100) * calcIngredientWeight(ing, amount);
};

export default caclIngredientABV;
