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

export type LineDataPoint = {
  date: string;
  [key: string]: number | string;
};

export type LineConfig = {
  key: string;
  label: string;
  color: string;
  yAxisID?: string;
};

interface MultiLineChartProps {
  data: LineDataPoint[];
  lines: LineConfig[];
  height?: number;
}

export const DailyTrendChart: React.FC<MultiLineChartProps> = ({
  data,
  lines,
  height = 250,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No data available
      </div>
    );
  }

  return (
    <ChartContainer className="w-full" style={{ height }} config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 12, right: 24, bottom: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          {/* X-Axis */}
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />

          {/* Left Axis (Counts) */}
          <YAxis
            yAxisId="left"
            orientation="left"
            tickLine={false}
            axisLine={false}
          />

          {/* Right Axis (Percentage) */}
          <YAxis
            yAxisId="percentage"
            orientation="right"
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />

          {/* Tooltip */}
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="value"
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
            }
          />

          {/* Dynamic Lines */}
          {lines.map((line) => (
            <Line
              key={line.key}
              dataKey={line.key}
              yAxisId={line.yAxisID || "left"}
              type="monotone"
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              name={line.label}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
