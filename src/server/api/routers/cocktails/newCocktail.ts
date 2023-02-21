import { z } from "zod";
import { calcCocktailStats } from "../../../helperFuncs/calcStats";
import { protectedProcedure } from "../../trpc";
import { makeSpecIngs } from "./editCocktail";
import { cocktailFromUserSchema } from "./schemas";

export const addCocktailProcedure = protectedProcedure
  .input(z.object({ cocktailFromUserSchema }))
  .mutation(async ({ ctx, input }) => {
    const { ingredients } = input.cocktailFromUserSchema;

    const ingredientIds = await ctx.prisma.cocktail.create({
      data: {
        ...input.cocktailFromUserSchema,
        ownerId: ctx.session.user.id,
        ingredients: {
          connectOrCreate: input.cocktailFromUserSchema.ingredients.map(
            (ing) => {
              return {
                where: {
                  id: ing.id,
                },
                create: {
                  name: ing.name,
                  ownerId: ctx.session.user.id,
                },
              };
            }
          ),
        },
      },
      select: {
        id: true,
        ingredients: {
          include: {
            ingredientSpecs: true,
          },
        },
      },
    });

    return await ctx.prisma.cocktail.update({
      where: {
        id: ingredientIds.id,
      },
      data: {
        ...calcCocktailStats(
          ingredientIds.ingredients,
          makeSpecIngs(ingredientIds.ingredients, ingredients)
        ),
        specIngredients: {
          createMany: {
            data: ingredients.map((ing) => {
              return {
                amount: ing.amount,
                mesure: ing.mesure,
                ingredientId:
                  ingredientIds.ingredients.find(
                    (ingid) => ingid.name === ing.name
                  )?.id ?? "",
              };
            }),
          },
        },
      },
    });
  });
