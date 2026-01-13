import type {
  CurrentApplicationStatus,
  CurrentStudentStatus,
  EnrollmentStatus,
  LanguageEnum,
} from "../types/enums";

export interface StudentResponse {
  academicQualification: string;
  classTime: string;
  currentApplicationStatus: CurrentApplicationStatus;
  currentStudentStatus: CurrentStudentStatus;
  enrollmentStatus: EnrollmentStatus;
  faculty: string;
  gpaOrPercentage: string;
  id: string;
  interestedCourse: string;
  language: LanguageEnum;
  preferredCountry: string;
  remark: string;
  yearOfCompletion: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  address: string;
  email: string;
  fullName: string;
  lockUntil: string | null;
  loginAttempts: number;
  otp: string | null;
  otpExpireTime: string | null;
  phoneNumber: string;
  profileImage: {
    id: string;
    url: string;
  };
  profileImageId: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export const Role = {
  ADMIN: "admin",
  STUDENT: "student",
  SUPER_ADMIN: "superAdmin",
  ACCOUNTANT: "accountant",
  IELTS_ADMIN: "ieltsAdmin",
  PTE_ADMIN: "pteAdmin",
  SAT_ADMIN: "satAdmin",
  DUOLINGO_ADMIN: "duolingoAdmin",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
