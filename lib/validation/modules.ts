import { z } from "zod";
import { dateStringSchema } from "./habits";

export const nutritionEntrySchema = z.object({
  date: dateStringSchema,
  food_name: z.string().trim().min(1, "Name the food").max(200),
  source: z.enum(["manual", "usda", "off"]).default("manual"),
  source_ref: z.string().max(60).optional(),
  calories: z.coerce.number().min(0).max(20000).default(0),
  protein_g: z.coerce.number().min(0).max(2000).default(0),
  carbs_g: z.coerce.number().min(0).max(2000).default(0),
  fat_g: z.coerce.number().min(0).max(2000).default(0),
  fiber_g: z.coerce.number().min(0).max(500).optional(),
  sugar_g: z.coerce.number().min(0).max(2000).optional(),
});

export const workoutEntrySchema = z
  .object({
    date: dateStringSchema,
    kind: z.enum(["strength", "cardio"]),
    name: z.string().trim().min(1, "Name the exercise").max(120),
    sets: z.coerce.number().int().min(1).max(100).optional(),
    reps: z.coerce.number().int().min(1).max(1000).optional(),
    weight_kg: z.coerce.number().min(0).max(2000).optional(),
    distance_km: z.coerce.number().min(0).max(2000).optional(),
    duration_minutes: z.coerce.number().int().min(1).max(1440).optional(),
    calories_burned: z.coerce.number().int().min(0).max(20000).optional(),
  })
  .refine(
    (w) => (w.kind === "strength" ? true : w.distance_km || w.duration_minutes),
    { message: "Add a distance or duration for cardio" }
  );

export const journalEntrySchema = z.object({
  date: dateStringSchema,
  body: z.string().max(20000),
});
