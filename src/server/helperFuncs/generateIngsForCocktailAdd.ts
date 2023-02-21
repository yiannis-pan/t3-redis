type IngredientForRouter = {
  name: string;
  amount: number;
  mesure: string;
};

const generateIngsForCocktailAdd = (
  ingredients: IngredientForRouter[],
  userId: string
) => {
  const cocktailIngs = ingredients.map((ing) => {
    return {
      create: {
        name: ing.name,
        userId: userId,
      },

      where: {
        name: ing.name,
      },
    };
  });
  return cocktailIngs;
};

export default generateIngsForCocktailAdd;
