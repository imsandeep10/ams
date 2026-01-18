import type { CreateAdminFormData } from "@/schema/createAdminSchema";
import type { CreateAdminResponse } from "@/shared/types/createAdminTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import api from "../axiosInstance";

type UpdateAdminPayload = {
  id: string;
  data: CreateAdminFormData;
};
export const useCreateAdmins = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateAdminResponse, AxiosError, CreateAdminFormData>({
    mutationFn: async (data: CreateAdminFormData) => {
      const res = await api.post<CreateAdminResponse>("/api/user", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error creating Admin: ${error.message}`);
    },
  });
};
// useAdmin.tsx
// useAdmin.tsx
export const useChangeAdminPw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; newPassword: string }) => {
      const res = await api.post(
        `/api/reset-password/admin/change-password`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin password changed successfully!");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to change password";
      toast.error(`Error: ${errorMessage}`);
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateAdminPayload) => {
      const res = await api.patch(`/api/user/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error updating Admin: ${error.message}`);
    },
  });
};

export const useGetAdminById = (id: string) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: async ({ queryKey }) => {
      const [, adminId] = queryKey;
      const res = await api.get(`/api/user/admin/${adminId}`);
      if (!res?.data) throw new Error("Admins not found");

      return res.data;
    },
    enabled: !!id,
  });
};

export const useGetAllAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await api.get("/api/user/admins");
      if (!res || !res.data) {
        throw new Error("Failed to fetch admins");
      }
      return Array.isArray(res.data.data) ? res.data.data : res.data.data.admins || [];
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/user/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin Deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["admins"],
        refetchType: "active",
      });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error deleting Admin: ${error.message}`);
    },
  });
};
