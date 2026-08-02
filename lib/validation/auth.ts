import { z } from "zod";

/** Shared client/server validation (architecture doc §10) — one schema, both sides. */

export const emailSchema = z.email("Enter a valid email address");

// Small enough to keep inline; these are the handful of passwords that show
// up at the very top of every public breach-corpus frequency list.
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "qwertyuiop",
  "letmein123",
  "iloveyou1",
  "admin1234",
  "welcome123",
  "abc123456",
  "password123",
  "football1",
  "baseball1",
]);

/** New/changed passwords — matches the "one number or symbol, no common passwords" copy shown at registration. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .refine((v) => /[0-9]/.test(v) || /[^A-Za-z0-9]/.test(v), {
    message: "Add a number or symbol",
  })
  .refine((v) => !COMMON_PASSWORDS.has(v.toLowerCase()), {
    message: "That password is too common — try another",
  });

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
