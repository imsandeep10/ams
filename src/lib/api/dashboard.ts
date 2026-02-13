import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import { toYMD } from "@/hooks/toYMD";

export type PresentStudent = {
  fullName: string;
  phoneNumber: string;
  email: string;
  language: "IELTS" | "PTE" | "SAT" | "Duolingo";
  status: "present" | "absent";
};

export type DashboardStats = {
  total: number;
  ielts: number;
  pte: number;
  sat: number;
  duolingo: number;
  totalEnrolled: number;
  totalPresentToday: number;
  totalAbsentToday: number;
};

async function fetchPresentStudentsByDate(
  date?: Date,
): Promise<PresentStudent[]> {
  const ymd = toYMD(date);
  const response = await api.get<PresentStudent[]>(
    "/api/dashboard/today/present",
    {
      params: ymd ? { date: ymd } : undefined,
    },
  );
  const data = response.data ?? [];
  return data;
}

async function fetchDashboardStats(date?: Date): Promise<DashboardStats> {
  const ymd = toYMD(date);
  const response = await api.get<DashboardStats>("/api/dashboard/stats", {
    params: ymd ? { date: ymd } : undefined,
  });
  return response.data;
}

export function useTodayPresentStudents(date?: Date) {
  return useQuery({
    queryKey: ["dashboard", toYMD(date)],
    queryFn: () => fetchPresentStudentsByDate(date),
    staleTime: 60_000, // 1 minute cache
    gcTime: 5 * 60_000, // 5 minutes
    refetchOnMount: true,
    retry: 1,
  });
}

export function useDashboardStats(date?: Date) {
  return useQuery({
    queryKey: ["dashboard", "stats", toYMD(date)],
    queryFn: () => fetchDashboardStats(date),
    staleTime: 60_000, // 1 minute cache
    gcTime: 5 * 60_000, // 5 minutes
    refetchOnMount: true,
  });
}
