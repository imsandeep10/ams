import { useQuery } from "@tanstack/react-query";
import api from "../axiosInstance";
import type {
  DonutChartResponse,
  ReportPeriodType,
  PeriodReportResponse,
} from "@/shared/types/reportTypes";
import type { Language } from "@/shared/types/languageType";

type UseGetStudentGrowthParams = {
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
  language?: Language["language"];
};

export const useGetReport = (date?: Date, language?: Language["language"]) => {
  return useQuery({
    queryKey: ["report", date, language],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (date) {
        params.append("year", String(date.getFullYear()));
        params.append("month", String(date.getMonth() + 1));
      }

      if (language) params.append("language", language);

      const res = await api.get(
        `/api/reports/charts/language-programs?${params.toString()}`
      );

      if (!res?.data) {
        throw new Error("Report data not found");
      }

      return res.data; // return fully typed report data
    },
    enabled: !!date, // only fetch if date exists
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};

export const useGetDonutChart = (
  year?: number,
  month?: number,
  language?: Language["language"]
) => {
  return useQuery<DonutChartResponse>({
    queryKey: ["donutChart", year, month, language],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (year) params.append("year", String(year));
      if (month) params.append("month", String(month));
      if (language) params.append("language", language);

      const res = await api.get<DonutChartResponse>(
        `/api/reports/charts/attendance-overview?${params.toString()}`
      );

      if (!res?.data) {
        throw new Error("Report data not found");
      }

      return res.data;
    },
    enabled: !!year && !!month,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetStudentGrowth = ({
  startYear,
  startMonth,
  endYear,
  endMonth,
  language,
}: UseGetStudentGrowthParams) => {
  return useQuery({
    queryKey: [
      "studentGrowth",
      startYear,
      startMonth,
      endYear,
      endMonth,
      language,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        startYear: String(startYear),
        startMonth: String(startMonth),
        endYear: String(endYear),
        endMonth: String(endMonth),
      });

      if (language) {
        params.append("language", language);
      }

      const res = await api.get(`/api/reports/charts/student-growth?${params}`);

      if (!res?.data) {
        throw new Error("Student growth data not found");
      }

      return res.data;
    },
    enabled:
      typeof startYear === "number" &&
      typeof startMonth === "number" &&
      typeof endYear === "number" &&
      typeof endMonth === "number",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetTodayAttendance = (language?: Language["language"]) => {
  return useQuery({
    queryKey: ["todayAttendance", language],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (language) params.append("language", language);

      const res = await api.get(`/api/reports/today?${params.toString()}`);

      if (!res?.data) {
        throw new Error("Today's attendance data not found");
      }

      return res.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchInterval: 1000 * 60 * 2, // refetch every 2 minutes
  });
};

type UseGetPeriodReportParams = {
  year: number;
  month: number;
  periodType?: ReportPeriodType;
  date?: string;
  week?: number;
  language?: Language["language"];
};

export const useGetPeriodReport = ({
  year,
  month,
  periodType = "monthly" as ReportPeriodType,
  date,
  week,
  language,
}: UseGetPeriodReportParams) => {
  return useQuery<PeriodReportResponse>({
    queryKey: ["periodReport", year, month, periodType, date, week, language],
    queryFn: async () => {
      const params = new URLSearchParams({
        year: String(year),
        month: String(month),
      });

      if (periodType) params.append("periodType", periodType);
      if (date) params.append("date", date);
      if (week) params.append("week", String(week));
      if (language) params.append("language", language);

      const res = await api.get<PeriodReportResponse>(
        `/api/reports/period?${params.toString()}`
      );

      if (!res?.data) {
        throw new Error("Period report data not found");
      }

      return res.data;
    },
    enabled: !!year && !!month,
    staleTime: 1000 * 60 * 5,
  });
};

export const downloadReport = async ({
  year,
  month,
  periodType = "monthly" as ReportPeriodType,
  date,
  week,
  language,
}: UseGetPeriodReportParams) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  if (periodType) params.append("periodType", periodType);
  if (date) params.append("date", date);
  if (week) params.append("week", String(week));
  if (language) params.append("language", language);

  const res = await api.get(`/api/reports/download/csv?${params.toString()}`, {
    responseType: "blob",
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `attendance-report-${periodType}-${year}-${month}.csv`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadPdfReport = async ({
  year,
  month,
  periodType = "monthly" as ReportPeriodType,
  date,
  week,
  language,
}: UseGetPeriodReportParams) => {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  if (periodType) params.append("periodType", periodType);
  if (date) params.append("date", date);
  if (week) params.append("week", String(week));
  if (language) params.append("language", language);

  const res = await api.get(`/api/reports/download/csv`, {
    responseType: "blob",
  });

  // Create download link
  const periodLabel =
    periodType === "daily"
      ? date
      : periodType === "weekly"
      ? `week-${week}`
      : `${year}-${month}`;
  const url = window.URL.createObjectURL(
    new Blob([res.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `attendance-report-${periodType}-${periodLabel}.pdf`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
