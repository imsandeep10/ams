import { z } from "zod";

export const createAdminSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(50),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must contain at least 10 digits" })
    .max(15, { message: "Phone number must not exceed 15 digits" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  profileImageId: z.string().optional(),
  role: z.enum(["satAdmin", "duolingoAdmin", "ieltsAdmin", "pteAdmin","accountant"], {
    message: "Please select a role",
  }),
});

// Schema for edit mode (without password)
export const editAdminSchema = createAdminSchema.omit({ password: true });

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;