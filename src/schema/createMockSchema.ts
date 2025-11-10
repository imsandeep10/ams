import {
  DESTINATION_COUNTRY_OPTIONS,
  MODULE_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  TEST_TYPE_OPTIONS,
} from "@/constant/mock";
import { z } from "zod";

//  Zod Schema Definition
export const createMockSchema = z
  .object({
    mockTestDate: z
      .string()
      .min(1, "Date is required")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),

    preferredTime: z.enum(PREFERRED_TIME_OPTIONS, {
      message: "Please select a preferred time",
    }),

    testType: z.enum(TEST_TYPE_OPTIONS, {
      message: "Please select a test type",
    }),

    moduleCompleted: z
      .array(z.enum(MODULE_OPTIONS))
      .min(1, "Please select a module"),

    name: z
      .string()
      .min(2, "Minimum 2 characters")
      .nonempty("Name is required"),

    surname: z
      .string()
      .min(2, "Minimum 2 characters")
      .nonempty("Surname is required"),

    whatsappNumber: z
      .string()
      .nonempty("WhatsApp number is required")
      .regex(/^[0-9+\-\s()]*$/, "Invalid phone number"),

    ieltsExamDate: z
      .string()
      .optional()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),

    destinationCountry: z.enum(DESTINATION_COUNTRY_OPTIONS, {
      message: "Please select a destination country",
    }),

    otherCountry: z.string().optional(),
  })
  //  Conditional Validation: Require `otherCountry` if destination is "Other"
  .refine(
    (data) =>
      data.destinationCountry !== "Other" || !!data.otherCountry?.trim(),
    {
      path: ["otherCountry"],
      message: "Please specify the country",
    }
  );

// Type inference for form
export type IELTSMockTestFormData = z.infer<typeof createMockSchema>;
