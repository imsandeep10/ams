// import type { LanguageEnum } from "./enums";

export interface Payment {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  payment: {
    id: string;
    paymentAmount: string;
    paymentMethod: string;
    paymentStatus: string;
    bookStatus: string;
    remarks: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  language: string;
  classTime: string | null;
}
