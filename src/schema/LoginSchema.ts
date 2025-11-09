import * as z from "zod";
export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .refine((p) => !/\s/.test(p), "Password must not contain spaces"),
});
export type loginSchema = z.infer<typeof loginSchema>;
