import { Ingredieint } from "@prisma/client";
import { ingredientFrontEnd } from "../../types/ingredientFrontEnd";

const findIngredientAmount = (
  ing: Ingredieint,
  ingredients: ingredientFrontEnd[]
) => {
  let amount = 0;
  ingredients.forEach((ingOG) => {
    if (ingOG.name == ing.name) {
      amount = ingOG.amount;
    }
  });
  return amount;
};

export default findIngredientAmount;
