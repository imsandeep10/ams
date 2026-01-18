import { useQuery } from "@tanstack/react-query";
import api from "../axiosInstance";

export const useGetBook = (page: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: ["books", page, limit, search],
    queryFn: async () => {
      const res = await api.get(`/api/payment?term=${search}`, {
        params: { page, limit },
      }); // api milauni
      if (!res || !res.data) {
        throw new Error("Failed to fetch books");
      }
      return res.data;
    },
  });
};
