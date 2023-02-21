import { Ingredieint } from "@prisma/client";
import { ingredientFrontEnd } from "../../types/ingredientFrontEnd";

export const findIngredientMesure = (
  ing: Ingredieint,
  ingredients: ingredientFrontEnd[]
) => {
  let mesure = "";
  ingredients.forEach((ingOG) => {
    if (ingOG.name == ing.name) {
      mesure = ingOG.mesure;
    }
  });
  return mesure;
};
