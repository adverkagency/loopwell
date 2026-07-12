import { z } from "zod";

export const goalInputSchema = z.object({
  label: z.string().trim().min(1, "Give your goal a name").max(120),
  target_value: z.coerce.number().finite(),
  current_value: z.coerce.number().finite().default(0),
  start_value: z.coerce.number().finite().optional(),
  unit: z.string().trim().max(20).optional(),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
});

export const goalProgressSchema = z.object({
  id: z.uuid(),
  current_value: z.coerce.number().finite(),
});
