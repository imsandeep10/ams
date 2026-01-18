import type {
  DestinationCountry,
  ModulesCompleted,
  PreferredTime,
  TestType,
} from "@/shared/types/mockFormTypes";

//
export const PREFERRED_TIME_OPTIONS: PreferredTime[] = [
  "6:00 AM TO 9:00 AM",
  "9:00 AM TO 12:00 PM",
  "12:00 PM TO 3:00 PM",
] as const;

export const TEST_TYPE_OPTIONS: TestType[] = [
  "Academic IELTS",
  "General Training",
] as const;

export const MODULE_OPTIONS: ModulesCompleted[] = [
  "Listening",
  "Reading",
  "Writing",
  "Speaking",
  // "None",
] as const;

export const DESTINATION_COUNTRY_OPTIONS: DestinationCountry[] = [
  "Australia",
  "UK",
  "Canada",
  "USA",
  "New Zealand",
  "South Korea",
  "Finland",
  "Other",
];
