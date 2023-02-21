import { Ingredieint, IngredientSpec } from "@prisma/client";
import { ingredientFrontEnd } from "../../types/ingredientFrontEnd";
import { SpecWithId } from "../serverTypes/SpecWithId";
import calcIngredientWeight from "./calcIngredientWeight";
import calculateCocktailTotalInGr from "./calculateCocktailTotalInGr";
import findIngredientAmount from "./findIngredientAmount";

const calcBrix = (
  ingredients: Ingredieint[],
  ingredieintsWithAmounts: SpecWithId[]
) => {
  //Map through ingredients and return each ings sugar content in an array
  const ingredientsSugarContent = ingredients.map((ing) => {
    //First find the amount of ingredient in cocktail and covert it in grams
    const amountInGrams = calcIngredientWeight(
      ing,
      ingredieintsWithAmounts.find((specIng) => specIng.ingredientId === ing.id)
        ?.amount ?? 0
    );
    return ing.brixLevel == 0 || ing.abvLevel != 0
      ? 0
      : (ing.brixLevel / 100) * amountInGrams;
  });
  //Then add all the sugar grams in cocktail to get the total sugar amount in grams for the cocktail
  const totalSugs = ingredientsSugarContent.reduce((acc, cv) => acc + cv);

  //Then find the total grams of cocktail ingredients sumed
  const totalOfIngredientsInGrams = calculateCocktailTotalInGr(
    ingredients,
    ingredieintsWithAmounts
  );

  //Lastly calculate cocktail brix level, knowing the total sugar in cocktail and the weight of the cocktail
  //total birx = totalsugarcontent * totalAountinGr / 100

  return (totalSugs / totalOfIngredientsInGrams) * 100;
};
export default calcBrix;
