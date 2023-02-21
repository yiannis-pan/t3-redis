import { Ingredieint } from "@prisma/client";

export function makeIngSpecs(
  ingredients: Ingredieint[],
  specIngredients: {
    name: string;
    amount: number;
    mesure: string;
  }[],
  id: string
) {
  return specIngredients.map((specIng) => {
    return {
      amount: specIng.amount,
      mesure: specIng.mesure,
      parentIngredientId: id,
      specIngredientId:
        ingredients.find((ing) => ing.name === specIng.name)?.id ?? "",
    };
  });
}
