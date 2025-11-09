import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axiosInstance';

export type PresentStudent = {
  fullName: string;
  phoneNumber: string;
  email: string;
  language: 'IELTS' | 'PTE' | 'SAT' | 'Duolingo';
  status: 'present' | 'absent';
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

async function fetchTodayPresentStudents(): Promise<PresentStudent[]> {
  const response = await api.get<PresentStudent[]>('/dashboard/today/present');
  const data = response.data ?? [];
  return data;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>('/dashboard/stats');
  return response.data;
}

export function useTodayPresentStudents() {
  return useQuery({
    queryKey: ['dashboard', 'todayPresent'],
    queryFn: fetchTodayPresentStudents,
    staleTime: 60_000, // 1 minute cache
    gcTime: 5 * 60_000, // 5 minutes
    refetchOnMount: true,
    retry: 1,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 60_000, // 1 minute cache
    gcTime: 5 * 60_000, // 5 minutes
    refetchOnMount: true,
  });
}
