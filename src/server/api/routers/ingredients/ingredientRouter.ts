import { createTRPCRouter } from "../../trpc";
import { addIngredientProcedure } from "./addIngredient";
import { addHomemadeIngredientProcedure } from "./addHomemadeIngredient";
import { getAllIngredientsProcedure } from "./getAllIngredients";
import { editIngredientProcedure } from "./editIngredient";
import { editHomemadeIngredientProcedure } from "./editHomemadeIngredient";
export const ingredientRouter = createTRPCRouter({
  getAll: getAllIngredientsProcedure,
  addIngredient: addIngredientProcedure,
  addHomemadeIngredient: addHomemadeIngredientProcedure,
  editIngredient: editIngredientProcedure,
  editHomemadeIngredient: editHomemadeIngredientProcedure,
});
