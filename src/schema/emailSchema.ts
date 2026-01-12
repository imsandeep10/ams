import * as z from "zod";

export const emailSchema = z.object({
  to: z.string().email("Invalid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject is too long"),
  message: z.string().min(1, "Email body is required"),
});
