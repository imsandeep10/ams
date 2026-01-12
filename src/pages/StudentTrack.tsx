"use client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrackDataTable } from "@/components/students/studentTrack/TrackDataTable";
import { trackColumns } from "@/components/students/studentTrack/TrackColumn";
import { useGetStudentAttendanceTrack } from "@/lib/api/useStudents";
import { useStudentProgress } from "@/lib/api/useStudents";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Clock,
  User,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  ArrowLeft,
  SendHorizontal,
  Circle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const StudentTrack = React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());
  const navigate = useNavigate();

  const { data: attendanceRecord, isPending } = useGetStudentAttendanceTrack(
    id!,
    Number(year),
    Number(month)
  );

  const { data: studentProgress } = useStudentProgress(id!);
  console.log("student progress", studentProgress);

  // Generate year options (current year and past 5 years)
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Month options
  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // progress bar steps

  const progressBarSteps = [
    {
      label: "3 Days Attendance",
      isCompleted: studentProgress?.percentageForAttendance >= 6.67,
    },
    {
      label: "45 Days Attendance",
      isCompleted: studentProgress?.percentageForAttendance >= 100,
    },
    {
      label: "Date Booking",
      isCompleted: studentProgress?.isDateBooked || false,
    },
    {
      label: "Documents Received",
      isCompleted: studentProgress?.isDocumentReceived || false,
    },
    { label: "Visa", isCompleted: studentProgress?.isVisaReceived || false },
  ];

  const completedSteps = progressBarSteps.filter(
    (step) => step.isCompleted
  ).length;
  const totalProgressPercentage =
    (completedSteps / progressBarSteps.length) * 100;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-gray-200  cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>
      {/* Header Section */}
      {attendanceRecord && (
        <>
          <Card className="border-none shadow-lg dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col  lg:flex-row w-full lg:justify-between">
                {/* first section */}
                <div className="flex flex-col lg:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-32 w-32 border-1 border-white shadow-lg">
                    <AvatarImage
                      src={attendanceRecord.student.profileImage}
                      alt={attendanceRecord.student.fullName}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-[#A5D6A7] text-white">
                      {attendanceRecord.student.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2 flex flex-col md:items-center lg:items-start">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                      {attendanceRecord.student.fullName}
                    </h1>
                    <div className="flex flex-wrap  flex-col gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {attendanceRecord.student.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Joined: {attendanceRecord.student.joinDate}
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {attendanceRecord.period.monthName}{" "}
                          {attendanceRecord.period.year}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:flex-row sm:justify-center lg:justify-start">
                        <Button className="bg-[#1B5E20] text-white flex items-center gap-2">
                          Button
                          <SendHorizontal />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* second section */}
                <div className="flex flex-col lg:flex-col gap-6 py-2 lg:mt-0 px-2  rounded-lg justify-evenly">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="Payment"
                        className="font-medium text-[#1B5E20] min-w-[40px]"
                      >
                        Payment:
                      </label>
                      <Select>
                        <SelectTrigger className="w-[140px] text-[#0E2A10] bg-[#F1FFF5] border-[#BAFFD3] focus:border-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F1FFF5] text-[#0E2A10] border-[#BAFFD3] ">
                          <SelectGroup>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="VisaStatus"
                        className="font-medium text-[#1B5E20] min-w-[40px]"
                      >
                        Visa Status:
                      </label>
                      <Select>
                        <SelectTrigger className="w-[140px] text-[#1B2E5E] bg-[#F1F8FF] border-[#BADEFF] focus:border-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="text-[#1B2E5E] bg-[#F1F8FF] border-[#BADEFF]">
                          <SelectGroup>
                            <SelectItem value="paid">Accepted</SelectItem>
                            <SelectItem value="unpaid">Rejected</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="Docs"
                        className="font-medium text-[#1B5E20] min-w-[40px]"
                      >
                        Docs:
                      </label>
                      <Select>
                        <SelectTrigger className="w-[140px] text-[#0E2A10] bg-[#F1FFF5] border-[#BAFFD3] focus:border-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F1FFF5] text-[#0E2A10] border-[#BAFFD3] ">
                          <SelectGroup>
                            <SelectItem value="paid">Received</SelectItem>
                            <SelectItem value="unpaid">Not Received</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="DateBookStatus"
                        className="font-medium text-[#1B5E20] min-w-[40px]"
                      >
                        Date Book Status:
                      </label>
                      <Select>
                        <SelectTrigger className="w-[140px] text-[#0E2A10] bg-[#F1FFF5] border-[#BAFFD3] focus:border-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F1FFF5] text-[#0E2A10] border-[#BAFFD3] ">
                          <SelectGroup>
                            <SelectItem value="paid">Booked</SelectItem>
                            <SelectItem value="unpaid">Not Booked</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[140px] justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PP") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              setDate(selectedDate);
                              setCalendarOpen(false);
                            }}
                            className="rounded-md border shadow-sm"
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="DateBookStatus"
                        className="font-medium text-[#1B5E20] min-w-[40px]"
                      >
                        Book:
                      </label>
                      <Select>
                        <SelectTrigger className="w-[140px] text-[#0E2A10] bg-[#F1FFF5] border-[#BAFFD3] focus:border-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F1FFF5] text-[#0E2A10] border-[#BAFFD3] ">
                          <SelectGroup>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="notReceived">
                              Not Received
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              {/* progress bar  */}
              <div className="py-4 mt-4 lg:ml-32 xl:ml-40">
                {/* header */}
                <div className="flex justify-between mb-4">
                  <h3>STUDENT PROGRESS TRACK</h3>
                  <h3>{Math.round(totalProgressPercentage)}%</h3>
                </div>
                {/* progress section */}
                <div className="relative space-y-2">
                  <div className="flex justify-between z-10">
                    {progressBarSteps.map((step, index) => (
                      <Circle
                        key={index}
                        className={`h-4 w-4 stroke-none transition-colors duration-300 ${
                          step.isCompleted ? "fill-[#22C55E]" : "fill-[#E5E7EB]"
                        }
                        `}
                      />
                    ))}
                    {/* <Circle className="h-4 w-4 fill-[#22C55E] stroke-none" /> */}
                  </div>
                  <div className="w-full h-2">
                    <div className="w-full absolute rounded-full h-2 bg-[#E5E7EB] "></div>
                    <div
                      className={`w-${totalProgressPercentage}absolute rounded-full h-2 bg-[#22C55E] transition-all duration-500 ease-out`}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    {progressBarSteps.map((step, index) => (
                      <span key={index} className="">
                        {step.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Join Date Message */}
          {/* {attendanceRecord.message && (
            <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    {attendanceRecord.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          )} */}
        </>
      )}

      {/* Stats Cards */}
      {!isPending &&
        attendanceRecord &&
        attendanceRecord.dailyRecords.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Total Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {attendanceRecord.summary.totalDays}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Working Days: {attendanceRecord.summary.workingDays}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Present Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {attendanceRecord.summary.presentDays}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Out of {attendanceRecord.summary.workingDays} working days
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Absent Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {attendanceRecord.summary.absentDays}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Includes weekends: {attendanceRecord.summary.weekendDays}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {attendanceRecord.summary.attendancePercentage.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${attendanceRecord.summary.attendancePercentage}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      {/* Month/Year Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Select Month & Year
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <Label
                htmlFor="month-select"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Clock className="h-4 w-4" />
                Month
              </Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month-select" className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 min-w-[150px]">
              <Label
                htmlFor="year-select"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <CalendarIcon className="h-4 w-4" />
                Year
              </Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year-select" className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((yr) => (
                    <SelectItem key={yr} value={yr.toString()}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Daily Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground font-medium">
                  Loading attendance records...
                </p>
              </div>
            </div>
          ) : attendanceRecord &&
            attendanceRecord.dailyRecords &&
            attendanceRecord.dailyRecords.length > 0 ? (
            <TrackDataTable
              columns={trackColumns}
              data={attendanceRecord.dailyRecords}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              {attendanceRecord?.message ||
                "No attendance records found for this period."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

StudentTrack.displayName = "StudentTrack";
export default StudentTrack;
