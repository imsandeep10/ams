import { useQuery } from "@tanstack/react-query";
import api from "../axiosInstance";
import type { Language } from "@/types/languageType";
import type { DonutChartResponse } from "@/types/reportTypes";

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
        `/reports/charts/language-programs?${params.toString()}`
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

export const useGetDonutChart = (year?: number, month?: number, language?: Language["language"]) => {
  return useQuery<DonutChartResponse>({
    queryKey: ["donutChart", year, month, language],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (year) params.append("year", String(year));
      if (month) params.append("month", String(month));
      if (language) params.append("language", language);

      const res = await api.get<DonutChartResponse>(
        `/reports/charts/attendance-overview?${params.toString()}`
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

export const useGetDailyTrend = (
  year?: number,
  month?: number,
  language?: Language["language"]
) => {
  return useQuery({
    queryKey: ["dailyTrend", year, month, language],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (year) params.append("year", String(year));
      if (month) params.append("month", String(month));
      if (language) params.append("language", language);

      const res = await api.get(
        `/reports/charts/daily-trend?${params.toString()}`
      );

      if (!res?.data) {
        throw new Error("Report data not found");
      }

      return res.data;
    },
    enabled: typeof year === "number" && typeof month === "number",
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    queryKey: ["studentGrowth", startYear, startMonth, endYear, endMonth, language],
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

      const res = await api.get(`/reports/charts/student-growth?${params}`);

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
