import { useQuery} from "@tanstack/react-query";
import api from "../axiosInstance";

export const useGetBook = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["books", page, limit],
    queryFn: async () => {
      const res = await api.get("/api/payment", { params: { page, limit } }); // api milauni 
      if (!res || !res.data) {
        throw new Error("Failed to fetch books");
      }
      return res.data;
    },
  });
};