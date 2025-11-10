import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axiosInstance";
import { AxiosError } from "axios";
import type { CreateStudentResponse } from "@/types/createStudentTypes";
import type { CreateStudentFormData } from "@/schema/createStudentSchema";
import { toast } from "sonner";
import type { Student } from "@/types/studentTypes";

type UpdateStudentPayload = {
  id: string;
  data: CreateStudentFormData;
};

interface AttendanceParams {
  page?: number;
  limit?: number;
}
export const useCreateStudents = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateStudentResponse, AxiosError, CreateStudentFormData>({
    mutationFn: async (data: CreateStudentFormData) => {
      const res = await api.post<CreateStudentResponse>(
        "/student/initiate",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Student created successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error creating student: ${error.message}`);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/student/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Student Deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error deleting student: ${error.message}`);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateStudentPayload) => {
      const res = await api.patch(`/student/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Student updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error updating student: ${error.message}`);
    },
  });
};

export const useGetStudentsByLanguage = (language: string) => {
  return useQuery({
    queryKey: ["students", language],
    queryFn: async (): Promise<Student[]> => {
      const res = await api.get(`/students/language/${language}`);
      if (!res?.data?.students) {
        throw new Error("Failed to fetch students");
      }

      return res.data.students.map((apiStudent: any) => ({
        id: apiStudent.id,
        name: apiStudent.user.fullName,
        studentId: apiStudent.id.slice(0, 8).toUpperCase(),
        faculty: apiStudent.faculty,
        phone: apiStudent.user.phoneNumber,
        email: apiStudent.user.email,
        classTime: apiStudent.classTime,
        academicQualification: apiStudent.academicQualification,
        gpaOrPercentage: apiStudent.gpaOrPercentage,
        yearOfCompletion: apiStudent.yearOfCompletion,
        interestedCourse: apiStudent.interestedCourse,
        language: apiStudent.language,
        preferredCountry: apiStudent.preferredCountry,
        qrCode: apiStudent.qrCode,
        user: apiStudent.user,
      }));
    },
    enabled: !!language,
  });
};

export const useGetStudentById = (id: string) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: async ({ queryKey }) => {
      const [, studentId] = queryKey;
      const res = await api.get(`/student/${studentId}`);
      if (!res || !res.data) {
        throw new Error("Student Not Found");
      }
      return res.data.student;
    },
    enabled: !!id, // only fetch if id exists
  });
};

export const useGetStudentAttendance = (params: AttendanceParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["attendance", page, limit],
    queryFn: async () => {
      try {
        const res = await api.get(`/attendance?page=${page}&limit=${limit}`);
        return res.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to fetch attendance: ${message}`);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetStudentAttendanceTrack = (
  studentId: string,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      try {
        const res = await api.get(
          `/attendance-track/monthly/${studentId}?year=${year}&month=${month}`
        );
        return res.data;
      } catch (err: any) {
        toast.error("Failed to fetch attendance:", err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useStudentSearch = (query: string) => {
  return useQuery({
    queryKey: ["student-search", query],
    queryFn: async () => {
      const res = await api.get("/student/search", {
        params: { term: query },
      });
      return res.data;
    },
    enabled: query.length > 0 || query === "",
  });
};
