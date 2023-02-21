import { Ingredieint } from "@prisma/client";
import { ingredientFrontEnd } from "../../types/ingredientFrontEnd";
import findIngredientAmount from "./findIngredientAmount";

const updateSpecIngs = (
  ingredients: ingredientFrontEnd[],
  ids: { ingredients: Ingredieint[]; id: string }
) => {
  const specIngredients = ids.ingredients.map((ing) => {
    return {
      where: {
        cocktailID: ids.id,
      },
      create: {
        amount: findIngredientAmount(ing, ingredients),
        ingredient: {
          connect: {
            id: ing.id,
          },
        },
        mesure: ingredients.find((specIng) => ing.name == specIng.name)?.mesure,
        name: ing.name,
      },
    };
  });
  return specIngredients;
};

export default updateSpecIngs;
