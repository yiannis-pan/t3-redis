import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const addIngredientSchema = z.object({
  name: z.string(),
  abvLevel: z.number(),
  brixLevel: z.number(),
  acidLevel: z.number(),
  type: z.string(),
  notes: z.string(),
  bottleMesure: z.string(),
  bottleSize: z.number(),
  bottleCost: z.number(),
  homemade: z.boolean(),
});

export const addIngredientProcedure = protectedProcedure
  .input(z.object({ addIngredientSchema }))
  .mutation(async (req) => {
    console.table(req.input.addIngredientSchema);
    return req.ctx.prisma.ingredieint.create({
      data: {
        ...req.input.addIngredientSchema,
        ownerId: req.ctx.session.user.id,
      },
    });
  });
