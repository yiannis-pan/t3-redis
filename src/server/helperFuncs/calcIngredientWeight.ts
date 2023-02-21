import { Ingredieint } from "@prisma/client";
import densityCalculator from "./densityCalculator";

const calcIngredientWeight = (ing: Ingredieint, amount: number) => {
  const density = densityCalculator(ing);
  return amount * density;
};

export default calcIngredientWeight;
