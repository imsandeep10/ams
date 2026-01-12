import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import api from "../axiosInstance";
import type { CurrentUserResponse } from "@/shared/types/currentUserResponse";

export const useCurrentUser = () => {
  return useQuery<CurrentUserResponse, AxiosError>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/api/user/profile");
      return res.data as CurrentUserResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
};
