import { z } from "zod";
import { calcIngredientStats } from "../../../helperFuncs/calcStats";
import { protectedProcedure } from "../../trpc";

export const addHomemadeIngredientSchema = z.object({
  name: z.string(),
  notes: z.string(),
  prepSteps: z.array(
    z.object({
      stepDescription: z.string(),
      stepNumber: z.number(),
    })
  ),
  storage: z.string(),
  type: z.string(),
  homemade: z.boolean(),
  ingredientSpecs: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      mesure: z.string(),
      type: z.string(),
      id: z.string(),
      homemade: z.boolean(),
    })
  ),
});

export const addHomemadeIngredientProcedure = protectedProcedure
  .input(z.object({ addHomemadeIngredientSchema }))
  .mutation(async ({ ctx, input }) => {
    //First add all the ingredients that make this ingredient
    const ingredientsUsedForHomemadeIng = await Promise.all(
      input.addHomemadeIngredientSchema.ingredientSpecs.map(
        async (ing) =>
          await ctx.prisma.ingredieint.upsert({
            where: {
              id: ing.id,
            },
            update: {},
            create: {
              homemade: ing.homemade,
              name: ing.name,
              type: ing.type,
              ownerId: ctx.session.user.id,
            },
          })
      )
    );

    //Then add the homemade ingredient including the ingredientSpecs
    const homemadeIngWihoutStats = await ctx.prisma.ingredieint.create({
      data: {
        name: input.addHomemadeIngredientSchema.name,
        notes: input.addHomemadeIngredientSchema.notes,
        storage: input.addHomemadeIngredientSchema.storage,
        type: input.addHomemadeIngredientSchema.type,
        homemade: input.addHomemadeIngredientSchema.homemade,
        ownerId: ctx.session.user.id,
        ingredientSpecs: {
          createMany: {
            data: input.addHomemadeIngredientSchema.ingredientSpecs.map(
              (ing) => {
                return {
                  amount: ing.amount,
                  mesure: ing.mesure,
                  specIngredientId:
                    ingredientsUsedForHomemadeIng.find(
                      (idsIng) => idsIng.name === ing.name
                    )?.id ?? "",
                };
              }
            ),
          },
        },
        steps: {
          createMany: {
            data: input.addHomemadeIngredientSchema.prepSteps,
          },
        },
      },
      include: {
        ingredientSpecs: true,
      },
    });

    return await ctx.prisma.ingredieint.update({
      where: {
        id: homemadeIngWihoutStats.id,
      },
      data: {
        ...calcIngredientStats(
          ingredientsUsedForHomemadeIng,
          homemadeIngWihoutStats.ingredientSpecs.map((specIng) => {
            return {
              amount: specIng.amount,
              ingredientId: specIng.specIngredientId,
              mesure: specIng.mesure,
            };
          })
        ),
      },
    });
  });
