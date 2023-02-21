import {
  Cocktail,
  CocktailSpec,
  Ingredieint,
  IngredientSpec,
  PrismaClient,
} from "@prisma/client";
import { z } from "zod";
import {
  calcCocktailStats,
  calcIngredientStats,
} from "../../../helperFuncs/calcStats";
import { protectedProcedure } from "../../trpc";
import { addHomemadeIngredientSchema } from "./addHomemadeIngredient";
import { addIngredientSchema } from "./addIngredient";

export const editIngredientSchema = z.object({
  ...{ addIngredientSchema },
  id: z.string(),
});

export const editHomemadeIngredientSchema = z.object({
  ...{ addHomemadeIngredientSchema },
  id: z.string(),
});

//Func that updates stats of cocktails that use an updated homemade ing
export const updateCocktailsWhichUseUpdatedHomemadeIng = async (
  updatedHomemadeIng: Ingredieint & {
    cocktails: (Cocktail & {
      specIngredients: CocktailSpec[];
      ingredients: Ingredieint[];
    })[];
  },
  prisma: PrismaClient,
  ingredientSpec?: IngredientSpec[]
) => {
  return await Promise.all(
    updatedHomemadeIng.cocktails.map(async (cocktail) => {
      return await prisma.cocktail.update({
        where: {
          id: cocktail.id,
        },
        data: {
          ...calcCocktailStats(cocktail.ingredients, cocktail.specIngredients),
        },
      });
    })
  );
};

export const editIngredientProcedure = protectedProcedure
  .input(z.object({ editIngredientSchema }))
  .mutation(async ({ ctx, input }) => {
    //#1: update the stats of the ingredient (which are passed as input from the user)
    //#2: update the stats of any homemade ingredeints that inlcude the updated ing that we updated on step 1
    //#2.5: update any cocktails that use the updated homemade ingredients from #2
    //#3: update any cocktails that use the updated ingredient from #1

    //#1
    //Updating  ing
    const updatedIng = await ctx.prisma.ingredieint.update({
      where: {
        id: input.editIngredientSchema.id,
      },
      data: {
        ...input.editIngredientSchema.addIngredientSchema,
        ownerId: ctx.session.user.id,
      },
      select: {
        cocktails: {
          include: {
            ingredients: true,
            specIngredients: true,
          },
        },
        ingredientUses: {
          include: {
            //Homemade Ing
            parentIngredient: {
              include: {
                //Ing specs that are used in Homemade Ing (updated ing in here)
                ingredientSpecs: {
                  include: {
                    //The actual ings that are used in homemade ings that have the ing we updated
                    specIngredient: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    //#2
    //First find the homemade ings that use the updated ingredient

    //Homemade ings to update stats for:
    const homemadeIngsThatIncludeUpdatedIng = updatedIng.ingredientUses.map(
      (ing) => ing.parentIngredient
    );

    //Updating homemade ings stats
    const updatedIngs = await Promise.all(
      homemadeIngsThatIncludeUpdatedIng.map(async (homemadeIng) => {
        const ingredientsUsed = homemadeIng.ingredientSpecs.map(
          (ing) => ing.specIngredient
        );

        return await ctx.prisma.ingredieint.update({
          where: {
            id: homemadeIng.id,
          },
          data: {
            ...calcIngredientStats(
              ingredientsUsed,
              homemadeIng.ingredientSpecs.map((ingSpec) => {
                return {
                  ingredientId: ingSpec.specIngredientId,
                  amount: ingSpec.amount,
                  mesure: ingSpec.mesure,
                };
              })
            ),
          },
          include: {
            cocktails: {
              include: {
                ingredients: true,
                specIngredients: true,
              },
            },
            ingredientSpecs: true,
          },
        });
      })
    );

    //#2.5
    //Updating cocktails that use any updated homemade ingredients
    const updatedCocktailsThatUseUpdatedHomemadeIngredients = await Promise.all(
      updatedIngs.map(async (updatedHomadeIng) => {
        return updateCocktailsWhichUseUpdatedHomemadeIng(
          updatedHomadeIng,
          ctx.prisma
        );
      })
    );

    //#3
    //Updating cocktails that use updated ingredient
    const updatedCocktails = await Promise.all(
      updatedIng.cocktails.map(async (cocktail) => {
        return await ctx.prisma.cocktail.update({
          where: {
            id: cocktail.id,
          },
          data: {
            ...calcCocktailStats(
              cocktail.ingredients,
              cocktail.specIngredients
            ),
          },
        });
      })
    );

    return {
      cocktails: updatedCocktails,
      ings: updatedIngs,
      updatedCocktailsForHomemadeIngs:
        updatedCocktailsThatUseUpdatedHomemadeIngredients,
    };
  });
