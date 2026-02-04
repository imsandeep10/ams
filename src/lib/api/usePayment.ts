import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { StudentResponse } from "@/shared/interface/studentResponse";
export const useGetPaymentById = (userId: string) => {
  return useQuery({
    queryKey: ["payment", userId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/payment/${userId}`);
        return response.data;
      } catch (err: any) {
        console.error("Error fetching payment data:", err);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!userId,
  });
};

interface GetAllPaymentsParams {
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
  students: StudentResponse[];
}

export const useGetAllPayments = (
  page: number = 1,
  limit: number = 10,
  paymentStatus?: string,
  student?: string,
) => {
  console.log(student);
  return useQuery({
    queryKey: ["allPayments", page, limit, student, paymentStatus],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (student) params.term = student;
      if (paymentStatus) params.filter = paymentStatus;
      params.page = page;
      params.limit = limit;

      try {
        const response = await api.get<GetAllPaymentsParams>(`/api/payment`, {
          params,
        });
        return response.data;
      } catch (err: any) {
        console.error("Error fetching all payments data:", err);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const usePatchPayment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      paymentStatus: "FULL_PAID" | "PARTIAL_PAID" | "NOT_PAID";
      remarks: string | undefined;
      paymentMethod: "CASH" | "ONLINE";
      paymentAmount: number;
      bookStatus: "NO_BOOK_TAKEN" | "TWO_BOOKS_TAKEN" | "ALL_BOOKS_TAKEN";
    }) => {
      try {
        const response = await api.patch(`/api/payment`, data);
        toast.success("Payment updated successfully");
        navigate(-1);
        return response.data;
      } catch (err: any) {
        console.error("Error updating payment data:", err);
      }
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["allPayments"] });
      queryClient.invalidateQueries({ queryKey: ["student", data.studentId] });
    },
    onError: (error) => {
      console.error("Error in payment mutation:", error);
    },
  });
};
