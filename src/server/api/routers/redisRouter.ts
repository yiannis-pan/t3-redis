import { createTRPCRouter, publicProcedure } from "../trpc";

export const redisRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.redis.srandmember<string>("nextjs13");
  }),
});
