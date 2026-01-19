import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import api from "../axiosInstance";
import { toast } from "sonner";
import type { CustomEmailData } from "@/shared/types/sendEmail.types";
import type { RemarksFormData } from "@/schema/remarks.schema";

export const useCustomSingleEmail = () => {
  return useMutation<AxiosResponse, AxiosError, CustomEmailData>({
    mutationKey: ["customSingleEmail"],
    mutationFn: async (data: CustomEmailData) => {
      const res = await api.post("/api/student/message-student", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Custom email sent successfully!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Failed to send custom email: ${error.message}`);
    },
  });
};

export const useSendResultScore = () => {
  return useMutation<
    AxiosResponse,
    AxiosError,
    { email: string; score: number }
  >({
    mutationKey: ["sendResultScore"],
    mutationFn: async (data: { email: string; score: number }) => {
      const res = await api.post("/api/mock-test/results", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Result score sent successfully!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Failed to send result score: ${error.message}`);
    },
  });
};

export const usePostRemark = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse, AxiosError, RemarksFormData>({
    mutationKey: ["postRemark", id],
    mutationFn: async (data: RemarksFormData) => {
      const res = await api.post(`/api/student/add-remark/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Remark sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Failed to send remark: ${error.message}`);
    },
  });
};
