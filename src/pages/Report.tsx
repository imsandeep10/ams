import React, { useState, useMemo } from "react";
import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AttendancePieChart from "@/components/report/AttendancePieChart";
import {
  useGetDonutChart,
  useGetReport,
  useGetStudentGrowth,
  useGetPeriodReport,
  downloadPdfReport,
} from "@/lib/api/useReport";
import { StudentGrowthChart } from "@/components/report/StudentGrowthChart";
import ReportChart from "@/components/report/ReportChart";
import type { ReportPeriodType } from "@/types/reportTypes";
import { toast } from "sonner";
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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState(false);

  // Determine program name based on role
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

  // Memoized parameters
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

  // API calls
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
    date: periodType === 'daily' ? selectedDate : undefined,
    week: periodType === 'weekly' ? selectedWeek : undefined,
  });


  const growthChartData = useMemo(
    () => studentGrowthData?.data?.growth || [],
    [studentGrowthData]
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPdfReport({
        year: selectedYear,
        month: selectedMonth,
        periodType,
        date: periodType === 'daily' ? selectedDate : undefined,
        week: periodType === 'weekly' ? selectedWeek : undefined,
      });
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Failed to download report: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };


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

          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download Report'}
          </Button>
        </div>

        {/* Period Type Selector */}
        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <Label className="text-sm font-semibold mb-3 block">Report Period</Label>
          <div className="flex flex-wrap items-center gap-6">
            <RadioGroup
              value={periodType}
              onValueChange={(value) => setPeriodType(value as ReportPeriodType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="cursor-pointer font-normal">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="cursor-pointer font-normal">Weekly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer font-normal">Monthly</Label>
              </div>
            </RadioGroup>

            {/* Date Picker for Daily */}
            {periodType === 'daily' && (
              <div className="flex items-center gap-2">
                <Label htmlFor="date" className="text-sm">Date:</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-40"
                />
              </div>
            )}

            {/* Week Selector for Weekly */}
            {periodType === 'weekly' && (
              <div className="flex items-center gap-2">
                <Label htmlFor="week" className="text-sm">Week:</Label>
                <Input
                  id="week"
                  type="number"
                  min="1"
                  max="52"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Period-Based Report */}
      {periodType !== 'monthly' && (
        <div className="bg-white border border-gray-200 rounded-md p-6 shadow-md">
          {isPeriodLoading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground animate-pulse">
                Loading {periodType} report...
              </p>
            </div>
          ) : isPeriodError ? (
            <div className="text-center py-10">
              <p className="text-destructive">
                Failed to load {periodType} report.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">{periodReportData?.title}</h3>
              {periodType === 'daily' && periodReportData?.data && 'date' in periodReportData.data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-2xl font-bold">{periodReportData.data.date}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{periodReportData.data.present}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{periodReportData.data.absent}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-purple-600">{periodReportData.data.attendanceRate}%</p>
                  </div>
                </div>
              )}
              {periodType === 'weekly' && periodReportData?.data && 'dailyData' in periodReportData.data && (
                <div>
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Week Period: {periodReportData.data.weekStart} - {periodReportData.data.weekEnd}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-left">Day</th>
                          <th className="p-2 text-right">Present</th>
                          <th className="p-2 text-right">Absent</th>
                          <th className="p-2 text-right">Total</th>
                          <th className="p-2 text-right">Rate (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {periodReportData.data.dailyData.map((day: any) => (
                          <tr key={day.date} className="border-t">
                            <td className="p-2">{day.date}</td>
                            <td className="p-2">{day.dayName}</td>
                            <td className="p-2 text-right text-green-600 font-medium">{day.present}</td>
                            <td className="p-2 text-right text-red-600 font-medium">{day.absent}</td>
                            <td className="p-2 text-right">{day.total}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-semibold">
                        <tr className="border-t-2">
                          <td className="p-2" colSpan={2}>Summary</td>
                          <td className="p-2 text-right text-green-600">{periodReportData.data.summary.totalPresent}</td>
                          <td className="p-2 text-right text-red-600">{periodReportData.data.summary.totalAbsent}</td>
                          <td className="p-2 text-right">{periodReportData.data.summary.totalPresent + periodReportData.data.summary.totalAbsent}</td>
                          <td className="p-2 text-right">{periodReportData.data.summary.averageAttendanceRate}%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
