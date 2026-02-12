import { useQuery } from "@tanstack/react-query";
import api from "../axiosInstance";
import { AxiosError } from "axios";

export const useGetBook = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ["books", page, limit, search],
    queryFn: async () => await getAllBooksData({ page, limit, search }),
    retry: 1,
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    networkMode: "online",
  });
};

export const getAllBooksData = async ({
  search,
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const res = await api.get(`/api/payment/all`, { params });
    if (!res || !res.data) {
      throw new Error("Failed to fetch all books data");
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `API Error: ${error.response?.data?.message || error.message}`,
      );
    }
    throw error;
  }
};
