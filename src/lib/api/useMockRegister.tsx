import type {
  createMockRegisterRespoonse,
  IELTSMockTestFormData,
} from "@/shared/types/mockFormTypes";
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
      toast.success("You registered mock test form successfully");
      queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
    },
    onError: (error: AxiosError) => {
      console.log("error", error);
      toast.error(
        `Mock test registration failed: ${(error.response?.data as any)?.message || error.message}`,
      );
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

export const upcomingMockTest = (
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  return useQuery({
    queryKey: ["mock-tests", "upcoming", page, limit, search],
    queryFn: async (): Promise<{
      data: createMockRegisterRespoonse[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
      numberOfStudentsInEachModule: {
        totalSpeaking: number;
        totalListening: number;
        totalReading: number;
        totalWriting: number;
      };
    }> => {
      const params: Record<string, any> = { page, limit };
      if (search?.trim()) params.term = search.trim();
      const res = await api.get(`/api/mock-test/upcoming`, {
        params,
      });
      if (!res?.data) {
        throw new Error("Failed to fetch mock test Data");
      }

      return {
        data: res.data.data,
        pagination: res.data.data.pagination || {
          page,
          limit,
          total: res.data.data.length,
          totalPages: 1,
        },
        numberOfStudentsInEachModule: res.data.numberOfStudentsInEachModule || {
          totalSpeaking: 0,
          totalListening: 0,
          totalReading: 0,
          totalWriting: 0,
        },
      };
    },
  });
};

interface UseExportMockTestsParams {
  startDate?: string;
  endDate?: string;
}
export const useExportMockTests = () => {
  return useMutation({
    mutationFn: async ({ startDate, endDate }: UseExportMockTestsParams) => {
      // Format dates to YYYY-MM-DD format
      const formattedStartDate = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : undefined;
      const formattedEndDate = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : undefined;

      const res = await api.post(
        `/api/mock-test/past/export?${
          formattedStartDate ? `startDate=${formattedStartDate}&` : ""
        }${formattedEndDate ? `endDate=${formattedEndDate}` : ""}`,
        {},
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream",
          },
        },
      );

      // Verify response is a blob
      if (!(res.data instanceof Blob)) {
        throw new Error("Expected blob response but got something else");
      }

      // Create download link
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `mock-tests-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: AxiosError) => {
      toast.error(`Error exporting mock tests: ${error.message}`);
    },
  });
};

// export const useExportMockTests = ({
//   startDate,
//   endDate,
// }: UseExportMockTestsParams) => {
//   const params = new URLSearchParams();
//   if (startDate) params.append("startDate", startDate);
//   if (endDate) params.append("endDate", endDate);
//   const query = params.toString();
//   return useQuery({
//     queryKey: ["export-mock-tests", query],
//     queryFn: async () => {
//       const res = await api.get(
//         `/api/mock-test/past/export?${query.toString()}`,
//         {
//           responseType: "blob",
//         }
//       );
//       return res.data;
//     },
//     enabled: false,
//   });
// };
