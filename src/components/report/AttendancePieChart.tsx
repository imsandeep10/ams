import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface AttendancePieChartProps {
  title?: string;
  labels?: string[]; // ['Present', 'Absent']
  values?: number[]; // [presentCount, absentCount]
  colors?: string[]; // [presentColor, absentColor]
  percentages?: number[]; // [present%, absent%]
  height?: number;
}

const defaultColors = ["#10B981", "#EF4444"]; // fallback

export const AttendancePieChart: React.FC<AttendancePieChartProps> = ({
  title = "Attendance Overview",
  labels = ["Present", "Absent"],
  values = [0, 0],
  colors = defaultColors,
  percentages,
  height = 320,
}) => {
  const total = values.reduce((a, b) => a + b, 0);
  const computedPercentages = useMemo(() => {
    if (percentages && percentages.length === values.length) return percentages;
    return total > 0
      ? values.map((v) => Number(((v / total) * 100).toFixed(1)))
      : values.map(() => 0);
  }, [percentages, values, total]);

  const pieData = useMemo(() => {
    return labels.map((name, i) => ({
      name,
      value: values[i] ?? 0,
      percentage: computedPercentages[i] ?? 0,
      color: colors[i] ?? defaultColors[i] ?? "#999999",
    }));
  }, [labels, values, computedPercentages, colors]);

  const centerText = `${computedPercentages[0] ?? 0}%`;

  return (
    <Card className="w-full shadow-md border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ height }}>
        <div className="relative w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
                label={(entry: any) => {
                  const value = Number(entry?.value ?? 0);
                  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${entry?.name}: ${pct}%`;
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`slice-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => {
                  const v = Number(value ?? 0);
                  const pct = total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';
                  return [`${v} (${pct}%)`, name];
                }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "13px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold">{centerText}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(AttendancePieChart);
