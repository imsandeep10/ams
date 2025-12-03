"use client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrackDataTable } from "@/components/students/studentTrack/TrackDataTable";
import { trackColumns } from "@/components/students/studentTrack/TrackColumn";
import { useGetStudentAttendanceTrack } from "@/lib/api/useStudents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const StudentTrack = React.memo(() => {
  const { id } = useParams();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());
  const navigate = useNavigate();

  const { data: attendanceRecord, isPending } = useGetStudentAttendanceTrack(
    id as string,
    Number(year),
    Number(month)
  );

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
      {!isPending && attendanceRecord && (
        <>
          <Card className="border-none shadow-lg dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={attendanceRecord.student.profileImage}
                    alt={attendanceRecord.student.fullName}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {attendanceRecord.student.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {attendanceRecord.student.fullName}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {attendanceRecord.student.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Joined: {attendanceRecord.student.joinDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {attendanceRecord.period.monthName}{" "}
                      {attendanceRecord.period.year}
                    </div>
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
      {!isPending && attendanceRecord && attendanceRecord.dailyRecords.length > 0 && (
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
            <Calendar className="h-5 w-5" />
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
                <Calendar className="h-4 w-4" />
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
          ) : attendanceRecord && attendanceRecord.dailyRecords && attendanceRecord.dailyRecords.length > 0 ? (
            <TrackDataTable
              columns={trackColumns}
              data={attendanceRecord.dailyRecords}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              {attendanceRecord?.message || "No attendance records found for this period."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

StudentTrack.displayName = "StudentTrack";
export default StudentTrack;
