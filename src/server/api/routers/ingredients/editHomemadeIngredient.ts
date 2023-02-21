import { z } from "zod";
import calcTotalABV from "../../../helperFuncs/calcABV";
import { calcIngredientStats } from "../../../helperFuncs/calcStats";
import { protectedProcedure } from "../../trpc";
import {
  editHomemadeIngredientSchema,
  updateCocktailsWhichUseUpdatedHomemadeIng,
} from "./editIngredient";

export const editHomemadeIngredientProcedure = protectedProcedure
  .input(z.object({ editHomemadeIngredientSchema }))
  .mutation(async ({ ctx, input }) => {
    //First add the new ingredients that are used to make updated homemade ing
    const { addHomemadeIngredientSchema, id } =
      input.editHomemadeIngredientSchema;
    const ids = await Promise.all(
      addHomemadeIngredientSchema.ingredientSpecs.map(async (ing) => {
        return await ctx.prisma.ingredieint.upsert({
          where: {
            id: ing.id,
          },
          update: {
            name: ing.name,
            type: ing.type,
            ownerId: ctx.session.user.id,
          },
          create: {
            name: ing.name,
            type: ing.type,
            homemade: ing.homemade,
            ownerId: ctx.session.user.id,
          },
        });
      })
    );

    //Then update homemade ing with the new ings
    const updatedHomemadeIngNoStats = await ctx.prisma.ingredieint.update({
      where: { id: input.editHomemadeIngredientSchema.id },
      data: {
        name: addHomemadeIngredientSchema.name,
        notes: addHomemadeIngredientSchema.notes,
        storage: addHomemadeIngredientSchema.storage,
        type: addHomemadeIngredientSchema.type,
        homemade: addHomemadeIngredientSchema.homemade,
        ownerId: ctx.session.user.id,
        ingredientSpecs: {
          deleteMany: {},
          createMany: {
            data: addHomemadeIngredientSchema.ingredientSpecs.map((ing) => {
              return {
                amount: ing.amount,
                specIngredientId:
                  ids.find((idsIng) => idsIng.name === ing.name)?.id ?? "",
                mesure: ing.mesure,
              };
            }),
          },
        },
        steps: {
          deleteMany: {},
          createMany: {
            data: addHomemadeIngredientSchema.prepSteps,
          },
        },
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

    console.log("got here", updatedHomemadeIngNoStats);

    //Then update the stats of the updated homemade ing
    const updatedHomemadeIng = await ctx.prisma.ingredieint.update({
      where: {
        id: updatedHomemadeIngNoStats.id,
      },
      data: {
        ...calcIngredientStats(
          ids,
          updatedHomemadeIngNoStats.ingredientSpecs.map((specIng) => {
            return {
              amount: specIng.amount,
              mesure: specIng.mesure,
              ingredientId: specIng.specIngredientId,
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
      },
    });

    //Then update the stats of any cocktails that use the updated homemade ing
    const updatedCocktails = await updateCocktailsWhichUseUpdatedHomemadeIng(
      updatedHomemadeIng,
      ctx.prisma
    );

    //Return both the updated homemade ing and any updated cocktails that use the updated hoemade ing
    return {
      homemadeIng: updatedHomemadeIng,
      cocktails: updatedCocktails,
    };
  });
