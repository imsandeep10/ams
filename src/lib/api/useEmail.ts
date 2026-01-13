import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import api from "../axiosInstance";
import { toast } from "sonner";
import type { CustomEmailData } from "@/shared/types/sendEmail.types";

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
