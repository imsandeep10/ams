import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ProgramData {
  program?: {
    name: string;
    totalStudents: number;
    presentStudents: number;
    absentStudents: number;
    attendanceRate: number;
  };
  labels?: string[];
  datasets?: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
  // optional helpers for daily simple format
  present?: number;
  absent?: number;
}

// interface Perioddata {
//   absent: number;
//   present: number;
// }

interface ReportChartProps {
  data: ProgramData | null;
  title?: string;
  height?: number;
  isLoading?: boolean;
  isError?: boolean;
}

const COLORS = {
  present: "#10b981", // green
  absent: "#ef4444", // red
  total: "#3b82f6", // blue
};

const ReportChart: React.FC<ReportChartProps> = ({
  data,
  title = "Program Comparison",
  height = 350,
  isLoading = false,
  isError = false,
}) => {
  // ✅ Safe transform of data
  console.log("Raw data for ReportChart:", data);
  const chartData = useMemo(() => {
    // Simple daily present/absent format coming from period daily
    if (
      data?.labels &&
      Array.isArray(data.labels) &&
      data.labels.length === 2 &&
      data.labels[0]?.toLowerCase() === "present" &&
      data.labels[1]?.toLowerCase() === "absent" &&
      Array.isArray(data.datasets) &&
      data.datasets.length === 1
    ) {
      const ds = data.datasets[0];
      const present = ds.data?.[0] ?? 0;
      const absent = ds.data?.[1] ?? 0;
      return [
        { category: "Present", value: present, color: COLORS.present },
        { category: "Absent", value: absent, color: COLORS.absent },
      ];
    }

    if (data?.program) {
      return [
        {
          category: "Present",
          value: data.program.presentStudents,
          color: COLORS.present,
        },
        {
          category: "Absent",
          value: data.program.absentStudents,
          color: COLORS.absent,
        },
        {
          category: "Total",
          value: data.program.totalStudents,
          color: COLORS.total,
        },
      ];
    }

    if (data?.labels?.length && data?.datasets?.length) {
      return data.labels.map((label, i) => {
        const entry: Record<string, number | string> = { label };
        data.datasets?.forEach((dataset) => {
          entry[dataset.label] = dataset.data?.[i] ?? 0;
        });
        return entry;
      });
    }

    return [];
  }, [data]);

  const isSingleProgramFormat = useMemo(() => Boolean(data?.program), [data]);
  const isDailySimple = useMemo(() => {
    return (
      Array.isArray(data?.labels) &&
      data!.labels!.length === 2 &&
      (data!.labels![0] || "").toLowerCase() === "present" &&
      (data!.labels![1] || "").toLowerCase() === "absent" &&
      Array.isArray(data?.datasets) &&
      data!.datasets!.length === 1
    );
  }, [data]);
  const hasValidData = useMemo(() => chartData.length > 0, [chartData]);

  const programStats = useMemo(() => {
    if (!data?.program) return null;
    return {
      attendanceRate: data.program.attendanceRate,
      totalStudents: data.program.totalStudents,
      presentStudents: data.program.presentStudents,
      absentStudents: data.program.absentStudents,
    };
  }, [data]);

  // Loading, error, and empty states
  if (isLoading) {
    return (
      <Card className="w-full" style={{ minHeight: height + 100 }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <p className="text-muted-foreground animate-pulse">
            Loading chart...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full" style={{ minHeight: height + 100 }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <p className="text-destructive">Failed to load chart data.</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasValidData) {
    return (
      <Card className="w-full" style={{ minHeight: height + 100 }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent
          className="flex items-center justify-center"
          style={{ height }}
        >
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>

        {programStats && (
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-muted-foreground">
              Attendance Rate:{" "}
              <strong className="text-green-600">
                {programStats.attendanceRate}%
              </strong>
            </span>
            <span className="text-muted-foreground">
              Total Students: <strong>{programStats.totalStudents}</strong>
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {isSingleProgramFormat || isDailySimple ? (
            //  Single program format
            <BarChart
              data={chartData}
              barSize={60}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                style={{ fontSize: "13px", fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "12px" }}
                label={{
                  value: "Students",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: "12px" },
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value: number, name: string, props: any) => {
                  return [
                    `${value} students`,
                    props?.payload?.category || name,
                  ];
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={String(entry.color)} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            //  Legacy format
            <BarChart
              data={chartData}
              barSize={35}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "13px" }}
              />
              {data?.datasets?.map((dataset) => (
                <Bar
                  key={dataset.label}
                  dataKey={dataset.label}
                  fill={dataset.backgroundColor || "#3B82F6"}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default React.memo(ReportChart);
