import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axiosInstance";
import { AxiosError } from "axios";
import type { CreateStudentResponse } from "@/shared/types/createStudentTypes";
import type { CreateStudentFormData } from "@/schema/createStudentSchema";
import { toast } from "sonner";
import type { Student } from "@/shared/types/studentTypes";
import type { StudentResponse } from "@/shared/interface/studentResponse";
import type {
  StudentTrackErrorResponse,
  StudentTrackResponse,
} from "@/shared/types/studentTrackTypes";
import { toYMD } from "@/hooks/toYMD";
import { useStore } from "@/shared/store";

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
    mutationKey: ["student"],
    mutationFn: async (data: CreateStudentFormData) => {
      const res = await api.post<CreateStudentResponse>(
        "/api/student/initiate",
        data,
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
  const { selectedDate } = useStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/student/${id}`);
      return res.data;
    },
    onSuccess: (_, id) => {
      toast.success("Student Deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", toYMD(selectedDate)],
      });
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
      const res = await api.patch(`/api/student/${id}`, data);
      return res.data;
    },
    onSuccess: (_, data) => {
      toast.success("Student updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", data.id] });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error updating student: ${error.message}`);
    },
  });
};

export const useGetStudentsByLanguage = (
  language: string,
  page: number = 1,
  limit: number = 10,
  student?: string,
) => {
  return useQuery({
    queryKey: ["students", language, page, limit, student?.trim()],
    queryFn: async (): Promise<{
      students: Student[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }> => {
      const params: Record<string, any> = {};
      if (student?.trim()) {
        params.term = student.trim();
      }
      if (language) {
        params.language = language;
      }
      if (page) {
        params.page = page;
      }
      if (limit) {
        params.limit = limit;
      }

      const res = await api.get(`/api/students/language/${language}`, {
        params,
      });
      if (!res?.data?.students) {
        throw new Error("Failed to fetch students");
      }

      const students = res.data.students.map((apiStudent: any) => ({
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

      return {
        students,
        pagination: res.data.pagination || {
          page,
          limit,
          total: students.length,
          totalPages: 1,
        },
      };
    },
    enabled: !!language,
  });
};

export const useGetAllStudents = (
  page: number = 1,
  limit: number = 10,
  student?: string,
  language?: string,
  preferredCountry?: string,
  yearOfCompletion?: string,
  includeQrCode?: boolean,
) => {
  return useQuery({
    queryKey: [
      "all-students",
      page,
      limit,
      student?.trim(),
      language,
      preferredCountry,
      yearOfCompletion,
      includeQrCode,
    ],
    queryFn: async (): Promise<{
      students: Student[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }> => {
      const params: Record<string, any> = {};

      if (student?.trim()) {
        params.term = student.trim();
      }
      if (language) {
        params.language = language;
      }
      if (preferredCountry) {
        params.preferredCountry = preferredCountry;
      }
      if (yearOfCompletion) {
        params.yearOfCompletion = yearOfCompletion;
      }
      if (includeQrCode) {
        params.includeQrCode = includeQrCode;
      }
      if (page) {
        params.page = page;
      }
      if (limit) {
        params.limit = limit;
      }
      const res = await api.get(`/api/students/filter`, {
        params,
      });
      if (!res?.data?.students) {
        throw new Error("Failed to fetch students");
      }

      const students = res.data.students.map((apiStudent: any) => ({
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

      return {
        students,
        pagination: res.data.pagination || {
          page,
          limit,
          total: students.length,
          totalPages: 1,
        },
      };
    },
  });
};

export const useGetStudentById = (id: string) => {
  return useQuery<StudentResponse>({
    queryKey: ["student", id],
    queryFn: async (): Promise<StudentResponse> => {
      try {
        const res = await api.get(`/api/student/${id}`);
        return res.data.student;
      } catch (err: AxiosError | any) {
        toast.error(err);
        throw err;
      }
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
        const res = await api.get(
          `/api/attendance?page=${page}&limit=${limit}`,
        );
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
  month: number,
  page?: number,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ["attendance", studentId, year, month, page, limit],
    queryFn: async (): Promise<
      StudentTrackResponse & StudentTrackErrorResponse
    > => {
      const params: Record<string, any> = { year, month };
      if (page) params.page = page;
      if (limit) params.limit = limit;

      try {
        const res = await api.get(
          `/api/attendance-track/monthly/${studentId}`,
          { params },
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

export const useStudentProgress = (userId: string) => {
  return useQuery({
    queryKey: ["student-progress", userId],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/student-progress/${userId}`);
        return res.data;
      } catch (err: any) {
        console.error(err);
      }
    },
  });
};

export const useStudentSearch = (
  query: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["student-search", query],
    queryFn: async () => {
      const res = await api.get("/api/student/search", {
        params: { term: query },
      });
      return res.data;
    },
    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : query.trim().length >= 2,
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentId: string) => {
      const res = await api.post(
        `/api/attendance/mark-student-present/${studentId}`,
      );
      return res.data;
    },
    onSuccess: ({ id }) => {
      toast.success("Attendance marked successfully!");
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        toast.error(`Attendance has already been marked for today.`);
      } else {
        toast.error(`Error marking attendance: ${error.message}`);
      }
    },
  });
};
