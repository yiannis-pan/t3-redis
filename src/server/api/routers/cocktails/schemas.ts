import { z } from "zod";

export const cocktailFromUserSchema = z.object({
  name: z.string(),
  method: z.string(),
  glass: z.string(),
  ice: z.string(),
  notes: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      mesure: z.string(),
      id: z.string(),
    })
  ),
  garnish: z.string(),
});

export const editCocktailSchema = z.object({
  cocktail: z.object({
    ...{ cocktailFromUserSchema },
    specIngredients: z.array(
      z.object({
        amount: z.number(),
        mesure: z.string(),
        name: z.string(),
      })
    ),
  }),
  id: z.string(),
});
