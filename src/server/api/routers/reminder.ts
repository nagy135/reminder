import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { reminders } from "~/server/db/schema";

export const reminderRouter = createTRPCRouter({
  getRemindersByUserId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.query.reminders.findMany({
        where: eq(reminders.userId, input),
      });
    }),
  deleteReminderById: publicProcedure
    .input(
      z.object({
        id: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id, userId } }) => {
      await ctx.db
        .delete(reminders)
        .where(and(eq(reminders.id, id), eq(reminders.userId, userId)));
    }),
  createReminder: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        userId: z.string(),
        email: z.string().email(),
        remindAt: z.date(),
        repeatPeriodicity: z.string(),
        repeatIntervalSeconds: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(reminders).values({
        name: input.name,
        remindAt: input.remindAt,
        email: input.email,
        userId: input.userId,
        repeatPeriodicity: input.repeatPeriodicity,
        repeatIntervalSeconds: input.repeatIntervalSeconds,
      });
    }),

  updateReminder: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        userId: z.string(),
        email: z.string().email(),
        remindAt: z.date(),
        repeatPeriodicity: z.string(),
        repeatIntervalSeconds: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(reminders)
        .set({
          name: input.name,
          remindAt: input.remindAt,
          email: input.email,
          userId: input.userId,
          repeatPeriodicity: input.repeatPeriodicity,
          repeatIntervalSeconds: input.repeatIntervalSeconds,
        })
        .where(eq(reminders.id, input.id));
    }),
});
