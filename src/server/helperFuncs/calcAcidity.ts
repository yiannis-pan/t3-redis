import { Ingredieint, IngredientSpec } from "@prisma/client";
import { ingredientFrontEnd } from "../../types/ingredientFrontEnd";
import { SpecWithId } from "../serverTypes/SpecWithId";
import calcIngredientWeight from "./calcIngredientWeight";
import calculateCocktailTotalInGr from "./calculateCocktailTotalInGr";
import findIngredientAmount from "./findIngredientAmount";

const calcAcidity = (
  ingredients: Ingredieint[],
  ingredieintsWithAmounts: SpecWithId[]
) => {
  const totalAcidityOfIngredients = ingredients.map((ing) => {
    //First calculate the precentage of acid of ingredient based on the amount of ingredient in grams
    return (
      (ing.acidLevel / 100) *
      calcIngredientWeight(
        ing,
        ingredieintsWithAmounts.find(
          (specIng) => specIng.ingredientId === ing.id
        )?.amount ?? 0
      )
    );
  });
  const totalAcidInCocktailInGrams = totalAcidityOfIngredients.reduce(
    (ac, cv) => ac + cv
  );
  return (
    (totalAcidInCocktailInGrams /
      calculateCocktailTotalInGr(ingredients, ingredieintsWithAmounts)) *
    100
  );
};

export default calcAcidity;
