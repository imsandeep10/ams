import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "../axiosInstance";

export const useRequestOtp = () =>
  useMutation<{ message: string }, AxiosError, { email: string }>({
    mutationFn: async (payload) => {
      const res = await api.post("/api/reset-password/request-otp", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent to email");
    },
    onError: (err) => {
      const msg = (err.response?.data as any)?.message || err.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

export const useVerifyOtp = () =>
  useMutation<{ message: string }, AxiosError, { email: string; otp: string }>({
    mutationFn: async (payload) => {
      const res = await api.post("/api/reset-password/verify-otp", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP verified");
    },
    onError: (err) => {
      const msg = (err.response?.data as any)?.message || err.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

export const useResetPasswordMutation = () =>
  useMutation<
    { message: string },
    AxiosError,
    { email: string; newPassword: string }
  >({
    mutationFn: async (payload) => {
      const res = await api.post("/api/reset-password/new-password", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully");
    },
    onError: (err) => {
      const msg = (err.response?.data as any)?.message || err.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
