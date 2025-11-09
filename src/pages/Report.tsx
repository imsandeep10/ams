import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GaugeChart } from "@/components/dashboard/GaugeChart";
import { DailyTrendChart } from "@/components/report/DailyTrendChart";
import {
  useGetDailyTrend,
  useGetDonutChart,
  useGetReport,
  useGetStudentGrowth,
} from "@/lib/api/useReport";
import type { Language } from "@/types/languageType";
import { StudentGrowthChart } from "@/components/report/StudentGrowthChart";
import ReportChart from "@/components/report/ReportChart";

// Constants moved outside component to prevent recreation
const YEARS = [2023, 2024, 2025];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DEPARTMENTS = ["All Departments", "IELTS", "PTE", "SAT", "DUOLINGO"];

// Helper function moved outside component
const getLanguageParam = (
  department: string
): Language["language"] | undefined => {
  const languageMap: Record<string, Language["language"]> = {
    DUOLINGO: "Duolingo",
    IELTS: "IELTS",
    PTE: "PTE",
    SAT: "SAT",
  };

  return department === "All Departments" ? undefined : languageMap[department];
};

export const Report = React.memo(() => {
  const currentDate = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  // Memoize API parameters to prevent unnecessary refetches
  const reportDate = useMemo(
    () => new Date(selectedYear, selectedMonth - 1),
    [selectedYear, selectedMonth]
  );

  const languageParam = useMemo(
    () => getLanguageParam(selectedDepartment),
    [selectedDepartment]
  );

  const growthParams = useMemo(
    () => ({
      startYear: selectedYear,
      startMonth: 1,
      endYear: selectedYear,
      endMonth: 12,
      language: languageParam,
    }),
    [selectedYear, languageParam]
  );

  // API calls with memoized parameters
  const {
    data: languagePrograms,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useGetReport(reportDate, languageParam);

  const { 
    data: attendenceOverview,
    isLoading: isDonutLoading,
    isError: isDonutError
  } = useGetDonutChart(selectedYear, selectedMonth, languageParam);

  const {
    data: dailyTrendData,
    isLoading: isTrendLoading,
    isError: isTrendError,
  } = useGetDailyTrend(selectedYear, selectedMonth, languageParam);

  const {
    data: studentGrowthData,
    isLoading: isGrowthLoading,
    isError: isGrowthError,
  } = useGetStudentGrowth(growthParams);

  // Memoize transformed data
  const chartData = useMemo(() => {
    return (
      dailyTrendData?.data?.daily?.map((item: any) => ({
        date: item.date,
        present: item.present ?? 0,
        absent: item.absent ?? 0,
        attendanceRate: item.attendanceRate ?? 0,
      })) || []
    );
  }, [dailyTrendData]);

  const lines = useMemo(() => {
    return (
      dailyTrendData?.data?.datasets?.map((dataset: any) => ({
        key:
          dataset.label === "Attendance Rate (%)"
            ? "attendanceRate"
            : dataset.label.toLowerCase(),
        label: dataset.label,
        color: dataset.borderColor,
        yAxisID:
          dataset.label === "Attendance Rate (%)" ? "percentage" : "left",
      })) || []
    );
  }, [dailyTrendData]);

  const growthChartData = useMemo(
    () => studentGrowthData?.data?.growth || [],
    [studentGrowthData]
  );

  return (
    <div className="p-5 space-y-5">
      {/* Filters Section */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {/* Year Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center py-2" variant="outline">
                <span>{selectedYear}</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {YEARS.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Month Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center py-2" variant="outline">
                <span>
                  {new Date(2000, selectedMonth - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {MONTHS.map((month) => (
                <DropdownMenuItem
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                >
                  {new Date(2000, month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Department Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center py-2" variant="outline">
              <span>{selectedDepartment}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {DEPARTMENTS.map((dept) => (
              <DropdownMenuItem
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Charts Grid */}
      <div className="flex flex-col gap-5">
        {/* Top Row Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReportChart
            data={languagePrograms?.data}
            title={languagePrograms?.title}
            isLoading={isReportLoading}
            isError={isReportError}
          />
          {isDonutLoading ? (
            <div className="border bg-white shadow-md border-gray-200 rounded-md p-10 text-center">
              <p className="text-muted-foreground animate-pulse">
                Loading attendance overview...
              </p>
            </div>
          ) : isDonutError ? (
            <div className="border bg-white shadow-md border-gray-200 rounded-md p-10 text-center">
              <p className="text-destructive">
                Failed to load attendance overview.
              </p>
            </div>
          ) : (
            <GaugeChart
              labels={attendenceOverview?.data?.labels}
              values={attendenceOverview?.data?.values}
              colors={attendenceOverview?.data?.colors}
              title={attendenceOverview?.title}
              description={`Year: ${attendenceOverview?.metadata?.year} | Month: ${attendenceOverview?.metadata?.month}`}
              footerText={`Total Records: ${attendenceOverview?.metadata?.totalRecords}`}
            />
          )}
        </div>

        {/* Daily Trend Chart */}
        <div className="w-full">
          {isTrendLoading ? (
            <div className="border bg-white shadow-md border-gray-200 rounded-md p-10 text-center">
              <p className="text-muted-foreground animate-pulse">
                Loading daily trend...
              </p>
            </div>
          ) : isTrendError ? (
            <div className="border bg-white shadow-md border-gray-200 rounded-md p-10 text-center">
              <p className="text-destructive">
                Failed to load daily trend data.
              </p>
            </div>
          ) : (
            <div className="border bg-white shadow-md border-gray-200 rounded-md">
              <h2 className="p-4 text-muted-foreground text-xl">
                {dailyTrendData?.title || "Daily Attendance Trend"}
              </h2>
              <DailyTrendChart data={chartData} lines={lines} height={300} />
            </div>
          )}
        </div>

        {/* Student Growth Chart */}
        <div className="w-full">
          {isGrowthLoading ? (
            <div className="border bg-white shadow-md border-gray-200 rounded-md p-10 text-center">
              <p className="text-muted-foreground animate-pulse">
                Loading student growth...
              </p>
            </div>
          ) : isGrowthError ? (
            <div className="border bg-white shadow-md border-gray-200 rounded-md p-10 text-center">
              <p className="text-destructive">
                Failed to load student growth data.
              </p>
            </div>
          ) : (
            <StudentGrowthChart data={growthChartData} />
          )}
        </div>
      </div>
    </div>
  );
});

Report.displayName = "Report";
