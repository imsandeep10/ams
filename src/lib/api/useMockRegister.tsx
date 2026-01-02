import type { IELTSMockTestFormData } from "@/types/mockFormTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axiosInstance";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

export const useMockRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, AxiosError, IELTSMockTestFormData>({
    mutationFn: async (data: IELTSMockTestFormData) => {
      const res = await api.post("/api/mock-test/register", data);
      return res;
    },
    onSuccess: () => {
      //  refresh related queries after registration
      toast.success("you registered mock test form successfully");
      queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Mock test registration failed: ${error.message}`);
    },
  });
};

export const useGetMockUpcoming = () => {
  return useQuery({
    queryKey: ["mock-tests", "upcoming"],
    queryFn: async () => {
      const res = await api.get("/api/mock-test/upcoming");
      if (!res || !res.data) {
        throw new Error("Failed to fetch admins");
      }
      return Array.isArray(res.data) ? res?.data : res?.data?.data || [];
    },
  });
};

// Server-side paginated past mock tests
export const useGetMockPast = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["mock-tests", "past", page, limit],
    queryFn: async () => {
      const res = await api.get("/api/mock-test/past", {
        params: { page, limit },
      });
      if (!res || !res.data) {
        throw new Error("Failed to fetch admins");
      }
      return res.data;
    },
  });
};

export const useDeleteMock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/mock-test/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Mock Student deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error deleting mock student: ${error.message}`);
    },
  });
};
