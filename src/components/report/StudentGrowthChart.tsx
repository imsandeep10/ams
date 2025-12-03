"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type StudentGrowthData = {
  month: string; // e.g. "2025-01"
  newStudents: number;
  totalStudents: number;
  studentsLeft: number;
};

interface StudentGrowthChartProps {
  data: StudentGrowthData[];
}

export const StudentGrowthChart: React.FC<StudentGrowthChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-2xl text-red-500 ">
        No student growth data available
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student Growth Over Time</CardTitle>
        <CardDescription>
          Monthly trends in total and new students
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer className="w-full h-[300px]" config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              {/* X-Axis (Month) */}
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value) => {
                  const [year, month] = value.split("-");
                  return new Date(`${year}-${month}-01`).toLocaleDateString(
                    "en-US",
                    { month: "short" }
                  );
                }}
              />

              {/* Y-Axis */}
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />

              {/* Tooltip */}
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[160px]"
                    labelFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return new Date(`${year}-${month}-01`).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" }
                      );
                    }}
                  />
                }
              />

              {/* Lines */}
              <Line
                type="monotone"
                dataKey="totalStudents"
                name="Total Students"
                stroke="#3B82F6" // Blue
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="newStudents"
                name="New Students"
                stroke="#10B981" // Green
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
