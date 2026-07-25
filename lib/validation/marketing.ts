import { z } from "zod";
import { emailSchema } from "./auth";

/** Shared client/server validation for the public marketing forms. */

export const CONTACT_TOPICS = ["support", "sales", "press", "partnerships", "other"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Tell us your name").max(120, "That name is too long"),
  email: emailSchema,
  topic: z.enum(CONTACT_TOPICS, { message: "Pick a topic" }),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail helps us help you")
    .max(5000, "That message is too long"),
});

export const deletionSchema = z.object({
  email: emailSchema,
  reason: z.string().trim().max(2000, "That reason is too long").optional(),
  confirm: z.literal("on", { message: "Please confirm you understand this is permanent" }),
});
