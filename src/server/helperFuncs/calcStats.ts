import { Ingredieint } from "@prisma/client";
import { SpecWithId } from "../serverTypes/SpecWithId";
import calcTotalABV from "./calcABV";
import calcAcidity from "./calcAcidity";
import calcBrix from "./calcBrix";
import calcSum from "./calcSum";

export function calcCocktailStats(
  ingredients: Ingredieint[],
  specIngs: SpecWithId[]
) {
  return {
    abv: calcTotalABV(ingredients, specIngs),
    brix: calcBrix(ingredients, specIngs),
    acidity: calcAcidity(ingredients, specIngs),
    amount: calcSum(specIngs),
  };
}
export function calcIngredientStats(
  ingredients: Ingredieint[],
  specIngs: SpecWithId[]
) {
  const abv = calcTotalABV(ingredients, specIngs);
  return {
    // abvLevel: calcTotalABV(ingredients, specIngs),
    // brixLevel: calcBrix(ingredients, specIngs),
    // acidLevel: calcAcidity(ingredients, specIngs),
    abvLevel: abv,
  };
}
