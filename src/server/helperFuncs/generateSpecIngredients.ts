import { Ingredieint } from "@prisma/client";
import { ingredientFrontEnd } from "../../types/ingredientFrontEnd";
import findIngredientAmount from "./findIngredientAmount";

const generateSpecIngredients = (
  ingredients: ingredientFrontEnd[],
  ids: { ingredients: Ingredieint[]; id: string }
) => {
  const specIngredients = ids.ingredients.map((ing) => {
    return {
      amount: findIngredientAmount(ing, ingredients),
      ingredient: {
        connect: {
          id: ing.id,
        },
      },
      mesure: ingredients.find((specIng) => ing.name == specIng.name)?.mesure,
      name: ing.name,
    };
  });
  return specIngredients;
};

export default generateSpecIngredients;
