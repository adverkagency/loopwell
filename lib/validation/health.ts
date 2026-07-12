import { z } from "zod";
import { dateStringSchema } from "./habits";

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Invalid time");

export const addWaterSchema = z.object({
  date: dateStringSchema,
  amount_ml: z.coerce.number().int().min(1).max(10000),
});

export const setSleepSchema = z.object({
  date: dateStringSchema,
  bed_time: timeSchema,
  wake_time: timeSchema,
  quality: z.enum(["poor", "okay", "great"]).nullable(),
});

export const setMoodSchema = z.object({
  date: dateStringSchema,
  mood: z.coerce.number().int().min(1).max(5),
  note: z.string().trim().max(280).optional(),
});

export const setWeightSchema = z.object({
  date: dateStringSchema,
  weight_kg: z.coerce.number().min(1).max(500),
});
