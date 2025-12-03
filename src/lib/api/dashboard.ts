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

function toYMD(date?: Date): string | undefined {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function fetchPresentStudentsByDate(date?: Date): Promise<PresentStudent[]> {
  const ymd = toYMD(date);
  const response = await api.get<PresentStudent[]>('/dashboard/today/present', {
    params: ymd ? { date: ymd } : undefined,
  });
  const data = response.data ?? [];
  return data;
}

async function fetchDashboardStats(date?: Date): Promise<DashboardStats> {
  const ymd = toYMD(date);
  const response = await api.get<DashboardStats>('/dashboard/stats', {
    params: ymd ? { date: ymd } : undefined,
  });
  return response.data;
}

export function useTodayPresentStudents(date?: Date) {
  return useQuery({
    queryKey: ['dashboard', 'presentByDate', toYMD(date)],
    queryFn: () => fetchPresentStudentsByDate(date),
    staleTime: 60_000, // 1 minute cache
    gcTime: 5 * 60_000, // 5 minutes
    refetchOnMount: true,
    retry: 1,
  });
}

export function useDashboardStats(date?: Date) {
  return useQuery({
    queryKey: ['dashboard', 'stats', toYMD(date)],
    queryFn: () => fetchDashboardStats(date),
    staleTime: 60_000, // 1 minute cache
    gcTime: 5 * 60_000, // 5 minutes
    refetchOnMount: true,
  });
}
