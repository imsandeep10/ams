import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../axiosInstance";
import { AxiosError } from "axios";
import type { GlobalQRCodeType, StaticQRCodeType, MockTestRegistrationQRCodeType } from "@/types/dashboardTypes";

interface AttendanceResponse {
  success: boolean;
  message: string;
  studentName?: string;
  alreadyMarked?: boolean;
  date?: string;
  time?: string;
  error?: string;
}

interface MarkAttendanceRequest {
  token?: string; // Optional for static QR
  phoneNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
}


/**
 * Custom hook to fetch static QR code for wall mounting
 * @returns React Query result with static QR code data
 */
export const useGetStaticQRCode = () => {
  return useQuery<StaticQRCodeType, AxiosError>({
    queryKey: ["staticQRCode"],
    queryFn: async (): Promise<StaticQRCodeType> => {
      const res = await api.get<StaticQRCodeType>("/qr-code/static/attendance");
      
      if (!res?.data) {
        throw new Error("Failed to fetch static QR code");
      }

      return res.data;
    },
    // Cache for 1 hour since static QR codes don't change
    staleTime: 60 * 60 * 1000,
    // Retry on failure
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Custom hook to fetch static QR code for student registration
 * @returns React Query result with student registration QR code data
 */
export const useGetStudentRegistrationQRCode = () => {
  return useQuery<StaticQRCodeType, AxiosError>({
    queryKey: ["studentRegistrationQRCode"],
    queryFn: async (): Promise<StaticQRCodeType> => {
      const res = await api.get<StaticQRCodeType>("/qr-code/static/student-register");
      
      if (!res?.data) {
        throw new Error("Failed to fetch student registration QR code");
      }

      return res.data;
    },
    // Cache for 1 hour since static QR codes don't change
    staleTime: 60 * 60 * 1000,
    // Retry on failure
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Custom hook to fetch static QR code for mock test registration
 * @returns React Query result with mock test registration QR code data
 */
export const useGetMockTestRegistrationQRCode = () => {
  return useQuery<MockTestRegistrationQRCodeType, AxiosError>({
    queryKey: ["mockTestRegistrationQRCode"],
    queryFn: async (): Promise<MockTestRegistrationQRCodeType> => {
      const res = await api.get<MockTestRegistrationQRCodeType>("/qr-code/static/mock-test-register");
      
      if (!res?.data) {
        throw new Error("Failed to fetch mock test registration QR code");
      }

      return res.data;
    },
    // Cache for 1 hour since static QR codes don't change
    staleTime: 60 * 60 * 1000,
    // Retry on failure
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Custom hook to fetch global QR code for attendance
 * @returns React Query result with global QR code data
 */
export const useGetGlobalQRCode = () => {
  return useQuery<GlobalQRCodeType, AxiosError>({
    queryKey: ["globalQRCode"],
    queryFn: async (): Promise<GlobalQRCodeType> => {
      const res = await api.get<GlobalQRCodeType>("/qr-code/global");
      
      if (!res?.data) {
        throw new Error("Failed to fetch global QR code");
      }

      return res.data;
    },
    // Cache for 5 minutes since QR codes are time-sensitive
    staleTime: 5 * 60 * 1000,
    // Retry on failure
    retry: 3,
    retryDelay: 1000,
  });
};

/**
 * Custom hook to mark attendance using phone number and location
 * Works with both static QR codes (no token) and dynamic QR codes (with token)
 * @returns React Query mutation for attendance marking
 */
export const useMarkAttendance = () => {
  return useMutation<AttendanceResponse, AxiosError, MarkAttendanceRequest>({
    mutationFn: async ({ token, phoneNumber, location }: MarkAttendanceRequest): Promise<AttendanceResponse> => {
      const payload: any = { 
        phoneNumber,
        location
      };
      
      // Add token only if provided (for dynamic QR codes)
      if (token) {
        payload.token = token;
      }
      
      const res = await api.post<AttendanceResponse>("/attendance/mark", payload);
      
      if (!res?.data) {
        throw new Error("Failed to mark attendance");
      }

      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });
};