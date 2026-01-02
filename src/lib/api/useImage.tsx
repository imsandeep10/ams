import { useMutation } from "@tanstack/react-query";
import api from "../axiosInstance";
import type { UploadedImageResponse } from "@/types/createStudentTypes";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUploadImage = () => {
  return useMutation<UploadedImageResponse, AxiosError, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post<UploadedImageResponse>(
        "/api/uploads/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },
    onError: (error: AxiosError) => {
      toast.error(`Error uploading image: ${error.message}`);
    },
  });
};
