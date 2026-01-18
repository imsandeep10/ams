import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axiosInstance";
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

export const useGetAllPayments = (
  page: number = 1,
  limit: number = 10,
  paymentStatus?: string,
  student?: string,
) => {
  return useQuery({
    queryKey: ["allPayments", page, limit, student, paymentStatus],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/payment?term=${student || ""}`, {
          params: { page, limit, term: paymentStatus },
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
  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      paymentStatus: "FULL_PAID" | "PARTIAL_PAID" | "NOT_PAID";
      remarks: string | undefined;
      paymentAmount: number;
      bookStatus: "NO_BOOK_TAKEN" | "TWO_BOOKS_TAKEN" | "ALL_BOOKS_TAKEN";
    }) => {
      try {
        const response = await api.patch(`/api/payment`, data);
        return response.data;
      } catch (err: any) {
        console.error("Error updating payment data:", err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPayments"] });
    },
    onError: (error) => {
      console.error("Error in payment mutation:", error);
    },
  });
};
