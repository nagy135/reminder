import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { reminders } from "~/server/db/schema";

export const reminderRouter = createTRPCRouter({
  createReminder: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        userId: z.string(),
        email: z.string().email(),
        remindAt: z.date(),
        repeatPeriodicity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(reminders).values({
        name: input.name,
        remindAt: input.remindAt,
        email: input.email,
        userId: input.userId,
        repeatPeriodicity: input.repeatPeriodicity,
      });
    }),
});
