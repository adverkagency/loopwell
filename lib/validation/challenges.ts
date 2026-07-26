import { z } from "zod";

/** Challenge ids are stable slugs seeded by migration, not user input. */
export const challengeIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "Unknown challenge");

export const joinChallengeSchema = z.object({
  challenge_id: challengeIdSchema,
});
