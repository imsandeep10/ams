import type {
  CurrentApplicationStatus,
  CurrentStudentStatus,
  EnrollmentStatus,
  LanguageEnum,
} from "./enums";

export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  image?: string; // optional student image
  classTime: string;
  registrationDate?: string; // optional registration date
  attendanceStatus?: "Present" | "Absent"; // optional attendance status
  faculty: string;
  gpaOrPercentage: string;
  academicQualification: string;
  yearOfCompletion: string;
  interestedCourse: string;
  preferredCountry: string;
  language: LanguageEnum;
  currentApplicationStatus: CurrentApplicationStatus;
  currentStudentStatus: CurrentStudentStatus;
  enrollmentStatus: EnrollmentStatus;
  user: {
    id: string;
    address: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  }; // optional related user details
}
