import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrackDataTable } from "@/components/students/studentTrack/TrackDataTable";
import { trackColumns } from "@/components/students/studentTrack/TrackColumn";
import {
  useGetStudentAttendanceTrack,
  useGetStudentById,
} from "@/lib/api/useStudents";
import { useStudentProgress } from "@/lib/api/useStudents";
import { useGetPayment } from "@/lib/api/usePayment";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import type { SendResultScoreData } from "@/shared/types/sendEmail.types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSendResultScore } from "@/lib/api/useEmail";
import { DialogDescription } from "@radix-ui/react-dialog";
import { StatsCard } from "@/components/recordCards/Card";
import { Progress } from "@/components/ui/progress";

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
  const [progress, setProgress] = React.useState(0);

  const { data: attendanceRecord, isPending } = useGetStudentAttendanceTrack(
    id!,
    Number(year),
    Number(month)
  );

  const {data: paymentData} = useGetPayment(id!);
  console.log("Payment Data:", paymentData);
  const { data: studentProgress } = useStudentProgress(id!);
  const { data: currentStudent } = useGetStudentById(id!);
  const { mutate: sendResultScore, isPending: isSendingResult } =
    useSendResultScore();

  const form = useForm<SendResultScoreData>({
    defaultValues: {
      email: currentStudent?.user.email || "",
      score: 0,
    },
    values: currentStudent
      ? {
          email: currentStudent?.user.email || "",
          score: 0,
        }
      : undefined,
  });

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

  const handleSubmit = (data: SendResultScoreData) => {
    sendResultScore(data);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(totalProgressPercentage);
    }, 300);
    return () => clearInterval(timer);
  }, [totalProgressPercentage]);

  if (isPending) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-10 w-24" />

        {/* Header Card Skeleton */}
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col lg:flex-row w-full lg:justify-between">
              <div className="flex flex-col lg:flex-row items-start md:items-center gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              <div className="flex flex-col gap-6 py-2">
                <div className="flex flex-col lg:flex-row gap-4">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[200px]" />
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[140px]" />
                  <Skeleton className="h-10 w-[200px]" />
                </div>
              </div>
            </div>
            <div className="py-4 mt-4 lg:ml-32 xl:ml-40 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-3 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Month/Year Selector Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-col gap-2 min-w-[150px]">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Days",
      icon: CalendarIcon,
      value: attendanceRecord?.summary.totalDays || 0,
      borderColor: "border-l-blue-500",
      textColor: "text-gray-900",
      subtext: `Working Days: ${attendanceRecord?.summary.workingDays || 0}`,
    },
    {
      title: "Present Days",
      icon: CheckCircle,
      value: attendanceRecord?.summary.presentDays || 0,
      borderColor: "border-l-green-500",
      textColor: "text-green-600",
      subtext: `Out of ${
        attendanceRecord?.summary.workingDays || 0
      } working days`,
    },
    {
      title: "Absent Days",
      icon: XCircle,
      value: attendanceRecord?.summary.absentDays || 0,
      borderColor: "border-l-red-500",
      textColor: "text-red-600",
      subtext: `Includes weekends: ${
        attendanceRecord?.summary.weekendDays || 0
      }`,
    },
    {
      title: "Attendance Rate",
      icon: TrendingUp,
      value: `${
        attendanceRecord?.summary.attendancePercentage.toFixed(1) || 0
      }%`,
      borderColor: "border-l-purple-500",
      textColor: "text-purple-600",
      subtext: `Working days attendance percentage${
        attendanceRecord?.summary?.workingDaysAttendancePercentage.toFixed(1) ||
        0
      }%`,
    },
  ];

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
              <div className="flex flex-col xl:flex-row w-full xl:justify-between">
                {/* first section */}
                <div className="flex flex-col xl:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-32 w-32 border-1 border-white shadow-lg">
                    <AvatarImage
                      src={attendanceRecord.student.profileImage}
                      alt={attendanceRecord.student.fullName}
                    />
                    <AvatarFallback className="text-2xl font-bold bg-[#A5D6A7] text-white">
                      {attendanceRecord.student.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2 flex flex-col md:items-center xl:items-start">
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
                      <div className="flex flex-wrap items-center gap-2 md:flex-row sm:justify-center xl:justify-start">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-[#1B5E20] text-white flex items-center gap-2">
                              Send Mail
                              <SendHorizontal />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Select custom email or marks
                              </DialogTitle>
                            </DialogHeader>
                            <DialogDescription />

                            <Link to="email">
                              <Card className="gap-0">
                                <CardHeader>
                                  <CardTitle>Custom Email</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <CardDescription>
                                    Send custom email to student{" "}
                                  </CardDescription>
                                </CardContent>
                              </Card>
                            </Link>

                            {/* Dialog for marks email */}
                            <SendScoreEmailDialog
                              form={form}
                              handleSubmit={handleSubmit}
                              isSending={isSendingResult}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
                {/* second section */}
                <div className="flex flex-col gap-6 py-2 xl:mt-0 px-2 rounded-lg justify-evenly">
                  <div className="flex flex-col xl:flex-row gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="Payment"
                        className="font-medium text-[#1B5E20] min-w-[40px]"
                      >
                        Payment:
                      </label>
                      <div >
                        {/* <SelectTrigger className="w-[140px] text-[#0E2A10] bg-[#F1FFF5] border-[#BAFFD3] focus:border-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F1FFF5] text-[#0E2A10] border-[#BAFFD3] ">
                          <SelectGroup>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="pending">Partial</SelectItem>
                          </SelectGroup>
                        </SelectContent> */}
                        {paymentData?.payment === "FULL_PAID" ? (
                          <span className="px-4 py-2 rounded-md bg-green-100 text-green-800 font-medium">
                            Paid
                            </span>
                        ) : paymentData?.payment === "PARTIAL_PAID" ? (
                          <span className="px-4 py-2 rounded-md bg-yellow-100 text-yellow-800 font-medium">
                            Partial
                          </span>
                        ) : (
                          <span className="px-4 py-2 rounded-md bg-red-100 text-red-800 font-medium">
                            Unpaid
                          </span>
                        )}
                      </div>
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
                  <div className="flex flex-col xl:flex-row gap-4">
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
                          <SelectGroup value={status}>
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
              <div className="py-4 mt-4 xl:ml-40">
                {/* header */}
                <div className="flex justify-between mb-4">
                  <h3>STUDENT PROGRESS TRACK</h3>
                  <h3>{Math.round(totalProgressPercentage)}%</h3>
                </div>
                {/* progress section */}
                <div className="relative space-y-2">
                  <div className="grid grid-cols-5 z-10">
                    {progressBarSteps.map((step, index) => (
                      <div key={index} className="flex justify-end">
                        <Circle
                          className={`h-4 w-4 stroke-none transition-colors duration-300 ${
                            step.isCompleted
                              ? "fill-[#22C55E]"
                              : "fill-[#E5E7EB]"
                          }
                        `}
                        />
                      </div>
                    ))}
                    {/* <Circle className="h-4 w-4 fill-[#22C55E] stroke-none" /> */}
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 w-full  bg-[#E5E7EB]"
                  />
                  <div className="grid grid-cols-5">
                    {progressBarSteps.map((step, index) => (
                      <span
                        key={index}
                        className="text-center text-sm max-w-[80px] mx-auto"
                      >
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
            {/* <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
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
            </Card> */}
            {statsData.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                icon={stat.icon}
                value={stat.value}
                subtext={stat.subtext}
                borderColor={stat.borderColor}
                textColor={stat.textColor}
              />
            ))}
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
          {attendanceRecord &&
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

const SendScoreEmailDialog = ({
  isSending,
  form,
  handleSubmit,
}: {
  isSending: boolean;
  form: any;
  handleSubmit: (data: SendResultScoreData) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="gap-0 cursor-pointer">
          <CardHeader>
            <CardTitle>Marks Email</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Send student result through email</CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marks Email</DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter score" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#1B5E20] text-white"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Score"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
