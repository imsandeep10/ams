import { z } from "zod";

export const createStudentFormSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(50, { message: "Full name must be at most 50 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(10, { message: "Phone number must be at most 10 digits" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .regex(/^[^0-9].*/, { message: "Address cannot start with a number" }),
  profileImageId: z.string().optional(),
  gpaOrPercentage: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true; // Allow empty values
        const num = parseFloat(val);
        if (isNaN(num)) return false;
        // Accept GPA range (0.0 - 4.0) or Percentage range (0 - 100)
        return (num >= 0 && num <= 4) || (num >= 0 && num <= 100);
      },
      {
        message:
          "GPA must be between 0.0 and 4.0 or Percentage must be between 0 and 100",
      },
    ),
  preferredCountry: z.string().optional(),
  faculty: z.string().optional(),
  classTime: z.string().optional(),
  language: z.enum(["Duolingo", "IELTS", "PTE", "SAT"], {
    message: "Language is required",
  }),
  interestedCourse: z.string().optional(),
  academicQualification: z.string().optional(),
  yearOfCompletion: z.string().optional(),
});

export type CreateStudentFormData = z.infer<typeof createStudentFormSchema>;
