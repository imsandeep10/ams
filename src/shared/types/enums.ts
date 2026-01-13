export const language = {
  IELTS: "IELTS",
  PTE: "PTE",
  SAT: "SAT",
  DUOLINGO: "DUOLINGO",
} as const;

export type LanguageEnum = (typeof language)[keyof typeof language];

export const EnrollmentStatus = {
  TRIAL: "TRIAL",
  PAID: "PAID",
  NOT_PAID: "NOT_PAID",
} as const;

export type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const CurrentStudentStatus = {
  COURSE_COMPLETED: "COURSE_COMPLETED",
  DATE_BOOKED: "DATE_BOOKED",
  ATTEND_EXAM: "ATTEND_EXAM",
  RESULT_RECEIVED: "RESULT_RECEIVED",
} as const;

export type CurrentStudentStatus =
  (typeof CurrentStudentStatus)[keyof typeof CurrentStudentStatus];

export const CurrentApplicationStatus = {
  WITHDRAWN: "WITHDRAWN",
  DOCUMENT_RECEIVED: "DOCUMENT_RECEIVED",
  VISA_LODGE: "VISA_LODGE",
  VISA_RECEIVED: "VISA_RECEIVED",
} as const;

export type CurrentApplicationStatus =
  (typeof CurrentApplicationStatus)[keyof typeof CurrentApplicationStatus];
