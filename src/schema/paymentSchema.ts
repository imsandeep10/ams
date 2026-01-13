import * as z from "zod";

export const paymentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  amount: z.number().min(1, "Amount must be at least 1"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(["cash", "online"]),
  language: z.enum(["PTE", "SAT", "IELTS", "DUOLINGO"]),
  remarks: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
