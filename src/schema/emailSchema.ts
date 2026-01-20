import * as z from "zod";

export const emailSchema = z.object({
  studentFilter: z.enum(["all", "PTE", "IELTS", "SAT", "Duolingo"]).optional(),
  customSubject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject is too long"),
  body: z.string().min(1, "Email body is required"),
});

export type EmailFormData = z.infer<typeof emailSchema>;
