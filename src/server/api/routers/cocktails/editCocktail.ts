import { Ingredieint } from "@prisma/client";
import { z } from "zod";
import { makeIngSpecs } from "../../../helperFuncs/makeIngSpecs";
import { protectedProcedure } from "../../trpc";
import { calcCocktailStats } from "../../../helperFuncs/calcStats";
import { editCocktailSchema } from "./schemas";

export const makeSpecIngs = (
  ingredients: Ingredieint[],
  specIngredients: {
    name: string;
    amount: number;
    mesure: string;
  }[]
) => {
  return specIngredients.map((specIng) => {
    return {
      amount: specIng.amount,
      mesure: specIng.mesure,
      ingredientId: ingredients.find((ing) => ing.name == specIng.name)!.id,
    };
  });
};

export const editCocktailProcedure = protectedProcedure
  .input(z.object({ editCocktailSchema }))
  .mutation(async (req) => {
    const ids = await req.ctx.prisma.cocktail.update({
      where: {
        id: req.input.editCocktailSchema.id,
      },
      data: {
        ...req.input.editCocktailSchema.cocktail.cocktailFromUserSchema,
        ingredients: {
          set: [],
          connectOrCreate:
            req.input.editCocktailSchema.cocktail.cocktailFromUserSchema.ingredients.map(
              (ing) => {
                return {
                  where: {
                    id: ing.id,
                  },
                  create: {
                    name: ing.name,
                    ownerId: req.ctx.session.user.id,
                  },
                };
              }
            ),
        },
        specIngredients: {
          deleteMany: {},
        },
      },
      select: {
        ingredients: true,
      },
    });

    return await req.ctx.prisma.cocktail.update({
      where: {
        id: req.input.editCocktailSchema.id,
      },
      data: {
        ...calcCocktailStats(
          ids.ingredients,
          makeSpecIngs(
            ids.ingredients,
            req.input.editCocktailSchema.cocktail.specIngredients
          )
        ),
        specIngredients: {
          createMany: {
            data: makeSpecIngs(
              ids.ingredients,
              req.input.editCocktailSchema.cocktail.specIngredients
            ),
          },
        },
      },
    });
  });
