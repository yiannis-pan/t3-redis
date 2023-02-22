import { Ingredieint } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const redisRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    console.log("Input req", `user::${ctx.session.user.id}::ing:Beefeater`);
    const ingString = await ctx.redis.get<string>(
      // `user::${ctx.session.user.id}::${input}`
      "user::cleewhxtt0000j6wxm7o9xnow::ing:Beefeater"
    );

    const parsed: Ingredieint = JSON.parse(JSON.stringify(ingString) ?? "");
    console.log(parsed);
    return parsed;
  }),
});
