import { Ingredieint, IngredientSpec } from "@prisma/client";
import { SpecWithId } from "../serverTypes/SpecWithId";
import calcIngredientWeight from "./calcIngredientWeight";

const calculateCocktailTotalInGr = (
  ingredients: Ingredieint[],
  ingredieintsWithAmounts: SpecWithId[]
) => {
  const amountsOfIngredientsInGrams = ingredients.map((ing) => {
    return calcIngredientWeight(
      ing,
      ingredieintsWithAmounts.find((specIng) => specIng.ingredientId === ing.id)
        ?.amount ?? 0
    );
  });
  return amountsOfIngredientsInGrams.reduce((acc, cv) => acc + cv);
};
export default calculateCocktailTotalInGr;
