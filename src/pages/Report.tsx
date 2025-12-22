import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AttendancePieChart from "@/components/report/AttendancePieChart";
import {
  useGetDonutChart,
  useGetReport,
  useGetStudentGrowth,
  useGetPeriodReport,
} from "@/lib/api/useReport";
import { StudentGrowthChart } from "@/components/report/StudentGrowthChart";
import ReportChart from "@/components/report/ReportChart";
import type { ReportPeriodType } from "@/types/reportTypes";
import { useAuthStore } from "@/lib/stores/AuthStore";


const YEARS = [2023, 2024, 2025];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export const Report = React.memo(() => {
  const role = useAuthStore((state) => state.role);
  
  const currentDate = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [periodType, setPeriodType] = useState<ReportPeriodType>('monthly');

  const programName = useMemo(() => {
    switch (role) {
      case 'ieltsAdmin': return 'IELTS';
      case 'pteAdmin': return 'PTE';
      case 'satAdmin': return 'SAT';
      case 'duolingoAdmin': return 'Duolingo';
      case 'superAdmin': return 'All Programs';
      default: return 'Program';
    }
  }, [role]);

  const reportDate = useMemo(
    () => new Date(selectedYear, selectedMonth - 1),
    [selectedYear, selectedMonth]
  );

  const growthParams = useMemo(
    () => ({
      startYear: selectedYear,
      startMonth: 1,
      endYear: selectedYear,
      endMonth: 12,
    }),
    [selectedYear]
  );

  const {
    data: languagePrograms,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useGetReport(reportDate);

  const {
    data: attendenceOverview,
    isLoading: isDonutLoading,
    isError: isDonutError,
  } = useGetDonutChart(selectedYear, selectedMonth);


  const {
    data: studentGrowthData,
    isLoading: isGrowthLoading,
    isError: isGrowthError,
  } = useGetStudentGrowth(growthParams);

  const {
    data: periodReportData,
    isLoading: isPeriodLoading,
    isError: isPeriodError,
  } = useGetPeriodReport({
    year: selectedYear,
    month: selectedMonth,
    periodType,
  });


  const growthChartData = useMemo(
    () => studentGrowthData?.data?.growth || [],
    [studentGrowthData]
  );




  return (
    <div className="p-5 space-y-5">
      {/* Role-based Header */}
      {role !== 'superAdmin' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <p className="text-sm font-medium text-blue-900">
              Viewing {programName} Program Reports
            </p>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="space-y-4">
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

         
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <Label className="text-sm font-semibold mb-3 block">Report Period</Label>
          <div className="flex flex-wrap items-center gap-6">
            <RadioGroup
              value={periodType}
              onValueChange={(value) => setPeriodType(value as ReportPeriodType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer font-normal">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="cursor-pointer font-normal">Yearly</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-5">
        {/* Top Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReportChart
            data={periodType !== 'monthly' ? (periodReportData?.data ?? null) : (languagePrograms?.data ?? null)}
            title={
              periodType !== 'monthly' 
                ? (periodReportData?.title ?? 'Daily/Weekly Report')
                : role === 'superAdmin' 
                  ? (languagePrograms?.title ?? 'Program Comparison')
                  : `${programName} Program Report`
            }
            isLoading={periodType !== 'monthly' ? isPeriodLoading : isReportLoading}
            isError={periodType !== 'monthly' ? isPeriodError : isReportError}
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
          ) : periodType !== 'monthly' && periodReportData?.data && 'present' in periodReportData.data ? (
            <AttendancePieChart
              title={periodReportData?.title}
              labels={['Present', 'Absent']}
              values={[periodReportData.data.present || 0, periodReportData.data.absent || 0]}
              percentages={[
                Number(((periodReportData.data.present || 0) / ((periodReportData.data.present || 0) + (periodReportData.data.absent || 0)) * 100).toFixed(1)),
                Number(((periodReportData.data.absent || 0) / ((periodReportData.data.present || 0) + (periodReportData.data.absent || 0)) * 100).toFixed(1))
              ]}
            />
          ) : (
            <AttendancePieChart
              title={attendenceOverview?.title}
              labels={attendenceOverview?.data?.labels}
              values={attendenceOverview?.data?.values}
              percentages={attendenceOverview?.data?.percentages}
              colors={attendenceOverview?.data?.colors}
            />
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
