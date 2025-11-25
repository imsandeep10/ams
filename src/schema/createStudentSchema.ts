import { z } from "zod";

export const createStudentFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(50),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 7 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" }),
  address: z.string().min(1, "Address is required"),
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
      }
    ),
  preferredCountry: z.string().min(1, "Preferred country is required"),
  faculty: z.string().min(1, "Faculty is required"),
  classTime: z.string().min(1, "Class time is required"),
  language: z.string().min(1, "Language is required"),
  interestedCourse: z.string().optional(),
  academicQualification: z
    .string()
    .min(1, "Academic qualification is required"),
  yearOfCompletion: z.string().min(1, "Year of completion is required"),
});

export type CreateStudentFormData = z.infer<typeof createStudentFormSchema>;
