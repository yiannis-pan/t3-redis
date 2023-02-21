import { protectedProcedure } from "../../trpc";

export const getAllCocktailsProcedure = protectedProcedure.query(({ ctx }) => {
  return ctx.prisma.cocktail.findMany({
    where: {
      ownerId: ctx.session.user.id,
    },
    include: {
      specIngredients: true,
      ingredients: true,
    },
  });
});
