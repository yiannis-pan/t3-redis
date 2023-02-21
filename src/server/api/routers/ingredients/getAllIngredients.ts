import { protectedProcedure } from "../../trpc";

export const getAllIngredientsProcedure = protectedProcedure.query(
  async ({ ctx }) => {
    return await ctx.prisma.ingredieint.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      include: {
        cocktails: true,
        ingredientUses: true,
        ingredientSpecs: true,
        cocktailSpecs: true,
        steps: true,
      },
    });
  }
);
