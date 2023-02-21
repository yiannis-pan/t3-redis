import { createTRPCRouter } from "./trpc";
import { cocktailRouter } from "./routers/cocktails/cocktailRouter";
import { authRouter } from "./routers/authRouter";
import { ingredientRouter } from "./routers/ingredients/ingredientRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  cocktails: cocktailRouter,
  auth: authRouter,
  ingredients: ingredientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
