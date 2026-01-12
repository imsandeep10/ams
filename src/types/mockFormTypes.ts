export type createMockRegisterRespoonse = {
  id: string;
  mockTestDate: string;
  timeSlot: PreferredTime;
  testType: TestType;
  moduleCompleted: ModulesCompleted[];
  fullName: string;
  whatsappNumber: string;
  examDate: string;
  destinationCountry: DestinationCountry;
};

export type Mock = {
  id: string;
  mockTestDate: string;
  timeSlot: PreferredTime;
  testType: TestType;
  modulesCompleted: ModulesCompleted[];
  fullName: string;
  whatsappNumber: string;
  examDate: string;
  destinationCountry: DestinationCountry;
};

// Types
export type PreferredTime =
  | "6:00 AM TO 9:00 AM"
  | "9:00 AM TO 12:00 PM"
  | "12:00 PM TO 3:00 PM";

export type TestType = "Academic IELTS" | "General Training";

export type ModulesCompleted =
  | "Listening"
  | "Reading"
  | "Writing"
  | "Speaking"
  | "None";
export type DestinationCountry =
  | "Australia"
  | "UK"
  | "Canada"
  | "USA"
  | "New Zealand"
  | "South Korea"
  | "Finland"
  | "Other";

export type IELTSMockTestFormData = {
  mockTestDate: string;
  timeSlot: PreferredTime;
  testType: TestType;
  modulesCompleted: ModulesCompleted[];
  fullName: string;
  whatsappNumber: string;
  ieltsExamDate?: string;
  destinationCountry: DestinationCountry;
  otherCountry?: string;
};
