import { createTRPCRouter } from "../../trpc";
import { getAllCocktailsProcedure } from "./getAllCocktails";
import { addCocktailProcedure } from "./newCocktail";
import { editCocktailProcedure } from "./editCocktail";

export const cocktailRouter = createTRPCRouter({
  //Get All Cocktails in DB
  getAll: getAllCocktailsProcedure,
  //Add cocktail to db
  addCocktail: addCocktailProcedure,
  //Edit cocktail
  editCocktail: editCocktailProcedure,
});
