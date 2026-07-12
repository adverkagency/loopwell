import { z } from "zod";

export const habitStateSchema = z.enum(["complete", "partial", "skip"]);

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

export const habitInputSchema = z.object({
  name: z.string().trim().min(1, "Give the habit a name").max(80),
  icon: z.string().max(40).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  frequency_count: z.coerce.number().int().min(1).max(31).default(7),
  frequency_period: z.enum(["week", "month"]).default("week"),
  in_quick_log: z.coerce.boolean().default(false),
});

export const setStateSchema = z.object({
  habit_id: z.uuid(),
  date: dateStringSchema,
  // null clears the day's log (re-tap toggles off)
  state: habitStateSchema.nullable(),
});

export const onboardingSchema = z.object({
  habit_names: z.array(z.string().trim().min(1).max(80)).min(3).max(5),
  timezone: z.string().max(60),
});
