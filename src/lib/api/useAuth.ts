import type { LoginFormData } from "@/schema/LoginSchema";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../axiosInstance";

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation<AxiosResponse, AxiosError, LoginFormData>({
    mutationFn: async (data) => {
      const res = await api.post("/api/login/signin", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error: AxiosError) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const res = await api.post("/api/login/signout");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Logout successful!");
    },
    onError: (error: AxiosError) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });
};

export const useForgotPassword = () => {
  const navigate = useNavigate();
  return useMutation<AxiosResponse, AxiosError, { email: string }>({
    mutationKey: ["forgotPassword"],
    mutationFn: async (data) => {
      const res = await api.post("/api/reset-password/request-otp", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("OTP sent to your email!");
      navigate("/reset-password/verify-otp");
    },
    onError: (error: AxiosError) => {
      toast.error(`Failed to send OTP: ${error.message}`);
    },
  });
};

export const useVerifyOtp = () => {
  const navigate = useNavigate();
  return useMutation<AxiosResponse, AxiosError, { email: string; otp: string }>(
    {
      mutationKey: ["verifyOtp"],
      mutationFn: async (data) => {
        const res = await api.post("/api/reset-password/verify-otp", data);
        return res.data;
      },
      onSuccess: () => {
        toast.success("OTP verified! You can now reset your password.");
        navigate("/reset-password/new-password");
      },
      onError: (error: AxiosError) => {
        toast.error(`OTP verification failed: ${error.message}`);
      },
    }
  );
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation<
    AxiosResponse,
    AxiosError,
    { email: string; newPassword: string }
  >({
    mutationKey: ["resetPassword"],
    mutationFn: async (data) => {
      const res = await api.post("/api/reset-password/new-password", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful! Please log in.");
      navigate("/");
    },
    onError: (error: AxiosError) => {
      toast.error(`Password reset failed: ${error.message}`);
    },
  });
};
