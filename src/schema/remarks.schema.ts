import * as z from "zod";

export const remarksSchema = z.object({
  remark: z.string().min(1, "Remark is required"),
});
export type RemarksFormData = z.infer<typeof remarksSchema>;
