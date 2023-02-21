import { Ingredieint, IngredientSpec } from "@prisma/client";
import { SpecWithId } from "../serverTypes/SpecWithId";
import caclIngredientABV from "./calcIngredientABV";
import calculateCocktailTotalInGr from "./calculateCocktailTotalInGr";

const calcTotalABV = (ingredients: Ingredieint[], specIngs: SpecWithId[]) => {
  const abvOfIngredientsArr = ingredients.map((ing) => {
    console.log("ing: ", ing.id);
    console.log(
      "Amount: ",
      specIngs.find((specIng) => specIng.ingredientId === ing.id)?.amount ?? 0
    );

    return caclIngredientABV(
      ing,
      specIngs.find((specIng) => specIng.ingredientId === ing.id)?.amount ?? 0
    );
  });
  const totalABVOfIngredients = abvOfIngredientsArr.reduce(
    (acc, cv) => acc + cv
  );

  const totalABV = Math.round(
    (totalABVOfIngredients /
      calculateCocktailTotalInGr(ingredients, specIngs)) *
      100
  );
  console.log(totalABV, "total abv");
  return totalABV;
};

export default calcTotalABV;
