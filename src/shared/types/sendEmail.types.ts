import * as zod from "zod";

export const SendEmailSchema = zod.object({
  email: zod.string().min(1, "Student ID is required"),
  customSubject: zod.string().min(1, "Subject is required"),
  body: zod.string().min(1, "Email body is required"),
});

export type CustomEmailData = zod.infer<typeof SendEmailSchema>;

export const sendResultScoreSchema = zod.object({
  email: zod.string().min(1, "Email is required"),
  score: zod.number().min(0, "Score must be at least 0"),
});

export type SendResultScoreData = zod.infer<typeof sendResultScoreSchema>;
