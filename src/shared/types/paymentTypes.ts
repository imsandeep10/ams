import type { LanguageEnum } from "./enums";

export interface Payment {
  id: string;
  studentId: string;
  fullName: string;
  paymentDate: string;
  language: LanguageEnum;
  balance: number;
  dueDate: string;
  paymentMethod: string;
  Status: string;
}
