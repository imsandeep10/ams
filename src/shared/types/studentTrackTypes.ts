export type studentTrackTypes = {
  studentId: string;
  name: string;
  phone: string;
  classTime: string;
  date: string;
  attendance: "Present" | "Absent";
};

export type PhoneFormData = {
  phone: string;
};

export interface StudentTrackResponse {
  dailyRecords: dailyRecord[];
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
    page: number;
    totalPages: number;
    totalRecords: number;
  };
  period: {
    month: number;
    monthName: string;
    totalDays: number;
    year: number;
  };
  student: {
    id: string;
    email: string;
    fullName: string;
    joinDate: string;
    phoneNumber: string;
    profileImage: string;
  };
  summary: {
    absentDays: number;
    attendancePercentage: number;
    presentDays: number;
    totalDays: number;
    weekendDays: number;
    workingDays: number;
    workingDaysAbsent: number;
    workingDaysAttendancePercentage: number;
    workingDaysPresent: number;
  };
}
export interface StudentTrackErrorResponse {
  message: string;
}
export interface dailyRecord {
  date: string;
  day: number;
  dayName: string;
  isWeekend: boolean;
  status: "PRESENT" | "ABSENT";
}
