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
  payment: PaymentResponse;
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
    filename: string;
  };
  profileImageId: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export const Role = {
  STUDENT: "student",
  SUPER_ADMIN: "superAdmin",
  ACCOUNTANT: "accountant",
  IELTS_ADMIN: "ieltsAdmin",
  PTE_ADMIN: "pteAdmin",
  SAT_ADMIN: "satAdmin",
  DUOLINGO_ADMIN: "duolingoAdmin",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export interface PaymentResponse {
  bookStatus: "NO_BOOK_TAKEN" | "TWO_BOOKS_TAKEN" | "ALL_BOOKS_TAKEN";
  createdAt: string;
  id: string;
  paymentAmount: number;
  paymentMethod: "CASH" | "ONLINE" | null;
  paymentStatus: PaymentStatus;
  remarks: string | null;
  studentId: string;
  updatedAt: string;
}

export const BookStatus = [
  "NO_BOOK_TAKEN",
  "TWO_BOOKS_TAKEN",
  "ALL_BOOKS_TAKEN",
];

export const PaymentMethod = ["CASH", "ONLINE"];

export const PaymentStatus = {
  FULL_PAID: "FULL_PAID",
  PARTIAL_PAID: "PARTIAL_PAID",
  NOT_PAID: "NOT_PAID",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
