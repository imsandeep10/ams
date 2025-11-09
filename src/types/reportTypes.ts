export type ReportChartProps = {
  year: number;
  month: number;
};

export type ReportData = {
  programs: { programName: string; studentsCount: number }[];
  labels: string[];
  datasets: Dataset[];
};

export type Metadata = {
  year: number;
  month: number;
  totalRecords: number;
  generatedAt: string;
};

export type ReportResponse = {
  message: string;
  title: string;
  chartType: string;
  data: ReportData;
  metadata: Metadata;
};

export type AttendanceOverviewData = {
  labels: string[];
  values: number[];
  colors: string[];
  present: number;
  absent: number;
  total: number;
  attendanceRate: number;
};

export type DonutChartResponse = {
  message: string;
  title: string;
  chartType: "pie";
  data: AttendanceOverviewData;
  metadata: {
    year: number;
    month: number;
    totalRecords: number;
    generatedAt: string;
  };
};

// types/reportTypes.ts
export interface Program {
  language: string;
  programName: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  newStudents: number;
  attendanceRate: number;
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string;
}

export interface ReportChartData {
  programs: Program[];
  labels: string[];
  datasets: Dataset[];
}

export interface ReportDataResponse {
  message: string;
  title: string;
  chartType: "bar" | "line" | "pie";
  data: ReportChartData;
  metadata: {
    year: number;
    month: number;
    totalRecords: number;
    generatedAt: string;
  };
}
