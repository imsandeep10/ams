import * as z from "zod";

export const remarksSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  subject: z.string().min(1, "Subject is required"),
  priorityStatus: z.enum(["low", "medium", "high"]),
  remark: z.string().min(1, "Remark is required"),
});
export type RemarksFormData = z.infer<typeof remarksSchema>;
