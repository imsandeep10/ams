import * as z from "zod";

export const emailSchema = z.object({
  to: z.string().email("Invalid email address").array(),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject is too long"),
  message: z.string().min(1, "Email body is required"),
  from: z.string().email("Invalid sender email address").optional(),
});

export type EmailFormData = z.infer<typeof emailSchema>;
